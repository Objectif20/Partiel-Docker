"use client"

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { enableA2F, validateA2F, disableA2F } from "@/api/auth.api";
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link, useNavigate } from "react-router-dom";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { ProfileAPI } from "@/api/profile.api";
import { logout } from "@/redux/slices/authSlice";

const PrivacySettings: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);

  const isProvider = user?.profile.includes("PROVIDER");
  const isClient = user?.profile.includes("CLIENT");
  const isMerchant = user?.profile.includes("MERCHANT");
  const isDeliveryman = user?.profile.includes("DELIVERYMAN");
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisableMode, setIsDisableMode] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.settings.confidentiality.home"), t("client.pages.office.settings.confidentiality.settings"), t("client.pages.office.settings.confidentiality.privacy")],
        links: ["/office/dashboard"],
      }),
    );
  }, [dispatch, t]);


  const handleActivateOTP = async () => {
    if (!user?.user_id) {
      console.error("User ID is not available");
      return;
    }

    try {
      setIsLoading(true);
      const data = await enableA2F(user.user_id);
      setQrCode(data.qrCode);
      setIsDisableMode(false);
    } catch (error) {
      console.error("Failed to enable A2F:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateOTP = async () => {
    if (!user?.user_id) {
      console.error("User ID is not available");
      return;
    }

    try {
      setIsLoading(true);
      await validateA2F(user.user_id, otp);
      setQrCode(null);
      setOtp("");
      setIsDisableMode(false);
    } catch (error) {
      console.error("Failed to validate A2F:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableOTP = async () => {
    if (!user?.user_id) {
      console.error("User ID is not available");
      return;
    }

    setIsDisableMode(true);
    setQrCode("dummy_value");
  };

  const handleConfirmDisableOTP = async () => {
    if (!user?.user_id) {
      console.error("User ID is not available");
      return;
    }
    try {
      setIsLoading(true);
      await disableA2F(user.user_id, otp);
      setQrCode(null);
      setOtp("");
      setIsDisableMode(true);
    } catch (error) {
      console.error("Failed to disable A2F:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setQrCode(null);
    setOtp("");
    setIsDisableMode(false);
  };

  const handleResetPassword = async () => {
    try {
      await ProfileAPI.updateMyPassword()
    } catch (error) {
      console.error("Failed to reset password:", error);
    }

    dispatch(logout());
    navigate("/auth/login")
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">{t("client.pages.office.settings.confidentiality.privacy")}</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings">{t("client.pages.office.settings.confidentiality.generalSettings")}</Link>
          <Link to="/office/profile">{t("client.pages.office.settings.confidentiality.profile")}</Link>
          <Link to="/office/privacy" className="font-semibold text-primary active-link">
            {t("client.pages.office.settings.confidentiality.privacy")}
          </Link>
          <Link to="/office/contact-details">{t("client.pages.office.settings.confidentiality.contactDetails")}</Link>
          {(isMerchant || isClient) && <Link to="/office/subscriptions">{t("client.pages.office.settings.confidentiality.subscriptions")}</Link>}
          {(isProvider || isDeliveryman) && <Link to="/office/billing-settings">{t("client.pages.office.settings.confidentiality.billing")}</Link>}
          <Link to="/office/reports">{t("client.pages.office.settings.confidentiality.reports")}</Link>
        </nav>
        <div className="grid gap-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">{t("client.pages.office.settings.confidentiality.privacy")}</h2>
              <p className="text-sm text-muted-foreground">{t("client.pages.office.settings.confidentiality.modifyPrivacy")}</p>
              <div className="h-px bg-border my-6"></div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium">{t("client.pages.office.settings.confidentiality.updatePassword")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("client.pages.office.settings.confidentiality.updatePasswordDescription")}
                </p>
              </div>
              {isMobile ? (

                  <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="destructive" >{t("client.pages.office.settings.confidentiality.changePassword")}</Button>
                  </DrawerTrigger>
                  <DrawerContent className="sm:max-w-[425px]">
                    <DrawerHeader>
                      <DrawerTitle>Réinitialiser le mot de passe</DrawerTitle>
                      <DrawerDescription>
                      Un email de réinitialisation de mot de passe vous sera envoyé.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <Button onClick={handleResetPassword}>{t('pages.parametres.valider')}</Button>
                      <Button variant={"ghost"}>{t('pages.parametres.annuler')}</Button>
                    </DrawerFooter>
                  </DrawerContent>
                  </Drawer>

              ) : (
                <div className="absolute right-0 top-0 md:static md:ml-auto">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" className="w-full md:w-auto">{t("client.pages.office.settings.confidentiality.changePassword")}</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
                              <DialogDescription>
                              Un email de réinitialisation de mot de passe vous sera envoyé.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button onClick={handleResetPassword}>{t('pages.parametres.valider')}</Button>
                              <Button variant={"ghost"}>{t('pages.parametres.annuler')}</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                  </div>
              )}
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <h3 className="text-base font-medium">{t("client.pages.office.settings.confidentiality.downloadData")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("client.pages.office.settings.confidentiality.downloadDataDescription")}
                </p>
              </div>
              <Button className="px-4 py-2 rounded-md text-sm transition-colors">
                {t("client.pages.office.settings.confidentiality.downloadDocument")}
              </Button>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <h3 className="text-base font-medium">{t("client.pages.office.settings.confidentiality.enable2FA")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("client.pages.office.settings.confidentiality.enable2FADescription")}
                </p>
              </div>
              <Button className="px-4 py-2 rounded-md text-sm transition-colors" onClick={user?.otp ? handleDisableOTP : handleActivateOTP} disabled={isLoading}>
                {user?.otp ? t("client.pages.office.settings.confidentiality.disable2FA") : t("client.pages.office.settings.confidentiality.activate2FA")}
              </Button>
            </div>

            <div className="pt-2">
              <p className="text-sm">
                {t("client.pages.office.settings.confidentiality.whatIs2FA")}
                <a href="#" className="text-primary hover:underline">
                  {t("client.pages.office.settings.confidentiality.here")}
                </a>
              </p>
            </div>

            <div className="pt-6">
              <p className="text-sm">
                {t("client.pages.office.settings.confidentiality.accessPrivacyPolicy")}
                <a href="#" className="text-primary hover:underline">
                  {t("client.pages.office.settings.confidentiality.privacyPolicy")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {qrCode && (
        <>
          {!isMobile ? (
            <Dialog open={!!qrCode} onOpenChange={(open) => { if (!open) handleClose(); }}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{isDisableMode ? t('client.pages.office.settings.confidentiality.disable2FA') : t('client.pages.office.settings.confidentiality.activate2FA')}</DialogTitle>
                  <DialogDescription>
                    {isDisableMode
                      ? t('client.pages.office.settings.confidentiality.enterOtp')
                      : t('client.pages.office.settings.confidentiality.scanQrCode')}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4">
                  {!isDisableMode && <img src={qrCode} alt={t('client.pages.office.settings.confidentiality.imageAlt')} className="mb-4" />}
                  <InputOTP maxLength={6} value={otp} onChange={(newValue: string) => setOtp(newValue)}>
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
                <Button onClick={isDisableMode ? handleConfirmDisableOTP : handleValidateOTP} disabled={isLoading}>
                  {isLoading ? t('client.pages.office.settings.confidentiality.loading') : t('client.pages.office.settings.confidentiality.validate')}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" onClick={handleClose}>
                    {t('client.pages.office.settings.confidentiality.cancel')}
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          ) : (
            <Drawer open={!!qrCode} onClose={handleClose}>
              <DrawerContent className="sm:max-w-[425px]">
                <DrawerHeader>
                  <DrawerTitle>{isDisableMode ? t('client.pages.office.settings.confidentiality.disable2FA') : t('client.pages.office.settings.confidentiality.activate2FA')}</DrawerTitle>
                  <DrawerDescription>
                    {isDisableMode
                      ? t('client.pages.office.settings.confidentiality.enterOtp')
                      : t('client.pages.office.settings.confidentiality.scanQrCode')}
                  </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col items-center space-y-4 mb-4">
                  {!isDisableMode && <img src={qrCode} alt={t('client.pages.office.settings.confidentiality.imageAlt')} className="mb-4" />}
                  <InputOTP maxLength={6} value={otp} onChange={(newValue: string) => setOtp(newValue)}>
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
                <Button onClick={isDisableMode ? handleConfirmDisableOTP : handleValidateOTP} disabled={isLoading}>
                  {isLoading ? t('client.pages.office.settings.confidentiality.loading') : t('client.pages.office.settings.confidentiality.validate')}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" onClick={handleClose}>
                    {t('client.pages.office.settings.confidentiality.cancel')}
                  </Button>
                </DrawerClose>
              </DrawerContent>
            </Drawer>
          )}
        </>
      )}
    </div>
  );
};

export default PrivacySettings;
