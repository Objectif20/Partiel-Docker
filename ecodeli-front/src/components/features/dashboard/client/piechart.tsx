"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Cell } from "recharts"

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
import { DashboardApi, packages } from "@/api/dashboard.api"

const chartColors: Record<string, string> = {
  S: "hsl(var(--chart-1))",
  M: "hsl(var(--chart-2))",
  L: "hsl(var(--chart-3))",
  XL: "hsl(var(--chart-4))",
  XXL: "hsl(var(--chart-5))",
}

const chartConfig: ChartConfig = {
  packages: { label: "Packages" },
  S: { label: "S", color: chartColors.S },
  M: { label: "M", color: chartColors.M },
  L: { label: "L", color: chartColors.L },
  XL: { label: "XL", color: chartColors.XL },
  XXL: { label: "XXL", color: chartColors.XXL },
}

export function PackageStats() {
  const [data, setData] = React.useState<packages[]>([])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DashboardApi.getPackages()
        setData(res)
      } catch (err) {
        console.error("Erreur de chargement des colis:", err)
      }
    }
    fetchData()
  }, [])

  const totalPackages = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.packages, 0),
    [data]
  )

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Graphique en anneau - Colis envoyés</CardTitle>
        <CardDescription>Janvier - Juin 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="packages"
              nameKey="size"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[entry.size] || "hsl(var(--chart-fallback))"}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalPackages.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Colis
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          En hausse de 5.2% ce mois-ci <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage du nombre total de colis envoyés pour les 6 derniers mois
        </div>
      </CardFooter>
    </Card>
  )
}
