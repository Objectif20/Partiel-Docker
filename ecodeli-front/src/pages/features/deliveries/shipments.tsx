"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, MessageCircleWarning, Package } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import { DeliveriesAPI, ShipmentListItem } from "@/api/deliveries.api"
import { RootState } from "@/redux/store"

export default function ShipmentsListPage() {
  const { t } = useTranslation();
  const [shipments, setShipments] = useState<ShipmentListItem[]>([])
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  const StatusBadge = ({ status, finished }: { status: string; finished: boolean }) => {
    if (finished) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t("client.pages.office.shipment.onGoing.status.finished")}</Badge>
    }

    switch (status) {
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{t("client.pages.office.shipment.onGoing.status.pending")}</Badge>
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{t("client.pages.office.shipment.onGoing.status.inProgress")}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? t("client.pages.office.shipment.onGoing.invalidDate") : format(date, "d MMM yyyy", { locale: fr });
  }

  const user = useSelector((state: RootState) => state.user.user);
  const isStripeValidate = user?.customer_stripe_id;

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.shipment.onGoing.breadcrumb.home"), t("client.pages.office.shipment.onGoing.breadcrumb.shipments")],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const data = await DeliveriesAPI.getMyCurrentShipmentsOffice();
        setShipments(data)
        setLoading(false)
      } catch (error) {
        console.error(t("client.pages.office.shipment.onGoing.errorFetching"), error)
        setLoading(false)
      }
    }

    fetchShipments()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t("client.pages.office.shipment.onGoing.title")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 flex justify-between">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("client.pages.office.shipment.onGoing.title")}</h1>
      {!isStripeValidate && (
          <div className="mb-4">
            <p className="text-sm flex items-center text-underline">
              <MessageCircleWarning className="mr-2" />
              {t("client.pages.office.shipment.onGoing.warningMessage")} &nbsp;
              <Link to="/office/subscriptions" className="underline text-sm text-primary">
                  {t("client.pages.office.shipment.onGoing.addBankDetails")}
                </Link>
            </p>
          </div>
        )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shipments.map((shipment) => (
          <Card key={shipment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-lg line-clamp-1">{shipment.name}</h2>
                  {shipment.urgent && (
                    <Badge variant="destructive" className="ml-2">
                      {t("client.pages.office.shipment.onGoing.urgent")}
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{t("client.pages.office.shipment.onGoing.from")}: {shipment.departure.city}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(shipment.departure_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{t("client.pages.office.shipment.onGoing.to")}: {shipment.arrival.city}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(shipment.arrival_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm">{shipment.packageCount} {t("client.pages.office.shipment.onGoing.packages")}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{t("client.pages.office.shipment.onGoing.progress")}</span>
                    <span>{shipment.progress}%</span>
                  </div>
                  <Progress value={shipment.progress} className="h-2" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-muted/50 p-4 flex justify-between">
              <StatusBadge status={shipment.status} finished={shipment.finished} />
              <Link to={`/office/shipments/${shipment.id}`}>
                <Button>{t("client.pages.office.shipment.onGoing.viewDetails")}</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
