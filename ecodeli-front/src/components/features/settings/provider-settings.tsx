import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LocationSelector from "@/components/ui/location-input";
import { ProfileAPI } from "@/api/profile.api";

const ProviderSettings: React.FC = () => {
  const { t } = useTranslation();

  const formSchema = z.object({
    company_name: z.string().min(1, t("client.pages.office.settings.provider.companyNameRequired")),
    siret: z.string().min(1, t("client.pages.office.settings.provider.siretRequired")),
    address: z.string().min(1, t("client.pages.office.settings.provider.addressRequired")),
    service_type: z.string().min(1, t("client.pages.office.settings.provider.serviceTypeRequired")),
    postal_code: z.string().min(1, t("client.pages.office.settings.provider.postalCodeRequired")),
    city: z.string().min(1, t("client.pages.office.settings.provider.cityRequired")),
    country: z.string().min(1, t("client.pages.office.settings.provider.countryRequired")),
    phone: z.string().min(1, t("client.pages.office.settings.provider.phoneRequired")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      siret: "",
      address: "",
      service_type: "",
      postal_code: "",
      city: "",
      country: "",
      phone: "",
    },
  });

  useEffect(() => {
    const fetchCommonSettings = async () => {
      try {
        const settings = await ProfileAPI.getCommonSettings();
        form.reset(settings);
      } catch (error) {
        console.error("Failed to fetch common settings:", error);
      }
    };

    fetchCommonSettings();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await ProfileAPI.updateCommonSettings(values);
      await ProfileAPI.getCommonSettings();
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">{t("client.pages.office.settings.provider.providerSettings")}</h3>
          <p className="text-sm text-muted-foreground">{t("client.pages.office.settings.provider.modifyInfo")}</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("client.pages.office.settings.provider.companyName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("client.pages.office.settings.provider.yourCompanyName")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="siret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("client.pages.office.settings.provider.siret")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("client.pages.office.settings.provider.yourSiret")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("client.pages.office.settings.provider.address")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("client.pages.office.settings.provider.yourAddress")} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("client.pages.office.settings.provider.serviceType")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("client.pages.office.settings.provider.yourServiceType")} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("client.pages.office.settings.provider.postalCode")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("client.pages.office.settings.provider.yourPostalCode")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("client.pages.office.settings.provider.city")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("client.pages.office.settings.provider.yourCity")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("client.pages.office.settings.provider.country")}</FormLabel>
                    <LocationSelector
                      onCountryChange={(country) => {
                        field.onChange(country?.name || '');
                      }}
                      enableStateSelection={false}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("client.pages.office.settings.provider.phone")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("client.pages.office.settings.provider.yourPhone")} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">
              {t("client.pages.office.settings.provider.updateInfo")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProviderSettings;
