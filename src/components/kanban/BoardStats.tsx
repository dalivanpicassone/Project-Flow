"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useCardStore } from "@/store/cardStore"
import { useColumnStore } from "@/store/columnStore"
import { differenceInDays } from "date-fns"
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react"

export function BoardStats() {
  const columns = useColumnStore((s) => s.columns)
  const cards = useCardStore((s) => s.cards)

  const total = cards.length
  const overdue = cards.filter((c) => c.due_date && new Date(c.due_date) < new Date()).length
  const stuck = cards.filter((c) => {
    const start = c.moved_at ? new Date(c.moved_at) : new Date(c.created_at)
    return differenceInDays(new Date(), start) > 7
  }).length
  const wipViolations = columns.filter((col) => {
    if (!col.wip_limit) return false
    return cards.filter((c) => c.column_id === col.id).length > col.wip_limit
  }).length

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 text-sm">
        {/* Per-column counts */}
        <div className="flex items-center gap-1.5">
          {columns.map((col) => {
            const count = cards.filter((c) => c.column_id === col.id).length
            const exceeded = col.wip_limit !== null && count > col.wip_limit
            return (
              <Tooltip key={col.id}>
                <TooltipTrigger>
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full cursor-default"
                    style={
                      exceeded
                        ? { background: "rgba(212,76,71,0.08)", color: "#d44c47", border: "1px solid rgba(212,76,71,0.2)" }
                        : { background: "#f6f5f4", color: "#615d59", border: "1px solid rgba(0,0,0,0.06)" }
                    }
                  >
                    {col.title}: {count}{col.wip_limit ? `/${col.wip_limit}` : ""}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {exceeded
                    ? `WIP-лимит превышен (${count}/${col.wip_limit})`
                    : `${count} задач в колонке`}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        {overdue > 0 && (
          <Tooltip>
            <TooltipTrigger>
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full cursor-default"
                style={{ background: "rgba(212,76,71,0.08)", color: "#d44c47", border: "1px solid rgba(212,76,71,0.2)" }}
              >
                <AlertTriangle className="h-3 w-3" />
                {overdue} просрочено
              </span>
            </TooltipTrigger>
            <TooltipContent>Задачи с истёкшим дедлайном</TooltipContent>
          </Tooltip>
        )}

        {stuck > 0 && (
          <Tooltip>
            <TooltipTrigger>
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full cursor-default"
                style={{ background: "rgba(203,145,47,0.08)", color: "#cb912f", border: "1px solid rgba(203,145,47,0.2)" }}
              >
                <Clock className="h-3 w-3" />
                {stuck} застряло
              </span>
            </TooltipTrigger>
            <TooltipContent>Задачи в одной колонке более 7 дней</TooltipContent>
          </Tooltip>
        )}

        {wipViolations > 0 && (
          <Tooltip>
            <TooltipTrigger>
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full cursor-default"
                style={{ background: "rgba(203,145,47,0.08)", color: "#cb912f", border: "1px solid rgba(203,145,47,0.2)" }}
              >
                <AlertTriangle className="h-3 w-3" />
                {wipViolations} WIP
              </span>
            </TooltipTrigger>
            <TooltipContent>Превышен WIP-лимит в {wipViolations} колонке(ах)</TooltipContent>
          </Tooltip>
        )}

        {overdue === 0 && stuck === 0 && wipViolations === 0 && total > 0 && (
          <span
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full cursor-default"
            style={{ background: "rgba(68,131,97,0.08)", color: "#448361", border: "1px solid rgba(68,131,97,0.2)" }}
          >
            <CheckCircle2 className="h-3 w-3" />
            Всё в порядке
          </span>
        )}

        <span className="text-[11px] text-[#a39e98] ml-1">Всего: {total}</span>
      </div>
    </TooltipProvider>
  )
}
