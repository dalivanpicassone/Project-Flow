"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useCardStore } from "@/store/cardStore"
import { useColumnStore } from "@/store/columnStore"
import { differenceInDays } from "date-fns"
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react"

export function BoardStats() {
  const columns = useColumnStore((s) => s.columns)
  const cards = useCardStore((s) => s.cards)

  const total = cards.length
  const overdue = cards.filter((c) => {
    if (!c.due_date) return false
    return new Date(c.due_date) < new Date()
  }).length

  const stuck = cards.filter((c) => {
    const start = c.moved_at ? new Date(c.moved_at) : new Date(c.created_at)
    return differenceInDays(new Date(), start) > 7
  }).length

  const wipViolations = columns.filter((col) => {
    if (!col.wip_limit) return false
    const count = cards.filter((c) => c.column_id === col.id).length
    return count > col.wip_limit
  }).length

  return (
    <TooltipProvider>
      <div className="flex items-center gap-3 text-sm">
        {/* Per-column counters */}
        <div className="flex items-center gap-2">
          {columns.map((col) => {
            const count = cards.filter((c) => c.column_id === col.id).length
            const exceeded = col.wip_limit !== null && count > col.wip_limit
            return (
              <Tooltip key={col.id}>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className={`cursor-default ${
                      exceeded ? "bg-red-50 text-red-700 border-red-200" : "bg-white text-gray-600"
                    }`}
                  >
                    {col.title}: {count}
                    {col.wip_limit ? `/${col.wip_limit}` : ""}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {exceeded
                    ? `⚠️ WIP-лимит превышен (${count}/${col.wip_limit})`
                    : `${count} задач в колонке`}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        {/* Summary badges */}
        {overdue > 0 && (
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant="outline"
                className="bg-red-50 text-red-600 border-red-200 gap-1 cursor-default"
              >
                <AlertTriangle className="h-3 w-3" />
                {overdue} просрочено
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Задачи с истёкшим дедлайном</TooltipContent>
          </Tooltip>
        )}

        {stuck > 0 && (
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-600 border-orange-200 gap-1 cursor-default"
              >
                <Clock className="h-3 w-3" />
                {stuck} застряло
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Задачи в одной колонке более 7 дней</TooltipContent>
          </Tooltip>
        )}

        {wipViolations > 0 && (
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1 cursor-default"
              >
                <AlertTriangle className="h-3 w-3" />
                {wipViolations} WIP
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Превышен WIP-лимит в {wipViolations} колонке(ах)</TooltipContent>
          </Tooltip>
        )}

        {overdue === 0 && stuck === 0 && wipViolations === 0 && total > 0 && (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 gap-1 cursor-default"
          >
            <CheckCircle2 className="h-3 w-3" />
            Всё в порядке
          </Badge>
        )}

        <span className="text-muted-foreground text-xs ml-1">Всего: {total}</span>
      </div>
    </TooltipProvider>
  )
}
