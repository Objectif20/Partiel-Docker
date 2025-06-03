"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"
import { BarcodeScanner } from "@/components/barcodeScanner"
import { DeliveriesAPI } from "@/api/deliveries.api"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { CancelDeliveryDialog } from "./cancel-delivery-dialog"
import { Button } from "@/components/ui/button"

type DeliveryProps = {
  delivery: {
    id: string
    from: string
    to: string
    status: string
    pickupDate: string | null
    estimatedDeliveryDate: string | null
    coordinates: {
      origin: [number, number]
      destination: [number, number]
    }
    progress: number
  }
  onUpdate: () => void
}

export default function DeliveryCard({ delivery, onUpdate }: DeliveryProps) {
  const { t } = useTranslation()
  const [isMounted, setIsMounted] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [otpCode, setOtpCode] = useState<string>("")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleScanResult = (code: string) => {
    setScannedCode(code)
    setShowScanner(false)
  }

  const handleTakeDelivery = async () => {
    if (scannedCode) {
      try {
        await DeliveriesAPI.takeDeliveryPackage(delivery.id, scannedCode)
        onUpdate()
      } catch (error) {
        console.error("Error taking delivery package:", error)
      }
    }
  }

  const handleFinishDelivery = async () => {
    try {
      await DeliveriesAPI.finishedDelivery(delivery.id)
      onUpdate()
    } catch (error) {
      console.error("Error finishing delivery:", error)
    }
  }

  const handleValidateDelivery = async () => {
    try {
      await DeliveriesAPI.validateDeliveryWithCode(delivery.id, otpCode)
      onUpdate()
    } catch (error) {
      console.error("Error validating delivery:", error)
    }
  }

  const handleCancelDelivery = async (deliveryId: string) => {
    try {
      // Here you would call your API to cancel the delivery
      // For example: await DeliveriesAPI.cancelDelivery(deliveryId);
      console.log("Delivery cancelled:", deliveryId)
      onUpdate()
    } catch (error) {
      console.error("Error cancelling delivery:", error)
    }
  }

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "En cours de livraison":
        return "bg-primary/20 text-primary hover:bg-primary/20"
      case "En transit":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100"
      case "En préparation":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }
  }

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold">
            {t("client.pages.office.deliveryman.ongoingDeliveries.deliveryId", {
              id: delivery.id,
            })}
          </CardTitle>
        </div>
        <Badge variant="outline" className={`${getBadgeColor(delivery.status)} px-4 py-1.5 rounded-full`}>
          {t("client.pages.office.deliveryman.ongoingDeliveries.pending")}
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative w-full h-[300px] overflow-hidden rounded-md">
          {isMounted && (
            <MapContainer
              center={delivery.coordinates.destination}
              zoom={6}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={delivery.coordinates.origin}>
                <Popup>
                  {t("client.pages.office.deliveryman.ongoingDeliveries.departure")} {delivery.from}
                </Popup>
              </Marker>
              <Marker position={delivery.coordinates.destination}>
                <Popup>
                  {t("client.pages.office.deliveryman.ongoingDeliveries.arrival")} {delivery.to}
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-col space-y-6">
            <div className="relative w-full h-4">
              <div className="h-1 bg-background w-full rounded-full"></div>
              <div
                className="h-1 bg-primary rounded-full absolute top-0 left-0 transition-all duration-500"
                style={{ width: `33%` }}
              ></div>
              <div
                className="absolute transform -translate-y-1/2 bg-background p-1 rounded-full border-2 border-primary"
                style={{ left: `33%` }}
              >
                <Truck className="h-4 w-4 text-primary" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex flex-col items-start">
                <span className="text-xl font-semibold">{delivery.from}</span>
                <div className="flex items-center mt-2">
                  <div className="bg-primary w-4 h-4 rounded-full"></div>
                  <div className="text-sm text-foreground ml-2">
                    {t("client.pages.office.deliveryman.ongoingDeliveries.packageTransmitted")}
                    <div className="font-semibold">{delivery.pickupDate || "N/A"}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xl font-semibold">{delivery.to}</span>
                <div className="flex items-center mt-2 justify-end">
                  <div className="text-sm text-foreground mr-2 text-right">
                    {t("client.pages.office.deliveryman.ongoingDeliveries.estimatedArrivalDate")}
                    <div className="font-semibold">{delivery.estimatedDeliveryDate || "N/A"}</div>
                  </div>
                  <div className="bg-foreground w-4 h-4 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {delivery.status === "pending" && (
            <div className="mt-8">
              {!showScanner ? (
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setShowScanner(true)} >
                    📦 {t("client.pages.office.deliveryman.ongoingDeliveries.scanPackage")}
                  </Button>
                  <CancelDeliveryDialog deliveryId={delivery.id} onCancel={handleCancelDelivery} />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 mt-4">
                  <BarcodeScanner onResult={handleScanResult} />
                  <Button onClick={() => setShowScanner(false)} variant={"destructive"}>
                    ❌ {t("client.pages.office.deliveryman.ongoingDeliveries.cancelScan")}
                  </Button>
                </div>
              )}
              {scannedCode && (
                <div className="mt-2">
                  <p className="font-medium">✅ {t("client.pages.office.deliveryman.ongoingDeliveries.codeScanned")} {scannedCode}</p>
                  <Button onClick={handleTakeDelivery} >
                    {t("client.pages.office.deliveryman.ongoingDeliveries.takePackage")}
                  </Button>
                </div>
              )}
            </div>
          )}

          {delivery.status === "taken" && (
            <div className="mt-8 flex flex-wrap gap-2">
              <Button onClick={handleFinishDelivery}>
                {t("client.pages.office.deliveryman.ongoingDeliveries.finishDelivery")}
              </Button>
              <CancelDeliveryDialog deliveryId={delivery.id} onCancel={handleCancelDelivery} />
            </div>
          )}

          {delivery.status === "finished" && (
            <div className="mt-8">
              <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button onClick={handleValidateDelivery}>
                  {t("client.pages.office.deliveryman.ongoingDeliveries.validateDelivery")}
                </Button>
                <CancelDeliveryDialog deliveryId={delivery.id} onCancel={handleCancelDelivery} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
