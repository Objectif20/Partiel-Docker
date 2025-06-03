"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslation } from "react-i18next"
import { DeliveriesAPI } from "@/api/deliveries.api"

interface CancelDeliveryDialogProps {
  deliveryId: string
  onCancel: (deliveryId: string) => Promise<void>
}

export function CancelDeliveryDialog({ deliveryId, onCancel }: CancelDeliveryDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      const response = await DeliveriesAPI.cancelDelivery(deliveryId)
      if (response.status === 200) {
        await onCancel(deliveryId)
        setOpen(false)
      } else {
        console.error("Error cancelling delivery:", response.data)
      }
    } catch (error) {
      console.error("Error cancelling delivery:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          {t("client.components.deliveries.cancel", "Annuler")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("client.components.deliveries.cancelConfirmTitle", "Confirmer l'annulation")}</DialogTitle>
          <DialogDescription>
            {t(
              "client.components.deliveries.cancelConfirmDescription",
              "Êtes-vous sûr de vouloir annuler cette livraison ?",
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            {t("common.cancel", "Annuler")}
          </Button>
          <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
            {isLoading ? t("common.loading", "Chargement...") : t("common.confirm", "Confirmer")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
