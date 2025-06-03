"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import L from "leaflet"

import PackageIcon from "@/assets/illustrations/package.svg?url"
import { DashboardApi } from "@/api/dashboard.api"

export default function LastDelivery() {
  const [delivery, setDelivery] = useState<null | any>(null) 
  const [loading, setLoading] = useState(true)

  const customPackageIcon = new L.Icon({
    iconUrl: PackageIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  useEffect(() => {

    const fetchDelivery = async () => {
      try {
        const data = await DashboardApi.getLastDelivery()
        setDelivery(data.delivery)
      } catch (err) {
        console.error("Erreur lors de la récupération de la livraison :", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDelivery()
  }, [])

  if (loading) {
    return (
      <Card className="rounded-xl shadow-lg border bg-background">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold text-foreground">Chargement...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (!delivery) {
    return (
      <Card className="rounded-xl shadow-lg border bg-background">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold text-foreground">Aucune livraison en cours</CardTitle>
          <p className="text-foreground">Vous n'avez pas de livraison en cours.</p>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold">Votre dernière demande</CardTitle>
        </div>
        <Badge variant="outline" className="bg-primary/20 text-primary hover:bg-primary/20 px-4 py-1.5 rounded-full">
          {delivery.status}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full h-[300px] overflow-hidden rounded-md">
          {typeof window !== "undefined" && (
            <MapContainer
              center={delivery.coordinates.current as [number, number]}
              zoom={6}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={delivery.coordinates.origin as [number, number]} icon={customPackageIcon}>
                <Popup>Départ: {delivery.from}</Popup>
              </Marker>
              <Marker position={delivery.coordinates.destination as [number, number]} icon={customPackageIcon}>
                <Popup>Arrivée: {delivery.to}</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center">
              <p className="text-foreground font-medium">ID : </p>
              <span className="text-primary font-semibold ml-2">{delivery.id}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start">
                <span className="text-xl font-semibold">{delivery.from}</span>
                <div className="flex items-center mt-2">
                  <div className="bg-primary w-4 h-4 rounded-full"></div>
                  <div className="text-sm text-foreground ml-2">
                    Colis transmis
                    <div className="font-semibold">{delivery.pickupDate}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className="h-1 w-full absolute top-1/2 transform -translate-y-1/2"></div>
                <div className="h-1 bg-primary w-1/2 absolute top-1/2 transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background p-1 rounded-full border-2 border-primary">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xl font-semibold">{delivery.to}</span>
                <div className="flex items-center mt-2 justify-end">
                  <div className="text-sm text-foreground mr-2 text-right">
                    Date d'arrivée estimée :<div className="font-semibold">{delivery.estimatedDeliveryDate}</div>
                  </div>
                  <div className=" w-4 h-4 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
