import React, { useEffect, useMemo, useState } from "react";
import { RiCalendarCheckLine } from "@remixicon/react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { fr } from 'date-fns/locale';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  addHoursToDate,
  AgendaDaysToShow,
  AgendaView,
  CalendarEvent,
  CalendarView,
  DayView,
  EventDialog,
  EventGap,
  EventHeight,
  MonthView,
  WeekCellsHeight,
  WeekView,
} from "@/components/event-calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { useTranslation } from 'react-i18next';

export interface EventCalendarProps {
  events?: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  className?: string;
  initialView?: CalendarView;
  initialDate?: Date;
}

export function EventCalendar({
  events = [],
  className,
  initialView = "month",
  initialDate = new Date(),
}: EventCalendarProps) {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState<CalendarView>(initialView);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    setCurrentDate(initialDate);
  }, [initialDate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isEventDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "m":
          setView("month");
          break;
        case "w":
          setView("week");
          break;
        case "d":
          setView("day");
          break;
        case "a":
          setView("agenda");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEventDialogOpen]);

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === "agenda") {
      setCurrentDate(addDays(currentDate, -AgendaDaysToShow));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === "agenda") {
      setCurrentDate(addDays(currentDate, AgendaDaysToShow));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const getCleanView = (view : string) => {
    switch (view) {
      case "month":
        return t('client.pages.office.planning.EventCalendar.month');
      case "week":
        return t('client.pages.office.planning.EventCalendar.week');
      case "day":
        return t('client.pages.office.planning.EventCalendar.day');
      case "agenda":
        return t('client.pages.office.planning.EventCalendar.agenda');
      default:
        return "";
    }
  };

  const handleEventCreate = (startTime: Date) => {
    const minutes = startTime.getMinutes();
    const remainder = minutes % 15;
    if (remainder !== 0) {
      if (remainder < 7.5) {
        startTime.setMinutes(minutes - remainder);
      } else {
        startTime.setMinutes(minutes + (15 - remainder));
      }
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);
    }

    const newEvent: CalendarEvent = {
      id: "",
      title: "",
      start: startTime,
      end: addHoursToDate(startTime, 1),
      allDay: false,
    };
    setSelectedEvent(newEvent);
    setIsEventDialogOpen(true);
  };

  const capitalizeFirstLetter = (string : string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const viewTitle = useMemo(() => {
    if (view === "month") {
      return capitalizeFirstLetter(format(currentDate, "MMMM yyyy", { locale: fr }));
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      if (isSameMonth(start, end)) {
        return capitalizeFirstLetter(format(start, "MMMM yyyy", { locale: fr }));
      } else {
        return capitalizeFirstLetter(`${format(start, "MMM", { locale: fr })} - ${format(end, "MMM yyyy", { locale: fr })}`);
      }
    } else if (view === "day") {
      return format(currentDate, "d MMMM yyyy", { locale: fr });
    } else if (view === "agenda") {
      const start = currentDate;
      const end = addDays(currentDate, AgendaDaysToShow - 1);

      if (isSameMonth(start, end)) {
        return capitalizeFirstLetter(format(start, "MMMM yyyy", { locale: fr }));
      } else {
        return capitalizeFirstLetter(`${format(start, "MMM", { locale: fr })} - ${format(end, "MMM yyyy", { locale: fr })}`);
      }
    } else {
      return capitalizeFirstLetter(format(currentDate, "MMMM yyyy", { locale: fr }));
    }
  }, [currentDate, view]);

  return (
    <div
      className="flex flex-col border-r has-data-[slot=month-view]:flex-1"
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
          "--week-cells-height": `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <div className={cn("flex items-center justify-between p-2 sm:p-4", className)}>
        <div className="flex items-center gap-1 sm:gap-4">
          <Button variant="outline" className="aspect-square max-[479px]:p-0" onClick={handleToday}>
            <RiCalendarCheckLine className="min-[480px]:hidden" size={16} aria-hidden="true" />
            <span className="max-[479px]:sr-only">{t('client.pages.office.planning.EventCalendar.today')}</span>
          </Button>
          <div className="flex sm:hidden items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handlePrevious} aria-label={t('client.pages.office.planning.EventCalendar.previous')}>
              <ChevronLeftIcon size={16} aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNext} aria-label={t('client.pages.office.planning.EventCalendar.next')}>
              <ChevronRightIcon size={16} aria-hidden="true" />
            </Button>
          </div>
          <h2 className="text-sm font-semibold sm:text-lg md:text-xl">{viewTitle}</h2>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1.5 max-[479px]:h-8">
              <span>
                <span className="min-[480px]:hidden" aria-hidden="true">
                  {getCleanView(view).charAt(0).toUpperCase()}
                </span>
                <span className="max-[479px]:sr-only">
                  {getCleanView(view).charAt(0).toUpperCase() + getCleanView(view).slice(1)}
                </span>
              </span>
                <ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              <DropdownMenuItem onClick={() => setView("month")}>
                {t('client.pages.office.planning.EventCalendar.month')} <DropdownMenuShortcut>M</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("week")}>
                {t('client.pages.office.planning.EventCalendar.week')} <DropdownMenuShortcut>W</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("day")}>
                {t('client.pages.office.planning.EventCalendar.day')} <DropdownMenuShortcut>D</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("agenda")}>
                {t('client.pages.office.planning.EventCalendar.agenda')} <DropdownMenuShortcut>A</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {view === "month" ? (
          <MonthView
            currentDate={currentDate}
            events={events}
            onEventSelect={handleEventSelect}
            onEventCreate={handleEventCreate}
          />
        ) : (
          <ScrollArea className="h-[calc(100vh-12rem)] min-h-[300px] coucou">
            {view === "week" && (
              <WeekView
                currentDate={currentDate}
                events={events}
                onEventSelect={handleEventSelect}
                onEventCreate={handleEventCreate}
              />
            )}
            {view === "day" && (
              <DayView
                currentDate={currentDate}
                events={events}
                onEventSelect={handleEventSelect}
                onEventCreate={handleEventCreate}
              />
            )}
            {view === "agenda" && (
              <AgendaView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} />
            )}
          </ScrollArea>
        )}
      </div>

      <EventDialog
        event={selectedEvent}
        isOpen={isEventDialogOpen}
        onClose={() => {
          setIsEventDialogOpen(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
}
