"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { defineStepper } from "@/components/ui/stepper"
import type { PackagesFormValues, PickUpEndFormValues, PickUpFormValues, PriceChoiceFormValues } from "./types"
import PackagesFormComponent from "./packageForm"
import { PickupFormComponent } from "./pickUpForm"
import { PickupEndFormComponent } from "./pickUpEndForm"
import { PriceFormComponent } from "./priceForm"
import axios from "axios"
import { DeliveriesAPI } from "@/api/deliveries.api"
import QuestionFinishForm from "./questionFinishForm"
import { useNavigate } from "react-router-dom"

const packageSchema = z.object({
  name: z.string().min(1, "Nom de l'objet est requis"),
  weight: z.string().min(1, "Poids est requis"),
  estimatedPrice: z.string().min(1, "Prix estimé est requis"),
  volume: z.string().min(1, "Volume est requis"),
  isFragile: z.boolean().default(false),
  image: z.any().refine((files) => files?.length, "Une image est au moins requise"),
})

const packagesSchema = z.object({
  packages: z.array(packageSchema).min(1, "Au moins un colis est requis"),
})

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

const { StepperProvider, StepperControls, StepperNavigation, StepperStep, StepperTitle, useStepper } = defineStepper(
  {
    id: "packages",
    title: "Colis",
    schema: packagesSchema,
    Component: PackagesFormComponent,
  },
  {
    id: "pickup",
    title: "Départ",
    schema: pickupSchema,
    Component: PickupFormComponent,
  },
  {
    id: "pickupEnd",
    title: "Arrivée",
    schema: pickupEndSchema,
    Component: PickupEndFormComponent,
  },
  {
    id: "price",
    title: "Prix",
    schema: priceChoiceSchema,
    Component: PriceFormComponent,
  },
  {
    id : "summary",
    title : "Résumé",
    schema : z.object({}),
    Component : QuestionFinishForm,
  }
)

export function DeliveriesStepper() {
  const [formData, setFormData] = useState<{
    packages: PackagesFormValues | null
    pickup: PickUpFormValues | null
    pickupEnd: PickUpEndFormValues | null
    price : PriceChoiceFormValues | null
  }>({
    packages: null,
    pickup: null,
    pickupEnd: null,
    price : null,
  })

  return (
    <StepperProvider>
      <FormStepperComponent formData={formData} setFormData={setFormData} />
    </StepperProvider>
  )
}

type FormStepperProps = {
  formData: {
    packages: PackagesFormValues | null
    pickup: PickUpFormValues | null
    pickupEnd: PickUpEndFormValues | null
    price : PriceChoiceFormValues | null

  }
  setFormData: React.Dispatch<
    React.SetStateAction<{
      packages: PackagesFormValues | null
      pickup: PickUpFormValues | null
      pickupEnd: PickUpEndFormValues | null
      price : PriceChoiceFormValues | null
    }>
  >
}

const FormStepperComponent = ({ formData, setFormData }: FormStepperProps) => {
  const methods = useStepper()
  const navigate = useNavigate()

    const getDefaultValues = (step: string) => {
      if (step === "packages") {
        return {
          packages: [
            { name: "", weight: "", estimatedPrice: "", volume: "", isFragile: false, image: null },
          ],
        };
      }

      if (step === "pickup") {
        return {
          address: "",
          city: "",
          postalCode: "",
          lat: "",
          lon: "",
          pickupMethod: "",
          departure_handling: false,
          floor_departure_handling: 0,
          elevator_departure: false,
        };
      }

      if (step === "pickupEnd") {
        return {
          address: "",
          city: "",
          postalCode: "",
          lat: "",
          lon: "",
          arrival_handling: false,
          floor_arrival_handling: 0,
          elevator_arrival: false,
        };
      }

    if (step === "price") {
      return { price: "0", deadline_date: "", isPriorityShipping: false, shipmentName: "", deliveryEmail: "", hour_date: "" }
    }

      return {};
    };

  const form = useForm<any>({
    mode: "onTouched",
    resolver: zodResolver(methods.current.schema as z.ZodType<any>),
    defaultValues: formData[methods.current.id as keyof typeof formData] || getDefaultValues(methods.current.id),
  })

  const getCoordinatesFromAddress = async (address: string, city: string, postalCode: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', ' + city + ', ' + postalCode)}`;
    
    try {
      const response = await axios.get(url);
      
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { latitude: lat, longitude: lon };
      } else {
        throw new Error("Adresse non trouvée");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des coordonnées :", error);
      throw new Error("Erreur de géocodage");
    }
  };
  
  const onSubmit = async (values: any) => {
    console.log("Form submitted with values:", values);

    if (methods.current.id === "packages") {
      setFormData((prev) => ({ ...prev, packages: values }));
    } else if (methods.current.id === "pickup") {
      setFormData((prev) => ({ ...prev, pickup: values }));
    } else if (methods.current.id === "pickupEnd") {
      setFormData((prev) => ({ ...prev, pickupEnd: values }));
    } else if (methods.current.id === "price") {
      setFormData((prev) => ({ ...prev, price: values }));
    }

    if (methods.isLast) {
      const fullData = {
        ...formData,
        [methods.current.id]: values,
      };

      const packageList = fullData.packages?.packages || [];
      const pickup = fullData.pickup;
      const pickupEnd = fullData.pickupEnd;
      const price = fullData.price;

      const totalWeight = packageList.reduce((sum, pkg) => sum + Number(pkg.weight || 0), 0);
      const totalVolume = packageList.reduce((sum, pkg) => sum + Number(pkg.volume || 0), 0);

      const formDataToSend = new FormData();

      formDataToSend.append("shipment[description]", price?.shipmentName || "Expédition");
      formDataToSend.append("shipment[estimated_total_price]", price?.price || "0");
      formDataToSend.append("shipment[weight]", totalWeight.toString());
      formDataToSend.append("shipment[volume]", totalVolume.toString());
      formDataToSend.append("shipment[deadline_date]", fullData.price?.deadline_date || "");
      formDataToSend.append("shipment[hour_date]", price?.hour_date || "");
      formDataToSend.append("shipment[urgent]", price?.isPriorityShipping ? "true" : "false");
      formDataToSend.append("shipment[status]", "pending");
      formDataToSend.append("shipment[delivery_mail]", price?.deliveryEmail || "");

      const keywords = ["fragile", "colis", "expédition"];
      keywords.forEach((keyword, index) => {
        formDataToSend.append(`shipment[keywords][${index}]`, keyword);
      });

      formDataToSend.append("shipment[departure_city]", pickup?.city || "0");
      formDataToSend.append("shipment[arrival_city]", pickupEnd?.city || "0");
      formDataToSend.append("shipment[departure_postal_code]", pickup?.postalCode || "0");
      formDataToSend.append("shipment[arrival_postal_code]", pickupEnd?.postalCode || "0");
      formDataToSend.append("shipment[departure_address]", pickup?.address || "0");
      formDataToSend.append("shipment[arrival_address]", pickupEnd?.address || "0");
      formDataToSend.append("shipment[departure_handling]", pickup?.departure_handling ? "true" : "false");
      formDataToSend.append("shipment[arrival_handling]", pickupEnd?.arrival_handling ? "true" : "false");
      formDataToSend.append("shipment[handling_floor_departure]", pickup?.floor_departure_handling ? pickup?.floor_departure_handling.toString() : "0");
      formDataToSend.append("shipment[handling_floor_arrival]", pickupEnd?.floor_arrival_handling ? pickupEnd?.floor_arrival_handling.toString() : "0");
      formDataToSend.append("shipment[elevator_departure]", pickup?.elevator_departure ? "true" : "false");
      formDataToSend.append("shipment[elevator_arrival]", pickupEnd?.elevator_arrival ? "true" : "false");
      formDataToSend.append("shipment[departure_location][latitude]", pickup?.lat || "0");
      formDataToSend.append("shipment[departure_location][longitude]", pickup?.lon || "0");
      formDataToSend.append("shipment[arrival_location][latitude]", pickupEnd?.lat || "0");
      formDataToSend.append("shipment[arrival_location][longitude]", pickupEnd?.lon || "0");

      try {
        const departureCoords = await getCoordinatesFromAddress(pickup?.address || "", pickup?.city || "", pickup?.postalCode || "");
        const arrivalCoords = await getCoordinatesFromAddress(pickupEnd?.address || "", pickupEnd?.city || "", pickupEnd?.postalCode || "");

        formDataToSend.set("shipment[departure_location][latitude]", departureCoords.latitude);
        formDataToSend.set("shipment[departure_location][longitude]", departureCoords.longitude);
        formDataToSend.set("shipment[arrival_location][latitude]", arrivalCoords.latitude);
        formDataToSend.set("shipment[arrival_location][longitude]", arrivalCoords.longitude);
      } catch (error) {
        console.error("Erreur de géocodage des adresses", error);
        return;
      }

      for (let i = 0; i < packageList.length; i++) {
        const pkg = packageList[i];

        formDataToSend.append(`shipment[parcels][${i}][name]`, pkg.name);
        formDataToSend.append(`shipment[parcels][${i}][weight]`, pkg.weight);
        formDataToSend.append(`shipment[parcels][${i}][estimate_price]`, pkg.estimatedPrice);
        formDataToSend.append(`shipment[parcels][${i}][fragility]`, pkg.isFragile?.toString());
        formDataToSend.append(`shipment[parcels][${i}][volume]`, pkg.volume);

        if (pkg.image && Array.isArray(pkg.image)) {
          for (let j = 0; j < pkg.image.length; j++) {
            const base64Data = pkg.image[j];
            const blob = await (await fetch(base64Data)).blob();
            formDataToSend.append(`shipment[parcels][${i}][images_${j + 1}]`, blob, `image_${i}_${j}.png`);
          }
        }
      }

      const shipmentImage = localStorage.getItem("shipment-img");
      if (shipmentImage) {
        const response = await fetch(shipmentImage);
        const blob = await response.blob();
        formDataToSend.append("shipment[img]", blob, "shipment_image.png");
      }

      try {
        await DeliveriesAPI.createShipment(formDataToSend);
        navigate("/office/shipments/create/finish");
      } catch (error) {
        console.error("Erreur lors de l'envoi du formulaire : ", error);
      }

      return;
    }

    methods.next();
  };


  useEffect(() => {
    form.reset(formData[methods.current.id as keyof typeof formData] || getDefaultValues(methods.current.id))
  }, [methods.current.id])

  return (
    <div className="w-full max-w-3xl mx-auto">
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <StepperNavigation className="border-b pb-4">
              {methods.all.map((step) => (
                <StepperStep
                  key={step.id}
                  of={step.id}
                  onClick={async () => {
                    if (step.id !== methods.current.id) {
                      const valid = await form.trigger()
                      if (!valid) return

                      const currentValues = form.getValues()
                      if (methods.current.id === "packages") {
                        setFormData((prev) => ({ ...prev, packages: currentValues }))
                      } else if (methods.current.id === "pickup") {
                        setFormData((prev) => ({ ...prev, pickup: currentValues }))
                      } else if (methods.current.id === "pickupEnd") {
                        setFormData((prev) => ({ ...prev, pickupEnd: currentValues }))
                      } else if (methods.current.id === "price") {
                        setFormData((prev) => ({ ...prev, price: currentValues }))
                      }

                      form.reset(formData[step.id as keyof typeof formData] || getDefaultValues(step.id))
                      methods.goTo(step.id)
                    }
                  }}
                >
                  <StepperTitle>{step.title}</StepperTitle>
                </StepperStep>
              ))}
            </StepperNavigation>
            <div className="min-h-[400px]">
              {methods.switch({
                packages: ({ Component }) => <Component onFormSubmit={onSubmit} />,
                pickup: ({ Component }) => <Component onFormSubmit={onSubmit} />,
                pickupEnd: ({ Component }) => <Component onFormSubmit={onSubmit} />,
                price: ({ Component }) => <Component onFormSubmit={onSubmit} pickupData={formData.pickup} pickupEndData={formData.pickupEnd} />,
                summary: ({ Component }) => <Component />,
              })}
            </div>
            <StepperControls>
              {!methods.isFirst && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentValues = form.getValues()
                    if (methods.current.id === "packages") {
                      setFormData((prev) => ({ ...prev, packages: currentValues }))
                    } else if (methods.current.id === "pickup") {
                      setFormData((prev) => ({ ...prev, pickup: currentValues }))
                    } else if (methods.current.id === "pickupEnd") {
                      setFormData((prev) => ({ ...prev, pickupEnd: currentValues }))
                    } else if (methods.current.id === "price") {
                      setFormData((prev) => ({ ...prev, price: currentValues }))
                    }

                    methods.prev()

                    const currentIndex = methods.all.findIndex((step) => step.id === methods.current.id)
                    const prevStepId = methods.all[currentIndex - 1]?.id
                    if (prevStepId) {
                      form.reset(formData[prevStepId as keyof typeof formData] || getDefaultValues(prevStepId))
                    }
                  }}
                >
                  Précédent
                </Button>
              )}
              <Button type="submit">{methods.isLast ? "Terminer" : "Suivant"}</Button>
            </StepperControls>
          </form>
        </Form>
      </FormProvider>
    </div>
  )
}
