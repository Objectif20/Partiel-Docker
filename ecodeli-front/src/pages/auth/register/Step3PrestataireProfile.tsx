"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { RegisterContext } from "./RegisterContext"
import { Textarea } from "@/components/ui/textarea"
import { Language, RegisterApi } from "@/api/register.api"
import LocationSelector from "@/components/ui/location-input"

const createFormSchema = (t: (key: string) => string) => {
  return z.object({
    first_name: z.string().min(2, { message: t('client.pages.public.register.providerProfile.validation.firstNameMin') }),
    last_name: z.string().min(2, { message: t('client.pages.public.register.providerProfile.validation.lastNameMin') }),
    email: z.string().email({ message: t('client.pages.public.register.providerProfile.validation.invalidEmail') }),
    password: z.string().min(8, { message: t('client.pages.public.register.providerProfile.validation.passwordMin') }),
    confirm_password: z.string(),
    company_name: z.string().min(2, { message: t('client.pages.public.register.providerProfile.validation.companyNameMin') }),
    siret: z.string().min(14, { message: t('client.pages.public.register.providerProfile.validation.siretLength') }).max(14),
    service_type: z.string({ required_error: t('client.pages.public.register.providerProfile.validation.activitySector') }),
    address: z.string().min(1, { message: t('client.pages.public.register.providerProfile.validation.addressRequired') }),
    postal_code: z.string().min(1, { message: t('client.pages.public.register.providerProfile.validation.postalCodeRequired') }),
    city: z.string().min(1, { message: t('client.pages.public.register.providerProfile.validation.cityRequired') }),
    country: z.string().min(1, { message: t('client.pages.public.register.providerProfile.validation.countryRequired') }),
    phone: z.string().min(1, { message: t('client.pages.public.register.providerProfile.validation.phoneRequired') }),
    description: z.string().min(1, { message: t('client.pages.public.register.providerProfile.validation.descriptionRequired') }),
    language_id: z.string().min(1, { message: t('client.pages.public.register.providerProfile.validation.languageRequired') }),
    newsletter: z.boolean().default(false),
    terms: z.boolean().refine((val) => val === true, {
      message: t('client.pages.public.register.providerProfile.validation.acceptTerms'),
    }),
  }).refine((data) => data.password === data.confirm_password, {
    message: t('client.pages.public.register.providerProfile.validation.passwordMismatch'),
    path: ["confirm_password"],
  })
}

export default function Step3PrestataireProfile() {
  const { t } = useTranslation();
  const formSchema = createFormSchema(t);

  const { nextStep, setPrestataireInfo } = useContext(RegisterContext)
  const [languages, setLanguages] = useState<Language[]>([])
  const [, setCountry] = useState('FR');
  const [, setCountryName] = useState('');

  useEffect(() => {
    async function fetchLanguages() {
      const languages = await RegisterApi.getLanguage()
      setLanguages(languages.filter(lang => lang.active))
    }
    fetchLanguages()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      company_name: "",
      siret: "",
      address: "",
      postal_code: "",
      city: "",
      country: "",
      phone: "",
      description: "",
      language_id: "",
      newsletter: false,
      terms: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPrestataireInfo(values)
    nextStep()
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {t('client.pages.public.register.providerProfile.completeProfile')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('client.pages.public.register.providerProfile.fillInfo')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.providerProfile.lastName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('client.pages.public.register.providerProfile.placeholders.lastName')} {...field} />
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
                      <FormLabel>{t('client.pages.public.register.providerProfile.firstName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('client.pages.public.register.providerProfile.placeholders.firstName')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client.pages.public.register.providerProfile.email')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('client.pages.public.register.providerProfile.placeholders.email')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.providerProfile.password')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t('client.pages.public.register.providerProfile.placeholders.password')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.providerProfile.confirmPassword')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t('client.pages.public.register.providerProfile.placeholders.confirmPassword')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client.pages.public.register.providerProfile.companyName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('client.pages.public.register.providerProfile.placeholders.companyName')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client.pages.public.register.providerProfile.siretNumber')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('client.pages.public.register.providerProfile.placeholders.siretNumber')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="service_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client.pages.public.register.providerProfile.activitySector')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('client.pages.public.register.providerProfile.selectActivitySector')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant gastronomique</SelectItem>
                        <SelectItem value="commerce">Commerce alimentaire</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.providerProfile.address')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('client.pages.public.register.providerProfile.placeholders.address')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('client.pages.public.register.providerProfile.postalCode')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('client.pages.public.register.providerProfile.placeholders.postalCode')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('client.pages.public.register.providerProfile.city')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('client.pages.public.register.providerProfile.placeholders.city')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('client.pages.public.register.providerProfile.country')}</FormLabel>
                        <LocationSelector
                          onCountryChange={(country) => {
                            setCountry(country?.iso2 || 'FR');
                            setCountryName(country?.name || '');
                            field.onChange(country?.name || '');
                          }}
                          enableStateSelection={false}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.providerProfile.phone')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('client.pages.public.register.providerProfile.placeholders.phone')} {...field} />
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
                      <FormLabel>{t('client.pages.public.register.providerProfile.language')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('client.pages.public.register.providerProfile.selectLanguage')} />
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
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>{t('client.pages.public.register.providerProfile.description')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('client.pages.public.register.providerProfile.placeholders.description')} className="resize-none" {...field} />
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
                      <FormLabel>{t('client.pages.public.register.providerProfile.subscribeNewsletter')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {t('client.pages.public.register.providerProfile.acceptTerms', { link: <a href="#" className="text-primary underline">{t('client.pages.public.register.providerProfile.termsLink')}</a> })}
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {t('client.pages.public.register.providerProfile.continue')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
