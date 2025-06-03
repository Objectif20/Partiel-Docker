import auth1 from '@/assets/illustrations/auth1.svg';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function RegisterSuccess() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <h1 className="text-4xl font-bold">{t('client.pages.public.register.success.title')}</h1>
            <img
                src={auth1}
                alt={t('client.pages.public.register.success.alt')}
                className="w-72 my-5"
            />
            <p className="text-lg">
                {t('client.pages.public.register.success.message')}
            </p>
            <Button onClick={() => navigate("/auth/login")}>{t('client.pages.public.register.success.button')}</Button>
        </div>
    );
}
