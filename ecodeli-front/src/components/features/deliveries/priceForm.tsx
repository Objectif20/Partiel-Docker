"use client"

import type React from "react"

import { useFormContext } from "react-hook-form"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import { DeliveriesAPI } from "@/api/deliveries.api"
import { ClockIcon } from "lucide-react"
import { formatDateTime } from "@/utils/date-utils"
import { PickUpEndFormValues, PickUpFormValues } from "./types"

export type PriceChoiceFormValues = {
  price: string
  deadline_date: string
  hour_date: string
  shipmentName: string
  isPriorityShipping: boolean
  deliveryEmail: string
  shipmentImage: FileList
}

export interface SubscriptionForClient {
  planName: string
  discountRate?: number
  priorityRate: number
  insuranceLimit?: number | null
  additionalInsuranceCost?: number | null
  freeShipmentAvailable?: boolean
  freePriorityShipmentsPerMonth?: number
  freePriotiryShipmentsIfLower?: number
  permanentDiscount?: number
  hasUsedFreeShipment?: boolean
  remainingPriorityShipments?: number
}

export const PriceFormComponent = ({
  pickupData,
  pickupEndData,
}: {
  pickupData?: PickUpFormValues | null;
  pickupEndData?: PickUpEndFormValues | null;
  onFormSubmit: (data: PriceChoiceFormValues) => void;
}) => {
  const { control, watch, setValue } = useFormContext<PriceChoiceFormValues>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const price = Number.parseFloat(watch("price") || "0");
  const isPriorityShipping = watch("isPriorityShipping");
  const [subscriptionConfig, setSubscriptionConfig] = useState<SubscriptionForClient | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStat = async () => {
      try {
        const data = await DeliveriesAPI.getSubscriptionStat();
        setSubscriptionConfig(data);
      } catch (error) {
        console.error("Failed to fetch subscription stats:", error);
      }
    };

    fetchSubscriptionStat();

    const savedImage = localStorage.getItem("shipment-img");
    if (savedImage) {
      setImageSrc(savedImage);
    }
  }, []);

  useEffect(() => {
    const deadlineDate = watch("deadline_date");
    if (deadlineDate) {
      setSelectedDate(new Date(deadlineDate));
    }
  }, [watch("deadline_date")]);

  if (!subscriptionConfig) {
    return <div>Loading...</div>;
  }

  const priorityShippingFee = isPriorityShipping ? price * (Number.parseFloat(subscriptionConfig.priorityRate.toString()) / 100) : 0;
  const ecoDeliFee = 5.0;
  let handlingFee = 0;
  if (pickupData?.departure_handling) handlingFee += 29;
  if (pickupEndData?.arrival_handling) handlingFee += 29;
  const additionalInsuranceCost =
    subscriptionConfig.insuranceLimit != null && price > (subscriptionConfig.insuranceLimit ?? 0)
      ? Number.parseFloat(subscriptionConfig.additionalInsuranceCost?.toString() ?? "0")
      : 0;

  const totalPrice = price + ecoDeliFee + priorityShippingFee + additionalInsuranceCost + handlingFee;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setValue("deadline_date", format(date, "yyyy-MM-dd"));
    } else {
      setValue("deadline_date", "");
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("hour_date", e.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        localStorage.setItem("shipment-img", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-lg font-medium">Il ne vous reste plus que quelques infos à fournir.</div>

      <FormField
        control={control}
        name="shipmentName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de l'expédition</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Entrez le nom de l'expédition" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="deliveryEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email du réceptionneur final</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Entrez le nom du réceptionneur" type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="deadline_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date et heure limite</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    {field.value && watch("hour_date") ? (
                      formatDateTime(field.value, watch("hour_date"))
                    ) : (
                      <span>Choisissez une date et heure</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="rounded-md border">
                  <Calendar
                    mode="single"
                    className="p-2"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={fr}
                  />
                  <div className="border-t p-3">
                    <div className="flex items-center gap-3">
                      <FormLabel className="text-xs">Entrez l'heure</FormLabel>
                      <div className="relative grow">
                        <FormField
                          control={control}
                          name="hour_date"
                          render={({ field }) => (
                            <Input
                              type="time"
                              step="60"
                              defaultValue="12:00"
                              className="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              {...field}
                              onChange={handleTimeChange}
                            />
                          )}
                        />
                        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                          <ClockIcon size={16} aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="shipmentImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image de l'expédition</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleImageChange(e);
                  field.onChange(e.target.files);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {imageSrc && (
        <div className="mt-4">
          <img src={imageSrc || "/placeholder.svg"} alt="Shipment" className="max-w-xs mx-auto" />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Proposition tarifaire</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choisissez un prix</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      className="peer ps-6 pe-12"
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1000000"
                    />
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                      €
                    </span>
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                      EUR
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-2 text-sm text-muted-foreground">
            Abonnement : <strong>{subscriptionConfig.planName}</strong>
          </div>

          <div className="mt-4">
            <FormField
              control={control}
              name="isPriorityShipping"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Envoi prioritaire</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Ajoute {subscriptionConfig.priorityRate}% au montant de l'envoi
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                Charge supplémentaire EcoDeli
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-center">
                        Cette charge correspond à la garantie EcoDeli pour assurer votre expédition ainsi que les frais
                        de transaction et de gestion. Cette charge ne s'applique qu'une fois par demande de livraison.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <span>{ecoDeliFee.toFixed(2)} €</span>
            </div>

            {isPriorityShipping && priorityShippingFee > 0 && (
              <div className="flex justify-between text-sm">
                <span>Supplément envoi prioritaire</span>
                <span>{Number(priorityShippingFee)} €</span>
              </div>
            )}

            {subscriptionConfig.insuranceLimit !== null && (
              <div className="flex justify-between text-sm">
                <span>Assurance incluse</span>
                <span>Jusqu'à {subscriptionConfig.insuranceLimit} €</span>
              </div>
            )}

            {handlingFee > 0 && (
              <div className="flex justify-between text-sm">
                <span>Frais de manutention</span>
                <span>{handlingFee.toFixed(2)} €</span>
              </div>
            )}

            {additionalInsuranceCost > 0 && (
              <div className="flex justify-between text-sm">
                <span>Assurance supplémentaire</span>
                <span>{additionalInsuranceCost.toFixed(2)} €</span>
              </div>
            )}

            <div className="flex justify-between font-medium text-base pt-2 border-t">
              <div className="flex items-center">
                <span>Prix total TTC</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-center">
                        Ce prix TTC est le prix théorique dans le cas où votre demande de livraison est réalisée en une
                        seule fois. Dans le cas d'une livraison en plusieurs étapes, le prix pourra varier.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-primary font-bold">{totalPrice.toFixed(2)} €</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
