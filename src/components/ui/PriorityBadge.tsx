import type { Priority } from "@/types/database"

const config: Record<Priority, { label: string; dotColor: string; textColor: string }> = {
  critical: {
    label: "Критично",
    dotColor: "bg-[oklch(0.65_0.2_25)]",
    textColor: "text-[oklch(0.65_0.2_25)]",
  },
  high: {
    label: "Высокий",
    dotColor: "bg-[oklch(0.72_0.16_55)]",
    textColor: "text-[oklch(0.72_0.16_55)]",
  },
  medium: {
    label: "Средний",
    dotColor: "bg-muted-foreground",
    textColor: "text-muted-foreground",
  },
  low: {
    label: "Низкий",
    dotColor: "bg-[oklch(0.68_0.14_145)]",
    textColor: "text-[oklch(0.68_0.14_145)]",
  },
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = config[priority]
  if (!cfg) return null
  const { label, dotColor, textColor } = cfg
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      {label}
    </span>
  )
}
