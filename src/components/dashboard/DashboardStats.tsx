"use client"

import { useBoardStore } from "@/store/boardStore"
import { startOfMonth, startOfWeek } from "date-fns"
import { FileText, LayoutGrid, TrendingUp, Zap } from "lucide-react"

export function DashboardStats() {
  const boards = useBoardStore((s) => s.boards)
  const isLoading = useBoardStore((s) => s.isLoading)

  const now = new Date()
  const total = boards.length
  const thisMonth = boards.filter((b) => new Date(b.created_at) >= startOfMonth(now)).length
  const thisWeek = boards.filter(
    (b) => new Date(b.created_at) >= startOfWeek(now, { weekStartsOn: 1 })
  ).length
  const withDescription = boards.filter(
    (b) => b.description && b.description.trim().length > 0
  ).length

  const stats = [
    {
      label: "Всего досок",
      value: total,
      Icon: LayoutGrid,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      hint: total === 0 ? "Создайте первую" : `${total} активных`,
    },
    {
      label: "В этом месяце",
      value: thisMonth,
      Icon: TrendingUp,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      hint: thisMonth > 0 ? `+${thisMonth} новых` : "Нет новых",
    },
    {
      label: "На этой неделе",
      value: thisWeek,
      Icon: Zap,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      hint: thisWeek > 0 ? `+${thisWeek} создано` : "Нет новых",
    },
    {
      label: "С описанием",
      value: withDescription,
      Icon: FileText,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
      hint: total > 0 ? `${total - withDescription} без описания` : "Нет досок",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1,2,3,4].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card h-[92px] animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ label, value, Icon, iconBg, iconColor, hint }) => (
        <div
          key={label}
          className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 shadow-card hover:border-muted-foreground/20 hover:shadow-card-hover transition-[box-shadow,border-color] duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-[0.04em]">{label}</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
              <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
            </div>
          </div>
          <div>
            <p className="text-[26px] font-bold text-foreground tabular-nums leading-none">{value}</p>
            <p className="text-[11px] text-muted-foreground/60 mt-1.5">{hint}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
