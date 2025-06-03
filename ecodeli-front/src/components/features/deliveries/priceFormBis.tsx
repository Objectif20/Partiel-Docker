import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { DeliveriesAPI } from "@/api/deliveries.api";
import { TimePickerInput } from "@/components/ui/time-picker-input"; // Import the TimePickerInput component


export type PriceChoiceBisFormValues = {
  price: string;
  deadline_date: string;
  hour_date: string;
  shipmentName: string;
  isPriorityShipping: boolean;
  deliveryEmail: string;
  shipmentImage: FileList;
};

export interface SubscriptionForClient {
  planName: string;
  discountRate?: number;
  priorityRate: number;
  insuranceLimit?: number | null;
  additionalInsuranceCost?: number | null;
  freeShipmentAvailable?: boolean;
  freePriorityShipmentsPerMonth?: number;
  freePriotiryShipmentsIfLower?: number;
  permanentDiscount?: number;
  hasUsedFreeShipment?: boolean;
  remainingPriorityShipments?: number;
}

export const PriceFormComponent = ({
  
}: {
  onFormSubmit: (data: PriceChoiceBisFormValues) => void;
}) => {
  const { control, watch, setValue } = useFormContext<PriceChoiceBisFormValues>();

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

  if (!subscriptionConfig) {
    return <div>Loading...</div>;
  }

  const priorityShippingFee = isPriorityShipping
    ? price * subscriptionConfig.priorityRate
    : 0;
  const ecoDeliFee = 5.0;
  const additionalInsuranceCost =
    subscriptionConfig.insuranceLimit != null && price > (subscriptionConfig.insuranceLimit ?? 0)
      ? subscriptionConfig.additionalInsuranceCost ?? 0
      : 0;

  const totalPrice =
    price +
    ecoDeliFee +
    priorityShippingFee +
    additionalInsuranceCost;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    console.log("Formatted date:", date);
    console.log("Formatted date string:", format(date, "PPP", { locale: fr }));
    return format(date, "PPP", { locale: fr });
  };

  const timeStringToDate = (time: string): Date => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  const handleTimeChange = (
    field: "hour_date",
    date: Date | undefined
  ) => {
    const timeString = date ? date.toTimeString().slice(0, 5) : null;
    setValue(field, timeString || "");
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
      <div className="text-lg font-medium">
        Il ne vous reste plus que quelques infos à fournir.
      </div>

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
              <Input
                {...field}
                placeholder="Entrez le nom du réceptionneur"
                type="email"
              />
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
            <FormLabel>Date limite</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      formatDate(field.value)
                    ) : (
                      <span>Choisissez une date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(format(date, "yyyy-MM-dd"));
                    } else {
                      field.onChange("");
                    }
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Nouvel input pour l'heure du rendez-vous */}
      <FormField
        control={control}
        name="hour_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Heure du rendez-vous</FormLabel>
            <div className="flex items-end gap-2">
              <TimePickerInput
                picker="hours"
                date={field.value ? timeStringToDate(field.value) : undefined}
                setDate={(date) => handleTimeChange("hour_date", date)}
              />
              <TimePickerInput
                picker="minutes"
                date={field.value ? timeStringToDate(field.value) : undefined}
                setDate={(date) => {
                  const current = field.value ? timeStringToDate(field.value) : new Date();
                  current.setMinutes(date?.getMinutes() || 0);
                  handleTimeChange("hour_date", current);
                }}
              />
            </div>
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
          <img src={imageSrc} alt="Shipment" className="max-w-xs mx-auto" />
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

          {price > 0 && (
            <div className="text-sm text-muted-foreground mt-2">
              Le prix généralement proposé est compris entre 41 € et 52 €.
              <br />
              Votre prix est dans la moyenne.
            </div>
          )}

          <div className="mt-4">
            <FormField
              control={control}
              name="isPriorityShipping"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Envoi prioritaire</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Ajoute {subscriptionConfig.priorityRate * 100}% au montant de l'envoi
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
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
                        Cette charge correspond à la garantie EcoDeli pour
                        assurer votre expédition ainsi que les frais de transaction et de gestion. Cette charge ne s'applique qu'une fois par demande de livraison.
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
                <span>{priorityShippingFee.toFixed(2)} €</span>
              </div>
            )}

            {subscriptionConfig.insuranceLimit !== null && (
              <div className="flex justify-between text-sm">
                <span>Assurance incluse</span>
                <span>Jusqu’à {subscriptionConfig.insuranceLimit} €</span>
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
                        Ce prix TTC est le prix théorique dans le cas où votre demande de livraison est réalisée en une seule fois. Dans le cas d'une livraison en plusieurs étapes, le prix pourra varier.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-primary font-bold">
                {totalPrice.toFixed(2)} €
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
