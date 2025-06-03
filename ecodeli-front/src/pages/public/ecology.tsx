import { useTranslation } from 'react-i18next';

const EcologyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-primary">{t('client.pages.public.ecology.title')}</h1>
      <p className="mb-4">
        {t('client.pages.public.ecology.intro')}
      </p>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-primary">{t('client.pages.public.ecology.ourImpact.title')}</h2>
        <p>
          {t('client.pages.public.ecology.ourImpact.description')}
        </p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-primary">{t('client.pages.public.ecology.ourCommitment.title')}</h2>
        <p>
          {t('client.pages.public.ecology.ourCommitment.description')}
        </p>
      </section>
      <p className="mb-16">
        <a href="#" className="text-primary">{t('client.pages.public.ecology.learnMore')}</a>
      </p>
    </div>
  );
};

export default EcologyPage;
