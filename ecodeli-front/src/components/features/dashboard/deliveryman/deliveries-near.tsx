"use client"

import * as React from "react"
import { PackageSearch } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardApi, nearDeliveries } from "@/api/dashboard.api"


export default function NearDeliveries() {
  const [deliveries, setDeliveries] = React.useState<nearDeliveries | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchNearDeliveries = async () => {
      try {
        const data = await DashboardApi.getNearDeliveries()
        setDeliveries(data)
      } catch (err) {
        console.error("Erreur lors du chargement des livraisons proches :", err)
      } finally {
        setLoading(false)
      }
    }
    fetchNearDeliveries()
  }, [])

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-base font-medium">Colis près de chez vous</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chargement...</p>
        </CardContent>
      </Card>
    )
  }

  if (!deliveries) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-base font-medium">Colis près de chez vous</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Aucune livraison proche à afficher.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Colis près de chez vous</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm h-full pt-0">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-primary">{deliveries.count}</span>
        </div>
        <div className="flex items-center justify-center p-2 rounded-full">
          <PackageSearch className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}
