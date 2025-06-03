import { z } from "zod";

export const packageSchema = z.object({
  name: z.string().min(1, "Nom de l'objet est requis"),
  weight: z.string().min(1, "Poids est requis"),
  estimatedPrice: z.string().min(1, "Prix estimé est requis"),
  volume: z.string().min(1, "Volume est requis"),
  isFragile: z.boolean().default(false),
  image: z.any().refine((files) => files?.length, "Une image est au moins requise"),
});

export const packagesSchema = z.object({
  packages: z.array(packageSchema).min(1, "Au moins un colis est requis"),
  additionalInfo: z.string().optional(),
});

export const pickupSchema = z.object({
  address: z.string().min(1, "Adresse requise"),
  postalCode: z.string().min(5, "Code postal requis"),
  city: z.string().min(1, "Ville requise"),
  lat: z.string().optional(),
  lon: z.string().optional(),  
  departure_handling: z.boolean().default(false),
  floor_departure_handling : z.number().optional().default(0),
  elevator_departure : z.boolean().default(false),
});

export const pickupEndSchema = z.object({
  address: z.string().min(1, "Adresse requise"),
  postalCode: z.string().min(5, "Code postal requis"),
  city: z.string().min(1, "Ville requise"),
  lat: z.string().optional(),
  lon: z.string().optional(),
  arrival_handling: z.boolean().default(false),
  floor_arrival_handling : z.number().optional().default(0),
  elevator_arrival : z.boolean().default(false),
});

export const priceChoiceSchema = z.object({
  price : z.string().min(0, "Prix requis"),
  deadline_date : z.string().min(0, "Date requise"),
  hour_date : z.string().min(0, "Heure requise"),
  isPriorityShipping: z.boolean().default(false),
  shipmentName : z.string().min(0, "Nom de l'expédition requis"),
  deliveryEmail : z.string().email("Email invalide"),
})

export const priceChoiceBisSchema = z.object({
  price : z.string().min(0, "Prix requis"),
  deadline_date : z.string().min(0, "Date requise"),
  hour_date : z.string().min(0, "Heure requise"),
  isPriorityShipping: z.boolean().default(false),
  shipmentName : z.string().min(0, "Nom de l'expédition requis"),
  deliveryEmail : z.string().email("Email invalide"),
}) 
export type PackagesFormValues = z.infer<typeof packagesSchema>;
export type PickUpFormValues = z.infer<typeof pickupSchema>;
export type PickUpEndFormValues = z.infer<typeof pickupEndSchema>;
export type PriceChoiceFormValues = z.infer<typeof priceChoiceSchema>;
export type PriceChoiceBisFormValues = z.infer<typeof priceChoiceBisSchema>;