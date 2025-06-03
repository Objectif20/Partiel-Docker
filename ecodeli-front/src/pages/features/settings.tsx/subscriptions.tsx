"use client";

import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import type { RootState } from "@/redux/store";
import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionDataTable } from "@/components/features/settings/subscriptions/data-tables";
import { useTranslation } from 'react-i18next';
import { SubscriptionDialogWrapper } from "@/components/features/settings/subscriptions/dialog";
import { Button } from "@/components/ui/button";
import { ProfileAPI, UserSubscriptionData } from "@/api/profile.api";
import { RegisterApi, Plan } from "@/api/register.api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
} from "@stripe/react-stripe-js";
import stripePromise from '@/config/stripeConfig';

const SubscriptionSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);
  const [userSubscriptionData, setUserSubscriptionData] = useState<UserSubscriptionData | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);

  const isProvider = user?.profile.includes("PROVIDER");
  const isClient = user?.profile.includes("CLIENT");
  const isMerchant = user?.profile.includes("MERCHANT");
  const isDeliveryman = user?.profile.includes("DELIVERYMAN");

  const handlePlanChange = async (planId: number, paymentMethodId?: string) => {
    try {
      if (userSubscriptionData?.customer_stripe_id) {
        await ProfileAPI.updateMySubscription(planId);
      } else {
        await ProfileAPI.updateMySubscription(planId, paymentMethodId);
      }

      const updatedData = await ProfileAPI.getMySubscription();
      setUserSubscriptionData(updatedData);
    } catch (error) {
      console.error(t("client.pages.office.settings.subscriptions.planChangeError"), error);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await RegisterApi.getPlan();
      const mockPlans: Plan[] = await response;
      setPlans(mockPlans);
    } catch (error) {
      console.error(t("client.pages.office.settings.subscriptions.fetchPlansError"), error);
    }
  };

  const updateToFreePlan = async () => {
    const freePlan = plans.find(plan => Number(plan.price) === 0);
    if (freePlan) {
      try {
        await ProfileAPI.updateMySubscription(freePlan.plan_id);
        const updatedData = await ProfileAPI.getMySubscription();
        setUserSubscriptionData(updatedData);
      } catch (error) {
        console.error(t("client.pages.office.settings.subscriptions.freePlanUpdateError"), error);
      }
    }
  };

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t('client.pages.office.settings.subscriptions.breadcrumbHome'), t('client.pages.office.settings.subscriptions.breadcrumbSettings'), t('client.pages.office.settings.subscriptions.breadcrumbSubscriptions')],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await ProfileAPI.getMySubscription();
        setUserSubscriptionData(data);
      } catch (error) {
        console.error(t("client.pages.office.settings.subscriptions.fetchSubscriptionError"), error);
      }
    };

    fetchSubscription();
    fetchPlans();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">{t('client.pages.office.settings.subscriptions.title')}</h1>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex sm:ml-auto">
            <BankDetailsDialogWrapper customerStripeId={typeof userSubscriptionData?.customer_stripe_id === 'string' ? userSubscriptionData.customer_stripe_id : null}>
              <p>
                {t('client.pages.office.settings.subscriptions.updateBankDetails')}
              </p>
            </BankDetailsDialogWrapper>
          </div>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings">{t('client.pages.office.settings.subscriptions.generalSettings')}</Link>
          <Link to="/office/profile">{t('client.pages.office.settings.subscriptions.profile')}</Link>
          <Link to="/office/privacy">{t('client.pages.office.settings.subscriptions.privacy')}</Link>
          <Link to="/office/contact-details">{t('client.pages.office.settings.subscriptions.contactDetails')}</Link>
          {(isMerchant || isClient) && (
            <Link to="/office/subscriptions" className="font-semibold text-primary active-link">
              {t('client.pages.office.settings.subscriptions.subscriptions')}
            </Link>
          )}
          {(isProvider || isDeliveryman) && <Link to="/office/billing-settings">{t('client.pages.office.settings.subscriptions.billing')}</Link>}
          <Link to="/office/reports">{t('client.pages.office.settings.subscriptions.reports')}</Link>
        </nav>
        <div className="grid gap-6">
          <h1 className="text-2xl font-semibold">{t('client.pages.office.settings.subscriptions.yourSubscription')}</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  {t('client.pages.office.settings.subscriptions.currentSubscription')} <span className="text-primary">{userSubscriptionData?.plan?.name}</span>
                </CardTitle>
                <CardDescription className="text-3xl font-bold text-primary">
                  {userSubscriptionData?.plan?.price} <span className="text-sm font-normal text-muted-foreground">/mois</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('client.pages.office.settings.subscriptions.discountOnShipping')}</span>
                    <span className="font-medium">{userSubscriptionData?.plan?.shipping_discount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('client.pages.office.settings.subscriptions.priorityShipping')}</span>
                    <span className="font-medium">{userSubscriptionData?.plan?.priority_shipping_percentage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('client.pages.office.settings.subscriptions.permanentDiscount')}</span>
                    <span className="font-medium">{userSubscriptionData?.plan?.permanent_discount_percentage}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{t('client.pages.office.settings.subscriptions.whatToDo')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <SubscriptionDialogWrapper onPlanChange={handlePlanChange} stripe_account={userSubscriptionData?.customer_stripe_id || false} actualPlan={userSubscriptionData?.plan?.plan_id}>
                      <Button variant="link" className="text-primary p-0 h-auto hover:underline">
                        {t("client.pages.office.settings.subscriptions.changePlan")}
                      </Button>
                    </SubscriptionDialogWrapper>
                  </li>
                  {Number(userSubscriptionData?.plan?.price ?? 0) > 0 && (
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                      <Button onClick={updateToFreePlan} variant={"link"} className="text-primary p-0 h-auto hover:underline">
                        {t('client.pages.office.settings.subscriptions.cancelSubscription')}
                      </Button>
                  </li>
                )}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <SubscriptionDataTable subscriptions={userSubscriptionData?.history || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface BankDetailsDialogProps {
  children: React.ReactNode;
  customerStripeId: string | null;
}

function BankDetailsDialog({ children, customerStripeId }: BankDetailsDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) {
      setError(t("client.pages.office.settings.subscriptions.cardDetailsError"));
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
      });
      if (error) {
        setError(error.message || t("client.pages.office.settings.subscriptions.unknownError"));
        setIsProcessing(false);
      } else {
        await ProfileAPI.updateBankData(paymentMethod.id);
        setIsProcessing(false);
      }
    } catch (err) {
      setError(t("client.pages.office.settings.subscriptions.paymentProcessingError"));
      console.error(err);
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#000",
        "::placeholder": {
          color: "#aab7b7",
        },
      },
      invalid: {
        color: "hsl(var(--destructive))",
      },
    },
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{customerStripeId ? t('client.pages.office.settings.subscriptions.updateBankDetails') : t('client.pages.office.settings.subscriptions.addBankDetails')}</DialogTitle>
          <DialogDescription>
            {customerStripeId ? t('client.pages.office.settings.subscriptions.updateBankDetailsDescription') : t('client.pages.office.settings.subscriptions.addBankDetailsDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground">
              {t('client.pages.office.settings.subscriptions.cardNumber')}
            </label>
            <div className="mt-1 p-2 border rounded-md">
              <CardNumberElement id="cardNumber" options={cardElementOptions} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cardExpiry" className="block text-sm font-medium text-foreground">
                {t('client.pages.office.settings.subscriptions.expiryDate')}
              </label>
              <div className="mt-1 p-2 border rounded-md">
                <CardExpiryElement id="cardExpiry" options={cardElementOptions} />
              </div>
            </div>
            <div>
              <label htmlFor="cardCvc" className="block text-sm font-medium text-foreground">
                {t('client.pages.office.settings.subscriptions.cvc')}
              </label>
              <div className="mt-1 p-2 border rounded-md">
                <CardCvcElement id="cardCvc" options={cardElementOptions} />
              </div>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                {t('client.pages.office.settings.subscriptions.cancel')}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" disabled={!stripe || isProcessing}>
                {isProcessing ? t('client.pages.office.settings.subscriptions.processing') : t('client.pages.office.settings.subscriptions.submit')}
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function BankDetailsDialogWrapper(props: BankDetailsDialogProps) {
  return (
    <Elements stripe={stripePromise}>
      <BankDetailsDialog {...props} />
    </Elements>
  );
}

export default SubscriptionSettings;
