import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Plan } from 'src/common/entities/plan.entity';
import { Subscription } from 'src/common/entities/subscription.entity';
import { Merchant } from 'src/common/entities/merchant.entity';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(Plan)
        private readonly planRepository: Repository<Plan>,

        @InjectRepository(Subscription)
        private readonly subscriptionRepository: Repository<Subscription>,

        @InjectRepository(Merchant)
        private readonly merchantRepository: Repository<Merchant>,
    ) { }

    async getSubscriptionStats() {
        const plans = await this.planRepository.find();

        return plans.map(plan => ({
            plan_id: plan.plan_id,
            name: plan.name,
            price: plan.price,
            priority_shipping_percentage: plan.priority_shipping_percentage,
            priority_months_offered: plan.priority_months_offered,
            max_insurance_coverage: plan.max_insurance_coverage,
            extra_insurance_price: plan.extra_insurance_price,
            shipping_discount: plan.shipping_discount,
            permanent_discount: plan.permanent_discount,
            permanent_discount_percentage: plan.permanent_discount_percentage,
            small_package_permanent_discount: plan.small_package_permanent_discount,
            first_shipping_free: plan.first_shipping_free,
            first_shipping_free_threshold: plan.first_shipping_free_threshold,
            is_pro: plan.is_pro,
        }));
    }


    async getSubscriptionById(id: number) {
        const plan = await this.planRepository.findOne({ where: { plan_id: id } });

        if (!plan) {
            throw new NotFoundException(`Plan with ID ${id} not found`);
        }

        return plan;
    }

    async updatePlan(id: number, updatePlanDto: any) {
        const plan = await this.planRepository.findOne({ where: { plan_id: id } });
      
        if (!plan) {
          throw new NotFoundException(`Plan with ID ${id} not found`);
        }
      
        const { admin_id, subject, content, ...updateData } = updatePlanDto;
      
        await this.planRepository.update(id, updateData);
      
        const subscribers = await this.subscriptionRepository.find({
          where: { plan: { plan_id: id } },
          relations: ['user'],
        });
      
        const subscriberEmails = subscribers.map(sub => sub.user.email);
      
        // --- À remplacer par un vrai envoi de mail
        console.log(`Sending update notification to subscribers of plan ${id}:`, {
          subject,
          content,
          emails: subscriberEmails,
        });
      
        return this.planRepository.findOne({ where: { plan_id: id } });
    }

    async createPlan(createPlanDto: any) {
        const { admin_id, ...planData } = createPlanDto;
      
        const newPlan = this.planRepository.create(planData);
        return await this.planRepository.save(newPlan);
      }


    async getSubscribersList(page: number = 1, limit: number = 10, planId?: number) {
        const skip = (page - 1) * limit;

        const where: FindOptionsWhere<Subscription> = planId ? { plan: { plan_id: planId } } : {};

        const [subscriptions, total] = await this.subscriptionRepository.findAndCount({
            where,
            relations: ['user', 'plan'],
            skip,
            take: limit,
        });

        const formattedSubscriptions = await Promise.all(subscriptions.map(async subscription => ({
            subscription_id: subscription.subscription_id,
            user_id: subscription.user.user_id,
            email: subscription.user.email,
            plan_id: subscription.plan.plan_id,
            plan_name: subscription.plan.name,
            start_date: subscription.start_date,
            end_date: subscription.end_date,
            is_merchant: await this.isUserMerchant(subscription.user.user_id), // Vérifie si l'utilisateur est un commerçant
        })));

        return {
            data: formattedSubscriptions,
            meta: {
                total,
                page,
                limit,
            },
        };
    }

    private async isUserMerchant(userId: string): Promise<boolean> {
        const merchant = await this.merchantRepository.findOne({ where: { user: { user_id: userId } } });
        return !!merchant;
    }

}