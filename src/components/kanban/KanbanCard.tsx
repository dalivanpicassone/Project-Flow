"use client"

import { DueDateBadge } from "@/components/ui/DueDateBadge"
import { PriorityBadge } from "@/components/ui/PriorityBadge"
import type { Database } from "@/types/database"
import type { Priority } from "@/types/database"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

type CardType = Database["public"]["Tables"]["cards"]["Row"]

interface KanbanCardProps {
  card: CardType
  onClick: (card: CardType) => void
  colColor: string
}

export function KanbanCard({ card, onClick, colColor }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { type: "card", card },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <button
        type="button"
        className="group w-full text-left cursor-pointer rounded-lg bg-[#16161e] border border-[#1e1e2a] border-l-2 hover:border-[#252535] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)] p-3 space-y-2"
        style={{ borderLeftColor: colColor }}
        onClick={() => onClick(card)}
      >
        <div className="flex items-start gap-1.5">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="mt-0.5 opacity-0 group-hover:opacity-30 hover:!opacity-70 cursor-grab active:cursor-grabbing shrink-0 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-3.5 w-3.5 text-[#9ca3af]" />
          </button>
          <p className="text-sm font-medium text-[#e2e8f0] leading-snug flex-1">{card.title}</p>
        </div>

        {(card.priority || card.due_date || (card.labels && card.labels.length > 0)) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pl-5">
            <PriorityBadge priority={card.priority as Priority} />
            {card.due_date && <DueDateBadge dueDate={card.due_date} />}
            {card.labels?.map((label) => (
              <span
                key={label}
                className="text-xs text-[#9ca3af] border border-[#1e1e2a] rounded px-1.5 py-0.5"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </button>
    </div>
  )
}
