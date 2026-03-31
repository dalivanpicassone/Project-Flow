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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Database } from "@/types/database"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { Archive, Clock, MoreHorizontal, Settings, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Board = Database["public"]["Tables"]["boards"]["Row"]

interface BoardCardProps {
  board: Board
  onArchive: (id: string) => Promise<{ error: unknown }>
  onDelete: (id: string) => Promise<{ error: unknown }>
}

export function BoardCard({ board, onArchive, onDelete }: BoardCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()

  const handleArchive = async () => {
    const { error } = await onArchive(board.id)
    if (error) console.error("Archive error:", error)
  }

  const handleDelete = async () => {
    const { error } = await onDelete(board.id)
    if (error) console.error("Delete error:", error)
    setShowDeleteDialog(false)
  }

  const accentColor = board.color ?? "#818CF8"
  const initial = board.title.charAt(0).toUpperCase()

  return (
    <>
      <div className="group relative flex flex-col rounded-xl bg-card border border-border hover:border-muted-foreground/30 transition-all duration-200 overflow-hidden hover:shadow-lg hover:-translate-y-px">
        {/* Clickable link overlay */}
        <Link
          href={`/board/${board.id}`}
          className="absolute inset-0 z-0"
          aria-label={board.title}
        />

        {/* Top accent bar */}
        <div className="h-[3px] w-full shrink-0" style={{ backgroundColor: accentColor }} />

        {/* Card body */}
        <div className="relative z-10 p-4 flex flex-col gap-3 pointer-events-none flex-1">
          {/* Header: avatar + title + dropdown */}
          <div className="flex items-start gap-3">
            {/* Board avatar */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${accentColor}22` }}
            >
              <span className="text-xs font-bold leading-none" style={{ color: accentColor }}>
                {initial}
              </span>
            </div>

            {/* Title + description */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
                {board.title}
              </h3>
              {board.description && (
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                  {board.description}
                </p>
              )}
            </div>

            {/* Dropdown — re-enable pointer events */}
            <div className="shrink-0 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    />
                  }
                >
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/board/${board.id}/settings`)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Настройки
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleArchive}>
                    <Archive className="mr-2 h-4 w-4" />
                    Архивировать
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-1.5 pt-2.5 border-t border-border mt-auto">
            <Clock className="h-3 w-3 text-muted-foreground/60 shrink-0" />
            <span className="text-xs text-muted-foreground/60 tabular-nums">
              {formatDistanceToNow(new Date(board.created_at), { addSuffix: true, locale: ru })}
            </span>
          </div>
        </div>

        {/* Hover gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top right, ${accentColor}10, transparent 65%)`,
          }}
        />
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить доску?</AlertDialogTitle>
            <AlertDialogDescription>
              Доска «{board.title}» и все её колонки и карточки будут удалены безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
