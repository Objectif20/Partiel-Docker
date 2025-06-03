import { format, isBefore, isSameDay, parseISO, addMinutes, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ServiceApi } from "@/api/service.api";
import { Availability } from "@/api/profile.api";
import { toast } from "sonner";

interface Appointment {
  date: string;
  time: string;
  end: string;
}

interface ProviderDisponibilities {
  availabilities: Availability[];
  appointments: Appointment[];
}

interface TakeAppointmentProps {
  duration: number;
  service_id: string;
}

const mapFromJSWeekday = (jsDay: number): number => (jsDay + 6) % 7;

const timeStringToDate = (baseDate: Date, time: string | null): Date => {
  if (!time) throw new Error("Heure invalide.");
  const [hour, minute] = time.split(":");
  const date = new Date(baseDate);
  date.setHours(Number(hour), Number(minute), 0, 0);
  return date;
};

const generateSlots = (start: Date, end: Date, duration: number): Date[] => {
  const slots: Date[] = [];
  let current = new Date(start);
  while (addMinutes(current, duration) <= end) {
    slots.push(current);
    current = addMinutes(current, duration);
  }
  return slots;
};

const TakeAppointment: React.FC<TakeAppointmentProps> = ({ duration, service_id }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<Date | null>(null);
  const [providerData, setProviderData] = useState<Availability[]>([]);
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchProviderDisponibilites = async () => {
      try {
        const data: ProviderDisponibilities = await ServiceApi.getProviderDisponibilites(service_id);
        setProviderData(data.availabilities);
        setAppointmentsData(data.appointments);
      } catch (error) {
        console.error("Erreur lors de la récupération des disponibilités du fournisseur:", error);
      }
    };

    fetchProviderDisponibilites();
  }, [service_id]);

  const disabledDays = (day: Date): boolean => {
    const jsDay = day.getDay();
    const isPast = isBefore(day, startOfDay(new Date()));
    const provider = providerData.find(p => p.day_of_week === mapFromJSWeekday(jsDay));
    if (!provider || isPast) return true;

    const slots = computeAvailableSlots(day, provider, duration);
    return slots.length === 0;
  };

  const computeAvailableSlots = (selectedDate: Date, provider: Availability, duration: number): Date[] => {
    const allSlots: Date[] = [];

    const addSlots = (start: string | null, end: string | null) => {
      if (!start || !end) return;
      const from = timeStringToDate(selectedDate, start);
      const to = timeStringToDate(selectedDate, end);
      allSlots.push(...generateSlots(from, to, duration));
    };

    // Affiche les créneaux même si morning/afternoon/evening sont false mais que les heures sont présentes
    addSlots(provider.morning_start_time, provider.morning_end_time);
    addSlots(provider.afternoon_start_time, provider.afternoon_end_time);
    addSlots(provider.evening_start_time, provider.evening_end_time);

    const dayAppointments = appointmentsData
      .filter(app => isSameDay(parseISO(app.date), selectedDate))
      .map(app => ({
        start: timeStringToDate(selectedDate, app.time),
        end: timeStringToDate(selectedDate, app.end),
      }));

    return allSlots.filter(slot => {
      const end = addMinutes(slot, duration);
      return !dayAppointments.some(app =>
        (slot >= app.start && slot < app.end) ||
        (end > app.start && end <= app.end) ||
        (slot <= app.start && end >= app.end)
      );
    });
  };

  const selectedProvider = date
    ? providerData.find(p => p.day_of_week === mapFromJSWeekday(date.getDay()))
    : null;

  const availableSlots = date && selectedProvider
    ? computeAvailableSlots(date, selectedProvider, duration)
    : [];

  const handleReservation = async () => {
    if (date && time) {
      try {
        const appointmentDate = new Date(date);
        appointmentDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
        await ServiceApi.addAppointment(service_id, appointmentDate);
        toast.success("Rendez-vous réservé avec succès !");
      } catch (error) {
        toast.error("Erreur lors de la réservation du rendez-vous.");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full font-medium py-2">Prendre un rendez-vous</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Prendre un rendez-vous</DialogTitle>
          <DialogDescription>
            Choisissez une date et un créneau horaire
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={disabledDays}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>

          <div className="grid grid-cols-3 gap-2 px-2">
            {availableSlots.map(slot => (
              <Button
                key={slot.toISOString()}
                variant={time?.getTime() === slot.getTime() ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => setTime(slot)}
              >
                {format(slot, "HH:mm")}
              </Button>
            ))}
            {availableSlots.length === 0 && (
              <p className="col-span-3 text-center text-sm text-muted-foreground">
                Aucun créneau disponible
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleReservation} disabled={!date || !time}>
            Réserver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TakeAppointment;
