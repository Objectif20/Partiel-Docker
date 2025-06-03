import { useContext } from "react";
import { useTranslation } from 'react-i18next';
import { RegisterContext } from "./RegisterContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Step2ProChoice() {
  const { t } = useTranslation();
  const { setIsPrestataire, nextStep } = useContext(RegisterContext);

  const handleChoice = (isPrestataire : boolean) => {
    setIsPrestataire(isPrestataire);
    nextStep();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            {t('client.pages.public.register.secondProfileChoice.title')}
          </h2>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center mb-12">
            <div className="bg-secondary rounded-lg p-6 flex flex-col items-center max-w-sm mx-auto md:mx-0 w-full">
              <h3 className="text-xl font-semibold mb-4">
                {t('client.pages.public.register.secondProfileChoice.merchant')}
              </h3>
              <p className="text-center mb-8 text-sm">
                {t('client.pages.public.register.secondProfileChoice.merchantDescription')}
              </p>
              <div className="h-40 w-full mb-8">{/* Image placeholder - you'll add the image */}</div>
              <Button
                onClick={() => handleChoice(false)}
                className="w-full max-w-xs rounded-full"
                variant="default"
              >
                {t('client.pages.public.register.secondProfileChoice.signUp')}
              </Button>
            </div>

            <div className="bg-secondary rounded-lg p-6 flex flex-col items-center max-w-sm mx-auto md:mx-0 w-full">
              <h3 className="text-xl font-semibold mb-4">
                {t('client.pages.public.register.secondProfileChoice.serviceProvider')}
              </h3>
              <p className="text-center mb-8 text-sm">
                {t('client.pages.public.register.secondProfileChoice.serviceProviderDescription')}
              </p>
              <div className="h-40 w-full mb-8">{/* Image placeholder - you'll add the image */}</div>
              <Button
                onClick={() => handleChoice(true)}
                className="w-full max-w-xs rounded-full"
                variant="default"
              >
                {t('client.pages.public.register.secondProfileChoice.signUp')}
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p>
              {t('client.pages.public.register.secondProfileChoice.existingAccount')}{" "}
              <Link to="/auth/login" className="font-semibold text-primary hover:underline">
                {t('client.pages.public.register.secondProfileChoice.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
