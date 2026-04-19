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
  const colColor = column.color ?? "#a39e98"

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
      <div className="flex flex-col w-[272px] shrink-0">
        {/* ── Column header ── */}
        <div className="flex items-center gap-2 h-9 px-1 mb-3">
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
              <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={handleTitleSave}>
                <Check className="h-3.5 w-3.5 text-[#0075de]" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => { setTitleValue(column.title); setIsEditingTitle(false) }}>
                <X className="h-3.5 w-3.5 text-[#a39e98]" />
              </Button>
            </div>
          ) : (
            <>
              {/* Color indicator dot */}
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 transition-colors duration-150"
                style={{ backgroundColor: exceeded ? "#d44c47" : colColor }}
              />

              {/* Column title */}
              <button
                type="button"
                className="text-[13px] font-semibold truncate flex-1 text-left transition-colors duration-150 hover:opacity-70"
                style={{ color: "#31302e" }}
                onClick={() => setIsEditingTitle(true)}
                title="Нажмите чтобы изменить"
              >
                {column.title}
              </button>

              {/* Card count */}
              <span
                className="text-[11px] font-semibold tabular-nums shrink-0"
                style={{ color: exceeded ? "#d44c47" : "#a39e98" }}
              >
                {cards.length}
              </span>

              <WipLimitBadge count={cards.length} limit={column.wip_limit} />

              {/* Column menu */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 text-[#a39e98] hover:text-[#615d59] hover:bg-[rgba(0,0,0,0.05)]"
                    />
                  }
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
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
            </>
          )}
        </div>

        {/* ── Cards drop zone ── */}
        <div
          ref={setNodeRef}
          className="flex flex-col gap-2 flex-1 min-h-[60px] rounded-lg transition-all duration-150"
          style={{
            outline: isOver ? "2px dashed rgba(0,117,222,0.3)" : "2px dashed transparent",
            outlineOffset: "3px",
            background: isOver ? "rgba(0,117,222,0.03)" : "transparent",
            padding: isOver ? "4px" : "0",
          }}
        >
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

        {/* ── Add card ── */}
        <div className="mt-2">
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
