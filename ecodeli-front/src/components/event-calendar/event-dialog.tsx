import { useEffect, useState } from "react";
import { format } from "date-fns";

import type { CalendarEvent } from "@/components/event-calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { fr } from "date-fns/locale";

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDialog({ event, isOpen, onClose }: EventDialogProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (event) {
      setStartDate(new Date(event.start));
      setEndDate(new Date(event.end));
    }
  }, [event]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event?.id ? "Détails de l'événement" : "Aucun événement sélectionné"}</DialogTitle>
          <DialogDescription className="sr-only">
            {event?.id ? "Voir les détails de cet événement" : "Aucun événement sélectionné"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="*:not-first:mt-1.5">
            <Label>Titre</Label>
            <p>{event?.title || "(aucun titre)"}</p>
          </div>

          <div className="*:not-first:mt-1.5">
            <Label>Description</Label>
            <p>{event?.description || "(aucune description)"}</p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 *:not-first:mt-1.5">
              <Label>Date de début</Label>
              <p>{startDate ? format(startDate, "PPP", { locale: fr }) : "Aucune date de début"}</p>
            </div>

            <div className="min-w-28 *:not-first:mt-1.5">
              <Label>Heure de début</Label>
              <p>{startDate ? format(startDate, "H:mm", { locale: fr }) : "Aucune heure de début"}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 *:not-first:mt-1.5">
              <Label>Date de fin</Label>
              <p>{endDate ? format(endDate, "PPP", { locale: fr }) : "Aucune date de fin"}</p>
            </div>

            <div className="min-w-28 *:not-first:mt-1.5">
              <Label>Heure de fin</Label>
              <p>{endDate ? format(endDate, "H:mm", { locale: fr }) : "Aucune heure de fin"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label>Toute la journée</Label>
            <p>{event?.allDay ? "Oui" : "Non"}</p>
          </div>

          <div className="*:not-first:mt-1.5">
            <Label>Lieu</Label>
            <p>{event?.location || "(aucun lieu)"}</p>
          </div>
        </div>
        <DialogFooter className="flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
