import { Separator } from "@/components/ui/separator";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { ProfileAPI } from "@/api/profile.api";
import { toast } from "sonner";

const GeneralSettings: React.FC = () => {
  const { t } = useTranslation();

  const formSchema = z.object({
    nom: z.string().min(1, t("client.pages.office.settings.general.nameRequired")),
    prenom: z.string().min(1, t("client.pages.office.settings.general.firstNameRequired")),
    email: z.string().email(t("client.pages.office.settings.general.invalidEmail")),
    newsletter: z.boolean().default(false),
  });
  
  const dispatch = useDispatch();
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);

  const isProvider = user?.profile.includes('PROVIDER');
  const isClient = user?.profile.includes('CLIENT');
  const isMerchant = user?.profile.includes('MERCHANT');
  const isDeliveryman = user?.profile.includes('DELIVERYMAN');

  const fetchGeneralProfile = async () => {
      try {
        const response = await ProfileAPI.getMyGeneralProfile();
        form.reset({
          nom: response.last_name,
          prenom: response.first_name,
          email: response.email,
          newsletter: response.newsletter,
        });
      }
      catch (error) {
        console.error("Erreur lors de la récupération du profil général :", error);
      }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      newsletter: false,
    },
  });

  useEffect(() => {
    fetchGeneralProfile();
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    ProfileAPI.updateMyGeneralProfile({
      email: values.email,
      first_name: values.prenom,
      last_name: values.nom,
      newsletter: values.newsletter,
    })
      .then(() => {
        console.log("Profil mis à jour avec succès !");
        toast.success(t("client.pages.office.settings.general.updateSuccess"));
      }
      )
      .catch((error) => {
        console.error("Erreur lors de la mise à jour du profil :", error);
        toast.error(t("client.pages.office.settings.general.updateError"));
      }
      );


  }



  useEffect(() => {
    dispatch(setBreadcrumb({
      segments: [t("client.pages.office.settings.general.home"), t("client.pages.office.settings.general.settings"), t("client.pages.office.settings.general.generalSettings")],
      links: ['/office/dashboard'],
    }));
  }, [dispatch, t]);

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">{t("client.pages.office.settings.general.generalSettings")}</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings" className="font-semibold text-primary active-link">{t("client.pages.office.settings.general.generalSettings")}</Link>
          <Link to="/office/profile">{t("client.pages.office.settings.general.profile")}</Link>
          <Link to="/office/privacy">{t("client.pages.office.settings.general.privacy")}</Link>
          <Link to="/office/contact-details">{t("client.pages.office.settings.general.contactDetails")}</Link>
          {(isMerchant || isClient) && (
            <Link to="/office/subscriptions">{t("client.pages.office.settings.general.subscriptions")}</Link>
          )}
          {(isProvider || isDeliveryman) && (
            <Link to="/office/billing-settings">{t("client.pages.office.settings.general.billing")}</Link>
          )}
          <Link to="/office/reports">{t("client.pages.office.settings.general.reports")}</Link>
        </nav>
        <div className="grid gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">{t("client.pages.office.settings.general.generalSettings")}</h3>
              <p className="text-sm text-muted-foreground">{t("client.pages.office.settings.general.modifyInfo")}</p>
            </div>
            <Separator />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("client.pages.office.settings.general.lastName")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("client.pages.office.settings.general.yourLastName")} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("client.pages.office.settings.general.firstName")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("client.pages.office.settings.general.yourFirstName")} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("client.pages.office.settings.general.email")}</FormLabel>
                      <FormControl>
                        <Input placeholder="votre@email.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newsletter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t("client.pages.office.settings.general.acceptNewsletter")}</FormLabel>
                        <FormDescription>
                          {t("client.pages.office.settings.general.newsletterDescription")}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  {t("client.pages.office.settings.general.updateInfo")}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
