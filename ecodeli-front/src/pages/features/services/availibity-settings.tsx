"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash, Clock, Calendar } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Availability, ProfileAPI } from "@/api/profile.api"
import { TimePickerInput } from "@/components/ui/time-picker-input"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"


const timeStringToDate = (time: string): Date => {
  const [hours, minutes, seconds] = time.split(":").map(Number)
  const date = new Date()
  date.setHours(hours)
  date.setMinutes(minutes)
  date.setSeconds(seconds || 0)
  date.setMilliseconds(0)
  return date
}

const AvailabilitySettings: React.FC = () => {
  const { t } = useTranslation()
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const dayLabels = [t("client.pages.office.settings.contactDetails.days.0"), t("client.pages.office.settings.contactDetails.days.1"), t("client.pages.office.settings.contactDetails.days.2"), t("client.pages.office.settings.contactDetails.days.3"), t("client.pages.office.settings.contactDetails.days.4"), t("client.pages.office.settings.contactDetails.days.5"), t("client.pages.office.settings.contactDetails.days.6")]


  useEffect(() => {
    const fetchAvailabilities = async () => {
      setIsLoading(true)
      try {
        const data = await ProfileAPI.getMyAvailability()
        setAvailabilities(data)
      } catch (error) {
        console.error("Erreur lors de la récupération des disponibilités", error)
        toast.error(t("client.pages.office.settings.contactDetails.errorFetchingAvailability"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailabilities()
  }, [t])

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.settings.contactDetails.breadCrumb_accueil"), t("client.pages.office.settings.contactDetails.breadCrumb_disponibility")],
        links: ["/office/dashboard"],
      }),
    )
  }, [dispatch])

  const handleTimeChange = (
    index: number,
    period: "morning" | "afternoon" | "evening",
    field: "start_time" | "end_time",
    date: Date | undefined,
  ) => {
    const updated = [...availabilities]
    const timeString = date ? date.toTimeString().slice(0, 5) : null
    updated[index][`${period}_${field}`] = timeString
    setAvailabilities(updated)
  }

  const handleDayChange = (index: number, day: number) => {
    const updated = [...availabilities]
    updated[index].day_of_week = day
    setAvailabilities(updated)
  }

  const handleAddDay = () => {
    const existingDays = availabilities.map((a) => a.day_of_week)
    const availableDays = [0, 1, 2, 3, 4, 5, 6].filter((day) => !existingDays.includes(day))

    if (availableDays.length > 0) {
      const newAvailability: Availability = {
        day_of_week: availableDays[0],
        morning: false,
        morning_start_time: null,
        morning_end_time: null,
        afternoon: false,
        afternoon_start_time: null,
        afternoon_end_time: null,
        evening: false,
        evening_start_time: null,
        evening_end_time: null,
      }
      setAvailabilities([...availabilities, newAvailability])
    } else {
      toast.success(t("client.pages.office.settings.contactDetails.allDaysSelected"))
    }
  }

  const handleRemoveDay = (index: number) => {
    const updated = [...availabilities]
    updated.splice(index, 1)
    setAvailabilities(updated)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await ProfileAPI.updateMyAvailability(availabilities)
      toast.success(t("client.pages.office.settings.contactDetails.availabilityUpdated"))
    } catch (error) {
      console.error("Erreur lors de la mise à jour des disponibilités", error)
      toast.error(t("client.pages.office.settings.contactDetails.errorUpdatingAvailability"))
    } finally {
      setIsLoading(false)
    }
  }

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "morning":
        return {
          label: t(`client.pages.office.settings.contactDetails.periods.morning`),
          icon: <Clock className="h-4 w-4 text-yellow-500" />,
        }
      case "afternoon":
        return {
          label: t(`client.pages.office.settings.contactDetails.periods.afternoon`),
          icon: <Clock className="h-4 w-4 text-orange-500" />,
        }
      case "evening":
        return {
          label: t(`client.pages.office.settings.contactDetails.periods.evening`),
          icon: <Clock className="h-4 w-4 text-purple-500" />,
        }
      default:
        return { label: period, icon: <Clock className="h-4 w-4" /> }
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-2xl font-semibold">
                {t("client.pages.office.settings.contactDetails.mySchedule")}
              </CardTitle>
            </div>
            <Button onClick={handleAddDay} className="transition-all hover:shadow-md" disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              {t("client.pages.office.settings.contactDetails.addDay")}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t(
              "client.pages.office.settings.contactDetails.scheduleDescription",
              "Définissez vos horaires de disponibilité pour chaque jour de la semaine",
            )}
          </p>
          <Separator className="mt-4" />
        </CardHeader>
      </Card>

      {availabilities.length === 0 && !isLoading ? (
        <Card className="border-dashed border-2 p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <Calendar className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">{t("client.pages.office.settings.contactDetails.noDisponibility")}</h3>
            <p className="text-sm text-muted-foreground max-w-md">
                {t("client.pages.office.settings.contactDetails.noDisponibility")}
            </p>
            <Button onClick={handleAddDay} className="mt-2">
              <Plus className="mr-2 h-4 w-4" />
              {t("client.pages.office.settings.contactDetails.addDay")}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-1">
          {availabilities.map((a, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="bg-muted/30 pb-3">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-2 py-1 bg-primary/10">
                      {t(`client.pages.office.settings.contactDetails.days.${a.day_of_week}`)}
                    </Badge>
                    <Select
                      value={String(a.day_of_week)}
                      onValueChange={(value) => handleDayChange(index, Number(value))}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder={t("client.pages.office.settings.contactDetails.selectDay")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{t("client.pages.office.settings.contactDetails.day")}</SelectLabel>
                          {dayLabels.map((_, dayIndex) => (
                            <SelectItem
                              key={dayIndex}
                              value={String(dayIndex)}
                              disabled={availabilities.some((av, i) => av.day_of_week === dayIndex && i !== index)}
                            >
                              {t(`client.pages.office.settings.contactDetails.days.${dayIndex}`)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveDay(index)}
                    disabled={isLoading}
                    className="h-8 px-3"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Supprimer</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-5">
                  {(["morning", "afternoon", "evening"] as const).map((period) => {
                    const { label, icon } = getPeriodLabel(period)
                    return (
                      <div key={period} className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          {icon}
                          <span className="font-medium text-sm">{label}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">
                              {t("client.pages.office.settings.contactDetails.startTime")}
                            </label>
                            <div className="flex items-end gap-2">
                              <TimePickerInput
                                picker="hours"
                                date={
                                  a[`${period}_start_time`]
                                    ? timeStringToDate(a[`${period}_start_time`] || "")
                                    : undefined
                                }
                                setDate={(date) => handleTimeChange(index, period, "start_time", date)}
                                disabled={isLoading}
                                className="border rounded-md"
                              />
                              <TimePickerInput
                                picker="minutes"
                                date={
                                  a[`${period}_start_time`]
                                    ? timeStringToDate(a[`${period}_start_time`] || "")
                                    : undefined
                                }
                                setDate={(date) => {
                                  const current = a[`${period}_start_time`]
                                    ? timeStringToDate(a[`${period}_start_time`] || "")
                                    : new Date()
                                  current.setMinutes(date?.getMinutes() || 0)
                                  handleTimeChange(index, period, "start_time", current)
                                }}
                                disabled={isLoading}
                                className="border rounded-md"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">
                              {t("client.pages.office.settings.contactDetails.endTime")}
                            </label>
                            <div className="flex items-end gap-2">
                              <TimePickerInput
                                picker="hours"
                                date={
                                  a[`${period}_end_time`] ? timeStringToDate(a[`${period}_end_time`] || "") : undefined
                                }
                                setDate={(date) => handleTimeChange(index, period, "end_time", date)}
                                disabled={isLoading}
                                className="border rounded-md"
                              />
                              <TimePickerInput
                                picker="minutes"
                                date={
                                  a[`${period}_end_time`] ? timeStringToDate(a[`${period}_end_time`] || "") : undefined
                                }
                                setDate={(date) => {
                                  const current = a[`${period}_end_time`]
                                    ? timeStringToDate(a[`${period}_end_time`] || "")
                                    : new Date()
                                  current.setMinutes(date?.getMinutes() || 0)
                                  handleTimeChange(index, period, "end_time", current)
                                }}
                                disabled={isLoading}
                                className="border rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                        {period !== "evening" && <Separator className="my-2" />}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {availabilities.length > 0 && (
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={isLoading} className="px-6 transition-all hover:shadow-md" size="lg">
            {isLoading ? t("client.pages.office.settings.contactDetails.loading") : t("client.pages.office.settings.contactDetails.save")}
          </Button>
        </div>
      )}
    </div>
  )
}

export default AvailabilitySettings
