"use client"

import * as React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { DashboardApi, events as myEvents } from "@/api/dashboard.api"

export default function YourPlanning() {
  const [dateRange, setDateRange] = React.useState<Date | undefined>(undefined)
  const [events, setEvents] = React.useState<myEvents[]>([])

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await DashboardApi.getMyNextEvent()
        setEvents(fetchedEvents)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      }
    }

    fetchEvents()
  }, []) 

  const handleDateSelect = (date: Date | undefined) => {
    setDateRange(date)
  }

  const isEventDay = (date: Date) => {
    return events.some((event) => format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Votre planning</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-full overflow-auto">
        <div>
          <Calendar
            selected={dateRange}
            onSelect={handleDateSelect}
            mode="single"
            locale={fr}
            today={new Date()}
            numberOfMonths={1}
            modifiers={{
              eventDay: (date) => isEventDay(date),
            }}
            modifiersClassNames={{
              eventDay:
                "relative after:absolute after:w-2 after:h-2 after:bg-primary after:rounded-full after:bottom-1 after:left-1/2 after:-translate-x-1/2",
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
