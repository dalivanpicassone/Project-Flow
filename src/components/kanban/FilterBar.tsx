"use client"

import { Button } from "@/components/ui/button"
import type { Priority } from "@/types/database"
import { AlertCircle, ArrowDown, ArrowUp, CalendarClock, Minus, Search, X } from "lucide-react"

export type DueDateFilter = "all" | "overdue" | "today" | "this-week" | "no-date"
export type PriorityFilter = Priority | "all"

export interface BoardFilters {
  search: string
  priority: PriorityFilter
  dueDate: DueDateFilter
}

export const DEFAULT_FILTERS: BoardFilters = {
  search: "",
  priority: "all",
  dueDate: "all",
}

export function isFilterActive(f: BoardFilters): boolean {
  return f.search !== "" || f.priority !== "all" || f.dueDate !== "all"
}

interface FilterBarProps {
  filters: BoardFilters
  onChange: (filters: BoardFilters) => void
}

const PRIORITY_BADGES: {
  value: Priority
  Icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
  activeRing: string
}[] = [
  { value: "critical", Icon: AlertCircle, label: "Критично", color: "text-[oklch(0.65_0.2_25)]", activeRing: "ring-[oklch(0.65_0.2_25_/_40%)] bg-[oklch(0.65_0.2_25_/_10%)]" },
  { value: "high", Icon: ArrowUp, label: "Высокий", color: "text-[oklch(0.72_0.16_55)]", activeRing: "ring-[oklch(0.72_0.16_55_/_40%)] bg-[oklch(0.72_0.16_55_/_10%)]" },
  { value: "medium", Icon: Minus, label: "Средний", color: "text-[#6b7280]", activeRing: "ring-[#6b7280_/_40%] bg-[#6b7280]/10" },
  { value: "low", Icon: ArrowDown, label: "Низкий", color: "text-[oklch(0.68_0.14_145)]", activeRing: "ring-[oklch(0.68_0.14_145_/_40%)] bg-[oklch(0.68_0.14_145_/_10%)]" },
]

const DUE_DATE_OPTIONS: { value: DueDateFilter; label: string }[] = [
  { value: "all", label: "Все сроки" },
  { value: "overdue", label: "Просрочено" },
  { value: "today", label: "Сегодня" },
  { value: "this-week", label: "Эта неделя" },
  { value: "no-date", label: "Без срока" },
]

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const active = isFilterActive(filters)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Full-text search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#374151] pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Поиск..."
          className="h-[28px] pl-7 pr-3 rounded-lg bg-[#13131b] border border-[#1e1e2c] text-xs text-[#f1f5f9] placeholder:text-[#374151] focus:outline-none focus:border-[#6366f140] w-36 transition-colors hover:border-[#2a2a3a]"
        />
        {filters.search && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-[#9ca3af] transition-colors"
            onClick={() => onChange({ ...filters, search: "" })}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Priority quick-filter buttons — Lucide icons */}
      <div className="flex items-center gap-0.5">
        {PRIORITY_BADGES.map(({ value, Icon, label, color, activeRing }) => {
          const isActive = filters.priority === value
          return (
            <button
              key={value}
              type="button"
              title={label}
              onClick={() =>
                onChange({ ...filters, priority: isActive ? "all" : value })
              }
              className={`h-[28px] w-[28px] rounded-lg flex items-center justify-center transition-all ${
                isActive
                  ? `ring-1 ${activeRing}`
                  : "hover:bg-white/[0.04] opacity-40 hover:opacity-75"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${color}`} />
            </button>
          )
        })}
      </div>

      {/* Due-date filter */}
      <div className="flex items-center gap-1.5">
        <CalendarClock className="h-3.5 w-3.5 text-[#374151] shrink-0" />
        <select
          value={filters.dueDate}
          onChange={(e) => onChange({ ...filters, dueDate: e.target.value as DueDateFilter })}
          className="h-[28px] px-2 rounded-lg text-xs bg-[#13131b] border border-[#1e1e2c] text-[#9ca3af] focus:outline-none cursor-pointer appearance-none hover:border-[#2a2a3a] transition-colors"
          style={{ backgroundImage: "none" }}
        >
          {DUE_DATE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset */}
      {active && (
        <Button
          size="sm"
          variant="ghost"
          className="h-[28px] px-2 text-[11px] text-[#6b7280] hover:text-[#9ca3af] hover:bg-white/[0.04]"
          onClick={() => onChange(DEFAULT_FILTERS)}
        >
          <X className="h-3 w-3 mr-1" />
          Сбросить
        </Button>
      )}
    </div>
  )
}
