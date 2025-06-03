import { useTranslation } from 'react-i18next';

const LegalesNotices = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-primary">{t('client.pages.public.legalNotices.title')}</h1>
      <p className="mb-4">
        {t('client.pages.public.legalNotices.intro')}
      </p>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-primary">{t('client.pages.public.legalNotices.editor.title')}</h2>
        <p>
          {t('client.pages.public.legalNotices.editor.description')}
        </p>
        <p>
          Email : <a href="mailto:contact@cocolis.fr" className="text-primary">contact@cocolis.fr</a>
        </p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-primary">{t('client.pages.public.legalNotices.host.title')}</h2>
        <p>
          {t('client.pages.public.legalNotices.host.description')}
        </p>
        <p>
          {t('client.pages.public.legalNotices.host.images')}
        </p>
      </section>
      <p className="mb-16">
        <a href="#" className="text-primary">{t('client.pages.public.legalNotices.privacyPolicy')}</a>
      </p >

    </div>
  );
};

export default LegalesNotices;
