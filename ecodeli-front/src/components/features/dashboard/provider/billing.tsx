"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DashboardApi, revenueData as revenue } from "@/api/dashboard.api"


export default function MonthlyRevenue() {
  const [revenueData, setRevenueData] = React.useState<revenue[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const data = await DashboardApi.getRevenueData()
        setRevenueData(data)
      } catch (err) {
        console.error("Erreur lors du chargement des revenus :", err)
      } finally {
        setLoading(false)
      }
    }
    fetchRevenueData()
  }, [])

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Vos revenus mensuels</CardTitle>
          <CardDescription>Chargement des données...</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Chargement...</p>
        </CardContent>
      </Card>
    )
  }

  const chartConfig = {
    particuliers: {
      label: "Particuliers",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Vos revenus mensuels</CardTitle>
        <CardDescription>Revenus des clients particuliers et commerçants</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={revenueData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="particuliers" fill="var(--color-particuliers)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          En hausse de 8.3% ce mois-ci <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage des revenus totaux pour les 6 derniers mois
        </div>
      </CardFooter>
    </Card>
  )
}
