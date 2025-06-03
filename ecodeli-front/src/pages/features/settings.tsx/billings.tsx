import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { RootState } from "@/redux/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { BillingsData, ProfileAPI } from "@/api/profile.api";
import { BillingsDataTable } from "@/components/features/settings/billings/data-tables";
import { useTranslation } from "react-i18next";

const BillingSettings: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);

  const isProvider = user?.profile.includes("PROVIDER");
  const isClient = user?.profile.includes("CLIENT");
  const isMerchant = user?.profile.includes("MERCHANT");
  const isDeliveryman = user?.profile.includes("DELIVERYMAN");

  const balance = user?.balance || 0;

  const [stripeAccountValidity, setStripeAccountValidity] = useState({
    valid: false,
    enabled: false,
    needs_id_card: false,
    url_complete: "",
  });

  const [billingsData, setBillingsData] = useState<BillingsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    dispatch(setBreadcrumb({
      segments: [
        t("client.pages.office.settings.billings.breadcrumb.home"),
        t("client.pages.office.settings.billings.breadcrumb.settings"),
        t("client.pages.office.settings.billings.breadcrumb.billings")
      ],
      links: ["/office/dashboard"],
    }));

    const fetchData = async () => {
      try {
        const billings = await ProfileAPI.getMyBillings();
        setBillingsData(billings);
      } catch (err) {
        console.error("Erreur lors du chargement des facturations :", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStripeAccountValidity = async () => {
      const response = await ProfileAPI.getStripeAccountValidity();
      if (response.valid && response.enabled && !response.needs_id_card) {
        setStripeAccountValidity({
          valid: true,
          enabled: true,
          needs_id_card: false,
          url_complete: "",
        });
      } else if (response.valid && !response.enabled) {
        setStripeAccountValidity({
          valid: true,
          enabled: false,
          needs_id_card: false,
          url_complete: response.url_complete || "",
        });
      }
    };

    fetchData();
    fetchStripeAccountValidity();
  }, [dispatch, t]);

  const handleConfigureAccount = async () => {
    const { accountLinkUrl } = await ProfileAPI.createStripeAccount();
    if (accountLinkUrl) {
      window.location.href = accountLinkUrl;
    }
  };

  const handleUpdateAccount = async () => {
    const { accountLinkUrl } = await ProfileAPI.updateStripeAccount();
    if (accountLinkUrl) {
      window.location.href = accountLinkUrl;
    }
  };

  const handleRequestPayment = async () => {
    try {
      await ProfileAPI.createPayment();
      const billings = await ProfileAPI.getMyBillings();
      setBillingsData(billings);
    } catch (err) {
      console.error("Erreur lors de la demande de virement :", err);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">{t("client.pages.office.settings.billings.title")}</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings">{t("client.pages.office.settings.billings.nav.general")}</Link>
          <Link to="/office/profile">{t("client.pages.office.settings.billings.nav.profile")}</Link>
          <Link to="/office/privacy">{t("client.pages.office.settings.billings.nav.privacy")}</Link>
          <Link to="/office/contact-details">{t("client.pages.office.settings.billings.nav.contact")}</Link>
          {(isMerchant || isClient) && (
            <Link to="/office/subscriptions">{t("client.pages.office.settings.billings.nav.subscriptions")}</Link>
          )}
          {(isProvider || isDeliveryman) && (
            <Link to="/office/billing-settings" className="font-semibold text-primary active-link">
              {t("client.pages.office.settings.billings.nav.billings")}
            </Link>
          )}
          <Link to="/office/reports">{t("client.pages.office.settings.billings.nav.reports")}</Link>
        </nav>
        <div className="grid gap-6">
          <h1 className="text-2xl font-semibold">{t("client.pages.office.settings.billings.balance.title")}</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  {t("client.pages.office.settings.billings.balance.current")}: <span>{billingsData?.amount ?? balance}€</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(billingsData?.amount ?? balance) > 0 && stripeAccountValidity.enabled && stripeAccountValidity.valid && !stripeAccountValidity.needs_id_card && (
                  <Button onClick={handleRequestPayment}>
                    {t("client.pages.office.settings.billings.balance.requestPayment")}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  {stripeAccountValidity.valid && stripeAccountValidity.enabled
                    ? t("client.pages.office.settings.billings.stripe.valid")
                    : t("client.pages.office.settings.billings.stripe.update")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stripeAccountValidity.valid && stripeAccountValidity.enabled ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        {t("client.pages.office.settings.billings.stripe.update")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("client.pages.office.settings.billings.stripe.dialog.title")}</DialogTitle>
                        <DialogDescription>
                          {t("client.pages.office.settings.billings.stripe.dialog.description")}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose>
                          <Button variant="outline">{t("client.pages.office.settings.billings.stripe.dialog.no")}</Button>
                        </DialogClose>
                        <Button onClick={handleUpdateAccount}>{t("client.pages.office.settings.billings.stripe.dialog.yes")}</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        {t("client.pages.office.settings.billings.stripe.configureButton")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("client.pages.office.settings.billings.stripe.dialog.title")}</DialogTitle>
                        <DialogDescription>
                          {t("client.pages.office.settings.billings.stripe.dialog.description")}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose>
                          <Button variant="outline">{t("client.pages.office.settings.billings.stripe.dialog.no")}</Button>
                        </DialogClose>
                      <Button onClick={handleConfigureAccount}>{t("client.pages.office.settings.billings.stripe.dialog.yes")}</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            {!loading && billingsData ? (
              <BillingsDataTable billings={billingsData.billings} />
            ) : (
              <p>{t("client.pages.office.settings.billings.loading")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;
