import { useEffect, useState } from "react";
import { Calendar, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import CityAsyncSelectDemo from "@/components/search-place";
import { DeliveriesAPI } from "@/api/deliveries.api";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface DeliveryNegotiateProps {
  deliveryman_user_id: string;
}

interface ShipmentDetails {
  id: string;
  name: string;
  price: number;
  last_date: string;
}

interface Warehouse {
  id: string;
  name: string;
}

interface ApiWarehouse {
  warehouse_id: string;
  city: string;
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
  photo: string;
  description: string;
}

interface City {
  value: string;
  label: string;
  lat: number;
  lon: number;
}

export default function DeliveryNegotiateDialog({ deliveryman_user_id }: DeliveryNegotiateProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [locationType, setLocationType] = useState<"warehouse" | "custom">("warehouse");
  const [date, setDate] = useState<Date | undefined>();
  const [shipments, setShipments] = useState<ShipmentDetails[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentDetails | null>(null);
  const [customAddressEnabled, setCustomAddressEnabled] = useState(false);
  const [hourDate, setHourDate] = useState("12:00");

  const [formData, setFormData] = useState<{
    delivery_person_id: string;
    price: number;
    new_price: number;
    warehouse_id?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    end_date: string;
    isbox: boolean;
  }>({
    delivery_person_id: deliveryman_user_id,
    price: 0,
    new_price: 0,
    warehouse_id: "",
    city: "",
    latitude: 0,
    longitude: 0,
    end_date: "",
    isbox: false,
  });

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data: ApiWarehouse[] = await DeliveriesAPI.getWareHouse();
        setWarehouses(
          data.map((w) => ({
            id: w.warehouse_id,
            name: w.city,
          }))
        );
      } catch (error) {
        console.error(t("client.pages.office.chat-negotiation.errorLoadingWarehouses"), error);
      }
    };

    const fetchShipments = async () => {
      try {
        const data = await DeliveriesAPI.getMyCurrentShipments();
        setShipments(
          data.map((shipment) => ({
            id: shipment.shipment_id,
            name: shipment.description,
            price: shipment.estimated_total_price || 0,
            last_date: shipment.deadline_date || new Date().toISOString(),
          }))
        );
        if (data.length > 0) {
          setSelectedShipment({
            id: data[0].shipment_id,
            name: data[0].description,
            price: data[0].estimated_total_price || 0,
            last_date: data[0].deadline_date || new Date().toISOString(),
          });
          setFormData((prev) => ({
            ...prev,
            new_price: data[0].estimated_total_price || 0,
          }));
        }
      } catch (error) {
        console.error(t("client.pages.office.chat-negotiation.errorLoadingDeliveries"), error);
      }
    };

    fetchWarehouses();
    fetchShipments();
  }, [t]);

  const getCityNameFromCoordinates = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const cityName = response.data.address.city || response.data.address.town || response.data.address.village;
      return cityName || "Unknown";
    } catch (error) {
      console.error(t("client.pages.office.chat-negotiation.errorFetchingCityName"), error);
      return "Unknown";
    }
  };

  const handleCitySelect = async (city: City) => {
    setSelectedCity(city);

    const cityName = await getCityNameFromCoordinates(city.lat, city.lon);

    setFormData((prev) => ({
      ...prev,
      city: cityName,
      latitude: city.lat,
      longitude: city.lon,
      warehouse_id: "",
    }));
  };

  const handleWarehouseChange = (warehouseId: string) => {
    console.log("Warehouse selected:", warehouseId);
    setFormData((prev) => ({
      ...prev,
      warehouse_id: warehouseId,
      city: "",
      latitude: 0,
      longitude: 0,
      isbox: false,
    }));
    console.log("Form data after warehouse selection:", formData);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const defaultTime = "12:00";
      const [hours, minutes] = defaultTime.split(":").map(Number);
      selectedDate.setHours(hours, minutes);

      setFormData((prev) => ({
        ...prev,
        end_date: selectedDate.toISOString(),
      }));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHourDate(e.target.value);
    if (date) {
      const newDate = new Date(date);
      const [hours, minutes] = e.target.value.split(":").map(Number);
      newDate.setHours(hours || 0, minutes || 0);
      setDate(newDate);
      setFormData((prev) => ({
        ...prev,
        end_date: newDate.toISOString(),
      }));
    }
  };

  const handleSubmit = async () => {
    const submissionData = { ...formData };

    console.log("locationType", locationType);

    if (locationType === "warehouse") {
      delete submissionData.city;
      delete submissionData.latitude;
      delete submissionData.longitude;
    } else if (locationType === "custom") {
      delete submissionData.warehouse_id;
    }

    submissionData.price = Number(submissionData.price);
    submissionData.new_price = Number(submissionData.new_price);

    try {
      await DeliveriesAPI.createPartialDelivery(submissionData, selectedShipment?.id || "");
    } catch (error) {
      console.error(t("client.pages.office.chat-negotiation.errorSubmittingData"), error);
    }

    console.log("Form data submitted:", submissionData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {t("client.pages.office.chat-negotiation.negotiateDelivery")}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t("client.pages.office.chat-negotiation.negotiateDelivery")}
          </DialogTitle>
          <DialogDescription>{t("client.pages.office.chat-negotiation.proposeNewConditions")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-4">
            <h3 className="text-sm font-medium">{t("client.pages.office.chat-negotiation.selectDelivery")}</h3>
            <div className="space-y-2">
              <Label htmlFor="shipment">{t("client.pages.office.chat-negotiation.delivery")}</Label>
              <Select
                onValueChange={(shipmentId) => {
                  const selected = shipments.find((s) => s.id === shipmentId);
                  if (selected) {
                    setFormData((prev) => ({
                      ...prev,
                      price: selected.price,
                      new_price: selected.price,
                    }));
                    setSelectedShipment(selected);
                  }
                }}
                defaultValue={shipments.length > 0 ? shipments[0].id : undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("client.pages.office.chat-negotiation.selectDeliveryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {shipments.map((shipment) => (
                    <SelectItem key={shipment.id} value={shipment.id}>
                      {shipment.name} - {new Date(shipment.last_date).toLocaleDateString("fr-FR")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4">
            <h3 className="text-sm font-medium">{t("client.pages.office.chat-negotiation.priceInformation")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="new_price">{t("client.pages.office.chat-negotiation.modifyPrice")}</Label>
                  <Input
                    id="new_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.new_price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        new_price: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">{t("client.pages.office.chat-negotiation.negotiatedPrice")}</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <h3 className="text-sm font-medium">{t("client.pages.office.chat-negotiation.destination")}</h3>
            <Tabs
              defaultValue="warehouse"
              onValueChange={(value) => setLocationType(value as "warehouse" | "custom")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="warehouse">{t("client.pages.office.chat-negotiation.warehouse")}</TabsTrigger>
                <TabsTrigger value="custom">{t("client.pages.office.chat-negotiation.customAddress")}</TabsTrigger>
              </TabsList>
              <TabsContent value="warehouse" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="warehouse">{t("client.pages.office.chat-negotiation.selectWarehouse")}</Label>
                  <Select onValueChange={handleWarehouseChange} value={formData.warehouse_id}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("client.pages.office.chat-negotiation.selectWarehousePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="custom" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>{t("client.pages.office.chat-negotiation.searchAddress")}</Label>
                  <CityAsyncSelectDemo
                    onCitySelect={handleCitySelect}
                    placeholder={t("client.pages.office.chat-negotiation.searchAddressPlaceholder")}
                    labelValue={selectedCity?.label || ""}
                  />
                  {selectedCity && (
                    <div className="mt-2 text-sm">
                      {t("client.pages.office.chat-negotiation.coordinates")} : {selectedCity.lat.toFixed(6)},{" "}
                      {selectedCity.lon.toFixed(6)}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="isbox" className="">
                    {t("client.pages.office.chat-negotiation.isBox")}
                  </Label>
                  <Switch
                    id="isbox"
                    checked={customAddressEnabled}
                    onCheckedChange={() => {
                      setCustomAddressEnabled(!customAddressEnabled);
                      setFormData((prev) => ({
                        ...prev,
                        isbox: !customAddressEnabled,
                      }));
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Date and Time section */}
          <div className="grid gap-4">
            <h3 className="text-sm font-medium">{t("client.pages.office.chat-negotiation.endDate")}</h3>
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : t("client.pages.office.chat-negotiation.selectDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="rounded-md border">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                      locale={fr}
                      className="p-2"
                      disabled={(d) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (d < today) return true;

                        if (selectedShipment?.last_date) {
                          const last = new Date(selectedShipment.last_date);
                          last.setHours(0, 0, 0, 0);
                          return d < last;
                        }

                        return false;
                      }}
                    />
                    <div className="border-t p-3">
                      <div className="flex items-center gap-3">
                        <Label htmlFor="time-input" className="text-xs">
                          Heure
                        </Label>
                        <div className="relative grow">
                          <Input
                            id="time-input"
                            type="time"
                            step="60"
                            value={hourDate}
                            className="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            onChange={handleTimeChange}
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
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            {t("client.pages.office.chat-negotiation.submitProposal")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
