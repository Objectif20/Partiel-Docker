"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, AlertTriangle, FileText } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import { DeliveriesAPI, ShipmentsDetailsOffice } from "@/api/deliveries.api"

export default function ShipmentsDetailsOfficePage() {
  const { t } = useTranslation();
  const [_, setActiveTab] = useState("overview")
  const [delivery, setDelivery] = useState<ShipmentsDetailsOffice | null>(null)
  const navigate = useNavigate()

  const dispatch = useDispatch();

  const { id } = useParams()

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.shipment.details.breadcrumb.home"), t("client.pages.office.shipment.details.breadcrumb.shipments"), t("client.pages.office.shipment.details.breadcrumb.details")],
        links: ["/office/dashboard", "/office/shipments"],
      })
    )

    const fetchDeliveryDetails = async () => {
      if (id) {
        try {
          const data = await DeliveriesAPI.getShipmentDetailsByIdOffice(id)
          setDelivery(data)
        } catch (error) {
          console.error(t("client.pages.office.shipment.details.errorFetching"))
        }
      } else {
        console.error(t("client.pages.office.shipment.details.missingId"))
      }
    }

    fetchDeliveryDetails()
  }, [dispatch, id])

  if (!id) return <div>{t("client.pages.office.shipment.details.missingId")}</div>
  if (!delivery) return <div>{t("client.pages.office.shipment.details.loading")}</div>

  const lastStep = delivery.steps[delivery.steps.length - 1]
  let progress = 0

  if (lastStep?.id === -1) {
    progress = 0
  } else if (lastStep?.id === 0 || lastStep?.id === 1000) {
    progress = 100
  } else if (lastStep?.id >= 1 && lastStep?.id <= 999) {
    const maxStepId = Math.max(
      ...delivery.steps.filter((step) => step.id >= 1 && step.id <= 999).map((step) => step.id),
    )
    const totalSteps = maxStepId + 1
    progress = (maxStepId / totalSteps) * 100
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr })
  }

  const totalPrice = delivery.details.price_with_step.reduce((sum, step) => sum + step.price, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Card className="border-none shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-foreground rounded-t-lg py-8">
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold flex items-center">
              {delivery.details.name}
              {delivery.details.urgent && <Badge className="ml-2 bg-red-500 text-white border-none">{t("client.pages.office.shipment.details.urgent")}</Badge>}
            </CardTitle>
            <CardDescription className="text-primary-foreground/90 mt-1">
              {t("client.pages.office.shipment.details.reference")} N°{delivery.details.id}
            </CardDescription>
            {(delivery.details.departure_date || delivery.details.arrival_date) && (
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-primary-foreground/80">
                {delivery.details.departure_date && (
                  <div className="flex items-center gap-2">
                    <span>{t("client.pages.office.shipment.details.departure")}:</span>
                    <span className="font-medium">
                      {formatDate(delivery.details.departure_date)}
                    </span>
                  </div>
                )}
                {delivery.details.arrival_date && (
                  <div className="flex items-center gap-2">
                    <span>{t("client.pages.office.shipment.details.arrival")}:</span>
                    <span className="font-medium">
                      {formatDate(delivery.details.arrival_date)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="relative pl-8 space-y-6">
                <div className="relative">
                  <div className="absolute left-[-29px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-background"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("client.pages.office.shipment.details.departure")}</p>
                    <h3 className="text-lg font-semibold">{delivery.details.departure.city}</h3>
                    <p className="text-sm text-foreground">{t("client.pages.office.shipment.details.collection")} {formatDate(delivery.details.departure_date)}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute left-[-29px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("client.pages.office.shipment.details.arrival")}</p>
                    <h3 className="text-lg font-semibold">{delivery.details.arrival.city}</h3>
                    <p className="text-sm text-foreground">
                      {t("client.pages.office.shipment.details.delivery")} {formatDate(delivery.details.arrival_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{t("client.pages.office.shipment.details.progress")}</span>
                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {lastStep?.id === -1
                    ? t("client.pages.office.shipment.details.noSteps")
                    : lastStep?.id === 0
                      ? t("client.pages.office.shipment.details.fullDelivery")
                      : lastStep?.id === 1000
                        ? t("client.pages.office.shipment.details.lastStep")
                        : `${delivery.steps.length} ${t("client.pages.office.shipment.details.steps")} ${delivery.steps.length > 1 ? "s" : ""} ${t("client.pages.office.shipment.details.on")} ${Math.max(...delivery.steps.filter((step) => step.id >= 1 && step.id <= 999).map((step) => step.id)) + 1}`}
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">{t("client.pages.office.shipment.details.totalPrice")}</span>
                  <span className="text-xl font-bold">{totalPrice} €</span>
                </div>
                <p className="text-sm text-foreground">{t("client.pages.office.shipment.details.initialPrice")}: {delivery.details.initial_price} €</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t("client.pages.office.shipment.details.viewInvoice")}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full mt-6">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">{t("client.pages.office.shipment.details.overview")}</TabsTrigger>
          <TabsTrigger value="packages">{t("client.pages.office.shipment.details.packages")} ({delivery.package.length})</TabsTrigger>
          {delivery.steps.some(step => step.id !== -1) && (
            <TabsTrigger value="steps">{t("client.pages.office.shipment.details.stepsTab")} ({delivery.steps.filter(step => step.id !== -1).length})</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t("client.pages.office.shipment.details.additionalInfo")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{delivery.details.complementary_info}</p>
              <Separator className="my-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("client.pages.office.shipment.details.deliveryStatus")}</h3>
                  <Card className="border-none shadow-md bg-gradient-to-br from-background to-muted">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border-2 border-primary shadow-md">
                          <AvatarImage
                            src={lastStep?.courier?.photoUrl || "/placeholder.svg"}
                            alt={lastStep?.courier?.name || t("client.pages.office.shipment.details.courier")}
                          />
                          <AvatarFallback>{lastStep?.courier?.name?.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{lastStep?.courier?.name || t("client.pages.office.shipment.details.courier")}</p>
                            <Badge
                              variant="outline"
                              className={delivery.details.urgent ? "bg-red-50 text-red-700 border-red-200" : "hidden"}
                            >
                              {t("client.pages.office.shipment.details.urgent")}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground mt-1">
                            {lastStep?.id === -1
                              ? t("client.pages.office.shipment.details.noSteps")
                              : lastStep?.id === 0
                                ? t("client.pages.office.shipment.details.fullDelivery")
                                : lastStep?.id === 1000
                                  ? t("client.pages.office.shipment.details.lastStep")
                                  : t("client.pages.office.shipment.details.partialDelivery")}
                          </p>
                          {lastStep?.date && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(lastStep?.date)}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("client.pages.office.shipment.details.packageOverview")}</h3>
                  <div className="space-y-3">
                    {delivery.package.slice(0, 2).map((pkg) => (
                      <div
                        key={pkg.id}
                        className="flex items-center gap-3 p-4 bg-background rounded-lg border border-muted shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="w-14 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={pkg.picture[0] || "/placeholder.svg"}
                            alt={pkg.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{pkg.name}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {pkg.weight} kg
                            </Badge>
                            {pkg.estimated_price > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {pkg.estimated_price} €
                              </Badge>
                            )}
                            {pkg.fragility && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" /> {t("client.pages.office.shipment.details.fragile")}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 mt-6">
                <h3 className="text-lg font-semibold mb-4">{t("client.pages.office.shipment.details.shippingDetails")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-5 border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">{t("client.pages.office.shipment.details.status")}</span>
                      <Badge
                        className={`w-fit mt-2 ${
                          delivery.details.status === "pending"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            : delivery.details.finished
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : ""
                        }`}
                      >
                        {delivery.details.status === "pending"
                          ? t("client.pages.office.shipment.details.pending")
                          : delivery.details.status === "In Progress"
                            ? t("client.pages.office.shipment.details.inProgress")
                            : delivery.details.finished
                              ? t("client.pages.office.shipment.details.finished")
                              : delivery.details.status}
                      </Badge>
                    </div>
                  </Card>
                  <Card className="p-5 border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">{t("client.pages.office.shipment.details.distance")}</span>
                      <span className="font-medium mt-2">
                        {Math.round(
                          Math.sqrt(
                            Math.pow(
                              delivery.details.departure.coordinates[0] - delivery.details.arrival.coordinates[0],
                              2,
                            ) +
                              Math.pow(
                                delivery.details.departure.coordinates[1] - delivery.details.arrival.coordinates[1],
                                2,
                              ),
                          ) * 111.32,
                        )}{" "}
                        km
                      </span>
                    </div>
                  </Card>
                  <Card className="p-5 border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">{t("client.pages.office.shipment.details.totalWeight")}</span>
                      <span className="font-medium mt-2">
                        {delivery.package.reduce((total, pkg) => total + pkg.weight, 0)} kg
                      </span>
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t("client.pages.office.shipment.details.packageDetails")}</CardTitle>
              <CardDescription>{delivery.package.length} {t("client.pages.office.shipment.details.packagesForDelivery")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {delivery.package.map((pkg) => (
                  <Card key={pkg.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <img
                        src={pkg.picture[0] || "/placeholder.svg"}
                        alt={pkg.name}
                        className="w-full md:w-1/4 h-48 object-cover"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold">{pkg.name}</h3>
                          {pkg.fragility && (
                            <Badge className="border-none">
                              <AlertTriangle className="w-3 h-3 mr-1" /> {t("client.pages.office.shipment.details.fragile")}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-foreground">{t("client.pages.office.shipment.details.weight")}</p>
                            <p className="font-medium">{pkg.weight} kg</p>
                          </div>
                          <div>
                            <p className="text-sm text-foreground">{t("client.pages.office.shipment.details.volume")}</p>
                            <p className="font-medium">{pkg.volume} m³</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="steps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t("client.pages.office.shipment.details.deliverySteps")}</CardTitle>
              <CardDescription>{t("client.pages.office.shipment.details.tracking")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 space-y-8">
                <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-blue-200"></div>

                {delivery.steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    <div
                      className={`absolute left-[-29px] top-0 w-6 h-6 rounded-full ${
                        index === delivery.steps.length - 1 ? "bg-primary" : "bg-primary bg-opacity-30"
                      } flex items-center justify-center`}
                    >
                      {index === delivery.steps.length - 1 ? (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      )}
                    </div>

                    <Card
                      className={`border ${index === delivery.steps.length - 1 ? "bg-secondary" : ""}`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{step.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {formatDate(step.date)}
                              </Badge>
                            </div>
                            <p className="text-sm mt-1">{step.description}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={step.courier.photoUrl || "/placeholder.svg"}
                                alt={step.courier.name}
                              />
                              <AvatarFallback>{step.courier.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{step.courier.name}</p>
                              <p className="text-xs">{t("client.pages.office.shipment.details.courier")}</p>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <div>
                              <p className="text-sm ">{t("client.pages.office.shipment.details.departure")}</p>
                              <p className="font-medium">{step.departure.city}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 " />
                            <div>
                              <p className="text-sm">{t("client.pages.office.shipment.details.arrival")}</p>
                              <p className="font-medium">{step.arrival.city}</p>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => navigate(`/office/deliveries/public/${step.idLink}`)}
                          className="mt-4"
                        >
                          {t("client.pages.office.shipment.details.viewDetails")}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
