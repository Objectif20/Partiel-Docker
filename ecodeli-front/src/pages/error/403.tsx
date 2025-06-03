import { Button } from '@/components/ui/button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import auth1 from '@/assets/illustrations/auth1.svg'; 

const ForbiddenPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <h1 className="text-8xl font-bold">{t("pages.erreurs.403.titre")}</h1>
            <img
                src={auth1}
                alt="Illustration"
                className="w-72 my-5"
            />
            <p className="text-lg">{t("pages.erreurs.403.message")}</p>
            <Button onClick={handleGoBack} className="mt-5">{t("pages.erreurs.403.bouton")}</Button>
        </div>
    );
};

export default ForbiddenPage;