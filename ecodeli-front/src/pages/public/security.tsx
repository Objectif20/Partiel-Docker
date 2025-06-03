import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SecurityPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-primary">{t('client.pages.public.security.title')}</h1>
      <p className="mb-4">
        {t('client.pages.public.security.intro')}
      </p>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-primary">{t('client.pages.public.security.dataProtection.title')}</h2>
        <p>
          {t('client.pages.public.security.dataProtection.description')}
        </p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-primary">{t('client.pages.public.security.userSecurity.title')}</h2>
        <p>
          {t('client.pages.public.security.userSecurity.description')}
        </p>
      </section>
      <p className="mb-16">
        <Link to="/confidentiality" className="text-primary">{t('client.pages.public.security.learnMore')}</Link>
      </p>
    </div>
  );
};

export default SecurityPage;
