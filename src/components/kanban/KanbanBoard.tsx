"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useBoardMembers } from "@/hooks/useBoardMembers"
import { useCards } from "@/hooks/useCards"
import { useColumns } from "@/hooks/useColumns"
import { useRealtime } from "@/hooks/useRealtime"
import { useCardStore } from "@/store/cardStore"
import { useColumnStore } from "@/store/columnStore"
import type { Database } from "@/types/database"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useCallback, useMemo, useState } from "react"
import { CreateColumnDialog } from "./CreateColumnDialog"
import { KanbanCard } from "./KanbanCard"
import { KanbanColumn } from "./KanbanColumn"

type CardType = Database["public"]["Tables"]["cards"]["Row"]

interface KanbanBoardProps {
  boardId: string
  onCardClick: (card: CardType) => void
  myTasksOnly?: boolean
  currentUserId?: string
}

export function KanbanBoard({
  boardId,
  onCardClick,
  myTasksOnly,
  currentUserId,
}: KanbanBoardProps) {
  useRealtime(boardId)
  const [activeCard, setActiveCard] = useState<CardType | null>(null)
  const { members } = useBoardMembers(boardId)
  const memberProfilesMap = useMemo(
    () => Object.fromEntries(members.map((m) => [m.user_id, m.profile])),
    [members]
  )
  const {
    columns,
    isLoading: colsLoading,
    createColumn,
    updateColumnById,
    deleteColumn,
    reorderColumns,
  } = useColumns(boardId)
  const { cards, isLoading: cardsLoading, createCard, moveCard, updateCardById } = useCards(boardId)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const getColumnCards = (columnId: string) => {
    const base = cards.filter((c) => c.column_id === columnId)
    const filtered =
      myTasksOnly && currentUserId ? base.filter((c) => c.assignee_id === currentUserId) : base
    return filtered.sort((a, b) => a.position - b.position)
  }

  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (event.active.data.current?.type === "card") {
      setActiveCard(event.active.data.current.card)
    }
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeType = active.data.current?.type
    const overType = over.data.current?.type

    if (activeType !== "card") return

    const activeCard = active.data.current?.card as CardType
    const overColumnId =
      overType === "column" ? (over.id as string) : (over.data.current?.card?.column_id as string)

    if (!overColumnId || activeCard.column_id === overColumnId) return

    // Read current store state (not stale closure) for optimistic update
    const { cards: currentCards, setCards } = useCardStore.getState()
    const updatedCards = currentCards.map((c) =>
      c.id === activeCard.id ? { ...c, column_id: overColumnId } : c
    )
    setCards(updatedCards)
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveCard(null)
      const { active, over } = event
      if (!over) return

      const activeType = active.data.current?.type

      // Column reorder — read current columns from store, not stale closure
      if (activeType !== "card") {
        const currentColumns = useColumnStore.getState().columns
        const oldIndex = currentColumns.findIndex((c) => c.id === active.id)
        const newIndex = currentColumns.findIndex((c) => c.id === over.id)
        if (oldIndex !== newIndex) {
          const reordered = arrayMove(currentColumns, oldIndex, newIndex)
          await reorderColumns(reordered)
        }
        return
      }

      // Card move — read current cards from store, not stale closure
      const { cards: currentCards } = useCardStore.getState()
      const activeCardData = active.data.current?.card as CardType
      const overType = over.data.current?.type
      const targetColumnId =
        overType === "column" ? (over.id as string) : (over.data.current?.card?.column_id as string)

      if (!targetColumnId) return

      const targetColumnCards = currentCards
        .filter((c) => c.column_id === targetColumnId && c.id !== activeCardData.id)
        .sort((a, b) => a.position - b.position)

      const overCardIndex =
        overType === "card"
          ? targetColumnCards.findIndex((c) => c.id === over.id)
          : targetColumnCards.length

      const newPosition = overCardIndex >= 0 ? overCardIndex : targetColumnCards.length

      const updatedCards = currentCards.map((c) =>
        c.id === activeCardData.id ? { ...c, column_id: targetColumnId, position: newPosition } : c
      )

      await moveCard(activeCardData.id, targetColumnId, updatedCards)
    },
    [moveCard, reorderColumns]
  )

  if (colsLoading || cardsLoading) {
    const columnSkeletonKeys = ["col-1", "col-2", "col-3"]
    const cardSkeletonKeys = ["card-1", "card-2", "card-3"]

    return (
      <div className="flex gap-4 p-6">
        {columnSkeletonKeys.map((columnKey) => (
          <div key={columnKey} className="w-72 shrink-0 space-y-2">
            <Skeleton className="h-6 w-32 rounded-md" />
            {cardSkeletonKeys.map((cardKey) => (
              <Skeleton key={`${columnKey}-${cardKey}`} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 items-start overflow-x-auto pb-6 px-1 min-h-[calc(100vh-10rem)]">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            cards={getColumnCards(column.id)}
            onCreateCard={createCard}
            onCardClick={onCardClick}
            onDeleteColumn={deleteColumn}
            onUpdateColumn={updateColumnById}
            onUpdateCard={async (id, data) => {
              await updateCardById(id, data)
            }}
            memberProfiles={memberProfilesMap}
          />
        ))}

        <CreateColumnDialog onCreate={createColumn} />
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="rotate-1 scale-[1.02] opacity-90 shadow-elevated cursor-grabbing transition-transform duration-150">
            <KanbanCard
              card={activeCard}
              onClick={() => {}}
              colColor={columns.find((c) => c.id === activeCard.column_id)?.color ?? "#6b7280"}
              assigneeProfile={
                activeCard.assignee_id ? memberProfilesMap[activeCard.assignee_id] : undefined
              }
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
