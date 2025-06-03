import { format } from "date-fns"
import { fr } from "date-fns/locale"


export function formatDateTime(dateString: string, timeString: string): string {
  if (!dateString || !timeString) return ""

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ""

  const formattedDate = format(date, "PPP", { locale: fr })
  return `${formattedDate} à ${timeString}`
}


export function combineDateAndTime(dateString: string, timeString: string): Date | null {
  if (!dateString || !timeString) return null

  const [year, month, day] = dateString.split("-").map(Number)
  const [hours, minutes, seconds = 0] = timeString.split(":").map(Number)

  const date = new Date(year, month - 1, day, hours, minutes, seconds)
  return isNaN(date.getTime()) ? null : date
}


export function extractDateAndTime(date: Date): { dateString: string; timeString: string } {
  const dateString = format(date, "yyyy-MM-dd")
  const timeString = format(date, "HH:mm")

  return { dateString, timeString }
}
