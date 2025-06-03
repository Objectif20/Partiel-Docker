import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.svg";
import forgotPasswordSvg from "@/assets/illustrations/auth1.svg";
import { Link, useNavigate } from "react-router-dom";
import { requestPasswordReset } from "@/api/auth.api";
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const newPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await requestPasswordReset(email);
      setSuccess(true);
      navigate("/info/newPasswordSend");
    } catch (err) {
      setError(t('client.pages.public.auth.forgotPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <img src={logo} alt={t('client.pages.public.auth.forgotPassword.logoAlt')} className="h-16 w-16" />
            EcoDeli
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form className="flex flex-col gap-6" onSubmit={newPassword}>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{t('client.pages.public.auth.forgotPassword.title')}</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  {t('client.pages.public.auth.forgotPassword.description')}
                </p>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('client.pages.public.auth.forgotPassword.emailLabel')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('client.pages.public.auth.forgotPassword.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && (
                  <p className="text-green-500 text-sm">
                    {t('client.pages.public.auth.forgotPassword.successMessage')}
                  </p>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('client.pages.public.auth.forgotPassword.sending') : t('client.pages.public.auth.forgotPassword.send')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block bg-primary">
        <img
          src={forgotPasswordSvg}
          alt={t('client.pages.public.auth.forgotPassword.illustrationAlt')}
          className="absolute inset-0 object-cover w-3/5 h-auto mx-auto my-auto"
        />
      </div>
    </div>
  );
}
