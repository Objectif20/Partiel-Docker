"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Map, Package, Euro, Weight, AlertCircle, Landmark, Calendar,
  Truck, Clock, ShoppingCart
} from "lucide-react"
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { DeliveriesAPI, DeliveryDetailsPage } from "@/api/deliveries.api"
import { useParams } from "react-router-dom"

const markerIcon = new L.Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function DeliveryDetails() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {id} = useParams()
  const deliveryId = id ? id : null

  const [delivery, setDelivery] = useState<DeliveryDetailsPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t("client.pages.office.delivery.details.breadcrumb.home"),
          t("client.pages.office.delivery.details.breadcrumb.deliveries"),
          t("client.pages.office.delivery.details.breadcrumb.deliveryDetails"),
        ],
        links: ["/office/dashboard", "/office/deliveries"],
      })
    )
  }, [dispatch, t])

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const data = await DeliveriesAPI.getDeliveryDetails(deliveryId as string)
        setDelivery(data)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (deliveryId) {
      fetchDelivery()
    }
  }, [deliveryId])

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "Inconnu";
    }
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Inconnu";
    }
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 hover:bg-amber-100 text-amber-800 border-amber-200"
      case "finished":
        return "bg-green-100 hover:bg-green-100 text-green-800 border-green-200"
      case "validated":
        return "bg-blue-100 hover:bg-blue-100 text-blue-800 border-blue-200"
      case "taken":
        return "bg-purple-100 hover:bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 hover:bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) return <p>Chargement...</p>
  if (error || !delivery) return <p>Erreur lors du chargement de la livraison.</p>

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Détails de la livraison</h1>
          <p className="text-muted-foreground mt-1">
            {delivery.departure.city} → {delivery.arrival.city}
          </p>
        </div>
        <Badge className={`px-3 py-1.5 text-sm font-medium ${getStatusColor(delivery.status)}`}>
          {delivery.status === "pending" && t("client.pages.office.delivery.details.status.pending")}
          {delivery.status === "finished" && t("client.pages.office.delivery.details.status.finished")}
          {delivery.status === "validated" && t("client.pages.office.delivery.details.status.validated")}
          {delivery.status === "taken" && t("client.pages.office.delivery.details.status.taken")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Itinéraire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] rounded-md overflow-hidden">
              <MapContainer center={[46.2, 4.5]} zoom={6} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={delivery.departure.coordinates as L.LatLngTuple} icon={markerIcon}>
                  <Popup>Départ : {delivery.departure.city}</Popup>
                </Marker>
                <Marker position={delivery.arrival.coordinates as L.LatLngTuple} icon={markerIcon}>
                  <Popup>Arrivée : {delivery.arrival.city}</Popup>
                </Marker>
                <Polyline
                  positions={[
                    delivery.departure.coordinates as L.LatLngTuple,
                    delivery.arrival.coordinates as L.LatLngTuple,
                  ]}
                  color="#4CAF50"
                  weight={4}
                />
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Informations de livraison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Landmark className="h-4 w-4" />
                  <span>Départ</span>
                </div>
                <span className="font-medium">{delivery.departure.city}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Landmark className="h-4 w-4" />
                  <span>Arrivée</span>
                </div>
                <span className="font-medium">{delivery.arrival.city}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Date de départ</span>
                </div>
                <span className="font-medium">{formatDate(delivery.departure_date)}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Date d'arrivée</span>
                </div>
                <span className="font-medium">{formatDate(delivery.arrival_date)}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Euro className="h-4 w-4" />
                  <span>Prix total</span>
                </div>
                <span className="font-medium">{delivery.total_price} €</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Lâcher de chariot</span>
                </div>
                <span className={`font-medium ${delivery.cart_dropped ? "text-green-600" : "text-red-500"}`}>
                  {delivery.cart_dropped ? "Oui" : "Non"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Colis ({delivery.packages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {delivery.packages.map((item) => (
              <Card key={item.id} className="overflow-hidden border shadow-sm">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={item.picture[0] || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-3">{item.name}</h3>

                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Euro className="h-4 w-4" />
                      <span>Prix</span>
                    </div>
                    <span className="text-right font-medium">{item.estimated_price} €</span>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Weight className="h-4 w-4" />
                      <span>Poids</span>
                    </div>
                    <span className="text-right font-medium">{item.weight} kg</span>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Volume</span>
                    </div>
                    <span className="text-right font-medium">{item.volume} m³</span>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span>Fragile</span>
                    </div>
                    <span className={`text-right font-medium ${item.fragility ? "text-red-500" : "text-green-600"}`}>
                      {item.fragility ? "Oui" : "Non"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
