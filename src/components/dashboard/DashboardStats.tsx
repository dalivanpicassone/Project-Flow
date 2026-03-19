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
  const withDescription = boards.filter((b) => b.description && b.description.trim().length > 0).length

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
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card h-[88px] animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ label, value, Icon, iconBg, iconColor, hint }) => (
        <div
          key={label}
          className="rounded-xl border border-[#1a1a24] bg-[#111118] p-4 flex flex-col gap-3 transition-colors hover:border-white/[0.1]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
              <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
