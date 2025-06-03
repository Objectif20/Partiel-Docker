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

const DeliverymanSettings: React.FC = () => {
  const { t } = useTranslation();

  const formSchema = z.object({
    professional_email: z.string().email(t("client.pages.office.settings.deliveryman.invalidEmail")),
    phone_number: z.string().min(1, t("client.pages.office.settings.deliveryman.phoneRequired")),
    country: z.string().min(1, t("client.pages.office.settings.deliveryman.countryRequired")),
    city: z.string().min(1, t("client.pages.office.settings.deliveryman.cityRequired")),
    address: z.string().min(1, t("client.pages.office.settings.deliveryman.addressRequired")),
    postal_code: z.string().min(1, t("client.pages.office.settings.deliveryman.postalCodeRequired")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      professional_email: "",
      phone_number: "",
      country: "",
      city: "",
      address: "",
      postal_code: "",
    },
  });

  useEffect(() => {
    const fetchCommonSettings = async () => {
      try {
        const settings = await ProfileAPI.getCommonSettings();
        form.reset({
          professional_email: settings.professional_email || "",
          phone_number: settings.phone_number || "",
          country: settings.country || "",
          city: settings.city || "",
          address: settings.address || "",
          postal_code: settings.postal_code || "",
        });
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
          <h3 className="text-lg font-medium">{t("client.pages.office.settings.deliveryman.deliverymanSettings")}</h3>
          <p className="text-sm text-muted-foreground">{t("client.pages.office.settings.deliveryman.modifyInfo")}</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="professional_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("client.pages.office.settings.deliveryman.professionalEmail")}</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("client.pages.office.settings.deliveryman.phoneNumber")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("client.pages.office.settings.deliveryman.yourPhoneNumber")} {...field} />
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
                  <FormLabel>{t("client.pages.office.settings.deliveryman.address")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("client.pages.office.settings.deliveryman.yourAddress")} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("client.pages.office.settings.deliveryman.city")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("client.pages.office.settings.deliveryman.yourCity")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("client.pages.office.settings.deliveryman.postalCode")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("client.pages.office.settings.deliveryman.yourPostalCode")} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("client.pages.office.settings.deliveryman.country")}</FormLabel>
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
            <Button type="submit">
              {t("client.pages.office.settings.deliveryman.updateInfo")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DeliverymanSettings;
