"use client"

import * as React from "react"
import { MapPin, Package, Truck, Clock, Calendar, BarChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DashboardApi, NextDelivery as NextDeliveryProps } from "@/api/dashboard.api"

export default function NextDelivery() {
  const [delivery, setDelivery] = React.useState<NextDeliveryProps | null>(null)

  
  React.useEffect(() => {
    const fetchNextDelivery = async () => {
      try {
        const data = await DashboardApi.getNextDelivery()
        setDelivery(data)
      } catch (error) {
        console.error("Erreur lors de la récupération de la livraison :", error)
      }
    }

    fetchNextDelivery()
  }, [])

  if (!delivery) {
    return <div>Chargement...</div> 
  }

  const {
    origin,
    destination,
    date, 
    status,
    trackingNumber,
    carrier,
    weight,
    estimatedTime,
  } = delivery

  const parsedDate = new Date(date)
  
  if (isNaN(parsedDate.getTime())) {
    console.error("Date invalide reçue : ", date)
    return <div>Erreur de date.</div>
  }

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "wait":
        return "bg-gray-500"
      case "take":
        return "bg-yellow-500"
      case "going":
        return "bg-blue-500"
      case "finished":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="h-full border-2 border-primary/10 shadow-lg">
      <CardHeader className="pb-2 bg-primary/5 rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">Suivi de livraison</CardTitle>
          <Badge variant="outline" className="capitalize font-medium">
            <span className={`mr-2 w-2 h-2 rounded-full ${getStatusColor(status || "wait")}`}></span>
            {status === "wait" ? "En attente" : 
             status === "take" ? "Prise en charge" : 
             status === "going" ? "En cours de livraison" : 
             "Livraison terminée"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">N° de suivi:</span>
            <span className="text-sm font-medium">{trackingNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Transporteur:</span>
            <span className="text-sm font-medium">{carrier}</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Poids:</span>
            <span className="text-sm font-medium">{weight}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Délai estimé:</span>
            <span className="text-sm font-medium">{estimatedTime}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between w-full mt-4 relative">
          <div className="flex flex-col items-center z-10">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <span className="mt-2 font-medium">{origin}</span>
            <span className="text-xs text-muted-foreground">Départ</span>
          </div>

          <div className="absolute left-0 right-0 mx-auto w-3/4 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>

          <div className="absolute left-0 right-0 top-[27px] mx-auto flex justify-center">
            <div className="bg-background px-3 py-1 rounded-full border border-muted shadow-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs">{formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center z-10">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <span className="mt-2 font-medium">{destination}</span>
            <span className="text-xs text-muted-foreground">Arrivée</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
