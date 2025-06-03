import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "src/common/entities/client.entity";
import { DeliveryPerson } from "src/common/entities/delivery_persons.entity";
import { Merchant } from "src/common/entities/merchant.entity";
import { Plan } from "src/common/entities/plan.entity";
import { Providers } from "src/common/entities/provider.entity";
import { ProviderDocuments } from "src/common/entities/providers_documents.entity";
import { Users } from "src/common/entities/user.entity";
import { MinioService } from "src/common/services/file/minio.service";
import { In, MoreThan, Repository } from "typeorm";
import { UpdateMyBasicProfileDto } from "./dto/update-basic-profile.dto";
import { Blocked } from "src/common/entities/blocked.entity";
import { v4 as uuidv4 } from "uuid";
import { Report } from "src/common/entities/report.entity";
import { CreateReportDto } from "./dto/create-report.dto";
import { StripeService } from "src/common/services/stripe/stripe.service";
import { Availability } from "src/common/entities/availibities.entity";
import { AvailabilityDto } from "./dto/availitity.dto";
import * as nodemailer from 'nodemailer';
import { OneSignalService } from "src/common/services/notification/oneSignal.service";
import { BillingsData, CommonSettingsForm, UserSubscriptionData } from "./type";
import { Transfer } from "src/common/entities/transfers.entity";
import { TransferProvider } from "src/common/entities/transfers_provider.entity";
import { Subscription } from "src/common/entities/subscription.entity";
import { SubscriptionTransaction } from "src/common/entities/subscription_transaction.entity";
import { CommonSettingsDto } from "./dto/common-settings.dto";
import { Languages } from "src/common/entities/languages.entity";
import { PdfService } from "src/common/services/pdf/pdf.service";
import { Readable } from "stream";

  @Injectable()
  export class ProfileService {
    constructor(
      @InjectRepository(Users)
      private readonly userRepository: Repository<Users>,
      @InjectRepository(Client)
      private readonly clientRepository: Repository<Client>,
      @InjectRepository(Merchant)
      private readonly merchantRepository: Repository<Merchant>,
      @InjectRepository(DeliveryPerson)
      private readonly deliveryPersonRepository: Repository<DeliveryPerson>,
      @InjectRepository(Providers)
      private readonly providerRepository: Repository<Providers>,
      @InjectRepository(Plan)
      private readonly planRepository: Repository<Plan>,
      @InjectRepository(ProviderDocuments)
      private readonly providerDocumentsRepository: Repository<ProviderDocuments>,
      @InjectRepository(Blocked)
      private readonly blockedRepository: Repository<Blocked>,
      @InjectRepository(Report)
      private readonly reportRepository: Repository<Report>,
      @InjectRepository(Availability)
      private readonly availabilityRepository: Repository<Availability>,
      @InjectRepository(Transfer)
      private readonly transferRepository: Repository<Transfer>,
      @InjectRepository(TransferProvider)
      private readonly transferProviderRepository: Repository<TransferProvider>,
      @InjectRepository(Subscription)
      private readonly subscriptionRepository: Repository<Subscription>,
      @InjectRepository(SubscriptionTransaction)
      private readonly subscriptionTransactionRepository: Repository<SubscriptionTransaction>,
      @InjectRepository(Languages)
      private readonly languageRepository: Repository<Languages>,
      private readonly minioService: MinioService,
      private readonly stripeService: StripeService,
      @Inject('NodeMailer') private readonly mailer: nodemailer.Transporter,
      private readonly onesignalService: OneSignalService,
      private readonly pdfService: PdfService,
    ) {}
  
    async getMyProfile(user_id: string): Promise<any> {
      const user = await this.userRepository.findOne({
        where: { user_id },
        relations: ['language', 'subscriptions', 'subscriptions.plan'],
      });
    
      if (!user) {
        throw new Error('User not found');
      }
    
      const client = await this.clientRepository.findOne({ where: { user: { user_id } } });
      const deliverymanExists = await this.deliveryPersonRepository.count({ where: { user: { user_id } } });
      const merchant = await this.merchantRepository.findOne({ where: { user: { user_id } } });
      const provider = await this.providerRepository.findOne({ where: { user: { user_id } } });
    
      const profile: string[] = [];
      if (client) profile.push('CLIENT');
      if (merchant) profile.push('MERCHANT');
      if (provider) profile.push('PROVIDER');
      if (deliverymanExists > 0) profile.push('DELIVERYMAN');
    
      let first_name = 'N/A';
      let last_name = 'N/A';
      let validateProfile = false;
      let customer_stripe_id = false;

    
      if (provider) {
        first_name = provider.first_name;
        last_name = provider.last_name;
        validateProfile = provider.validated
      } else if (merchant) {
        first_name = merchant.first_name;
        last_name = merchant.last_name;
        customer_stripe_id = merchant.stripe_customer_id ? true : false;
        validateProfile = true;
      } else if (client) {
        first_name = client.first_name;
        last_name = client.last_name;
        customer_stripe_id = client.stripe_customer_id ? true : false;
        if (deliverymanExists > 0) {
          const deliveryman = await this.deliveryPersonRepository.findOne({ where: { user: { user_id } } });
          if (deliveryman) {
            validateProfile = deliveryman.validated;
          }
        } else {
          validateProfile = true;
        }
      }
    
      const latestSubscription = user.subscriptions?.sort((a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      )[0];
    
      const planName = latestSubscription?.plan?.name || null;
    
      let upgradablePlan: boolean | null = null;
    
      if (!provider && latestSubscription?.plan) {
        const currentPrice = latestSubscription.plan.price;
        console.log('currentPrice', currentPrice);
        const higherPlans = currentPrice !== undefined
          ? await this.planRepository.count({
              where: { price: MoreThan(currentPrice) },
            })
          : 0;
        upgradablePlan = higherPlans > 0;
      }

      let photoUrl = user.profile_picture;
      if (user.profile_picture) {
        const bucketName = 'client-images';
        const imageName = user.profile_picture;
        photoUrl = await this.minioService.generateImageUrl(bucketName, imageName);
      }
    
      const userData = {
        user_id: user.user_id,
        first_name,
        last_name,
        email: user.email,
        photo: photoUrl || null,
        active: !user.banned,
        language: user.language?.language_name || 'test',
        iso_code: user.language?.iso_code || 'test',
        language_id: user.language?.language_id || 'test',
        profile,
        otp: user.two_factor_enabled,
        upgradablePlan,
        validateProfile,
        planName,
        customer_stripe_id,
      };
    
      return userData;
    }

    async getMyBasicProfile(user_id: string): Promise<any> {
      const user = await this.userRepository.findOne({ where: { user_id } });
    
      if (!user) {
        throw new Error('Utilisateur introuvable');
      }
    
      const client = await this.clientRepository.findOne({ where: { user: { user_id } } });
      const merchant = await this.merchantRepository.findOne({ where: { user: { user_id } } });
      const provider = await this.providerRepository.findOne({ where: { user: { user_id } } });
    
      let first_name = 'N/A';
      let last_name = 'N/A';
    
      if (provider) {
        first_name = provider.first_name;
        last_name = provider.last_name;
      } else if (merchant) {
        first_name = merchant.first_name;
        last_name = merchant.last_name;
      } else if (client) {
        first_name = client.first_name;
        last_name = client.last_name;
      }
    
      return {
        email: user.email,
        first_name,
        last_name,
        newsletter: user.newsletter,
      };
    }
    
    
    async updateMyBasicProfile(
      user_id: string,
      dto: UpdateMyBasicProfileDto,
    ): Promise<{ message: string }> {
      const user = await this.userRepository.findOne({ where: { user_id } });
    
      if (!user) {
        throw new Error('Utilisateur introuvable');
      }
    
      const { email, first_name, last_name, newsletter } = dto;
    
      if (email) user.email = email;
      if (typeof newsletter === 'boolean') user.newsletter = newsletter;
    
      const provider = await this.providerRepository.findOne({ where: { user: { user_id } } });
      const merchant = await this.merchantRepository.findOne({ where: { user: { user_id } } });
      const client = await this.clientRepository.findOne({ where: { user: { user_id } } });
    
      if (first_name || last_name) {
        if (provider) {
          if (first_name) provider.first_name = first_name;
          if (last_name) provider.last_name = last_name;
          await this.providerRepository.save(provider);
        } else if (merchant) {
          if (first_name) merchant.first_name = first_name;
          if (last_name) merchant.last_name = last_name;
          await this.merchantRepository.save(merchant);
        } else if (client) {
          if (first_name) client.first_name = first_name;
          if (last_name) client.last_name = last_name;
          await this.clientRepository.save(client);
        }
      }
    
      await this.userRepository.save(user);
    
      return { message: 'Profil mis à jour avec succès' };
    }

    async getProfileWithBlocked(user_id: string): Promise<any> {
      // Récupération de l'utilisateur principal
      const user = await this.userRepository.findOne({ where: { user_id } });
    
      if (!user) throw new NotFoundException('User not found');
    
      const profilePictureUrl = user.profile_picture
        ? await this.minioService.generateImageUrl('client-images', user.profile_picture)
        : null;
    
      // Récupération des utilisateurs bloqués par l'utilisateur
      const blockedUsers = await this.blockedRepository.find({
        where: { user_id },
      });
    
      const blockedIds = blockedUsers.map((b) => b.user_id_blocked);
    
      if (blockedIds.length === 0) {
        return {
          photo: profilePictureUrl,
          blocked: [],
        };
      }
    
      // Récupération des entités Users correspondantes
      const users = await this.userRepository.find({
        where: { user_id: In(blockedIds) },
      });
    
      const userIds = users.map((u) => u.user_id);
    
      // Récupération des rôles associés
      const [clients, merchants, providers] = await Promise.all([
        this.clientRepository.find({ where: { user: { user_id: In(userIds) } }, relations: ['user'] }),
        this.merchantRepository.find({ where: { user: { user_id: In(userIds) } }, relations: ['user'] }),
        this.providerRepository.find({ where: { user: { user_id: In(userIds) } }, relations: ['user'] }),
      ]);
    
      const getName = (u: Users) => {
        const provider = providers.find((p) => p.user.user_id === u.user_id);
        if (provider) return { first_name: provider.first_name, last_name: provider.last_name };
    
        const merchant = merchants.find((m) => m.user.user_id === u.user_id);
        if (merchant) return { first_name: merchant.first_name, last_name: merchant.last_name };
    
        const client = clients.find((c) => c.user.user_id === u.user_id);
        if (client) return { first_name: client.first_name, last_name: client.last_name };
    
        return { first_name: 'N/A', last_name: 'N/A' };
      };
    
      const blockedList = await Promise.all(
        users.map(async (u) => {
          const name = getName(u);
          const photo = u.profile_picture
            ? await this.minioService.generateImageUrl('client-images', u.profile_picture)
            : null;
    
          return {
            user_id: u.user_id,
            ...name,
            photo,
          };
        }),
      );
    
      return {
        photo: profilePictureUrl,
        blocked: blockedList,
      };
    }

    async deleteBlocked(user_id: string, blocked_user_id: string): Promise<{ message: string }> {
      const block = await this.blockedRepository.findOne({
        where: { user_id, user_id_blocked: blocked_user_id },
      });
  
      if (!block) throw new NotFoundException('Relation de blocage non trouvée');
  
      await this.blockedRepository.remove(block);
      return { message: 'Utilisateur débloqué avec succès' };
    }
  
    async updateProfilePicture(user_id: string, file: Express.Multer.File): Promise<{ url: string }> {
      const user = await this.userRepository.findOne({ where: { user_id } });
      if (!user) throw new NotFoundException('Utilisateur introuvable');
  
      const oldPath = user.profile_picture;
      const filename = `${user_id}/image-${uuidv4()}.${file.originalname.split('.').pop()}`;
      const bucket = 'client-images';
  
      const uploaded = await this.minioService.uploadFileToBucket(bucket, filename, file);
      if (!uploaded) throw new Error("Erreur lors de l'upload");
  
      if (oldPath) {
        await this.minioService.deleteFileFromBucket(bucket, oldPath);
      }
  
      user.profile_picture = filename;
      await this.userRepository.save(user);
  
      const url = await this.minioService.generateImageUrl(bucket, filename);
      return { url };
    }

    async createReport(dto: CreateReportDto): Promise<Report> {
      const user = await this.userRepository.findOne({ where: { user_id: dto.user_id } });
      if (!user) {
        throw new NotFoundException('Utilisateur introuvable');
      }
  
      const report = this.reportRepository.create({
        user,
        report_message: dto.report_message,
        status: 'pending',
        state: 'new',
      });
  
      return this.reportRepository.save(report);
    }

    async getStripeAccountId(userId: string): Promise<string | null> {
      const provider = await this.providerRepository.findOne({
        where: { user: { user_id: userId } },
      });
      if (provider?.stripe_transfer_id) return provider.stripe_transfer_id;
    
      const delivery = await this.deliveryPersonRepository.findOne({
        where: { user: { user_id: userId } },
      });
      if (delivery?.stripe_transfer_id) return delivery.stripe_transfer_id;
    
      return null;
    }
    
    async createStripeAccount(userId: string): Promise<{ stripeAccountId: string, accountLinkUrl: string }> {
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
        relations: ['providers', 'deliveryPerson', 'clients'],
      });
    
      if (!user) throw new Error('User not found');
    
      const existingId = await this.getStripeAccountId(userId);
      if (existingId) return { stripeAccountId: existingId, accountLinkUrl: '' };
    
      const isProvider = (user.providers ?? []).length > 0;
      const isDelivery = user.deliveryPerson != null;
    
      if (!isProvider && !isDelivery) {
        throw new Error("L'utilisateur n’est ni provider ni livreur.");
      }
    
      const account = await this.stripeService.createExpressAccount();
      const accountLinkUrl = await this.stripeService.createAccountLink(account.id);
    
      if (isProvider) {
        const provider = user.providers[0];
        provider.stripe_transfer_id = account.id;
        await this.providerRepository.save(provider);
      }
    
      if (isDelivery) {
        const delivery = user.deliveryPerson;
        delivery.stripe_transfer_id = account.id;
        await this.deliveryPersonRepository.save(delivery);
      }
    
      return { stripeAccountId: account.id, accountLinkUrl };
    }
    
    async isStripeExpressAccountValid(user_id: string): Promise<{
      valid: boolean;
      enabled: boolean;
      needs_id_card: boolean;
      url_complete?: string;
    }> {
      const stripeAccountId = await this.getStripeAccountId(user_id);
      if (!stripeAccountId) {
        return { valid: false, enabled: false, needs_id_card: false };
      }
    
      const status = await this.stripeService.getStripeExpressAccountStatus(stripeAccountId);
    
      const url_complete = !status.isEnabled
        ? await this.stripeService.createAccountLink(stripeAccountId)
        : undefined;
    
      return {
        valid: status.isValid,
        enabled: status.isEnabled,
        needs_id_card: status.needsIdCard,
        url_complete,
      };
    }

    async updateExpressAccount(stripeAccountId: string): Promise<string> {
      const accountLinkUrl = await this.stripeService.updateExpressAccount(stripeAccountId);
      return accountLinkUrl;
    }


    async getMyBillingsData(user_id: string): Promise<BillingsData> {
      const user = await this.userRepository.findOne({ 
        where: { user_id },
        relations: ['deliveryPerson', 'providers', 'clients']      
      });
    
      if (!user) {
        throw new NotFoundException('User not found');
      }
    
      const isProvider = (user.providers ?? []).length > 0;
      const isDelivery = user.deliveryPerson != null;
    
      if (!isProvider && !isDelivery) {
        throw new Error("L'utilisateur n’est ni provider ni livreur.");
      }
    
      let amount = 0;
      let billings: {
        id: string;
        date: string;
        type: 'auto' | 'not-auto';
        amount: number;
        invoiceLink: string;
      }[] = [];
    
      if (isProvider) {
        const provider = user.providers[0];
        amount = provider.balance;
    
        const transfers = await this.transferProviderRepository.find({
          where: { provider: { provider_id: provider.provider_id } },
          order: { date: 'DESC' },
        });
    
        billings = transfers.map((transfer) => {
          if (!transfer.stripe_id) {
            throw new Error('Transfer ID is undefined');
          }
          return {
            id: transfer.stripe_id,
            date: transfer.date.toISOString().split('T')[0],
            type: transfer.type as 'auto' | 'not-auto',
            amount: transfer.amount,
            invoiceLink: transfer.url || `https://example.com/invoice/${transfer.stripe_id}`,
          };
        });
      }
    
      if (isDelivery) {
        const deliveryPerson = user.deliveryPerson;
        amount = deliveryPerson.balance;
    
        const transfers = await this.transferRepository.find({
          where: { delivery_person: { delivery_person_id: deliveryPerson.delivery_person_id } },
          order: { date: 'DESC' },
        });
    
        billings = transfers.map((transfer) => {
          if (!transfer.stripe_id) {
            throw new Error('Transfer ID is undefined');
          }
          return {
            id: transfer.stripe_id,
            date: transfer.date.toISOString().split('T')[0],
            type: transfer.type as 'auto' | 'not-auto',
            amount: transfer.amount,
            invoiceLink: transfer.url || `https://example.com/invoice/${transfer.stripe_id}`,
          };
        });
      }
    
      return {
        billings,
        amount,
      };
    }


    async createPayment(user_id: string, auto: boolean) {
    const user = await this.userRepository.findOne({
      where: { user_id },
      relations: [
        'deliveryPerson',
        'providers',
        'clients',
        'deliveryPerson.user',
        'providers.user',
        'deliveryPerson.user.clients',
        'providers.user.clients',
      ],
    });

    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    const provider = user.providers?.[0] ?? null;
    const delivery = user.deliveryPerson ?? null;

    if (!provider && !delivery) {
      throw new Error("L'utilisateur n’est ni provider ni livreur.");
    }

    const role = provider ? 'provider' : 'delivery';
    const balance = provider ? provider.balance : delivery.balance;

    if (balance <= 0) {
      throw new Error('Le montant est inférieur ou égal à zéro.');
    }

    const stripeAccountId = await this.getStripeAccountId(user_id);
    if (!stripeAccountId) {
      throw new Error("L'utilisateur n'a pas de compte Stripe associé.");
    }

    const amountInCents = Math.round(balance * 100);
    const transfer = await this.stripeService.transferToConnectedAccount(stripeAccountId, amountInCents);

    let transferRecord: Transfer | TransferProvider;
    if (role === 'provider') {
      const transferProvider = new TransferProvider();
      transferProvider.date = new Date();
      transferProvider.amount = balance;
      transferProvider.provider = provider;
      transferProvider.type = auto ? 'auto' : 'not-auto';
      transferProvider.stripe_id = transfer.id;
      transferProvider.url = 'temp';
      transferRecord = await this.transferProviderRepository.save(transferProvider);
    } else {
      const transferDelivery = new Transfer();
      transferDelivery.date = new Date();
      transferDelivery.amount = balance;
      transferDelivery.delivery_person = delivery;
      transferDelivery.type = auto ? 'auto' : 'not-auto';
      transferDelivery.stripe_id = transfer.id;
      transferDelivery.url = 'temp';
      transferRecord = await this.transferRepository.save(transferDelivery);
    }

    const name = role === 'provider' 
      ? provider.first_name 
      : delivery.user.clients[0]?.first_name || 'N/A';
    const firstName = role === 'provider' 
      ? provider.last_name 
      : delivery.user.clients[0]?.last_name || 'N/A';

    const pdfBuffer = await this.pdfService.generateTransferInvoicePdf({
      transferId: transfer.id,
      transferDate: new Date().toISOString(),
      amount: balance,
      recipientName: name,
      recipientFirstName: firstName,
      description: auto ? 'Paiement automatique' : 'Paiement manuel',
    });

    if (role === 'provider') {
      provider.balance = 0;
      await this.providerRepository.save(provider);
    } else {
      delivery.balance = 0;
      await this.deliveryPersonRepository.save(delivery);
    }

    const fromEmail = this.mailer.options.auth.user;
    await this.mailer.sendMail({
      from: fromEmail,
      to: user.email,
      subject: 'Votre facture de virement',
      text: 'Veuillez trouver ci-joint votre facture.',
      attachments: [
        {
          filename: `facture_${transfer.id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: `facture_${transfer.id}.pdf`,
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: pdfBuffer,
      size: pdfBuffer.length,
      destination: '',
      filename: `facture_${transfer.id}.pdf`,
      path: '',
      stream: Readable.from(pdfBuffer),
    };

    const filePath = `client-document/${user_id}/${role}/invoice/facture_${transfer.id}.pdf`;
    await this.minioService.uploadFileToBucket('client-documents', filePath, file);

    transferRecord.url = filePath;

    if (role === 'provider') {
      await this.transferProviderRepository.save(transferRecord as TransferProvider);
    } else {
      await this.transferRepository.save(transferRecord as Transfer);
    }
    }

    async getMySubscriptionData(user_id: string): Promise<UserSubscriptionData> {
      const user = await this.userRepository.findOne({
        where: { user_id },
        relations: ['clients', 'merchant']
      });
    
      if (!user) {
        throw new NotFoundException('User not found');
      }
    
      const subscriptions = await this.subscriptionRepository.find({
        where: { user: { user_id } },
        relations: ['plan'],
      });
    
      const subscriptionIds = subscriptions.map(sub => sub.subscription_id);
    
      if (subscriptionIds.length === 0) {
        return {
          history: [],
          customer_stripe_id: false,
          plan: {
            plan_id: 0,
            name: '',
            price: '0',
            priority_shipping_percentage: '0',
            priority_months_offered: 0,
            max_insurance_coverage: '0',
            extra_insurance_price: '0',
            shipping_discount: '0',
            permanent_discount: '0',
            permanent_discount_percentage: '0',
            small_package_permanent_discount: '0',
            first_shipping_free_threshold: '0',
            is_pro: false,
            first_shipping_free: false
          },
        };
      }
    
      const transactions = await this.subscriptionTransactionRepository.find({
        where: { subscription: { subscription_id: In(subscriptionIds) } },
        relations: ['subscription', 'subscription.plan'],
        order: { year: 'DESC', month: 'DESC' },
      });
    
      const subscriptionHistory = transactions.map(tx => ({
        id: tx.subscription.subscription_id,
        month: `${tx.year}-${String(tx.month).padStart(2, '0')}`,
        status: tx.subscription.status,
        name: tx.subscription.plan.name,
        invoiceLink: tx.invoice_url,
        price: tx.price_at_transaction.toString(),
      }));
    
      let customer_stripe_id = false;
    
      if (user.clients.length > 0) {
        customer_stripe_id = !!user.clients[0].stripe_customer_id;
      } else if (user.merchant) {
        customer_stripe_id = !!user.merchant.stripe_customer_id;
      }
    
      const activeSubscription = subscriptions.find(
        (sub) => sub.status === 'active' || sub.status === 'ok'
      );
    
      const activePlan = activeSubscription?.plan
        ? {
            ...activeSubscription.plan,
            price: activeSubscription.plan.price?.toString() || '0',
            priority_shipping_percentage: activeSubscription.plan.priority_shipping_percentage.toString(),
            max_insurance_coverage: activeSubscription.plan.max_insurance_coverage.toString(),
            extra_insurance_price: activeSubscription.plan.extra_insurance_price.toString(),
            shipping_discount: activeSubscription.plan.shipping_discount.toString(),
            permanent_discount: activeSubscription.plan.permanent_discount.toString(),
            permanent_discount_percentage: activeSubscription.plan.permanent_discount_percentage.toString(),
            small_package_permanent_discount: activeSubscription.plan.small_package_permanent_discount.toString(),
            first_shipping_free_threshold: activeSubscription.plan.first_shipping_free_threshold.toString(),
          }
        : null;
    
      return {
        history: subscriptionHistory.map((item) => ({
          ...item,
          status: (['ok', 'wait', 'cancelled'] as const).includes(item.status as any) ? (item.status as 'ok' | 'wait' | 'cancelled') : 'cancelled',
        })),
        customer_stripe_id: customer_stripe_id,
        plan: activePlan || {
          plan_id: 0,
          name: '',
          price: '0',
          priority_shipping_percentage: '0',
          priority_months_offered: 0,
          max_insurance_coverage: '0',
          extra_insurance_price: '0',
          shipping_discount: '0',
          permanent_discount: '0',
          permanent_discount_percentage: '0',
          small_package_permanent_discount: '0',
          first_shipping_free_threshold: '0',
          is_pro: false,
          first_shipping_free: false,
        },
      };
    }

    async updateMySubscription(
      user_id: string,
      planId: number,
      paymentMethodId?: string
    ): Promise<{ message: string }> {
      const user = await this.userRepository.findOne({
        where: { user_id },
        relations: ['clients', 'merchant', 'subscriptions']
      });
    
      if (!user) {
        throw new NotFoundException('User not found');
      }
    
      const plan = await this.planRepository.findOne({ where: { plan_id: planId } });
    
      if (!plan) {
        throw new NotFoundException('Plan not found');
      }
    
      const isClient = user.clients.length > 0;
      const isMerchant = !!user.merchant;
      let stripeCustomerId: string | null = null;
    
      const isFreePlan = (plan.price ?? 0) === 0;
    
      if (!isFreePlan) {
        if (isClient) {
          stripeCustomerId = user.clients[0].stripe_customer_id;
        } else if (isMerchant) {
          stripeCustomerId = user.merchant.stripe_customer_id;
        }
    
        if (!stripeCustomerId && paymentMethodId) {
          let customer;
          if (isClient) {
            customer = await this.stripeService.createCustomer(
              user.email,
              `Client: ${user.clients[0].first_name} ${user.clients[0].last_name}`
            );
          } else if (isMerchant) {
            customer = await this.stripeService.createCustomer(
              user.email,
              `Merchant: ${user.merchant.company_name}`
            );
          }
    
          if (!customer) {
            throw new Error("Failed to create Stripe customer");
          }
    
          await this.stripeService.attachPaymentMethod(customer.id, paymentMethodId);
          stripeCustomerId = customer.id;
    
          if (isClient) {
            user.clients[0].stripe_customer_id = stripeCustomerId;
            await this.clientRepository.save(user.clients[0]);
          } else if (isMerchant) {
            user.merchant.stripe_customer_id = stripeCustomerId;
            await this.merchantRepository.save(user.merchant);
          }
        }
    
        if (!stripeCustomerId) {
          throw new Error("Stripe customer ID is missing and no payment method was provided to create one.");
        }
      }
    
      const activeSubscription = await this.subscriptionRepository.findOne({
        where: {
          user: { user_id },
          status: 'active',
        },
        order: { end_date: 'DESC' }
      });
    
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
      const newStartDate = new Date(endOfMonth);
      const newEndDate = new Date(endOfMonth);
      newEndDate.setMonth(newEndDate.getMonth() + 1);
    
      if (activeSubscription) {
        activeSubscription.cancellation_date = endOfMonth;
        activeSubscription.status = 'cancelled';
        await this.subscriptionRepository.save(activeSubscription);
    
        if (activeSubscription.stripe_subscription_id) {
          try {
            await this.stripeService.cancelSubscriptionAtPeriodEnd(activeSubscription.stripe_subscription_id);
          } catch (error) {
            throw new Error(`Erreur lors de l'annulation de l'abonnement Stripe: ${error.message}`);
          }
        }
      }
    
      let stripeSubscriptionId: string | null = null;

      if (!plan.stripe_price_id) {
        if (plan.price === undefined) {
          throw new Error('Plan price is undefined');
        }
        const newPrice = await this.stripeService.createPriceForPlan(plan.name, plan.price);
        plan.stripe_price_id = newPrice.id;
        await this.planRepository.save(plan);
      }
    
      if (!isFreePlan && stripeCustomerId) {
        const stripeSubscription = await this.stripeService.createSubscription(
          stripeCustomerId,
          plan.stripe_price_id,
          newStartDate
        );
        stripeSubscriptionId = stripeSubscription.id;
      }
    
      const newSubscription = this.subscriptionRepository.create({
        user,
        plan,
        stripe_customer_id: stripeCustomerId || undefined,
        stripe_subscription_id: stripeSubscriptionId || undefined,
        status: 'active',
        start_date: newStartDate,
        end_date: newEndDate,
      });
    
      await this.subscriptionRepository.save(newSubscription);
    
      return { message: 'Subscription updated successfully' };
    }
    
    async newPassword(user_id: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({ where: { user_id } });
        if (!user) throw new UnauthorizedException('User not found');
      
        const passwordCode = uuidv4(); 
      
        user.password_code = passwordCode;
        await this.userRepository.save(user);
      
        try {
          const fromEmail = this.mailer.options.auth.user;
          const info = await this.mailer.sendMail({
            from: fromEmail,
            to: user.email,
            subject: 'Réinitialisation de mot de passe',
            text: 'Voici votre code temporaire pour réinitialiser votre mot de passe: ' + passwordCode,
          });
        } catch (error) {
          throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
        }
    
        return { message: 'Email sent' };
      }

    async getMyDocuments(user_id: string): Promise<any[]> {
      const provider = await this.providerRepository.findOne({
        where: { user: { user_id } },
        relations: ['user'],
      });
  
      if (!provider) {
        throw new Error('Provider not found for this user.');
      }
  
      const documents = await this.providerDocumentsRepository.find({
        where: { provider: { provider_id: provider.provider_id } },
      });
  
      const bucketName = 'provider-documents';
  
      const result = await Promise.all(
        documents.map(async (doc) => {
          const url = await this.minioService.generateImageUrl(bucketName, `${provider.provider_id}/documents/${doc.name}`);
          return {
            ...doc,
            download_url: url,
          };
        }),
      );
  
      return result;
    }
  
    async addDocument(
      user_id: string,
      name: string,
      file: Express.Multer.File,
      description?: string,
    ): Promise<any> {
      const provider = await this.providerRepository.findOne({
        where: { user: { user_id } },
        relations: ['user'],
      });
  
      if (!provider) {
        throw new Error('Provider not found for this user.');
      }
  
      const filePath = `${provider.provider_id}/documents/${name}`;
      const bucketName = 'provider-documents';
  
      const uploaded = await this.minioService.uploadFileToBucket(bucketName, filePath, file);
  
      if (!uploaded) {
        throw new Error("Erreur lors de l'upload du document");
      }
  
      const newDoc = this.providerDocumentsRepository.create({
        name,
        description,
        provider_document_url: filePath,
        provider,
      });
  
      await this.providerDocumentsRepository.save(newDoc);
  
      const downloadUrl = await this.minioService.generateImageUrl(bucketName, filePath);
  
      return {
        message: 'Document uploaded successfully',
        document: {
          ...newDoc,
          download_url: downloadUrl,
        },
      };
    }

    async getAvailabilityForUser(userId: string): Promise<Availability[]> {
      const provider = await this.providerRepository.findOne({
        where: { user : {user_id: userId} },
        relations: ['availabilities'], 
      });
  
      if (!provider) {
        throw new Error('Provider not found for the given user ID');
      }
  
      return provider.availabilities; 
    }
  
    async updateAvailabilityForUser(userId: string, availabilitiesDto: AvailabilityDto[]): Promise<Availability[]> {
      const provider = await this.providerRepository.findOne({
        where: { user: { user_id: userId } },
        relations: ["availabilities"],
      });
    
      if (!provider) {
        throw new Error('Provider not found for the given user ID');
      }
    
      if (provider.availabilities?.length) {
        await this.availabilityRepository.delete({ provider: provider });
      }
    
      const newAvailabilities = availabilitiesDto.map(dto =>
        this.availabilityRepository.create({
          provider,
          day_of_week: dto.day_of_week,
          morning: dto.morning,
          morning_start_time: dto.morning_start_time,
          morning_end_time: dto.morning_end_time,
          afternoon: dto.afternoon,
          afternoon_start_time: dto.afternoon_start_time,
          afternoon_end_time: dto.afternoon_end_time,
          evening: dto.evening,
          evening_start_time: dto.evening_start_time,
          evening_end_time: dto.evening_end_time,
        })
      );
    
      return this.availabilityRepository.save(newAvailabilities);
    }

    async registerNewDevice(userId: string, playerId: string): Promise<void> {
      const user = await this.userRepository.findOne({ where: { user_id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
    
      const existingDevice = await this.onesignalService.getPlayerIdsForUser(userId);
      if (existingDevice.includes(playerId)) {
        return;
      }
    
      await this.onesignalService.registerDevice(userId, playerId);
    }

    async createNotification(userId: string, title: string, content: string): Promise<void> {
      const subscriptionIds = await this.onesignalService.getPlayerIdsForUser(userId);
      if (subscriptionIds.length === 0) {
        throw new Error('No devices registered for this user');
      }
    
      await this.onesignalService.sendNotification(subscriptionIds, title, content);
    }

    async getCommonData(userId: string): Promise<CommonSettingsForm> {
      const user = await this.userRepository.findOne({ where: { user_id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
    
      const merchant = await this.merchantRepository.findOne({ where: { user: { user_id: userId } } });
      const provider = await this.providerRepository.findOne({ where: { user: { user_id: userId } } });
      const deliveryPerson = await this.deliveryPersonRepository.findOne({ where: { user: { user_id: userId } } });
    
      if (merchant) {
        return {
          company_name: merchant.company_name,
          siret: merchant.siret,
          address: merchant.address,
          postal_code: merchant.postal_code || '',
          city: merchant.city,
          country: merchant.country,
          phone: merchant.phone,
        };
      } else if (provider) {
        return {
          company_name: provider.company_name,
          siret: provider.siret,
          address: provider.address,
          service_type: provider.service_type,
          postal_code: provider.postal_code || '',
          city: provider.city,
          country: provider.country,
          phone: provider.phone,
        };
      } else if (deliveryPerson) {
        return {
          address: deliveryPerson.address,
          postal_code: deliveryPerson.postal_code || '',
          city: deliveryPerson.city,
          country: deliveryPerson.country,
          phone_number: deliveryPerson.phone_number,
          professional_email: deliveryPerson.professional_email,
        };
      } else {
        // Retour par défaut si aucun des cas ci-dessus n'est vrai
        return {
          address: '',
          postal_code: '',
          city: '',
          country: '',
        };
      }
    }

    async updateCommonData(userId: string, commonSettingsDto: CommonSettingsDto) {
      const user = await this.userRepository.findOne({ where: { user_id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
  
      const merchant = await this.merchantRepository.findOne({ where: { user: { user_id: userId } } });
      const provider = await this.providerRepository.findOne({ where: { user: { user_id: userId } } });
      const deliveryPerson = await this.deliveryPersonRepository.findOne({ where: { user: { user_id: userId } } });
  
      if (merchant) {
        await this.merchantRepository.update({ user: { user_id: userId } }, commonSettingsDto);
      } else if (provider) {
        await this.providerRepository.update({ user: { user_id: userId } }, commonSettingsDto);
      } else if (deliveryPerson) {
        await this.deliveryPersonRepository.update({ user: { user_id: userId } }, commonSettingsDto);
      } else {
        throw new Error('No profile found to update');
      }
  
      return this.getCommonData(userId);
    }


    async updateStripeBankData(userId : string, paymentMethodId : string) {

      console.log("paymentMethodId", paymentMethodId)
      console.log("userId", userId)
  
    }

    async updateLanguage(userId: string, language_id :string) : Promise<{ message: string }> {


      const user = await this.userRepository.findOne({ where: { user_id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
  
      const language = await this.languageRepository.findOne({ where: { language_id } });
      if (!language) {
        throw new Error('Language not found');
      }
  
      user.language = language;
      await this.userRepository.save(user);
  
      return { message: 'Language updated successfully' };

    }

    


  }