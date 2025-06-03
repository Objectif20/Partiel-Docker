import { Calendar } from "@/components/ui/calendar"
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import { useState } from "react"

interface DatePickerProps {
  onDateChange: (newDate: Date | undefined) => void;
  onMonthChange: (newMonth: Date | undefined) => void;
}

export function DatePicker({ onDateChange, onMonthChange }: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    onDateChange(newDate)
  }

  const handleMonthChange = (newMonth: Date | undefined) => {
    onMonthChange(newMonth)
  }

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]"
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          onMonthChange={handleMonthChange}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
