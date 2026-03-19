"use client"

import { BoardStats } from "@/components/kanban/BoardStats"
import { CardDetailDialog } from "@/components/kanban/CardDetailDialog"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"
import { Button } from "@/components/ui/button"
import type { Database } from "@/types/database"
import { ArrowLeft, Settings, UserPlus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

type CardType = Database["public"]["Tables"]["cards"]["Row"]

export default function BoardPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

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
      <div className="h-12 border-b border-[#141420] px-5 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="text-[#9ca3af] hover:text-[#f1f5f9] h-[30px] px-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
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
            className="bg-[#16161e] border border-[#1e1e2a] text-[#9ca3af] text-xs h-[30px] px-3 rounded-lg hover:text-[#f1f5f9]"
          >
            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
            Пригласить
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/board/${id}/settings`)}
            className="bg-[#16161e] border border-[#1e1e2a] text-[#9ca3af] text-xs h-[30px] px-3 rounded-lg hover:text-[#f1f5f9]"
          >
            <Settings className="mr-1.5 h-3.5 w-3.5" />
            Настройки
          </Button>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-auto p-5">
        <KanbanBoard boardId={id} onCardClick={handleCardClick} />
      </div>

      {/* Card detail */}
      <CardDetailDialog
        card={selectedCard}
        boardId={id}
        open={dialogOpen}
        onOpenChange={handleDialogClose}
      />
    </>
  )
}
