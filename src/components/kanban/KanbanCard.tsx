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

const priorityDotColors: Record<Priority, string> = {
  critical: "#d44c47",
  high:     "#cb912f",
  medium:   "#0075de",
  low:      "#448361",
}

function MiniAvatar({ profile }: { profile: AssigneeProfile }) {
  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  if (profile.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={profile.full_name ?? "Исполнитель"}
        className="w-5 h-5 rounded-full object-cover ring-1 ring-white shrink-0"
      />
    )
  }

  return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "#31302e" }}>
      <span className="text-[8px] font-semibold text-white leading-none">{initials}</span>
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

  const style = { transform: CSS.Transform.toString(transform), transition }
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
    if (onUpdateCard) await onUpdateCard(card.id, { due_date: value || null })
    setIsEditingDueDate(false)
  }

  const priorityColor = card.priority ? priorityDotColors[card.priority as Priority] : undefined
  const hasTopMeta = !!(card.priority || card.labels?.length)
  const hasBottomMeta = !!(card.due_date || isEditingDueDate || assigneeProfile || onUpdateCard)

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style}>
        <div
          className="w-full rounded-lg"
          style={{
            height: "72px",
            border: "1.5px dashed rgba(0,0,0,0.12)",
            background: "rgba(0,0,0,0.025)",
          }}
        />
      </div>
    )
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div
        {...attributes}
        {...dragListeners}
        className="group relative w-full cursor-pointer rounded-lg bg-white transition-shadow duration-150"
        style={{
          border: "1px solid rgba(0,0,0,0.09)",
          borderLeft: `3px solid ${colColor}`,
          boxShadow: "var(--shadow-card)",
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.boxShadow =
            "rgba(0,0,0,0.06) 0px 6px 24px, rgba(0,0,0,0.04) 0px 3px 10px, rgba(0,0,0,0.025) 0px 1px 4px"
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)"
        }}
        onClick={() => {
          if (isEditingTitle || isEditingDueDate) return
          onClick(card)
        }}
      >
        <div className="pl-3 pr-3.5 pt-3 pb-2.5">
          {/* Top meta: priority dot + labels */}
          {hasTopMeta && (
            <div className="flex items-center gap-1.5 mb-1.5">
              {priorityColor && (
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: priorityColor }}
                  title={card.priority ?? undefined}
                />
              )}
              {card.labels?.map((label) => (
                <span
                  key={label}
                  className="inline-block text-[10px] leading-4 font-semibold text-[#097fe8] bg-[#f2f9ff] border border-[rgba(0,117,222,0.15)] rounded-full px-1.5 uppercase tracking-[0.04em] truncate max-w-[80px]"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          {isEditingTitle ? (
            <div className="flex items-start gap-1">
              <input
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveTitleInline()
                  if (e.key === "Escape") { setTitleValue(card.title); setIsEditingTitle(false) }
                }}
                onBlur={saveTitleInline}
                // biome-ignore lint/a11y/noAutofocus: inline editing UX
                autoFocus
                className="flex-1 bg-white border border-[#dddddd] rounded px-2 py-0.5 text-[13.5px] text-[rgba(0,0,0,0.9)] leading-snug focus:outline-none focus:ring-2 focus:ring-[rgba(0,117,222,0.3)]"
                style={{ letterSpacing: "-0.01em" }}
              />
              <button type="button" onClick={saveTitleInline} className="p-0.5 rounded hover:bg-[#f6f5f4] shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5 text-[#0075de]" />
              </button>
              <button type="button" onClick={() => { setTitleValue(card.title); setIsEditingTitle(false) }} className="p-0.5 rounded hover:bg-[#f6f5f4] shrink-0 mt-0.5">
                <X className="h-3.5 w-3.5 text-[#a39e98]" />
              </button>
            </div>
          ) : (
            <p
              className="text-[13.5px] font-medium leading-[1.45] line-clamp-3"
              style={{ color: "rgba(0,0,0,0.88)", letterSpacing: "-0.01em" }}
              onDoubleClick={(e) => { e.stopPropagation(); setTitleValue(card.title); setIsEditingTitle(true) }}
              title="Двойной клик — изменить название"
            >
              {card.title}
            </p>
          )}

          {/* Bottom meta: due date + assignee */}
          {hasBottomMeta && (
            <div className="flex items-center justify-between mt-2.5">
              <div className="flex items-center gap-2">
                {isEditingDueDate ? (
                  <input
                    type="date"
                    defaultValue={card.due_date ?? ""}
                    // biome-ignore lint/a11y/noAutofocus: inline editing UX
                    autoFocus
                    className="bg-white border border-[#dddddd] rounded px-1.5 py-0.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-[rgba(0,117,222,0.3)]"
                    onBlur={(e) => saveDueDateInline(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveDueDateInline((e.target as HTMLInputElement).value)
                      if (e.key === "Escape") setIsEditingDueDate(false)
                    }}
                  />
                ) : card.due_date ? (
                  <div
                    onDoubleClick={(e) => { e.stopPropagation(); setIsEditingDueDate(true) }}
                    title="Двойной клик — изменить дедлайн"
                  >
                    <DueDateBadge dueDate={card.due_date} />
                  </div>
                ) : onUpdateCard ? (
                  <button
                    type="button"
                    className="text-[11px] text-[#a39e98] opacity-0 group-hover:opacity-100 hover:text-[#615d59] transition-all"
                    onDoubleClick={(e) => { e.stopPropagation(); setIsEditingDueDate(true) }}
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
    </div>
  )
}
