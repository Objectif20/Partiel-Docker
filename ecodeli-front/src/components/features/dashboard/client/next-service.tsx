"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { DashboardApi } from "@/api/dashboard.api"

interface NextService {
  title: string
  date: string
  image: string
}

export default function NextService() {
  const navigate = useNavigate()
  const [nextService, setNextService] = React.useState<NextService | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchNextService = async () => {
      try {
        const res = await DashboardApi.getNextServiceAsClient()
        setNextService(res)
      } catch (err) {
        console.error("Erreur lors du chargement de la prochaine prestation :", err)
        setNextService(null)
      } finally {
        setLoading(false)
      }
    }
    fetchNextService()
  }, [])

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-base font-medium">Prochaine prestation</CardTitle>
      </CardHeader>

      {loading ? (
        <CardContent>
          <p className="text-sm text-muted-foreground">Chargement en cours...</p>
        </CardContent>
      ) : nextService ? (
        <>
          <CardContent className="flex flex-col items-center gap-2">
            <div className="w-full overflow-hidden rounded-lg">
              <img
                src={nextService.image}
                alt="Photo prestation"
                width={300}
                height={400}
                className="w-full object-cover rounded-md"
              />
            </div>
            <div className="text-sm text-center">
              <p className="font-medium">{nextService.title}</p>
              <p className="text-muted-foreground text-xs">{nextService.date}</p>
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full" onClick={() => navigate("/office/planning")}>
              Accéder au planning
            </Button>
          </CardFooter>
        </>
      ) : (
        <>
          <CardContent>
            <p className="text-sm text-muted-foreground">Aucune prestation prévue.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate("/services")}>
              Découvrir les prestations
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
