import { useContext } from "react";
import { useTranslation } from 'react-i18next';
import { RegisterContext } from "./RegisterContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Step1ProfileChoice() {
  const { t } = useTranslation();
  const { setIsPro, nextStep } = useContext(RegisterContext);

  const handleChoice = (isPro : boolean) => {
    setIsPro(isPro);
    nextStep();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            {t('client.pages.public.register.firstProfileChoice.title')}
          </h2>
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center mb-12">
            <div className="bg-secondary rounded-lg p-6 flex flex-col items-center max-w-sm mx-auto md:mx-0 w-full">
              <h3 className="text-xl font-semibold mb-4">
                {t('client.pages.public.register.firstProfileChoice.individual')}
              </h3>
              <p className="text-center mb-8 text-sm">
                {t('client.pages.public.register.firstProfileChoice.individualDescription')}
              </p>
              <div className="h-40 w-full mb-8">{/* Image placeholder - you'll add the image */}</div>
              <Button
                onClick={() => handleChoice(false)}
                className="py-2 px-8 rounded-full transition-colors w-full max-w-xs"
              >
                {t('client.pages.public.register.firstProfileChoice.signUp')}
              </Button>
            </div>

            <div className="bg-secondary rounded-lg p-6 flex flex-col items-center max-w-sm mx-auto md:mx-0 w-full">
              <h3 className="text-xl font-semibold mb-4">
                {t('client.pages.public.register.firstProfileChoice.professional')}
              </h3>
              <p className="text-center mb-8 text-sm">
                {t('client.pages.public.register.firstProfileChoice.professionalDescription')}
              </p>
              <div className="h-40 w-full mb-8">{/* Image placeholder - you'll add the image */}</div>
              <Button
                onClick={() => handleChoice(true)}
                className="py-2 px-8 rounded-full transition-colors w-full max-w-xs"
              >
                {t('client.pages.public.register.firstProfileChoice.signUp')}
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p>
              {t('client.pages.public.register.firstProfileChoice.existingAccount')}{" "}
              <Link to="/auth/login" className="font-semibold text-primary hover:underline">
                {t('client.pages.public.register.firstProfileChoice.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
