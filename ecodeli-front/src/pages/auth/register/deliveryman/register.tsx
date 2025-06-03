'use client'

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTranslation } from 'react-i18next';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LocationSelector from "@/components/ui/location-input";
import { Language, RegisterApi } from "@/api/register.api";
import SignatureInput from "@/components/ui/signature-input";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { AlertCircleIcon, PaperclipIcon, UploadIcon, XIcon } from "lucide-react";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { addDeliverymanProfile } from "@/redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const createFormSchema = (t: (key: string) => string) => {
  return z.object({
    license: z.string().min(1, {
      message: t('client.pages.public.register.deliverymanProfile.licenseError'),
    }),
    professional_email: z.string().email({
      message: t('client.pages.public.register.deliverymanProfile.emailError'),
    }),
    phone_number: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, {
      message: t('client.pages.public.register.deliverymanProfile.phoneError'),
    }),
    country: z.string().min(1, {
      message: t('client.pages.public.register.deliverymanProfile.countryError'),
    }),
    city: z.string().min(1, {
      message: t('client.pages.public.register.deliverymanProfile.cityError'),
    }),
    address: z.string().min(5, {
      message: t('client.pages.public.register.deliverymanProfile.addressError'),
    }),
    postal_code: z.string().regex(/^\d{5}$/, {
      message: t('client.pages.public.register.deliverymanProfile.postalCodeError'),
    }),
    language_id: z.string().optional(),
    signature: z.string().optional(),
  });
};

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

export default function RegisterDeliveryman() {
  const dispatch = useDispatch();
  const [, setCountry] = useState('FR');
  const [, setCountryName] = useState('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setBreadcrumb({
      segments: [t('client.pages.public.register.deliverymanProfile.breadcrumb.home'), t('client.pages.public.register.deliverymanProfile.breadcrumb.deliverymanProfile')],
      links: ['/office/dashboard'],
    }));
  }, [dispatch]);

  const formSchema = createFormSchema(t);

  useEffect(() => {
    async function fetchLanguages() {
      const languages = await RegisterApi.getLanguage();
      setLanguages(languages.filter(lang => lang.active));
    }
    fetchLanguages();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      license: "",
      professional_email: "",
      phone_number: "",
      country: "",
      city: "",
      address: "",
      postal_code: "",
      language_id: "",
      signature: "",
    },
  });

  const maxSize = 10 * 1024 * 1024;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    maxSize,
  });

  async function onSubmit(values: FormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (files[0]) {
      if (files[0].file instanceof File) {
        formData.append('delivery_person_documents', files[0].file);
      } else {
        console.error("Invalid file type");
      }
    }

    try {
      await RegisterApi.registerDeliveryPerson(formData);
      dispatch(addDeliverymanProfile());
      navigate('/office/registerSuccess');
    } catch (error) {
      console.error("Error registering delivery person:", error);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {t('client.pages.public.register.deliverymanProfile.title')}
          </CardTitle>
          <CardDescription className="text-center">{t('client.pages.public.register.deliverymanProfile.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="license"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.deliverymanProfile.license')} *</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC123456" {...field} />
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
                      <FormLabel>{t('client.pages.public.register.deliverymanProfile.language')} *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre langue" />
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="professional_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.deliverymanProfile.email')} *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="professional@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.deliverymanProfile.phone')} *</FormLabel>
                      <FormControl>
                        <Input placeholder="+33123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.pages.public.register.deliverymanProfile.address')} *</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Delivery St." {...field} />
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
                        <FormLabel>{t('client.pages.public.register.deliverymanProfile.postalCode')} *</FormLabel>
                        <FormControl>
                          <Input placeholder="75001" {...field} />
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
                        <FormLabel>{t('client.pages.public.register.deliverymanProfile.city')} *</FormLabel>
                        <FormControl>
                          <Input placeholder="Paris" {...field} />
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
                        <FormLabel>{t('client.pages.public.register.deliverymanProfile.country')} *</FormLabel>
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
              <div className="flex items-center justify-center">
                <FormField
                  control={form.control}
                  name="signature"
                  render={({ field }) => (
                    <FormItem className="mx-auto">
                      <div>
                        <FormLabel>
                          {t('client.pages.public.register.providerDocument.signatureLabel')}
                        </FormLabel>
                      </div>
                      <div className="mx-auto">
                        <SignatureInput
                          canvasRef={canvasRef}
                          onSignatureChange={field.onChange}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* File Upload Component */}
              <div className="flex flex-col gap-2">
                {/* Drop area */}
                <div
                  role="button"
                  onClick={openFileDialog}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  data-dragging={isDragging || undefined}
                  className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
                >
                  <input
                    {...getInputProps()}
                    className="sr-only"
                    aria-label="Upload file"
                    disabled={Boolean(files[0])}
                  />

                  <div className="flex flex-col items-center justify-center text-center">
                    <div
                      className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                      aria-hidden="true"
                    >
                      <UploadIcon className="size-4 opacity-60" />
                    </div>
                    <p className="mb-1.5 text-sm font-medium">Upload file</p>
                    <p className="text-muted-foreground text-xs">
                      Drag & drop or click to browse (max. {formatBytes(maxSize)})
                    </p>
                  </div>
                </div>

                {errors.length > 0 && (
                  <div
                    className="text-destructive flex items-center gap-1 text-xs"
                    role="alert"
                  >
                    <AlertCircleIcon className="size-3 shrink-0" />
                    <span>{errors[0]}</span>
                  </div>
                )}

                {files[0] && (
                  <div className="space-y-2">
                    <div
                      key={files[0].id}
                      className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <PaperclipIcon
                          className="size-4 shrink-0 opacity-60"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium">
                            {files[0].file.name}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                        onClick={() => removeFile(files[0]?.id)}
                        aria-label="Remove file"
                      >
                        <XIcon className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <p className="mx-2 text-center text-muted-foreground">Vous pourrez ajouter des véhicules ultérieurement une fois votre profil Transporteur validé par un administrateur de EcoDeli</p>

              <Button type="submit" className="w-full">
                {t('client.pages.public.register.deliverymanProfile.continueButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
