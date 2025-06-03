import { ProfileAPI } from "@/api/profile.api";
import { MinimalTiptapEditorTextOnly } from "@/components/minimal-tiptap";
import { Button } from "@/components/ui/button";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const ReportSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);

  const [description, setDescription] = useState<string>("");

  const isProvider = user?.profile.includes('PROVIDER');
  const isClient = user?.profile.includes('CLIENT');
  const isMerchant = user?.profile.includes('MERCHANT');
  const isDeliveryman = user?.profile.includes('DELIVERYMAN');

  useEffect(() => {
    dispatch(setBreadcrumb({
      segments: [t('client.pages.office.settings.reports.breadcrumbHome'), t('client.pages.office.settings.reports.breadcrumbSettings'), t('client.pages.office.settings.reports.breadcrumbReports')],
      links: ['/office/dashboard'],
    }));
  }, [dispatch, t]);

  const handleSubmit = () => {
    console.log("Contenu du signalement :", description);
    try {
        ProfileAPI.createReport(description)
          .then(() => {
            console.log("Signalement envoyé avec succès !");
            setDescription("");
            toast.success(t('client.pages.office.settings.reports.success'));
          })
    } catch (error) {
      console.error("Erreur lors de l'envoi du signalement :", error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">{t('client.pages.office.settings.reports.title')}</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings">{t('client.pages.office.settings.reports.generalSettings')}</Link>
          <Link to="/office/profile">{t('client.pages.office.settings.reports.profile')}</Link>
          <Link to="/office/privacy">{t('client.pages.office.settings.reports.privacy')}</Link>
          <Link to="/office/contact-details">{t('client.pages.office.settings.reports.contactDetails')}</Link>
          {(isMerchant || isClient) && (
            <Link to="/office/subscriptions">{t('client.pages.office.settings.reports.subscriptions')}</Link>
          )}
          {(isProvider || isDeliveryman) && (
            <Link to="/office/billing-settings">{t('client.pages.office.settings.reports.billing')}</Link>
          )}
          <Link to="/office/reports" className="font-semibold text-primary active-link">{t('client.pages.office.settings.reports.reports')}</Link>
        </nav>
        <div className="grid gap-6">
            <div>
            <h3 className="text-lg font-medium">{t('client.pages.office.settings.reports.reportsTitle')}</h3>
            <p className="text-sm text-muted-foreground">{t('client.pages.office.settings.reports.reportsDescription')}</p>
          </div>
          <MinimalTiptapEditorTextOnly
              value={description}
              onChange={(value) => setDescription(value?.toString() || "")}
              className="w-full"
              editorContentClassName="p-5"
              output="html"
              placeholder={t('client.pages.office.settings.reports.placeholder')}
              autofocus
              editable={true}
              editorClassName="focus:outline-none"
          />
          <Button onClick={handleSubmit}>{t('client.pages.office.settings.reports.sendReport')}</Button>
        </div>
      </div>
    </div>
  );
};

export default ReportSettings;
