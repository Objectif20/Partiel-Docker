import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { loginUser, loginUserA2F } from "@/api/auth.api";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import auth1 from "@/assets/illustrations/auth1.svg";
import otpSvg from "@/assets/illustrations/otp.svg";
import logo from "@/assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [is2faRequired, setIs2faRequired] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(email, password);

      if (res.twoFactorRequired) {
        setIs2faRequired(true);
      } else {
        dispatch(login({ accessToken: res.accessToken ?? null, twoFactorRequired: false }));
        if (res.accessToken) {
          navigate("/office/dashboard");
          }

      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const res = await loginUserA2F(email, password, otp);
  
      if (res && res.accessToken) {
        dispatch(login({ accessToken: res.accessToken, twoFactorRequired: false }));
        setIs2faRequired(false);
        navigate("/office/dashboard");
      } else {
        throw new Error("Le token d'accès est manquant.");
      }
    } catch (err: any) {
      setError(`Erreur lors de la validation 2FA: ${err.message}`);
      setOtp("");
      console.error("Erreur lors de la validation 2FA:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <img src={logo} alt="Logo" className="h-16 w-16" />
            EcoDeli
          </Link>
        </div>

        {!is2faRequired ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">{t("pages.connexion.titre")}</h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    {t("pages.connexion.soustitre")}
                  </p>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">{t("pages.connexion.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("pages.connexion.placeholderEmail")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">
                        {t("pages.connexion.motdepasse")}
                      </Label>
                      <Link
                          to="/auth/forgot-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          {t("pages.connexion.forgotPassword")}
                        </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      placeholder={t("pages.connexion.placeholderMotdepasse")}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t("pages.connexion.chargement") : t("pages.connexion.connexion")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <form className="flex flex-col gap-6" onSubmit={handle2FA}>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">
                    {t("pages.connexion.otp")}
                  </h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    {t("pages.connexion.otpSousTitre")}
                  </p>
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="otp">
                        {t("pages.connexion.otpLabel")}
                        </Label>
                        <div className="flex justify-center">
                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                            <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        </div>
                    </div>

                  {error && <p className="text-red-500 text-sm text-center">{t("pages.connexion.erreurOtp")}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t("pages.connexion.chargement") : t("pages.connexion.valider")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="relative hidden lg:block bg-primary">
        <img
          src={is2faRequired ? otpSvg : auth1}
          alt="Illustration"
          className="absolute inset-0 object-cover w-3/5 h-auto mx-auto my-auto"
        />
      </div>
    </div>
  );
}
