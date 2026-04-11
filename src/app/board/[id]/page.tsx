"use client"

import { BoardStats } from "@/components/kanban/BoardStats"
import { CardDetailDialog } from "@/components/kanban/CardDetailDialog"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { useCardStore } from "@/store/cardStore"
import type { Database } from "@/types/database"
import { ArrowLeft, Settings, User, UserPlus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

type CardType = Database["public"]["Tables"]["cards"]["Row"]

export default function BoardPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const storeCards = useCardStore((s) => s.cards)
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [myTasksOnly, setMyTasksOnly] = useState(false)

  // Always pass the live card from the store so dialog shows updated fields immediately
  const liveSelectedCard = selectedCard
    ? (storeCards.find((c) => c.id === selectedCard.id) ?? selectedCard)
    : null

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card)
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setSelectedCard(null)
  }

  return (
    <>
      {/* Topbar */}
      <div className="h-14 border-b border-border px-5 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="text-muted-foreground hover:text-foreground h-8 px-2.5 text-xs font-medium"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Все доски
          </Button>

          {/* PM Analytics bar */}
          <div className="overflow-x-auto">
            <BoardStats />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMyTasksOnly((v) => !v)}
            className={cn(
              "text-xs h-[30px] px-3 rounded-lg border",
              myTasksOnly
                ? "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <User className="mr-1.5 h-3.5 w-3.5" />
            Мои задачи
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-muted border border-border text-muted-foreground text-xs h-[30px] px-3 rounded-lg hover:text-foreground"
          >
            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
            Пригласить
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/board/${id}/settings`)}
            className="bg-muted border border-border text-muted-foreground text-xs h-[30px] px-3 rounded-lg hover:text-foreground"
          >
            <Settings className="mr-1.5 h-3.5 w-3.5" />
            Настройки
          </Button>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-auto p-5">
        <KanbanBoard
          boardId={id}
          onCardClick={handleCardClick}
          myTasksOnly={myTasksOnly}
          currentUserId={user?.id}
        />
      </div>

      {/* Card detail */}
      <CardDetailDialog
        card={liveSelectedCard}
        boardId={id}
        open={dialogOpen}
        onOpenChange={handleDialogClose}
      />
    </>
  )
}
