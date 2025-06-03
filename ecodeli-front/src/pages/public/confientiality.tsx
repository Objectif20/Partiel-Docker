import { useTranslation } from 'react-i18next';
import Lock from '@/assets/illustrations/lock.svg';
import French from '@/assets/illustrations/french.svg';
import NotSend from '@/assets/illustrations/not-send.svg';
import Wallet from '@/assets/illustrations/wallet.svg';

export default function ConfidentialityPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">{t('client.pages.public.confidentiality.title')}</h1>
        <p className="text-foreground max-w-2xl mx-auto">
          {t('client.pages.public.confidentiality.intro')}
        </p>
      </div>

      <div className="space-y-20">
        {/* Point 1 */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48">
              <img
                src={NotSend}
                alt={t('client.pages.public.confidentiality.points.notForSale.title')}
                width={250}
                height={250}
                className="object-contain"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-xl font-bold mb-4">{t('client.pages.public.confidentiality.points.notForSale.title')}</h2>
            <p className="text-foreground">
              {t('client.pages.public.confidentiality.points.notForSale.description')}
            </p>
          </div>
        </div>

        {/* Point 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48">
              <img
                src={Lock}
                alt={t('client.pages.public.confidentiality.points.encryptedDocuments.title')}
                width={250}
                height={250}
                className="object-contain"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-xl font-bold mb-4">{t('client.pages.public.confidentiality.points.encryptedDocuments.title')}</h2>
            <p className="text-foreground">
              {t('client.pages.public.confidentiality.points.encryptedDocuments.description1')}
            </p>
            <p className="text-foreground mt-2">
              {t('client.pages.public.confidentiality.points.encryptedDocuments.description2')}
            </p>
          </div>
        </div>

        {/* Point 3 */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48">
              <img
                src={Wallet}
                alt={t('client.pages.public.confidentiality.points.noBankData.title')}
                width={250}
                height={250}
                className="object-contain"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-xl font-bold mb-4">{t('client.pages.public.confidentiality.points.noBankData.title')}</h2>
            <p className="text-foreground">
              {t('client.pages.public.confidentiality.points.noBankData.description1')}
            </p>
            <p className="text-foreground mt-2">
              {t('client.pages.public.confidentiality.points.noBankData.description2')}
            </p>
          </div>
        </div>

        {/* Point 4 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48">
              <img
                src={French}
                alt={t('client.pages.public.confidentiality.points.dataInFrance.title')}
                width={250}
                height={250}
                className="object-contain"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-xl font-bold mb-4">{t('client.pages.public.confidentiality.points.dataInFrance.title')}</h2>
            <p className="text-foreground">
              {t('client.pages.public.confidentiality.points.dataInFrance.description1')}
            </p>
            <p className="text-foreground mt-2">
              {t('client.pages.public.confidentiality.points.dataInFrance.description2')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
