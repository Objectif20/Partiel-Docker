import axiosInstance from "./axiosInstance";

interface Location {
type: string;
coordinates: [number, number];
}

export interface Delivery {
shipment_id: string;
description: string;
estimated_total_price: number | null;
proposed_delivery_price: number | null;
weight: string;
volume: string;
deadline_date: string | null;
time_slot: string | null;
urgent: boolean;
status: string | null;
image: string | null;
views: number;
departure_city: string;
arrival_city: string;
departure_location: Location;
arrival_location: Location;
delivery_mail: string;
}

export interface DeliveriesFilter {
latitude: number;
longitude: number;
radius: number;
limit?: number;
page?: number;
routeStartLatitude?: number;
routeStartLongitude?: number;
routeEndLatitude?: number;
routeEndLongitude?: number;
routeRadius?: number;
minPrice?: number;
maxPrice?: number;
minWeight?: number;
maxWeight?: number;
deliveryType?: string;
}

// Interface pour le détail d'une annonce de livraison

export interface DeliveryDetails {
id: string;
name: string;
description?: string;
complementary_info?: string;
departure: CityLocation;
arrival: CityLocation;
departure_date?: string;
arrival_date?: string;
status: string;
initial_price: number;
price_with_step: PriceStep[];
invoice: Invoice[];
finished: boolean;
urgent: boolean;
trolleydrop : boolean
}

export interface CityLocation {
city?: string;
coordinates: [number, number];
}

export interface PriceStep {
step: string;
price: number | null;
}

export interface Invoice {
name: string;
url_invoice: string;
}

export interface Package {
id: string;
picture: string[];
name: string;
fragility: boolean;
estimated_price: number;
weight: number;
volume: number;
}

export interface Step {
id: number;
title: string;
description: string;
date: string;
departure?: CityLocation;
arrival?: CityLocation;
courier: Courier;
}

export interface Courier {
name: string;
photoUrl: string | null;
}

export interface Shipment {
details: DeliveryDetails;
package: Package[];
steps: Step[];
}


export interface Warehouse {
warehouse_id: string;
city: string;
coordinates: {
    type : string;
    coordinates : [number, number];
},
photo : string;
description : string;
}

export interface DeliveryOnGoing {

id: string;
from: string;
to: string;
status: string;
pickupDate: string | null;
estimatedDeliveryDate: string | null;
coordinates: {
    origin: [number, number];
    destination: [number, number];
};
progress: number;

}

export interface HistoryDelivery {
id: string;
departure_city: string;
arrival_city: string;
price: number;
client: {
    name: string;
    photo_url: string;
};
status: string;
}

export interface ReviewAsDeliveryPerson {
id: string;
content: string;
author: {
    id: string;
    name: string;
    photo: string;
};
reply: boolean;
reply_content: string | null;
delivery_name: string;
rate: number;
}

export interface ReviewAsClient {
id: string;
content: string;
delivery: {
    id: string;
    deliveryman: {
    id: string;
    name: string;
    photo: string;
    email: string;
    };
};
services_name: string;
rate: number;
}

export interface DeliveriesLocation {
id: string;
coordinates: {
    lat: number;
    lng: number;
};
deliveryman?: {
    id: string;
    name: string;
    photo: string;
    email: string;
};
potential_address?: string;
}

export interface CurrentDeliveryAsClient {
id: string;
arrival_city: string;
departure_city: string;
date_departure: string;
date_arrival: string;
photo: string;
deliveryman: {
    name: string;
    photo: string;
};
}

export interface SubscriptionForClient {
planName: string;
discountRate?: number; 
priorityRate: number;
insuranceLimit?: number | null; 
additionalInsuranceCost?: number | null; 
freeShipmentAvailable?: boolean;
freePriorityShipmentsPerMonth?: number;
freePriotiryShipmentsIfLower?: number;
permanentDiscount?: number; 
hasUsedFreeShipment?: boolean; 
remainingPriorityShipments?: number; 
}

// Interface pour le détail d'une annonce de livraison

export interface ShipmentsDetailsOffice {
details: {
    id: string;
    name: string;
    description: string;
    complementary_info: string;
    facture_url : string;
    departure: {
    city: string;
    coordinates: [number, number];
    address?:string;
    postal_code?:string;
    handling?: boolean;
    floor?: number;
    elevator?: boolean;
    };
    arrival: {
    city: string;
    coordinates: [number, number];
    address?:string;
    postal_code?:string;
    handling?: boolean;
    floor?: number;
    elevator?: boolean;
    };
    departure_date: string;
    arrival_date: string;
    status: string;
    initial_price: number;
    price_with_step: {
    step: string;
    price: number;
    }[];
    invoice: {
    name: string;
    url_invoice: string;
    }[];
    urgent: boolean;
    finished: boolean;

};
package: {
    id: string;
    picture: string[];
    name: string;
    fragility: boolean;
    estimated_price: number;
    weight: number;
    volume: number;
}[];
steps: {
    id: number;
    title: string;
    description: string;
    date: string;
    departure: {
    city: string;
    coordinates: [number, number];
    };
    arrival: {
    city: string;
    coordinates: [number, number];
    };
    courier: {
    name: string;
    photoUrl: string;
    };
    idLink: number;
}[];
}


export interface ShipmentListItem {
id: string
name: string
status: string
urgent: boolean
departure: {
    city: string
    coordinates: [number, number]
}
arrival: {
    city: string
    coordinates: [number, number]
}
departure_date: string
arrival_date: string
packageCount: number
progress: number
finished: boolean
initial_price: number
}

export interface ShipmentHistoryRequest {
id: string;
name: string;
departureCity: string;
arrivalCity: string;
urgent: boolean;
nbColis: number;
nbLivraisons: number;
}

export interface DeliveryHistoryAsClient {
    id: string;
    deliveryman: {
      id: string;
      name: string;
      photo: string;
    };
    departureDate: string;
    arrivalDate: string;
    departureCity: string;
    arrivalCity: string;
    announcementName: string;
    rate: number | null;
    comment: string | null;
  }

export interface DeliveryDetailsPage {
    departure: {
      city: string;
      coordinates: [number, number];
    };
    arrival: {
      city: string;
      coordinates: [number, number];
    };
    departure_date: string;
    arrival_date: string;
    status: "pending" | "taken" | "finished" | "validated";
    total_price: number;
    cart_dropped: boolean;
    packages: {
      id: string;
      name: string;
      fragility: boolean;
      estimated_price: number;
      weight: number;
      volume: number;
      picture: string[];
    }[];
  }


export class DeliveriesAPI {

    static async getDeliveries(apiFilter : DeliveriesFilter) : Promise<Delivery[]> {
            try{
                const response = await axiosInstance.get<Delivery[]>("/client/shipments", {
                    params: apiFilter
                });
                return response.data;
            } catch (error) {
                console.error("Error fetching deliveries:", error);
                throw new Error("Failed to fetch deliveries");
            }
    }

    static async createShipment(data: FormData): Promise<any> {
        try {
            const response = await axiosInstance.post("/client/shipments", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating shipment:", error);
            throw new Error("Failed to create shipment");
        }
    }

    static async createShipmentTrolley(data: FormData): Promise<any> {
        try {
            const response = await axiosInstance.post("/client/shipments/trolley", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating shipment:", error);
            throw new Error("Failed to create shipment");
        }
    }

    static async getShipmentDetailsById(shipment_id : string) : Promise<Shipment> {

        try {
            const response = await axiosInstance.get<Shipment>(`/client/shipments/${shipment_id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching shipment details:", error);
            throw new Error("Failed to fetch shipment details");
        }
    }

    static async bookShipment(shipment_id: string): Promise<any> {
        try {
            const response = await axiosInstance.post(`/client/shipments/${shipment_id}/book`);
            return response.data;
        } catch (error) {
            console.error("Error booking shipment:", error);
            throw new Error("Failed to book shipment");
        }
    }

    static async askToNegotiate(shipment_id: string): Promise<any> {
        try {
            const response = await axiosInstance.post(`/client/shipments/${shipment_id}/askNegociation`);
            return response.data;
        } catch (error) {
            console.error("Error asking to negotiate:", error);
            throw new Error("Failed to ask to negotiate");
        }
    }

    static async getWareHouse() : Promise<Warehouse[]> {
        try {
            const response = await axiosInstance.get("/client/shipments/warehouses");
            return response.data;
        } catch (error) {
            console.error("Error fetching warehouses:", error);
            throw new Error("Failed to fetch warehouses");
        }
    }

    static async getMyCurrentShipments() : Promise<Delivery[]> {

        try {
            const response = await axiosInstance.get<Delivery[]>("/client/shipments/myCurrentShipmentsForNegotiation");
            return response.data;
        } catch (error) {
            console.error("Error fetching current shipments:", error);
            throw new Error("Failed to fetch current shipments");
        }
    }

    static async createPartialDelivery(data: any, shipment_id : string): Promise<any> {
        try {
            const response = await axiosInstance.post(`/client/shipments/${shipment_id}/bookPartial`, data)
            return response.data;
        } catch (error) {
            console.error("Error creating partial shipment:", error);
            throw new Error("Failed to create partial shipment");
        }
    }

    static async getMyOngoingDeliveriesAsDeliveryman() : Promise<DeliveryOnGoing[]> {

        try {
            const response = await axiosInstance.get<DeliveryOnGoing[]>("/client/shipments/onGoingDeliveries");
            return response.data;
        } catch (error) {
            console.error("Error fetching ongoing deliveries:", error);
            throw new Error("Failed to fetch ongoing deliveries");
        }

    }

    static async getMyDeliveryHistoryAsDeliveryman(pageIndex: number, pageSize: number): Promise<{ data: HistoryDelivery[], totalRows: number }>{
        try {
          const response = await axiosInstance.get<{ data: HistoryDelivery[], totalRows: number }>("/client/shipments/delivery/myHistory", {
            params: {
              page : pageIndex,
              limit : pageSize,
            },
          });
          return response.data;
        } catch (error) {
            console.error("Error fetching delivery history:", error);
            throw new Error("Failed to fetch delivery history");
        }

    }

    static async getMyReviewsAsDeliveryman(pageIndex: number, pageSize: number): Promise<{ data: ReviewAsDeliveryPerson[], totalRows: number }> {
        try {
            const response = await axiosInstance.get<{ data: ReviewAsDeliveryPerson[], totalRows: number }>("/client/shipments/delivery/reviews", {
                params: {
                    page : pageIndex,
                    limit : pageSize,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching delivery history:", error);
            throw new Error("Failed to fetch delivery history");
        }
    }

    static async replyToReview(review_id: string, content: string): Promise<any> {
        try {
            const id = review_id
            const response = await axiosInstance.post(`/client/shipments/delivery/reviews/${id}/reply`, { content });
            return response.data;
        } catch (error) {
            console.error("Error replying to review:", error);
            throw new Error("Failed to reply to review");
        }
    }

    static async getMyReviewsAsClient(pageIndex: number, pageSize: number): Promise<{ data: ReviewAsClient[], totalRows: number }> {
        try {
            const response = await axiosInstance.get<{ data: ReviewAsClient[], totalRows: number }>("/client/shipments/delivery/myReviews", {
                params: {
                    page : pageIndex,
                    limit : pageSize,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching delivery history:", error);
            throw new Error("Failed to fetch delivery history");
        }
    }

    static async getMyDeliveriesLocation() : Promise<DeliveriesLocation[]> {

        try {
            const response = await axiosInstance.get<DeliveriesLocation[]>("/client/shipments/delivery/myLocation");
            return response.data;
        } catch (error) {
            console.error("Error fetching deliveries location:", error);
            throw new Error("Failed to fetch deliveries location");
        }

    }

    static async getCurrentDeliveriesAsClient() : Promise<CurrentDeliveryAsClient[]> {
        try {
            const response = await axiosInstance.get<CurrentDeliveryAsClient[]>("/client/shipments/delivery/current");
            return response.data;
        } catch (error) {
            console.error("Error fetching current deliveries:", error);
            throw new Error("Failed to fetch current deliveries");
        }

    }

    static async takeDeliveryPackage(delivery_id: string, secretCode : string): Promise<any> {
        try {
            const response = await axiosInstance.post(`/client/shipments/delivery/${delivery_id}/taken` , { secretCode });
            return response.data;
        } catch (error) {
            console.error("Error taking delivery package:", error);
            throw new Error("Failed to take delivery package");
        }
    }

    static async finishedDelivery(delivery_id: string): Promise<any> {
      try {
          const response = await axiosInstance.post(`/client/shipments/delivery/${delivery_id}/finish`);
          return response.data;
      } catch (error) {
          console.error("Error taking delivery package:", error);
          throw new Error("Failed to take delivery package");
      }
    }

    static async validateDelivery(delivery_id: string): Promise<any> {
      try {
          const response = await axiosInstance.post(`/client/shipments/delivery/${delivery_id}/validate`);
          return response.data;
      } catch (error) {
          console.error("Error taking delivery package:", error);
          throw new Error("Failed to take delivery package");
      }
    }

    static async validateDeliveryWithCode(delivery_id: string, secretCode : string): Promise<any> {
        try {
            const response = await axiosInstance.post(`/client/shipments/delivery/${delivery_id}/validateWithCode`, { secretCode });
            return response.data;
        } catch (error) {
            console.error("Error taking delivery package:", error);
            throw new Error("Failed to take delivery package");
        }
    }

    static async getSubscriptionStat() : Promise<SubscriptionForClient> {
        try {
            const response = await axiosInstance.get<SubscriptionForClient>("/client/shipments/subscriptionStat");
            return response.data;
        } catch (error) {
            console.error("Error fetching subscription stats:", error);
            throw new Error("Failed to fetch subscription stats");
        }
    }

    static async getShipmentDetailsByIdOffice(shipment_id : string) : Promise<ShipmentsDetailsOffice> {
        try {
            const response = await axiosInstance.get<ShipmentsDetailsOffice>(`/client/shipments/office/${shipment_id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching shipment details:", error);
            throw new Error("Failed to fetch shipment details");
        }
    }

    static async getMyCurrentShipmentsOffice() : Promise<ShipmentListItem[]> {
        try {
            const response = await axiosInstance.get<ShipmentListItem[]>("/client/shipments/myCurrentShipments");
            return response.data;
        } catch (error) {
            console.error("Error fetching current shipments:", error);
            throw new Error("Failed to fetch current shipments");
        }
    }

    static async getMyShipmentsHistoryOffice(pageIndex: number, pageSize: number): Promise<{ data: ShipmentHistoryRequest[], totalRows: number }> {
        try {
            const response = await axiosInstance.get<{ data: ShipmentHistoryRequest[], totalRows: number }>("/client/shipments/myShipmentsHistory", {
                params: {
                    page : pageIndex,
                    limit : pageSize,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching shipment history:", error);
            throw new Error("Failed to fetch shipment history");
        }
    }

    static async getMyDeliveriesHistoryAsClient(pageIndex: number, pageSize: number): Promise<{ data: DeliveryHistoryAsClient[], totalRows: number }> {
        try {
            const response = await axiosInstance.get<{ data: DeliveryHistoryAsClient[], totalRows: number }>("/client/shipments/delivery/myHistoryAsClient", {
                params: {
                    page : pageIndex,
                    limit : pageSize,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching delivery history:", error);
            throw new Error("Failed to fetch delivery history");
        }
    }

    static async addReviewsAsClient(delivery_id: string, rate: number, comment: string): Promise<{message: string}> {
        try {
            const response = await axiosInstance.post(`/client/shipments/delivery/${delivery_id}/comments`, { rate, comment });
            return response.data;
        } catch (error) {
            console.error("Error adding review:", error);
            throw new Error("Failed to add review");
        }
    }

    static async getDeliveryDetails(delivery_id : string) : Promise<DeliveryDetailsPage> {
        try {
            const response = await axiosInstance.get<DeliveryDetailsPage>(`/client/shipments/delivery/${delivery_id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching delivery details:", error);
            throw new Error("Failed to fetch delivery details");
        }
    }

    static async cancelDelivery(delivery_id: string): Promise<any> {
        try {
            const response = await axiosInstance.delete(`/client/shipments/delivery/${delivery_id}/cancel`);
            return response.data;
        } catch (error) {
            console.error("Error cancelling delivery:", error);
            throw new Error("Failed to cancel delivery");
        }
    }


}