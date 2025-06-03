import React from 'react';
import auth1 from '@/assets/illustrations/auth1.svg';
import { useTranslation } from 'react-i18next';

const NewPasswordSend: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <h1 className="text-4xl font-bold">{t('client.pages.public.auth.newPasswordSend.title')}</h1>
            <img
                src={auth1}
                alt={t('client.pages.public.auth.newPasswordSend.alt')}
                className="w-72 my-5"
            />
            <p className="text-lg">
                {t('client.pages.public.auth.newPasswordSend.message')}
            </p>
        </div>
    );
};

export default NewPasswordSend;
