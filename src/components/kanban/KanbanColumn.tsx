"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { Database } from "@/types/database"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Check, MoreHorizontal, Trash2, X } from "lucide-react"
import { useState } from "react"
import { CreateCardDialog } from "./CreateCardDialog"
import { type AssigneeProfile, KanbanCard } from "./KanbanCard"
import { WipLimitBadge } from "./WipLimitBadge"

type ColumnType = Database["public"]["Tables"]["columns"]["Row"]
type CardType = Database["public"]["Tables"]["cards"]["Row"]

interface KanbanColumnProps {
  column: ColumnType
  cards: CardType[]
  onCreateCard: (columnId: string, input: { title: string; priority: string }) => Promise<unknown>
  onCardClick: (card: CardType) => void
  onDeleteColumn: (id: string) => void
  onUpdateColumn: (id: string, input: Partial<ColumnType>) => void
  onUpdateCard?: (id: string, data: { title?: string; due_date?: string | null }) => Promise<void>
  memberProfiles?: Record<string, AssigneeProfile>
}

export function KanbanColumn({
  column,
  cards,
  onCreateCard,
  onCardClick,
  onDeleteColumn,
  onUpdateColumn,
  onUpdateCard,
  memberProfiles,
}: KanbanColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(column.title)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", column },
  })

  const cardIds = cards.map((c) => c.id)
  const exceeded = column.wip_limit !== null && cards.length > column.wip_limit
  const colColor = column.color ?? "#6b7280"

  const handleTitleSave = async () => {
    if (titleValue.trim() && titleValue !== column.title) {
      await onUpdateColumn(column.id, { title: titleValue.trim() })
    }
    setIsEditingTitle(false)
  }

  const handleDelete = () => {
    onDeleteColumn(column.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <div
        className="flex flex-col w-[272px] shrink-0 rounded-xl overflow-hidden transition-[box-shadow] duration-150"
        style={{
          background: "#ffffff",
          border: isOver ? "1px solid rgba(0,117,222,0.35)" : "1px solid rgba(0,0,0,0.1)",
          boxShadow: isOver
            ? "0 0 0 3px rgba(0,117,222,0.08), var(--shadow-card)"
            : "var(--shadow-card)",
        }}
      >
        {/* Column color accent bar */}
        <div className="h-[3px] w-full" style={{ backgroundColor: colColor }} />

        {/* Column header */}
        <div className="px-3.5 py-3 border-b border-[rgba(0,0,0,0.06)] flex items-center gap-2">
          {isEditingTitle ? (
            <div className="flex items-center gap-1 flex-1">
              <Input
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave()
                  if (e.key === "Escape") { setTitleValue(column.title); setIsEditingTitle(false) }
                }}
                className="h-7 text-[13px] font-medium"
                autoFocus
              />
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleTitleSave}>
                <Check className="h-3.5 w-3.5 text-[#0075de]" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setTitleValue(column.title); setIsEditingTitle(false) }}>
                <X className="h-3.5 w-3.5 text-[#a39e98]" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              className="text-[13px] font-semibold truncate hover:opacity-70 text-left transition-opacity flex-1"
              style={{ color: exceeded ? "#d44c47" : colColor }}
              onClick={() => setIsEditingTitle(true)}
            >
              {column.title}
            </button>
          )}

          {/* Count badge */}
          <span className="text-[11px] font-semibold tabular-nums text-[#a39e98] bg-[#f6f5f4] rounded-full px-2 py-0.5">
            {cards.length}
          </span>

          <WipLimitBadge count={cards.length} limit={column.wip_limit} />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-[#a39e98] hover:text-[#615d59]"
                />
              }
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить колонку
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Cards drop zone */}
        <div ref={setNodeRef} className="flex flex-col gap-2 p-2.5 flex-1 min-h-[4rem] bg-[#f6f5f4]">
          <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
            {cards.map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                onClick={onCardClick}
                colColor={colColor}
                assigneeProfile={card.assignee_id ? memberProfiles?.[card.assignee_id] : undefined}
                onUpdateCard={onUpdateCard}
              />
            ))}
          </SortableContext>
        </div>

        {/* Add card */}
        <div className="p-2.5 pt-0 bg-[#f6f5f4]">
          <CreateCardDialog columnId={column.id} onCreate={onCreateCard} />
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить колонку?</AlertDialogTitle>
            <AlertDialogDescription>
              Колонка «{column.title}» и все её карточки будут удалены безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
