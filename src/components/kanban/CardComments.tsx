"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/useAuth"
import { useCardComments } from "@/hooks/useCardComments"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { Check, MessageCircle, Pencil, Send, Trash2, X } from "lucide-react"
import { useRef, useState } from "react"

interface CardCommentsProps {
  cardId: string
}

export function CardComments({ cardId }: CardCommentsProps) {
  const { comments, isLoading, addComment, updateComment, deleteComment } =
    useCardComments(cardId)
  const { user } = useAuth()

  const [newBody, setNewBody] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editBody, setEditBody] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = async () => {
    const trimmed = newBody.trim()
    if (!trimmed || isSending) return
    setIsSending(true)
    await addComment(trimmed)
    setNewBody("")
    setIsSending(false)
    textareaRef.current?.focus()
  }

  const handleStartEdit = (id: string, body: string) => {
    setEditingId(id)
    setEditBody(body)
  }

  const handleConfirmEdit = async (id: string) => {
    const trimmed = editBody.trim()
    if (!trimmed) return
    await updateComment(id, trimmed)
    setEditingId(null)
  }

  return (
    <div className="space-y-3">
      {/* Section heading */}
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <MessageCircle className="h-4 w-4 text-emerald-500" />
        Комментарии
        {comments.length > 0 && (
          <span className="text-muted-foreground text-xs">({comments.length})</span>
        )}
      </div>

      {/* Comment list */}
      {isLoading ? (
        <p className="text-xs text-muted-foreground">Загрузка...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">Комментариев пока нет</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => {
            const isOwn = comment.author_id === user?.id
            const displayName = comment.author_name ?? "Участник"
            const wasEdited = comment.updated_at !== comment.created_at

            return (
              <div key={comment.id} className="flex gap-2.5">
                {/* Avatar */}
                <div className="h-7 w-7 rounded-full bg-muted border border-border flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0 select-none">
                  {displayName.slice(0, 1).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Meta */}
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-semibold text-foreground">
                      {isOwn ? "Вы" : displayName}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: ru,
                      })}
                      {wasEdited && " · изм."}
                    </span>
                  </div>

                  {/* Body or edit form */}
                  {editingId === comment.id ? (
                    <div className="space-y-1.5">
                      <Textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        rows={2}
                        className="text-sm bg-background border-border resize-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleConfirmEdit(comment.id)
                          }
                          if (e.key === "Escape") setEditingId(null)
                        }}
                      />
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          className="h-6 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleConfirmEdit(comment.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Сохранить
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs text-muted-foreground"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="group/c">
                      <p className="text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed">
                        {comment.body}
                      </p>
                      {isOwn && (
                        <div className="flex gap-2 mt-1 opacity-0 group-hover/c:opacity-100 transition-opacity">
                          <button
                            type="button"
                            className="text-[10px] text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-0.5 transition-colors"
                            onClick={() => handleStartEdit(comment.id, comment.body)}
                          >
                            <Pencil className="h-2.5 w-2.5" />
                            изменить
                          </button>
                          <button
                            type="button"
                            className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-0.5 transition-colors"
                            onClick={() => deleteComment(comment.id)}
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                            удалить
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* New comment input */}
      <div className="flex gap-2 pt-1">
        <Textarea
          ref={textareaRef}
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          placeholder="Написать комментарий... (Enter — отправить, Shift+Enter — перенос)"
          rows={2}
          className="text-sm flex-1 bg-background border-border resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
        />
        <Button
          size="sm"
          disabled={!newBody.trim() || isSending}
          onClick={handleSend}
          className="self-end bg-emerald-600 hover:bg-emerald-700 text-white h-8 w-8 p-0"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
