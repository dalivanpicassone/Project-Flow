import { format, isPast, isToday, isValid } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarClock } from "lucide-react"

export function DueDateBadge({ dueDate }: { dueDate: string }) {
  const date = new Date(dueDate)
  if (!isValid(date)) return null
  const overdue = isPast(date) && !isToday(date)
  const dueToday = isToday(date)

  const colorClass = overdue
    ? "text-[oklch(0.65_0.2_25)]"
    : dueToday
      ? "text-[oklch(0.72_0.16_55)]"
      : "text-muted-foreground"

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${colorClass}`}>
      <CalendarClock className="h-3 w-3 shrink-0" />
      {format(date, "d MMM", { locale: ru })}
    </span>
  )
}
