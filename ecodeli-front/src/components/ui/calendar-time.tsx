"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { fr } from "date-fns/locale";

interface DateTimePickerProps {
  onDateTimeChange: (date: Date | null, time: string | null) => void;
}

export default function DateTimePicker({ onDateTimeChange }: DateTimePickerProps) {
  const today = new Date();
  const [date, setDate] = useState<Date>(today);
  const [time, setTime] = useState<string | null>(null);

  const timeSlots = [
    { time: "00:00", available: true },
    { time: "00:30", available: true },
    { time: "01:00", available: true },
    { time: "01:30", available: true },
    { time: "02:00", available: true },
    { time: "02:30", available: true },
    { time: "03:00", available: true },
    { time: "03:30", available: true },
    { time: "04:00", available: true },
    { time: "04:30", available: true },
    { time: "05:00", available: true },
    { time: "05:30", available: true },
    { time: "06:00", available: true },
    { time: "06:30", available: true },
    { time: "07:00", available: true },
    { time: "07:30", available: true },
    { time: "08:00", available: true },
    { time: "08:30", available: true },
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: true },
    { time: "12:00", available: true },
    { time: "12:30", available: true },
    { time: "13:00", available: true },
    { time: "13:30", available: true },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: true },
    { time: "16:00", available: true },
    { time: "16:30", available: true },
    { time: "17:00", available: true },
    { time: "17:30", available: true },
    { time: "18:00", available: true },
    { time: "18:30", available: true },
    { time: "19:00", available: true },
    { time: "19:30", available: true },
    { time: "20:00", available: true },
    { time: "20:30", available: true },
    { time: "21:00", available: true },
    { time: "21:30", available: true },
    { time: "22:00", available: true },
    { time: "22:30", available: true },
    { time: "23:00", available: true },
    { time: "23:30", available: true },
  ];

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setTime(null);
      onDateTimeChange(newDate, null);
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    onDateTimeChange(date, newTime);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
            <span>
              {format(date, "PPP", { locale: fr })}
              {time && `, ${time}`}
            </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex flex-col sm:flex-row">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            disabled={[{ before: today }]}
            className="p-2 sm:pe-5 border-r"
          />
          <div className="relative w-full sm:w-40">
            <div className="absolute inset-0 py-4">
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  <div className="flex h-5 shrink-0 items-center px-5">
                <p className="text-sm font-medium">{format(date, "EEEE d MMMM", { locale: fr }).charAt(0).toUpperCase() + format(date, "EEEE d MMMM", { locale: fr }).slice(1)}</p>
                  </div>
                  <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                    {timeSlots.map(({ time: timeSlot, available }) => (
                      <Button
                        key={timeSlot}
                        variant={time === timeSlot ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                        onClick={() => handleTimeChange(timeSlot)}
                        disabled={!available}
                      >
                        {timeSlot}
                      </Button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
