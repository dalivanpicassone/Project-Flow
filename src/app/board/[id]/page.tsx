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
      <div className="h-[52px] border-b border-border px-5 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="text-[#615d59] hover:text-foreground h-7 px-2 text-[13px] font-medium shrink-0"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Все доски
          </Button>
          <div className="w-px h-4 bg-[rgba(0,0,0,0.1)]" />
          <div className="overflow-x-auto min-w-0">
            <BoardStats />
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setMyTasksOnly((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 h-7 px-3 text-[13px] font-medium rounded border transition-colors",
              myTasksOnly
                ? "bg-[#0075de] border-[#0075de] text-white hover:bg-[#005bab]"
                : "border-[rgba(0,0,0,0.12)] text-[#615d59] hover:bg-[#f6f5f4] hover:text-foreground"
            )}
          >
            <User className="h-3.5 w-3.5" />
            Мои задачи
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 h-7 px-3 text-[13px] font-medium rounded border border-[rgba(0,0,0,0.12)] text-[#615d59] hover:bg-[#f6f5f4] hover:text-foreground transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Пригласить
          </button>
          <button
            type="button"
            onClick={() => router.push(`/board/${id}/settings`)}
            className="inline-flex items-center gap-1.5 h-7 px-3 text-[13px] font-medium rounded border border-[rgba(0,0,0,0.12)] text-[#615d59] hover:bg-[#f6f5f4] hover:text-foreground transition-colors"
          >
            <Settings className="h-3.5 w-3.5" />
            Настройки
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-auto p-5 bg-[#f6f5f4]">
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
