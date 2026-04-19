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
  activeStyle: React.CSSProperties
}[] = [
  { value: "critical", Icon: AlertCircle, label: "Критично", color: "text-[#d44c47]", activeStyle: { background: "rgba(212,76,71,0.08)", outline: "1.5px solid rgba(212,76,71,0.3)" } },
  { value: "high",     Icon: ArrowUp,    label: "Высокий",  color: "text-[#cb912f]", activeStyle: { background: "rgba(203,145,47,0.08)", outline: "1.5px solid rgba(203,145,47,0.3)" } },
  { value: "medium",   Icon: Minus,      label: "Средний",  color: "text-[#0075de]", activeStyle: { background: "rgba(0,117,222,0.08)", outline: "1.5px solid rgba(0,117,222,0.3)" } },
  { value: "low",      Icon: ArrowDown,  label: "Низкий",   color: "text-[#448361]", activeStyle: { background: "rgba(68,131,97,0.08)", outline: "1.5px solid rgba(68,131,97,0.3)" } },
]

const DUE_DATE_OPTIONS: { value: DueDateFilter; label: string }[] = [
  { value: "all",       label: "Все сроки" },
  { value: "overdue",   label: "Просрочено" },
  { value: "today",     label: "Сегодня" },
  { value: "this-week", label: "Эта неделя" },
  { value: "no-date",   label: "Без срока" },
]

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const active = isFilterActive(filters)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#a39e98] pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Поиск..."
          className="h-7 pl-7 pr-3 rounded border border-[rgba(0,0,0,0.12)] bg-white text-xs text-foreground placeholder:text-[#a39e98] focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring w-36 transition-colors"
        />
        {filters.search && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#a39e98] hover:text-[#615d59] transition-colors"
            onClick={() => onChange({ ...filters, search: "" })}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Priority filters */}
      <div className="flex items-center gap-0.5">
        {PRIORITY_BADGES.map(({ value, Icon, label, color, activeStyle }) => {
          const isActive = filters.priority === value
          return (
            <button
              key={value}
              type="button"
              title={label}
              onClick={() => onChange({ ...filters, priority: isActive ? "all" : value })}
              className={`h-7 w-7 rounded flex items-center justify-center transition-all ${
                isActive ? "" : "hover:bg-[rgba(0,0,0,0.04)] opacity-40 hover:opacity-70"
              }`}
              style={isActive ? activeStyle : undefined}
            >
              <Icon className={`h-3.5 w-3.5 ${color}`} />
            </button>
          )
        })}
      </div>

      {/* Due date */}
      <div className="flex items-center gap-1.5">
        <CalendarClock className="h-3.5 w-3.5 text-[#a39e98] shrink-0" />
        <select
          value={filters.dueDate}
          onChange={(e) => onChange({ ...filters, dueDate: e.target.value as DueDateFilter })}
          className="h-7 px-2 rounded border border-[rgba(0,0,0,0.12)] text-xs bg-white text-[#615d59] focus:outline-none cursor-pointer appearance-none hover:border-[rgba(0,0,0,0.2)] transition-colors"
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
          className="h-7 px-2 text-[11px] text-[#a39e98] hover:text-[#615d59]"
          onClick={() => onChange(DEFAULT_FILTERS)}
        >
          <X className="h-3 w-3 mr-1" />
          Сбросить
        </Button>
      )}
    </div>
  )
}
