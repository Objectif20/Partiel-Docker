import { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { RegisterContext } from "./RegisterContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Language, RegisterApi } from "@/api/register.api";

const formSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email({
      message: t('client.pages.public.register.clientProfile.validation.email'),
    }),
    password: z
      .string()
      .min(12, {
        message: t('client.pages.public.register.clientProfile.validation.passwordLength'),
      })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
        message: t('client.pages.public.register.clientProfile.validation.passwordFormat'),
      }),
    confirmPassword: z.string(),
    first_name: z.string().min(1, {
      message: t('client.pages.public.register.clientProfile.validation.firstNameRequired'),
    }),
    last_name: z.string().min(1, {
      message: t('client.pages.public.register.clientProfile.validation.lastNameRequired'),
    }),
    newsletter: z.boolean().default(false),
    language_id: z.string().min(1, {
      message: t('client.pages.public.register.clientProfile.validation.languageRequired'),
    }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: t('client.pages.public.register.clientProfile.validation.acceptTerms'),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('client.pages.public.register.clientProfile.validation.passwordMatch'),
    path: ["confirmPassword"],
  });

type FormValues = z.infer<ReturnType<typeof formSchema>>;

export default function Step3ParticulierProfile() {
  const { t } = useTranslation();
  const { nextStep, setClientInfo } = useContext(RegisterContext);
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    async function fetchLanguages() {
      const languages = await RegisterApi.getLanguage();
      setLanguages(languages.filter(lang => lang.active));
    }
    fetchLanguages();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      newsletter: false,
      language_id: "",
      acceptTerms: false,
    },
  });

  function onSubmit(data: FormValues) {
    const { confirmPassword, acceptTerms, ...clientData } = data;
    setClientInfo((prev: any) => ({ ...prev, ...clientData }));
    nextStep();
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {t('client.pages.public.register.clientProfile.completeProfile')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-full">
          <div className="w-full">
            <h3 className="text-lg font-medium mb-6">
              {t('client.pages.public.register.clientProfile.profileDescription')}
            </h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('client.pages.public.register.clientProfile.lastName')}</FormLabel>
                        <FormControl>
                          <Input placeholder="Dupont" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('client.pages.public.register.clientProfile.firstName')}</FormLabel>
                        <FormControl>
                          <Input placeholder="Jean" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="language_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('client.pages.public.register.clientProfile.language')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('client.pages.public.register.clientProfile.selectLanguage')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {languages.map(lang => (
                              <SelectItem key={lang.language_id} value={lang.language_id}>
                                {lang.language_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('client.pages.public.register.clientProfile.email')}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={t('client.pages.public.register.clientProfile.emailPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('client.pages.public.register.clientProfile.password')}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('client.pages.public.register.clientProfile.confirmPassword')}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="newsletter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t('client.pages.public.register.clientProfile.newsletter')}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                        <FormLabel>
                          {t('client.pages.public.register.clientProfile.acceptTerms')}
                          <a href="#" className="text-primary hover:underline">
                            {t('client.pages.public.register.clientProfile.termsLink')}
                          </a>
                        </FormLabel>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-center">
                  <Button type="submit" className=" text-white px-8">
                    {t('client.pages.public.register.clientProfile.continue')}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
