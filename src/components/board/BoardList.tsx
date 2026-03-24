"use client"

import { BoardCard } from "@/components/board/BoardCard"
import { CreateBoardDialog } from "@/components/board/CreateBoardDialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useBoards } from "@/hooks/useBoards"
import { LayoutGrid } from "lucide-react"

function BoardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
      <Skeleton className="h-[3px] w-full rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2 pt-0.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
        <div className="pt-2.5 border-t border-border/50">
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </div>
  )
}

export function BoardList() {
  const { boards, isLoading, archiveBoard, deleteBoard } = useBoards()
  const skeletonKeys = [
    "board-skeleton-1",
    "board-skeleton-2",
    "board-skeleton-3",
    "board-skeleton-4",
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skeletonKeys.map((key) => (
          <BoardSkeleton key={key} />
        ))}
      </div>
    )
  }

  if (!boards || boards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-4 border border-border">
          <LayoutGrid className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">Активных досок сейчас нет</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
          Создайте первую доску, чтобы начать управлять задачами
        </p>
        <CreateBoardDialog />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} onArchive={archiveBoard} onDelete={deleteBoard} />
      ))}
    </div>
  )
}
