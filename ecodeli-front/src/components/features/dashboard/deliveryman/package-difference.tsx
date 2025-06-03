"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { DashboardApi, clientStats as client } from "@/api/dashboard.api"


export function DeliveryDistribution() {
  const [clientStats, setClientStats] = React.useState<client | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchClientStats = async () => {
      try {
        const data = await DashboardApi.getClientStats()
        setClientStats(data[0])
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques client:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchClientStats()
  }, [])

  if (loading) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>Répartition des Colis Livrés - Par Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chargement...</p>
        </CardContent>
      </Card>
    )
  }

  if (!clientStats) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>Répartition des Colis Livrés - Par Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Aucune donnée disponible.</p>
        </CardContent>
      </Card>
    )
  }

  const totalVisitors = clientStats.merchant + clientStats.client

  const chartData = [
    {
      month: "Janvier",
      merchant: clientStats.merchant,
      client: clientStats.client,
    },
  ]

  const chartConfig = {
    merchant: {
      label: "Commerçant",
      color: "hsl(var(--chart-1))",
    },
    client: {
      label: "Particulier",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Répartition des Colis Livrés - Par Profil</CardTitle>
        <CardDescription>Répartition des livraisons entre commerçants et particuliers</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Visiteurs
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="merchant"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-merchant)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="client"
              fill="var(--color-client)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          En hausse de 5.2% ce mois-ci <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage des visiteurs totaux pour les 6 derniers mois
        </div>
      </CardFooter>
    </Card>
  )
}
