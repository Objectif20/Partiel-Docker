"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardApi, AverageRating as rating } from "@/api/dashboard.api"


export default function AverageRating() {
  const [rating, setRating] = React.useState<rating | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const res = await DashboardApi.getAverageRating()
        setRating(res)
      } catch (err) {
        console.error("Erreur lors du chargement de la note moyenne :", err)
        setRating(null)
      } finally {
        setLoading(false)
      }
    }
    fetchAverageRating()
  }, [])

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Note moyenne</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chargement...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Note moyenne</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm h-full pt-0">
        <div className="flex flex-col">
          {rating ? (
            <>
              <span className="text-3xl font-bold text-primary">{rating.score}</span>
              <span className="text-xs text-muted-foreground mt-1">Moyenne des avis sur vous</span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">Note indisponible</span>
          )}
        </div>
        <div className="flex items-center justify-center bg-yellow-100 p-2 rounded-full">
          <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
        </div>
      </CardContent>
    </Card>
  )
}
