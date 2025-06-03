import { useTranslation } from 'react-i18next';

const AccessibilityPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-primary">{t('client.pages.public.accessibility.title')}</h1>
      <p className="mb-4">
        {t('client.pages.public.accessibility.commitment')}
      </p>
      <p className="mb-4">
        {t('client.pages.public.accessibility.applicability')}
      </p>
      <h2 className="text-xl font-semibold mb-2 text-primary">{t('client.pages.public.accessibility.complianceStatus')}</h2>
      <p className="mb-4">
        {t('client.pages.public.accessibility.wcagDescription')}
      </p>
      <p className="mb-4">
        {t('client.pages.public.accessibility.partialCompliance')}
      </p>
      <h2 className="text-xl font-semibold mb-2 text-primary">{t('client.pages.public.accessibility.inaccessibleContent')}</h2>
      <p className="mb-4">
        {t('client.pages.public.accessibility.nonComplianceReason')}
      </p>
      <p className="mb-4">
        {t('client.pages.public.accessibility.nonComplianceDetails')}
      </p>
      <h2 className="text-xl font-semibold mb-2 text-primary">{t('client.pages.public.accessibility.preparation')}</h2>
      <p className="mb-4">
        {t('client.pages.public.accessibility.preparationDate')}
      </p>
      <p className="mb-4">
        {t('client.pages.public.accessibility.complianceMethod')}
      </p>
      <h2 className="text-xl font-semibold mb-2 text-primary">{t('client.pages.public.accessibility.feedback')}</h2>
      <p className="mb-4">
        {t('client.pages.public.accessibility.contactInfo')}
      </p>
      <h2 className="text-xl font-semibold mb-2 text-primary">{t('client.pages.public.accessibility.enforcementProcedure')}</h2>
      <p className="mb-4">
        {t('client.pages.public.accessibility.enforcementDetails')}
      </p>
    </div>
  );
};

export default AccessibilityPage;
