import { format, isPast, isToday, isValid } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarClock } from "lucide-react"

export function DueDateBadge({ dueDate }: { dueDate: string }) {
  const date = new Date(dueDate)
  if (!isValid(date)) return null

  const overdue = isPast(date) && !isToday(date)
  const dueToday = isToday(date)

  const style = overdue
    ? { color: "#d44c47" }
    : dueToday
      ? { color: "#cb912f" }
      : { color: "#a39e98" }

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium"
      style={style}
    >
      <CalendarClock className="h-3 w-3 shrink-0" />
      {format(date, "d MMM", { locale: ru })}
    </span>
  )
}
