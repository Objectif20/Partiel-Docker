import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { RootState } from "@/redux/store";
import { useTranslation } from 'react-i18next';
import DeliverymanSettings from "@/components/features/settings/deliveryman-settings";
import MerchantSettings from "@/components/features/settings/merchant-settings";
import ProviderSettings from "@/components/features/settings/provider-settings";

const ContactDetailsSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);

  const isProvider = user?.profile?.includes("PROVIDER");
  const isClient = user?.profile?.includes("CLIENT");
  const isMerchant = user?.profile?.includes("MERCHANT");
  const isDeliveryman = user?.profile?.includes("DELIVERYMAN");

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t('client.pages.office.settings.contactDetails.breadcrumbHome'), t('client.pages.office.settings.contactDetails.breadcrumbSettings'), t('client.pages.office.settings.contactDetails.breadcrumbContactDetails')],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">{t('client.pages.office.settings.contactDetails.title')}</h1>
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings">{t('client.pages.office.settings.contactDetails.generalSettings')}</Link>
          <Link to="/office/profile">{t('client.pages.office.settings.contactDetails.profile')}</Link>
          <Link to="/office/privacy">{t('client.pages.office.settings.contactDetails.privacy')}</Link>
          <Link
            to="/office/contact-details"
            className="font-semibold text-primary active-link"
          >
            {t('client.pages.office.settings.contactDetails.contactDetails')}
          </Link>
          {(isMerchant || isClient) && (
            <Link to="/office/subscriptions">{t('client.pages.office.settings.contactDetails.subscriptions')}</Link>
          )}
          {(isProvider || isDeliveryman) && (
            <Link to="/office/billing-settings">{t('client.pages.office.settings.contactDetails.billing')}</Link>
          )}
          <Link to="/office/reports">{t('client.pages.office.settings.contactDetails.reports')}</Link>
        </nav>

        <div className="grid gap-6">

          {isProvider && <ProviderSettings />}
          {isDeliveryman && <DeliverymanSettings />}
          {isMerchant && <MerchantSettings />}
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsSettings;
