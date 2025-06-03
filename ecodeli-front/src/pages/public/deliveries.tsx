import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LatLngBoundsExpression } from "leaflet";
import {
  DeliveriesAPI,
  DeliveriesFilter,
  Delivery,
} from "@/api/deliveries.api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CityAsyncSelectDemo from "@/components/search-place";
import { useMediaQuery } from "react-responsive";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import DualRangeSlider from "@/components/ui/slider-dual";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

export interface City {
  value: string;
  label: string;
  lat: number;
  lon: number;
}

const createIcon = (className: string, price: string | null) => L.divIcon({
  className,
  html: `<div class="icon-text bg-background font-bold text-sm px-4 py-1 rounded-xl text-center">${price ?? ''} €</div>`,
  iconSize: [80, 20],
  iconAnchor: [30, 20],
});

const urgentIcon = (price: string | null) => createIcon('', price);
const nonUrgentIcon = (price: string | null) => createIcon('', price);

const departure = L.divIcon({
  className: 'non-urgent-icon',
  html: '<div class="icon-text bg-background text-sm px-4 py-1 rounded-xl text-center">Départ</div>',
  iconSize: [75, 20],
  iconAnchor: [30, 20],
});

const arrival = L.divIcon({
  className: 'non-urgent-icon',
  html: '<div class="icon-text bg-background  text-sm px-4 py-1 rounded-xl text-center">Arrivé</div>',
  iconSize: [70, 20],
  iconAnchor: [30, 20],
});

function DeliveriesPage() {

  const { t } = useTranslation();

  const franceBounds: LatLngBoundsExpression = useMemo(
    () => [
      [51.124199, -5.142222],
      [41.333, 9.560016],
    ],
    []
  );

  const parisCoordinates = useMemo(
    () => ({
      latitude: 48.8566,
      longitude: 2.3522,
      radius: 50000,
    }),
    []
  );

  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState("around");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [radius, setRadius] = useState<number>(100);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [routeStartCity, setRouteStartCity] = useState<City | null>(null);
  const [routeEndCity, setRouteEndCity] = useState<City | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [weightRange, setWeightRange] = useState<[number, number]>([0, 100]);
  const [deliveryType, setDeliveryType] = useState<string | null>(null);
  const [isReset, setIsReset] = useState<boolean>(false);


  const mapRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const isMobile = useMediaQuery({ maxWidth: 767 });

  const fetchDeliveries = useCallback(
    async (resetPage = false, currentPage = page) => {
      if (resetPage) {
        setPage(1);
        setHasMore(true);
      }
  
      if (loading || !hasMore) {
        return;
      }
  
      setLoading(true);
      try {
        const coordinates =
          selectedOption === "around"
            ? {
                latitude: selectedCity?.lat ?? parisCoordinates.latitude,
                longitude: selectedCity?.lon ?? parisCoordinates.longitude,
                radius: radius * 1000,
              }
            : {
                routeStartLatitude: routeStartCity?.lat,
                routeStartLongitude: routeStartCity?.lon,
                routeEndLatitude: routeEndCity?.lat,
                routeEndLongitude: routeEndCity?.lon,
                routeRadius: radius * 1000,
              };
  
        const apiFilter = {
          ...(selectedOption === "around"
            ? {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                radius: coordinates.radius,
              }
            : {
                routeStartLatitude: coordinates.routeStartLatitude,
                routeStartLongitude: coordinates.routeStartLongitude,
                routeEndLatitude: coordinates.routeEndLatitude,
                routeEndLongitude: coordinates.routeEndLongitude,
                routeRadius: coordinates.routeRadius,
              }),
          limit: 10,
          page: currentPage,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minWeight: weightRange[0],
          maxWeight: weightRange[1],
          deliveryType: deliveryType || undefined,
        } as DeliveriesFilter;
  
        const response = await DeliveriesAPI.getDeliveries(apiFilter);
  
        if (Array.isArray(response)) {
          if (response.length > 0) {
            setDeliveries((prevDeliveries) => {
              if (resetPage) {
                return response;
              } else {
                const newDeliveries = response.filter(
                  (newDelivery) =>
                    !prevDeliveries.some(
                      (prevDelivery) =>
                        prevDelivery.shipment_id === newDelivery.shipment_id
                    )
                );
                return [...prevDeliveries, ...newDeliveries];
              }
            });
            setPage((prevPage) => (resetPage ? 2 : prevPage + 1));
          } else {
            if (currentPage === 1 && resetPage) {
              setDeliveries([]);
              console.log("Aucune donnée trouvée.");
            }
            setHasMore(false);
          }
        } else {
          console.error("Response is not an array:", response);
        }
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      page,
      selectedOption,
      selectedCity,
      routeStartCity,
      routeEndCity,
      radius,
      loading,
      hasMore,
      parisCoordinates,
      priceRange,
      weightRange,
      deliveryType,
    ]
  );
  

  useEffect(() => {
    fetchDeliveries();
  }, []);

  useEffect(() => {
    if (selectedDelivery && mapRef.current && !isMobile) {
      const map = mapRef.current as L.Map;

      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
      }

      const polyline = L.polyline(
        [
          [
            selectedDelivery.departure_location.coordinates[1],
            selectedDelivery.departure_location.coordinates[0],
          ],
          [
            selectedDelivery.arrival_location.coordinates[1],
            selectedDelivery.arrival_location.coordinates[0],
          ],
        ],
        { color: "green" }
      ).addTo(map);

      polylineRef.current = polyline;
    }
  }, [selectedDelivery, isMobile]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    console.log(
      `Selected city in parent: ${city.label}, Lat: ${city.lat}, Lon: ${city.lon}`
    );
  };

  const handleRouteStartCitySelect = (city: City) => {
    setRouteStartCity(city);
    console.log(
      `Selected route start city in parent: ${city.label}, Lat: ${city.lat}, Lon: ${city.lon}`
    );
  };

  const handleRouteEndCitySelect = (city: City) => {
    setRouteEndCity(city);
    console.log(
      `Selected route end city in parent: ${city.label}, Lat: ${city.lat}, Lon: ${city.lon}`
    );
  };

  const handleMarkerClick = (delivery: Delivery) => {
    if (isMobile) {
      window.location.href = `/deliveries/${delivery.shipment_id}`;
    } else {
      setSelectedDelivery(delivery);
      console.log("Selected Delivery:", delivery);
    }
  };

  const handleResetView = () => {
    setSelectedDelivery(null);
    if (mapRef.current) {
      mapRef.current.fitBounds(franceBounds);
    }
    if (polylineRef.current) {
      mapRef.current?.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }
  };

  const handleDivClick = (delivery: Delivery) => {
    if (isMobile) {
      window.location.href = `/deliveries/${delivery.shipment_id}`;
    } else {
      setSelectedDelivery(delivery);
      console.log("Selected Delivery from div:", delivery);
    }
  };

  const handleApplyFilters = () => {
    fetchDeliveries(true, 1);
  };

  const handleResetFilters = () => {
    console.log("Resetting filters...");
    setSelectedCity(null);
    setRouteStartCity(null);
    setRouteEndCity(null);
    setRadius(50);
    setPriceRange([0, 1000]);
    setWeightRange([0, 100]);
    setDeliveryType(null);
    setPage(1);
    setHasMore(true);
    setIsReset(true);
    console.log("Filters reset complete.");
  };

  useEffect(() => {
    if (isReset) {
      fetchDeliveries(true, 1);
      setIsReset(false); 
    }
  }, [isReset]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-grow flex overflow-hidden">
        <div className="p-6 flex flex-col justify-between items-center shadow-md overflow-auto w-full md:w-2/5">
          <div className="w-full mb-4">
            <h2 className="text-xl font-bold mb-4">
              {t('client.pages.public.deliveries.findPackage')}
            </h2>
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
            >
              <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="around" id="around" />
                  <Label htmlFor="around">{t('client.pages.public.deliveries.around')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="onRoute" id="onRoute" />
                  <Label htmlFor="onRoute">{t('client.pages.public.deliveries.onRoute')}</Label>
                </div>
              </div>
            </RadioGroup>
            {selectedOption === "around" && (
              <div className="flex flex-col items-start mb-4">
                <CityAsyncSelectDemo
                  onCitySelect={handleCitySelect}
                  labelValue={selectedCity?.label || ""}
                />
                <div className="mt-4 w-full">
                  <div className="space-y-4 min-w-[300px]">
                    <div className="flex items-center justify-between gap-2">
                      <Label>{t('client.pages.public.deliveries.radius')}</Label>
                      <output className="text-sm font-medium tabular-nums">
                        {radius}
                      </output>
                    </div>
                    <Slider
                      defaultValue={[radius]}
                      max={100}
                      step={1}
                      onValueChange={(value) => setRadius(value[0])}
                    />
                  </div>
                </div>
              </div>
            )}
            {selectedOption === "onRoute" && (
              <div className="flex flex-col items-start mb-4">
                <CityAsyncSelectDemo
                  onCitySelect={handleRouteStartCitySelect}
                  labelValue={routeStartCity?.label || ""}
                  placeholder={t('client.pages.public.deliveries.departure')}
                />
                <CityAsyncSelectDemo
                  onCitySelect={handleRouteEndCitySelect}
                  labelValue={routeEndCity?.label || ""}
                  placeholder={t('client.pages.public.deliveries.arrival')}
                />
                <div className="mt-4 w-full">
                  <div className="space-y-4 min-w-[300px]">
                    <div className="flex items-center justify-between gap-2">
                      <Label>{t('client.pages.public.deliveries.radius')}</Label>
                      <output className="text-sm font-medium tabular-nums">
                        {radius}
                      </output>
                    </div>
                    <Slider
                      defaultValue={[radius]}
                      max={100}
                      step={1}
                      onValueChange={(value) => setRadius(value[0])}
                    />
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={handleApplyFilters}
              className="bg-primary text-primary-foreground px-4 py-2 rounded mt-4"
            >
              {t('client.pages.public.deliveries.applyFilters')}
            </button>
          </div>

          <ScrollArea className="h-[calc(100vh-20rem)] w-full mb-4">
            <div className="flex w-full flex-col items-center gap-3 mr-4 pr-4">
              {deliveries.length === 0 && page === 1 ? (
                <div>
                  {t('client.pages.public.deliveries.noDataFound')}
                  <Button
                    onClick={handleResetFilters}
                    className="underline ml-2"
                  >
                    {t('client.pages.public.deliveries.resetFilters')}
                  </Button>
                </div>
              ) : (
                deliveries.map((delivery) => (
                  <div
                    key={delivery.shipment_id}
                    className="flex items-center w-full mb-4 p-4 border rounded-lg shadow-sm cursor-pointer"
                    onClick={() => handleDivClick(delivery)}
                  >
                    <div className="w-36 h-24 bg-gray-300 rounded mr-4 flex-shrink-0 flex items-center justify-center">
                      {delivery.image ? (
                        <img
                          src={delivery.image}
                          alt="Delivery"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">
                          {delivery.description}
                        </h3>
                        <Badge className="text-sm font-medium px-2.5 py-0.5 rounded">
                          {delivery.estimated_total_price ?? "N/A"} €
                        </Badge>
                      </div>
                      <p className="mt-2">
                        {t('client.pages.public.deliveries.cityToCity', {
                          departureCity: delivery.departure_city,
                          arrivalCity: delivery.arrival_city,
                        })}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="badge badge-outline">
                          {t('client.pages.public.deliveries.weightKg', {
                            weight: delivery.weight,
                          })}
                        </Badge>
                        <Badge>
                          {t('client.pages.public.deliveries.urgency', {
                            urgency: delivery.urgent ? t('client.pages.public.deliveries.urgent') : t('client.pages.public.deliveries.nonUrgent'),
                          })}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <button
                onClick={() => fetchDeliveries()}
                disabled={loading || !hasMore}
                className="bg-primary text-primary-foreground px-4 py-2 rounded mt-4"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t('client.pages.public.deliveries.more')
                )}
              </button>
            </div>
          </ScrollArea>

          <div className="flex justify-center mt-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
                  {t('client.pages.public.deliveries.moreFilters')}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('client.pages.public.deliveries.filters')}</DialogTitle>
                  <DialogDescription>
                    {t('client.pages.public.deliveries.useThisSpace')}
                  </DialogDescription>
                </DialogHeader>
                <Accordion type="single" collapsible>
                  <AccordionItem value="price-filter">
                    <AccordionTrigger>{t('client.pages.public.deliveries.price')}</AccordionTrigger>
                    <AccordionContent>
                      <DualRangeSlider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        label={t('client.pages.public.deliveries.price')}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="weight-filter">
                    <AccordionTrigger>{t('client.pages.public.deliveries.weight')}</AccordionTrigger>
                    <AccordionContent>
                      <DualRangeSlider
                        value={weightRange}
                        onValueChange={setWeightRange}
                        label={t('client.pages.public.deliveries.weight')}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="type-filter">
                    <AccordionTrigger>{t('client.pages.public.deliveries.deliveryType')}</AccordionTrigger>
                    <AccordionContent>

                      <Select defaultValue="all" onValueChange={(value) => setDeliveryType(value)}>
                        <SelectTrigger className="w-full">
                          <Label>{t('client.pages.public.deliveries.deliveryType')}</Label>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {t('client.pages.public.deliveries.all')}
                          </SelectItem>
                          <SelectItem value="urgent">
                            {t('client.pages.public.deliveries.urgent')}
                          </SelectItem>
                          <SelectItem value="non-urgent">
                            {t('client.pages.public.deliveries.nonUrgent')}
                          </SelectItem>
                        </SelectContent>

                      </Select>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <DialogFooter>
                  <DialogClose asChild>
                    <button
                      onClick={handleApplyFilters}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded mt-4 w-full"
                    >
                      {t('client.pages.public.deliveries.apply')}
                    </button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="hidden md:block w-3/5 z-0 h-full overflow-hidden relative">
          <MapContainer
            bounds={franceBounds}
            className="w-full h-full z-0"
            attributionControl={true}
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {!selectedDelivery &&
              deliveries.slice(0, 10).map((delivery) => (
                <Marker
                  key={delivery.shipment_id}
                  position={[
                    delivery.departure_location.coordinates[1],
                    delivery.departure_location.coordinates[0],
                  ]}
                  icon={delivery.urgent ? urgentIcon(delivery.estimated_total_price?.toString() ?? "N/A") : nonUrgentIcon(delivery.estimated_total_price?.toString() ?? "N/A")}
                  eventHandlers={{
                    click: () => handleMarkerClick(delivery),
                  }}
                >
                  <Popup>
                    <div>
                      <strong>{delivery.description}</strong>
                      <br />
                      {t('client.pages.public.deliveries.totalPrice')}: {delivery.estimated_total_price ?? "N/A"} €
                    </div>
                  </Popup>
                </Marker>
              ))}
            {selectedDelivery && (
              <>
                <Marker
                  position={[
                    selectedDelivery.departure_location.coordinates[1],
                    selectedDelivery.departure_location.coordinates[0],
                  ]}
                  icon={departure}
                >
                  <Popup>{t('client.pages.public.deliveries.departure')}</Popup>
                </Marker>
                <Marker
                  position={[
                    selectedDelivery.arrival_location.coordinates[1],
                    selectedDelivery.arrival_location.coordinates[0],
                  ]}
                  icon={arrival}
                >
                  <Popup>{t('client.pages.public.deliveries.arrival')}</Popup>
                </Marker>
                <Polyline
                  positions={[
                    [
                      selectedDelivery.departure_location.coordinates[1],
                      selectedDelivery.departure_location.coordinates[0],
                    ],
                    [
                      selectedDelivery.arrival_location.coordinates[1],
                      selectedDelivery.arrival_location.coordinates[0],
                    ],
                  ]}
                  color="green"
                />
              </>
            )}
          </MapContainer>
          {selectedDelivery && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background p-4 shadow-md z-10 max-w-md w-full rounded-lg">
          <Button
            onClick={handleResetView}
            className="absolute top-2 right-2 p-2 z-10 rounded-full h-8 w-8"
            variant="ghost"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center w-full">
            <div className="w-36 h-24 rounded mr-4 flex-shrink-0 flex items-center justify-center">
              {selectedDelivery.image ? (
                <img
                  src={selectedDelivery.image || "/placeholder.svg"}
                  alt="Delivery"
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <></>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <h3 className="text-xl font-bold">{selectedDelivery.description}</h3>
              <p>
                {t("client.pages.public.deliveries.cityToCity", {
                  departureCity: selectedDelivery.departure_city,
                  arrivalCity: selectedDelivery.arrival_city,
                })}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge>{selectedDelivery.estimated_total_price ?? "N/A"} €</Badge>
                <Badge>{selectedDelivery.weight}</Badge>
                <Badge>
                  {selectedDelivery.urgent
                    ? t("client.pages.public.deliveries.urgent")
                    : t("client.pages.public.deliveries.nonUrgent")}
                </Badge>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <Button onClick={() => navigate(`/deliveries/${selectedDelivery.shipment_id}`)}>Détails</Button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default DeliveriesPage;
