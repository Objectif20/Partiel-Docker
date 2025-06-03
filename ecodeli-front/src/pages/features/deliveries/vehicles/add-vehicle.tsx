"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DeliverymanApi, vehicleCategory } from "@/api/deliveryman.api";
import { useImageUpload } from "@/hooks/use-image-upload";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import { ImagePlus, Upload, Trash2 } from "lucide-react";

const FormSchema = z.object({
  document: z.instanceof(File, { message: "client.pages.office.delivery.vehicles.addVehicle.form.errors.documentRequired" }),
  documentDescription: z.string().min(1, { message: "client.pages.office.delivery.vehicles.addVehicle.form.errors.descriptionRequired" }),
  model: z.string().min(1, { message: "client.pages.office.delivery.vehicles.addVehicle.form.errors.modelRequired" }),
  category: z.string().min(1, { message: "client.pages.office.delivery.vehicles.addVehicle.form.errors.categoryRequired" }),
  matricule: z.string().min(1, { message: "client.pages.office.delivery.vehicles.addVehicle.form.errors.matriculeRequired" }),
  electric: z.boolean(),
  co2Consumption: z.string().min(1, { message: "client.pages.office.delivery.vehicles.addVehicle.form.errors.co2ConsumptionRequired" }),
});

export default function AddVehicle() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      document: undefined,
      documentDescription: "",
      category: "",
      matricule: "",
      electric: false,
      co2Consumption: "0",
      model: "",
    },
  });

  const { previewUrl, uploadedFile, fileInputRef, handleThumbnailClick, handleFileChange, handleRemove } = useImageUpload();

  const [categories, setCategories] = useState<vehicleCategory[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    dispatch(setBreadcrumb({
      segments: [
        t('client.pages.office.delivery.vehicles.addVehicle.breadcrumb.home'),
        t('client.pages.office.delivery.vehicles.addVehicle.breadcrumb.vehicles'),
        t('client.pages.office.delivery.vehicles.addVehicle.breadcrumb.addVehicle')
      ],
      links: ["/office/dashboard", "/office/my-vehicles"],
    }));
  }, [dispatch, t]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetched = await DeliverymanApi.getVehicleCategories();
        setCategories(fetched);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    };

    fetchCategories();
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const fakeEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  }, [handleFileChange]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const formData = new FormData();

      if (uploadedFile) {
        formData.append("image", uploadedFile);
      }

      formData.append("document", data.document);
      formData.append("documentDescription", data.documentDescription);
      formData.append("model", data.model);
      formData.append("category", data.category);
      formData.append("registrationNumber", data.matricule);
      formData.append("electric", String(data.electric));
      formData.append("co2Consumption", data.co2Consumption);

      await DeliverymanApi.addVehicle(formData);
      navigate("/office/my-vehicles");
    } catch (error) {
      console.error("Erreur lors de l'ajout du véhicule :", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl mx-auto space-y-6 p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
      >
        <h2 className="text-2xl font-bold mb-4">{t('client.pages.office.delivery.vehicles.addVehicle.title')}</h2>

        {/* Zone upload image */}
        <div
          onClick={handleThumbnailClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/50 bg-muted/50 transition-colors hover:bg-muted",
            isDragging && "border-primary",
          )}
        >
          {!previewUrl ? (
            <>
              <div className="rounded-full bg-background p-3 shadow-sm">
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{t('client.pages.office.delivery.vehicles.addVehicle.form.uploadImage.clickToSelect')}</p>
                <p className="text-xs text-muted-foreground">{t('client.pages.office.delivery.vehicles.addVehicle.form.uploadImage.dragDrop')}</p>
              </div>
            </>
          ) : (
            <div className="relative h-full w-full">
              <img src={previewUrl} alt="Aperçu" className="object-cover rounded-lg w-full h-full" />
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity hover:opacity-100 flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary" onClick={handleThumbnailClick} className="h-9 w-9 p-0">
                  <Upload className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={handleRemove} className="h-9 w-9 p-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Input caché pour l'image */}
        <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

        {/* Le reste du formulaire */}
        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('client.pages.office.delivery.vehicles.addVehicle.form.document')}</FormLabel>
              <FormControl>
                <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0] || null)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('client.pages.office.delivery.vehicles.addVehicle.form.documentDescription')}</FormLabel>
              <FormControl>
                <Textarea placeholder={t('client.pages.office.delivery.vehicles.addVehicle.form.documentDescription')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('client.pages.office.delivery.vehicles.addVehicle.form.category')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('client.pages.office.delivery.vehicles.addVehicle.form.selectCategory')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.category_id} value={category.category_id.toString()}>
                      {category.name}
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
          name="matricule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('client.pages.office.delivery.vehicles.addVehicle.form.matricule')}</FormLabel>
              <FormControl>
                <Input placeholder={t('client.pages.office.delivery.vehicles.addVehicle.form.matricule')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('client.pages.office.delivery.vehicles.addVehicle.form.model')}</FormLabel>
              <FormControl>
                <Input placeholder={t('client.pages.office.delivery.vehicles.addVehicle.form.model')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="electric"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 border p-4 rounded-md">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1">
                <FormLabel>{t('client.pages.office.delivery.vehicles.addVehicle.form.electric')}</FormLabel>
                <p className="text-sm text-muted-foreground">{t('client.pages.office.delivery.vehicles.addVehicle.form.electricDescription')}</p>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="co2Consumption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('client.pages.office.delivery.vehicles.addVehicle.form.co2Consumption')}</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 120" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {t('client.pages.office.delivery.vehicles.addVehicle.form.submit')}
        </Button>
      </form>
    </Form>
  );
}
