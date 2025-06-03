"use client"

import * as React from "react"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardApi, upcomingService as service } from "@/api/dashboard.api"

export default function NextServicesProvider() {
  const [upcomingServices, setUpcomingServices] = React.useState<service[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchUpcomingServices = async () => {
      try {
        const data = await DashboardApi.getUpcomingServices()
        setUpcomingServices(data)
      } catch (err) {
        console.error("Erreur lors du chargement des services à venir :", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUpcomingServices()
  }, [])

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Prochaines prestations à réaliser
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chargement...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Prochaines prestations à réaliser
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4">
          {upcomingServices.map((service) => (
            <div key={service.id} className="flex items-center gap-3 pb-3 border-b last:border-0">
              <Avatar>
                <AvatarImage src={service.client.avatar || "/placeholder.svg"} alt={service.client.name} />
                <AvatarFallback>{service.client.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{service.client.name}</p>
                <p className="text-sm text-muted-foreground truncate">{service.service}</p>
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap">{service.date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
