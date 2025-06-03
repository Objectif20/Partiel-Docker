"use client"

import { useEffect, useState } from "react"
import { MapPin, Sun, Cloud, CloudRain, CloudSnow } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardApi } from "@/api/dashboard.api"

export default function Meteo() {
  const [weather, setWeather] = useState<null | {
    city: string
    temperature: number
    condition: string
    date: Date
  }>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await DashboardApi.getWeather()
        setWeather({
          ...data,
          date: new Date(data.date),
        })
      } catch (error) {
        console.error("Erreur lors du chargement de la météo:", error)
      }
    }

    fetchWeather()
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-400" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-400" />
      case "snowy":
        return <CloudSnow className="h-8 w-8 text-blue-200" />
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  if (!weather) {
    return (
      <Card className="h-full flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Chargement...</span>
      </Card>
    )
  }

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(weather.date)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <span>Météo</span>
          <div className="flex items-center text-sm font-normal text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {weather.city}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm h-full pt-0">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-primary">{weather.temperature}°C</span>
          <span className="text-xs text-muted-foreground mt-1">{formattedDate}</span>
        </div>
        <div className="flex items-center justify-center">{getWeatherIcon(weather.condition)}</div>
      </CardContent>
    </Card>
  )
}
