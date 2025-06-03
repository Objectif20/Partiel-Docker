import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function BecomeProviderPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">{t('client.pages.public.becomeProvider.title')}</h1>
        <p className="text-foreground max-w-2xl mx-auto">
          {t('client.pages.public.becomeProvider.intro')}
        </p>
      </div>

      <div className="space-y-20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48">
              <img
                src="/placeholder.svg?height=192&width=192"
                alt={t('client.pages.public.becomeProvider.steps.step1.title')}
                width={192}
                height={192}
                className="object-contain"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-xl font-bold mb-4">{t('client.pages.public.becomeProvider.steps.step1.title')}</h2>
            <p className="text-foreground">
              {t('client.pages.public.becomeProvider.steps.step1.description1')}
            </p>
            <p className="text-foreground mt-2">
              {t('client.pages.public.becomeProvider.steps.step1.description2')}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48">
              <img
                src="/placeholder.svg?height=192&width=192"
                alt={t('client.pages.public.becomeProvider.steps.step2.title')}
                width={192}
                height={192}
                className="object-contain"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-xl font-bold mb-4">{t('client.pages.public.becomeProvider.steps.step2.title')}</h2>
            <p className="text-foreground">
              {t('client.pages.public.becomeProvider.steps.step2.description1')}
            </p>
            <p className="text-foreground mt-2">
              {t('client.pages.public.becomeProvider.steps.step2.description2')}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48">
              <img
                src="/placeholder.svg?height=192&width=192"
                alt={t('client.pages.public.becomeProvider.steps.step3.title')}
                width={192}
                height={192}
                className="object-contain"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-xl font-bold mb-4">{t('client.pages.public.becomeProvider.steps.step3.title')}</h2>
            <p className="text-foreground">
              {t('client.pages.public.becomeProvider.steps.step3.description1')}
            </p>
            <p className="text-foreground mt-2">
              {t('client.pages.public.becomeProvider.steps.step3.description2')}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48">
              <img
                src="/placeholder.svg?height=192&width=192"
                alt={t('client.pages.public.becomeProvider.steps.step4.title')}
                width={192}
                height={192}
                className="object-contain"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-xl font-bold mb-4">{t('client.pages.public.becomeProvider.steps.step4.title')}</h2>
            <p className="text-foreground">
              {t('client.pages.public.becomeProvider.steps.step4.description1')}
            </p>
            <p className="text-foreground mt-2">
              {t('client.pages.public.becomeProvider.steps.step4.description2')}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold mb-4">{t('client.pages.public.becomeProvider.ready.title')}</h3>
        <Button asChild size="lg" className="px-8">
          <Link to="/auth/register">{t('client.pages.public.becomeProvider.ready.button')}</Link>
        </Button>
      </div>
    </div>
  );
}
