"use client"

import { DueDateBadge } from "@/components/ui/DueDateBadge"
import type { Database, Priority } from "@/types/database"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Check, X } from "lucide-react"
import { useState } from "react"

type CardType = Database["public"]["Tables"]["cards"]["Row"]

export interface AssigneeProfile {
  full_name: string | null
  avatar_url: string | null
}

interface KanbanCardProps {
  card: CardType
  onClick: (card: CardType) => void
  colColor: string
  assigneeProfile?: AssigneeProfile
  onUpdateCard?: (id: string, data: { title?: string; due_date?: string | null }) => Promise<void>
}

const priorityColorMap: Record<Priority, string> = {
  critical: "var(--priority-critical)",
  high: "var(--priority-high)",
  medium: "var(--priority-medium)",
  low: "var(--priority-low)",
}

function MiniAvatar({ profile }: { profile: AssigneeProfile }) {
  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  if (profile.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={profile.full_name ?? "Исполнитель"}
        className="w-5 h-5 rounded-full object-cover ring-2 ring-card shrink-0"
      />
    )
  }

  return (
    <div className="w-5 h-5 rounded-full bg-muted ring-2 ring-card flex items-center justify-center shrink-0">
      <span className="text-[8px] font-semibold text-muted-foreground leading-none">
        {initials}
      </span>
    </div>
  )
}

export function KanbanCard({
  card,
  onClick,
  colColor,
  assigneeProfile,
  onUpdateCard,
}: KanbanCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(card.title)
  const [isEditingDueDate, setIsEditingDueDate] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { type: "card", card },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Disable drag listeners while inline editing to avoid accidental drags
  const dragListeners = isEditingTitle || isEditingDueDate ? {} : listeners

  const saveTitleInline = async () => {
    const trimmed = titleValue.trim()
    if (trimmed && trimmed !== card.title && onUpdateCard) {
      await onUpdateCard(card.id, { title: trimmed })
    } else {
      setTitleValue(card.title)
    }
    setIsEditingTitle(false)
  }

  const saveDueDateInline = async (value: string) => {
    if (onUpdateCard) {
      await onUpdateCard(card.id, { due_date: value || null })
    }
    setIsEditingDueDate(false)
  }

  const priorityColor = card.priority ? priorityColorMap[card.priority as Priority] : undefined
  const hasTopMeta = !!(card.priority || card.labels?.length)
  const hasBottomMeta = !!(card.due_date || isEditingDueDate || assigneeProfile || onUpdateCard)

  // While dragging: render a highlighted drop-zone placeholder that marks where the card will land
  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style}>
        <div
          className="w-full rounded-xl border-2 border-dashed border-brand/40 bg-brand/5 animate-pulse"
          style={{ minHeight: "60px", borderLeftWidth: "3px", borderLeftColor: colColor }}
        />
      </div>
    )
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div
        {...attributes}
        {...dragListeners}
        className="group relative w-full cursor-pointer rounded-xl bg-card border border-border border-l-[3px] hover:border-muted-foreground/30 hover:shadow-md hover:-translate-y-0.5 transition-[transform,box-shadow,border-color] duration-200 px-3.5 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
        style={{ borderLeftColor: colColor }}
        onClick={() => {
          if (isEditingTitle || isEditingDueDate) return
          onClick(card)
        }}
      >
        {/* Top: thin priority strip + label chips */}
        {hasTopMeta && (
          <div className="flex items-center gap-1.5 mb-2">
            {priorityColor && (
              <span
                className="inline-block h-[3px] w-6 rounded-full shrink-0"
                style={{ backgroundColor: priorityColor }}
                title={card.priority ?? undefined}
              />
            )}
            {card.labels?.map((label) => (
              <span
                key={label}
                className="inline-block text-[10px] leading-4 text-muted-foreground border border-border bg-muted rounded-full px-2 truncate max-w-[80px]"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Title — double-click to edit inline */}
        {isEditingTitle ? (
          <div className="flex items-center gap-1">
            <input
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitleInline()
                if (e.key === "Escape") {
                  setTitleValue(card.title)
                  setIsEditingTitle(false)
                }
              }}
              onBlur={saveTitleInline}
              // biome-ignore lint/a11y/noAutofocus: required for inline editing UX
              autoFocus
              className="flex-1 bg-background border border-brand/40 rounded px-2 py-0.5 text-sm font-semibold text-foreground leading-snug focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              type="button"
              onClick={saveTitleInline}
              className="p-0.5 rounded hover:bg-muted shrink-0"
            >
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            </button>
            <button
              type="button"
              onClick={() => {
                setTitleValue(card.title)
                setIsEditingTitle(false)
              }}
              className="p-0.5 rounded hover:bg-muted shrink-0"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <p
            className="text-sm font-semibold text-foreground leading-snug line-clamp-3"
            onDoubleClick={(e) => {
              e.stopPropagation()
              setTitleValue(card.title)
              setIsEditingTitle(true)
            }}
            title="Двойной клик — изменить название"
          >
            {card.title}
          </p>
        )}

        {/* Bottom: due date (double-click to edit) + assignee */}
        {hasBottomMeta && (
          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-center gap-2">
              {isEditingDueDate ? (
                <div>
                  <input
                    type="date"
                    defaultValue={card.due_date ?? ""}
                    // biome-ignore lint/a11y/noAutofocus: required for inline editing UX
                    autoFocus
                    className="bg-background border border-brand/40 rounded px-1.5 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    onBlur={(e) => saveDueDateInline(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveDueDateInline((e.target as HTMLInputElement).value)
                      if (e.key === "Escape") setIsEditingDueDate(false)
                    }}
                  />
                </div>
              ) : card.due_date ? (
                <div
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    setIsEditingDueDate(true)
                  }}
                  title="Двойной клик — изменить дедлайн"
                >
                  <DueDateBadge dueDate={card.due_date} />
                </div>
              ) : onUpdateCard ? (
                <button
                  type="button"
                  className="text-[10px] text-muted-foreground/50 opacity-0 group-hover:opacity-100 hover:text-muted-foreground transition-all"
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    setIsEditingDueDate(true)
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  + дедлайн
                </button>
              ) : null}
            </div>
            {assigneeProfile && <MiniAvatar profile={assigneeProfile} />}
          </div>
        )}
      </div>
    </div>
  )
}
