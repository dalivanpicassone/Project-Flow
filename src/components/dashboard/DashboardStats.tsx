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
      hint: total === 0 ? "Создайте первую" : `${total} активных`,
    },
    {
      label: "В этом месяце",
      value: thisMonth,
      Icon: TrendingUp,
      hint: thisMonth > 0 ? `+${thisMonth} новых` : "Нет новых",
    },
    {
      label: "На этой неделе",
      value: thisWeek,
      Icon: Zap,
      hint: thisWeek > 0 ? `+${thisWeek} создано` : "Нет новых",
    },
    {
      label: "С описанием",
      value: withDescription,
      Icon: FileText,
      hint: total > 0 ? `${total - withDescription} без описания` : "Нет досок",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl h-[88px] animate-pulse bg-[#f6f5f4]"
            style={{ border: "1px solid rgba(0,0,0,0.08)" }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ label, value, Icon, hint }) => (
        <div
          key={label}
          className="rounded-xl bg-white p-4 flex flex-col gap-3 transition-[box-shadow] duration-150 hover:shadow-card-hover"
          style={{
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#a39e98] uppercase tracking-[0.05em]">
              {label}
            </span>
            <Icon className="h-3.5 w-3.5 text-[#a39e98]" />
          </div>
          <div>
            <p className="text-[26px] font-bold text-foreground tabular-nums leading-none tracking-[-0.02em]">
              {value}
            </p>
            <p className="text-[11px] text-[#a39e98] mt-1.5">{hint}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
