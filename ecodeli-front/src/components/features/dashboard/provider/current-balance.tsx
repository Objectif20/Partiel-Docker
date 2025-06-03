"use client"

import * as React from "react"
import { Euro } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardApi, CurrentBalance as Balance } from "@/api/dashboard.api"


export default function CurrentBalance() {
  const [balance, setBalance] = React.useState<Balance | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await DashboardApi.getCurrentBalance()
        setBalance(res)
      } catch (err) {
        console.error("Erreur lors du chargement du solde :", err)
        setBalance(null)
      } finally {
        setLoading(false)
      }
    }
    fetchBalance()
  }, [])

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Votre solde</CardTitle>
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
        <CardTitle className="text-base font-medium">Votre solde</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm h-full pt-0">
        <div className="flex flex-col">
          {balance ? (
            <>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-primary">{balance.amount}</span>
                <span className="text-xl font-bold text-primary ml-1">{balance.currency}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">actuellement dans votre solde</span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">Solde indisponible</span>
          )}
        </div>
        <div className="flex items-center justify-center p-2 rounded-full">
          <Euro className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}
