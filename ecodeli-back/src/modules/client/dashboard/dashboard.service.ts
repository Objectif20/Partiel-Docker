import { Between, In, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from "typeorm";
import { AverageRating, Carrier, clientStats, co2Saved, CompletedService, CurrentBalance, events, finishedDelivery, LastDelivery, nearDeliveries, NextDelivery, nextServiceAsClient, NumberOfDeliveries, PackageLocation, packages, revenueData, upcomingService, WeatherData } from "./type";
import { InjectRepository } from "@nestjs/typeorm";
import { DeliveryPerson } from "src/common/entities/delivery_persons.entity";
import { Delivery } from "src/common/entities/delivery.entity";
import axios from "axios";
import { Users } from "src/common/entities/user.entity";
import { Shipment } from "src/common/entities/shipment.entity";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Providers } from "src/common/entities/provider.entity";
import { Inject } from "@nestjs/common";
import { Client } from "minio";
import { Appointments } from "src/common/entities/appointments.entity";
import { MinioService } from "src/common/services/file/minio.service";
import { TransferProvider } from "src/common/entities/transfers_provider.entity";

export class DashboardService {

  constructor(
    @InjectRepository(DeliveryPerson)
    private readonly deliveryPersonRepository: Repository<DeliveryPerson>,
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
    @InjectRepository(Providers)
    private readonly providersRepository: Repository<Providers>,
    @InjectRepository(TransferProvider)
    private readonly transferProviderRepository: Repository<TransferProvider>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Appointments)
    private readonly appointmentRepository: Repository<Appointments>,
    private readonly minioService : MinioService
  ){}

    async getWeather(user_id: string): Promise<WeatherData> {

        const user = await this.userRepository.findOne({
            where: { user_id },
            relations: ['deliveryPerson', 'merchant', 'providers'],
        });

        if (!user) {
            throw new Error("User not found");
        }

        let city: string | null = null;

        if (user.deliveryPerson?.city) {
            city = user.deliveryPerson.city;
        } else if (user.merchant?.city) {
            city = user.merchant.city;
        } else if (user.providers?.length && user.providers[0].city) {
            city = user.providers[0].city;
        }

        if (!city) {
            return {
              city : "Paris",
              temperature: 0,
              condition: "sunny",
              date: new Date()
            };
        }

        try {
            const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
            const data = response.data;

            const current = data.current_condition?.[0];

            return {
                city,
                temperature: parseFloat(current.temp_C),
                condition: current.weatherDesc?.[0]?.value || "Unknown",
                date: new Date()
            };
        } catch (error) {
            console.error("Weather API error:", error);
            return {
              city : "Paris",
              temperature: 0,
              condition: "sunny",
              date: new Date()
            };
        }
    }


    async getLastShipment(user_id: string): Promise<LastDelivery> {
      const user = await this.userRepository.findOne({
        where: { user_id },
        relations: ['shipments']
      });

      if (!user || !user.shipments?.length) {
        throw new Error('Aucun envoi trouvé pour cet utilisateur.');
      }

      const closestShipment = await this.shipmentRepository.findOne({
        where: {
          user: { user_id },
        },
        order: {
          deadline_date: 'ASC',
        },
        relations: ['stores', 'stores.exchangePoint'],
      });

      if (!closestShipment) {
        throw new Error('Aucune livraison trouvée.');
      }

      const origin: [number, number] = closestShipment.departure_location?.coordinates?.slice().reverse() ?? [0, 0];
      const destination: [number, number] = closestShipment.arrival_location?.coordinates?.slice().reverse() ?? [0, 0];

      return {
        delivery: {
          id: closestShipment.shipment_id,
          from: closestShipment.departure_city || 'Inconnu',
          to: closestShipment.arrival_city || 'Inconnu',
          status: closestShipment.status || 'En attente',
          pickupDate: closestShipment.deadline_date?.toISOString().split('T')[0] || '',
          estimatedDeliveryDate: closestShipment.deadline_date?.toISOString().split('T')[0] || '',
          coordinates: {
            origin,
            destination,
            current: origin,
          }
        }
      };
    }

    async getFinishedDelivery(user_id: string): Promise<finishedDelivery> {
        const now = new Date();
        const year = now.getFullYear();

        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year + 1, 0, 1);

        const count = await this.shipmentRepository.count({
            where: {
                user: { user_id },
                status: 'validated',
                deadline_date: Between(startOfYear, endOfYear),
            },
        });

        return {
            count,
            period: year.toString(),
        };
    }

    async getMyCarrier(user_id: string): Promise<Carrier[]> {
        const shipments = await this.shipmentRepository.find({
            where: { user: { user_id } },
            relations: [
                'deliveries',
                'deliveries.delivery_person',
                'deliveries.delivery_person.user',
                'deliveries.delivery_person.user.clients',
                'deliveries.deliveryReviews'
            ],
        });

        const deliveries = shipments.flatMap(s => s.deliveries || []);

        const groupedByDeliveryPerson = new Map<string, {
            deliveryPerson: DeliveryPerson,
            ratings: number[],
            lastStatus: string,
        }>();

        for (const delivery of deliveries) {
            const deliveryPerson = delivery.delivery_person;
            if (!deliveryPerson) continue;

            const id = deliveryPerson.delivery_person_id;
            const existing = groupedByDeliveryPerson.get(id);

            const rating = (delivery.deliveryReviews || []).map(r => r.rating);

            if (existing) {
                existing.ratings.push(...rating);
                existing.lastStatus = delivery.status;
            } else {
                groupedByDeliveryPerson.set(id, {
                    deliveryPerson,
                    ratings: [...rating],
                    lastStatus: delivery.status,
                });
            }
        }

        const carriers: Carrier[] = await Promise.all(
            Array.from(groupedByDeliveryPerson.values()).map(async ({ deliveryPerson, ratings, lastStatus }) => {
                const averageRating = ratings.length > 0
                    ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length)
                    : 0;

                const statusMap: Record<string, "going" | "stop" | "finished"> = {
                    pending: "going",
                    taken: "going",
                    going: "going",
                    finished: "finished",
                };

                return {
                    id: deliveryPerson.delivery_person_id,
                    name: deliveryPerson.user.clients[0].first_name + ' ' + deliveryPerson.user.clients[0].last_name,
                    rating: averageRating,
                    status: statusMap[lastStatus] ?? "stop",
                    avatar: deliveryPerson.user?.profile_picture ? await this.minioService.generateImageUrl('client-images', deliveryPerson.user.profile_picture) : "/placeholder.svg?height=40&width=40",
                };
            })
        );

        return carriers;
    }

    async getNumberOfDeliveries(user_id: string): Promise<{ month: string; packages: number }[]> {

      const now = new Date();
      const deliveriesPerMonth: { month: string; packages: number }[] = [];

      for (let i = 11; i >= 0; i--) {
        const start = startOfMonth(subMonths(now, i));
        const end = endOfMonth(subMonths(now, i));

        const count = await this.shipmentRepository.count({
          where: {
            user: { user_id },
            deadline_date: Between(start, end),
          },
        });

        if (count > 0) {
          const monthName = start.toLocaleString('default', { month: 'short' });

          deliveriesPerMonth.push({
            month: monthName,
            packages: count,
          });
        }
      }

      return deliveriesPerMonth;
    }

    async getCo2Saved(user_id: string): Promise<co2Saved[]> {
        const now = new Date();
        const year = now.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year + 1, 0, 1);

        const shipments = await this.shipmentRepository.find({
            where: {
                user: { user_id },
                status: 'validated',
                deadline_date: Between(startOfYear, endOfYear),
            },
        });

        const monthsMap: Record<string, number> = {
            Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
            Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0,
        };

        for (const shipment of shipments) {
            if (!shipment.departure_location || !shipment.arrival_location) continue;

            const distanceMeters = getDistance(
                {
                    latitude: shipment.departure_location.coordinates[1],
                    longitude: shipment.departure_location.coordinates[0],
                },
                {
                    latitude: shipment.arrival_location.coordinates[1],
                    longitude: shipment.arrival_location.coordinates[0],
                }
            );

            const reducedDistanceKm = (distanceMeters / 1000) * 0.8;
            const co2Kg = reducedDistanceKm * 0.11; 

            const shipmentMonth = shipment.deadline_date!.toLocaleString('en-US', { month: 'short' });
            if (monthsMap[shipmentMonth] !== undefined) {
                monthsMap[shipmentMonth] += co2Kg;
            }
        }

        const result: co2Saved[] = Object.entries(monthsMap).map(([month, co2Saved]) => ({
            month,
            co2Saved: parseFloat(co2Saved.toFixed(2)), 
        }));

        return result;
    }

    async getPackages(user_id: string): Promise<{ size: string; packages: number }[]> {

      const shipments = await this.shipmentRepository.find({
        where: { user: { user_id }, }, 
        relations: ['parcels'],
      });

      const sizeCounts: Record<string, number> = {
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        XXL: 0,
      };

      shipments.forEach(shipment => {
        shipment.parcels.forEach(parcel => {
          const weight = parcel.weight ?? 0;

          if (weight < 5) sizeCounts.S += 1;
          else if (weight <= 30) sizeCounts.M += 1;
          else if (weight <= 50) sizeCounts.L += 1;
          else if (weight <= 100) sizeCounts.XL += 1;
          else sizeCounts.XXL += 1;
        });
      });

      return Object.entries(sizeCounts)
        .filter(([_, count]) => count > 0)
        .map(([size, count]) => ({ size, packages: count }));
    }

    async getNextServiceAsClient(user_id: string): Promise<nextServiceAsClient> {
      const user = await this.userRepository.findOne({
        where: { user_id },
        relations: ['clients'],
      });

      const client = user?.clients?.[0] ?? null;

      if (!client) {
        console.log("Aucun client trouvé pour l'utilisateur", user_id);
        return {
          title: "Promenade de votre chien",
          date: "Sam 12 janvier 2025, 14h30",
          image: "https://www.ennaturesimone.com/wp-content/uploads/2020/08/randonnee-fontainebleau.jpg",
        };
      }

      const now = new Date();

      const nextAppointment = await this.appointmentRepository.findOne({
        where: {
          client: { client_id: client.client_id },
          service_date: MoreThan(now),
        },
        order: { service_date: 'ASC' },
        relations: ['service', 'service.images'],
      });

      if (nextAppointment) {
        const imageKey = nextAppointment.service?.images?.[0]?.image_service_url;
        const firstImageUrl = imageKey
          ? await this.minioService.generateImageUrl('provider-images', imageKey)
          : "https://www.ennaturesimone.com/wp-content/uploads/2020/08/randonnee-fontainebleau.jpg";

        return {
          title: `Prestation : ${nextAppointment.service?.name ?? "Service non défini"}`,
          date: nextAppointment.service_date.toLocaleString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          image: firstImageUrl,
        };
      }

      const lastPastAppointment = await this.appointmentRepository.findOne({
        where: {
          client: { client_id: client.client_id },
          service_date: LessThanOrEqual(now),
        },
        order: { service_date: 'DESC' },
        relations: ['service', 'service.images'],
      });

      if (lastPastAppointment) {
        const imageKey = lastPastAppointment.service?.images?.[0]?.image_service_url;
        const firstImageUrl = imageKey
          ? await this.minioService.generateImageUrl('provider-images', imageKey)
          : "https://www.ennaturesimone.com/wp-content/uploads/2020/08/randonnee-fontainebleau.jpg";

        return {
          title: `Prestation : ${lastPastAppointment.service?.name ?? "Service non défini"}`,
          date: lastPastAppointment.service_date.toLocaleString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          image: firstImageUrl,
        };
      }

      const shipments = await this.shipmentRepository.find({
        where: { user: { user_id } },
        relations: ['deliveries'],
      });

      let futureDeliveries: Delivery[] = [];
      let pastDeliveries: Delivery[] = [];

      shipments.forEach(shipment => {
        shipment.deliveries?.forEach(delivery => {
          if (delivery.send_date > now && ['pending', 'taken', 'finished'].includes(delivery.status)) {
            futureDeliveries.push(delivery);
          } else if (delivery.send_date <= now && ['pending', 'taken', 'finished'].includes(delivery.status)) {
            pastDeliveries.push(delivery);
          }
        });
      });

      futureDeliveries.sort((a, b) => a.send_date.getTime() - b.send_date.getTime());
      pastDeliveries.sort((a, b) => b.send_date.getTime() - a.send_date.getTime());

      if (futureDeliveries.length > 0) {
        const d = futureDeliveries[0];
        return {
          title: `Livraison prévue`,
          date: d.send_date.toLocaleString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          image: "https://www.ennaturesimone.com/wp-content/uploads/2020/08/randonnee-fontainebleau.jpg",
        };
      }

      if (pastDeliveries.length > 0) {
        const d = pastDeliveries[0];
        return {
          title: `Dernière livraison`,
          date: d.send_date.toLocaleString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          image: "https://www.ennaturesimone.com/wp-content/uploads/2020/08/randonnee-fontainebleau.jpg",
        };
      }

      return {
        title: "Promenade de votre chien",
        date: "Sam 12 janvier 2025, 14h30",
        image: "https://www.ennaturesimone.com/wp-content/uploads/2020/08/randonnee-fontainebleau.jpg",
      };
    }

    async getCurrentBalance(user_id: string): Promise<{ amount: number; currency: string }> {

      const deliveryPerson = await this.deliveryPersonRepository.findOne({
        where: { user: { user_id } },
      });

      if (deliveryPerson) {
        return {
          amount: Number(deliveryPerson.balance), 
          currency: "€",
        };
      }

      const provider = await this.providersRepository.findOne({
        where: { user: { user_id } },
      });

      if (provider) {
        return {
          amount: Number(provider.balance),
          currency: "€",
        };
      }

      return {
        amount: 0,
        currency: "€",
      };
    }

    async getCompletedService(user_id: string): Promise<CompletedService> {

      const provider = await this.providersRepository.findOne({
        where: { user: { user_id } },
      });

      if (!provider) {
        throw new Error("Provider non trouvé pour cet utilisateur.");
      }

      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1); 
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59); 

      const count = await this.appointmentRepository.count({
        where: {
          provider: { provider_id: provider.provider_id },
          service_date: Between(startOfYear, endOfYear),
        },
      });

      const mois = now.toLocaleString('fr-FR', { month: 'long' });
      const capitalizedMois = mois.charAt(0).toUpperCase() + mois.slice(1);

      return {
        count,
        period: capitalizedMois,
      };
    }

    async getAverageRating(user_id: string): Promise<AverageRating> {

      const provider = await this.providersRepository.findOne({
        where: { user: { user_id } },
      });

      if (!provider) {
        throw new Error("Provider non trouvé.");
      }

      const finishedAppointments = await this.appointmentRepository.find({
        where: {
          provider: { provider_id: provider.provider_id },
          status: 'finished',
        },
        relations: ['review_presta'],
      });

      const ratings = finishedAppointments
        .map(app => app.review_presta?.rating)
        .filter((rating): rating is number => typeof rating === 'number');

      const total = ratings.length;

      if (total === 0) {
        return {
          score: 0,
          total: 0,
        };
      }

      const sum = ratings.reduce((acc, curr) => acc + curr, 0);
      const average = parseFloat((sum / total).toFixed(2));

      return {
        score: average,
        total,
      };
    }

    async getRevenueData(user_id: string): Promise<revenueData[]> {
      const provider = await this.providersRepository.findOne({
        where: { user: { user_id } },
      });

      if (!provider) throw new Error("Provider not found");

      const now = new Date();
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const transfers = await this.transferProviderRepository.find({
        where: {
          provider: { provider_id: provider.provider_id },
          date: MoreThanOrEqual(oneYearAgo),
        },
      });

      const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];

      const monthMap: { [key: string]: number } = {};

      for (const transfer of transfers) {
        const date = new Date(transfer.date);
        const monthLabel = monthNames[date.getMonth()];
        if (!monthMap[monthLabel]) {
          monthMap[monthLabel] = 0;
        }
        monthMap[monthLabel] += Number(transfer.amount);
      }

      const result: revenueData[] = [];

      for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        const monthLabel = monthNames[date.getMonth()];
        const amount = monthMap[monthLabel];
        if (amount !== undefined) {
          result.push({ month: monthLabel, particuliers: amount });
        }
      }

      const currentMonthName = monthNames[now.getMonth()];
      if (!result.find(item => item.month === currentMonthName)) {
        result.push({
          month: `${currentMonthName} (en cours)`,
          particuliers: 0,
        });
      }

      return result;
    }

    async getUpcomingServices(user_id: string): Promise<upcomingService[]> {
      const provider = await this.providersRepository.findOne({
        where: { user: { user_id } },
      });

      if (!provider) {
        throw new Error('Provider not found');
      }

      const now = new Date();

      const appointments = await this.appointmentRepository.find({
        where: {
          provider: { provider_id: provider.provider_id },
          service_date: MoreThan(now),
        },
        relations: ['client', 'service', 'client.user'],
        order: { service_date: 'ASC' },
        take: 7,
      });

      const upcoming: upcomingService[] = [];

      for (const appointment of appointments) {
        const client = appointment.client;
        const service = appointment.service;

        if (!client || !service) continue;

        const initials = `${client.first_name?.[0] ?? ''}${client.last_name?.[0] ?? ''}`.toUpperCase();
        const clientName = `${client.first_name} ${client.last_name ?? ''}`;

        upcoming.push({
          id: appointment.appointment_id,
          client: {
            name: clientName,
            avatar: client.user.profile_picture
              ? await this.minioService.generateImageUrl('client-images', client.user.profile_picture)
              : "/placeholder.svg?height=40&width=40",
            initials,
          },
          service: service.name,
          date: appointment.service_date.toLocaleDateString('fr-FR'),
        });
      }

      return upcoming;
    }

    async getNearDeliveries(user_id: string): Promise<nearDeliveries> {
      const deliveryPerson = await this.deliveryPersonRepository.findOne({
        where: { user: { user_id } },
      });

      if (!deliveryPerson) throw new Error("Livreur non trouvé");

      const fullAddress = `${deliveryPerson.address}, ${deliveryPerson.city}, ${deliveryPerson.country}`;

      console.log("Recherche de livraisons à proximité pour l'adresse :", fullAddress);

      const geoResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          format: 'json',
          q: fullAddress,
          limit: 1,
        },
        headers: {
          'User-Agent': 'Ecodeli',
        },
      });

      let latitude: number, longitude: number, radius = 30000;

      const location = geoResponse.data?.[0];
      if (location) {
        latitude = parseFloat(location.lat);
        longitude = parseFloat(location.lon);
      } else {
        latitude = 48.8566;
        longitude = 2.3522;
      }

      const nearbyShipments = await this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.deliveries', 'deliveries')
        .leftJoinAndSelect('shipment.stores', 'stores')
        .leftJoin('shipment.user', 'user')
        .leftJoin('user.clients', 'clients')
        .leftJoin('user.merchant', 'merchant')
        .where(`
          (
            EXISTS (SELECT 1 FROM clients WHERE clients.stripe_customer_id IS NOT NULL)
            OR merchant.stripe_customer_id IS NOT NULL
          )
        `)
        .andWhere(`
          ST_DWithin(
            shipment.departure_location::geography,
            ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
            :radius
          )
        `, {
          lon: longitude,
          lat: latitude,
          radius,
        })
        .getMany();

      const canceledDeliveries = await this.deliveryRepository.find({
        where: { status: 'canceled' },
        relations: ['shipment'],
      });

      const availableShipments = nearbyShipments.filter(shipment => {
        const allStores = shipment.stores;
        const totalSteps = allStores.map(s => s.step);
        const shipmentId = shipment.shipment_id;

        const validDeliveries = shipment.deliveries.filter(d => d.status !== 'canceled');
        const canceled = canceledDeliveries.filter(d => d.shipment.shipment_id === shipmentId);

        const coveredSteps = new Set<number>(validDeliveries.map(d => d.shipment_step));

        for (const canceledDelivery of canceled) {
          const step = canceledDelivery.shipment_step;
          if (!coveredSteps.has(step)) {
            coveredSteps.add(step);
          }
        }

        return totalSteps.some(step => !coveredSteps.has(step));
      });

      const now = new Date().toLocaleString('fr-FR', { month: 'long' });

      return {
        count: availableShipments.length,
        period: now.charAt(0).toUpperCase() + now.slice(1),
      };
    }

    async getClientStats(user_id: string): Promise<clientStats[]> {
      const deliveryPerson = await this.deliveryPersonRepository.findOne({
        where: { user: { user_id } },
      });
      if (!deliveryPerson) throw new Error('Livreur non trouvé');

      const deliveries = await this.deliveryRepository.find({
        where: {
          delivery_person: { delivery_person_id: deliveryPerson.delivery_person_id },
          status: 'validated',
        },
        relations: ['shipment', 'shipment.user', 'shipment.user.clients', 'shipment.user.merchant'],
      });

      console.log("Nombre de livraisons trouvées :", deliveries.length);

      let merchantCount = 0;
      let clientCount = 0;

      for (const delivery of deliveries) {
        const shipmentUser = delivery.shipment.user;
        const hasMerchant = shipmentUser.merchant != null;
        const hasClient = shipmentUser.clients && shipmentUser.clients.length > 0;

        if (hasMerchant) {
          merchantCount++;
        } else if (hasClient) {
          clientCount++;
        }
      }

      return [{
        month: 'total',
        merchant: merchantCount,
        client: clientCount,
      }];
    }

    async getMyNextEvent(user_id: string): Promise<events[]> {
      const deliveryPerson = await this.deliveryPersonRepository.findOne({
        where: { user: { user_id } },
      });

      if (!deliveryPerson) throw new Error('Livreur non trouvé');

      const deliveries = await this.deliveryRepository.find({
        where: { delivery_person: { delivery_person_id: deliveryPerson.delivery_person_id } },
      });

      const events: events[] = deliveries.map(delivery => ({
        date: delivery.delivery_date ?? delivery.send_date,
        label: delivery.delivery_id,
      }));

      events.sort((a, b) => a.date.getTime() - b.date.getTime());

      return events;
    }

    async getNextDelivery(user_id: string): Promise<NextDelivery> {
        const deliveryPerson = await this.deliveryPersonRepository.findOne({
            where: { user: { user_id } },
        });

        if (!deliveryPerson) {
            throw new Error('Livreur non trouvé');
        }

        const now = new Date();
        const deliveries = await this.deliveryRepository.find({
            where: { delivery_person: { delivery_person_id: deliveryPerson.delivery_person_id } },
            relations: [
                'shipment',
                'shipment.stores',
                'shipment.stores.exchangePoint',
                'shipment.parcels',
            ],
        });

        const sortedDeliveries = deliveries
            .filter(d => d.delivery_date || d.send_date)
            .sort((a, b) => {
                const dateA = new Date(a.delivery_date ?? a.send_date).getTime();
                const dateB = new Date(b.delivery_date ?? b.send_date).getTime();
                return dateA - dateB;
            });

        if (!sortedDeliveries.length) {
            throw new Error('Aucune livraison trouvée.');
        }

        // On prend d'abord la prochaine à venir, sinon la plus récente passée
        const upcomingDelivery =
            sortedDeliveries.find(d => new Date(d.delivery_date ?? d.send_date) >= now)
            ?? sortedDeliveries[sortedDeliveries.length - 1];

        const shipment = upcomingDelivery.shipment;
        const storesByStep = (shipment.stores || []).sort((a, b) => a.step - b.step);
        const step = upcomingDelivery.shipment_step;

        let origin = '';
        let destination = '';
        let originCoords: [number, number] = [0, 0];
        let destinationCoords: [number, number] = [0, 0];

        if (step === 0) {
            origin = shipment.departure_city ?? '';
            originCoords = shipment.departure_location?.coordinates?.slice().reverse() ?? [0, 0];

            const point = storesByStep[0]?.exchangePoint;
            destination = point?.city ?? shipment.arrival_city ?? '';
            destinationCoords = point?.coordinates?.coordinates?.slice().reverse() ?? shipment.arrival_location?.coordinates?.slice().reverse() ?? [0, 0];
        } else if (step === 1000) {
            const lastStore = storesByStep.find(s => s.step === step - 1);
            const point = lastStore?.exchangePoint;

            origin = point?.city ?? shipment.departure_city ?? '';
            originCoords = point?.coordinates?.coordinates?.slice().reverse() ?? shipment.departure_location?.coordinates?.slice().reverse() ?? [0, 0];

            destination = shipment.arrival_city ?? '';
            destinationCoords = shipment.arrival_location?.coordinates?.slice().reverse() ?? [0, 0];
        } else {
            const prevStore = storesByStep.find(s => s.step === step - 1);
            const currStore = storesByStep.find(s => s.step === step);

            const pointA = prevStore?.exchangePoint;
            const pointB = currStore?.exchangePoint;

            origin = pointA?.city ?? shipment.departure_city ?? '';
            originCoords = pointA?.coordinates?.coordinates?.slice().reverse() ?? shipment.departure_location?.coordinates?.slice().reverse() ?? [0, 0];

            destination = pointB?.city ?? shipment.arrival_city ?? '';
            destinationCoords = pointB?.coordinates?.coordinates?.slice().reverse() ?? shipment.arrival_location?.coordinates?.slice().reverse() ?? [0, 0];
        }

        const totalWeight = (shipment.parcels || []).reduce((sum, p) => sum + Number(p.weight || 0), 0);
        const deliveryDate = upcomingDelivery.delivery_date ?? upcomingDelivery.send_date;

        const statusMap: Record<string, "wait" | "take" | "going" | "finished"> = {
            pending: "wait",
            taken: "take",
            going: "going",
            finished: "finished",
        };

        const mappedStatus = statusMap[upcomingDelivery.status] ?? "wait";

        const distanceInMeters = getDistance(
            { latitude: originCoords[0], longitude: originCoords[1] },
            { latitude: destinationCoords[0], longitude: destinationCoords[1] }
        );

        const speedMps = 80_000 / 3600;
        const estimatedSeconds = distanceInMeters / speedMps;
        const estimatedMinutes = Math.round(estimatedSeconds / 60);

        const estimatedTime =
            estimatedMinutes < 60
                ? `${estimatedMinutes} min`
                : `${Math.floor(estimatedMinutes / 60)}h ${estimatedMinutes % 60} min`;

        const nextDelivery: NextDelivery = {
            origin,
            destination,
            date: deliveryDate,
            status: mappedStatus,
            trackingNumber: upcomingDelivery.delivery_id ?? '',
            carrier: "Vous même",
            weight: `${totalWeight.toFixed(2)} kg`,
            estimatedTime,
        };

        return nextDelivery;
    }

    async getCompletedDeliveries(user_id: string): Promise<CompletedService> {
        const deliveryPerson = await this.deliveryPersonRepository.findOne({
            where: { user: { user_id } },
        });

        if (!deliveryPerson) {
            throw new Error('Livreur non trouvé');
        }

        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

        const count = await this.deliveryRepository.count({
            where: {
                delivery_person: { delivery_person_id: deliveryPerson.delivery_person_id },
                status: 'validated',
                delivery_date: Between(startOfYear, endOfYear),
            },
        });

        return {
            count,
            period: now.getFullYear().toString(),
        };
    }
}


function getDistance(
  point1: { latitude: number; longitude: number },
  point2: { latitude: number; longitude: number }
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371000; 
  const lat1 = toRad(point1.latitude);
  const lat2 = toRad(point2.latitude);
  const deltaLat = toRad(point2.latitude - point1.latitude);
  const deltaLon = toRad(point2.longitude - point1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance; 
}