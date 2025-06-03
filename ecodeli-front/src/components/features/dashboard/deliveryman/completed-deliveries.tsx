"use client"

import * as React from "react"
import { Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardApi, finishedDelivery } from "@/api/dashboard.api"

export default function CompletedDeliveries() {
  const [deliveries, setDeliveries] = React.useState<finishedDelivery | null>(null)

  React.useEffect(() => {
    const fetchCompletedDeliveries = async () => {
      try {
        const data = await DashboardApi.getCompletedDeliveries()
        setDeliveries(data)
      } catch (error) {
        console.error("Erreur lors de la récupération des livraisons :", error)
      }
    }

    fetchCompletedDeliveries()
  }, [])

  if (!deliveries) {
    return <div>Chargement...</div> 
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Livraisons réalisées</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm h-full pt-0">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-primary">{deliveries.count}</span>
          <span className="text-xs text-muted-foreground mt-1">livraisons réalisées en {deliveries.period}</span>
        </div>
        <div className="flex items-center justify-center p-2 rounded-full">
          <Package className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}
