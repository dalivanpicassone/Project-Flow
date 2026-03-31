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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { useBoardMembers } from "@/hooks/useBoardMembers"
import { useCards } from "@/hooks/useCards"
import { type UpdateCardInput, updateCardSchema } from "@/lib/validations/card.schema"
import { useColumnStore } from "@/store/columnStore"
import type { Database } from "@/types/database"
import type { Priority } from "@/types/database"
import { zodResolver } from "@hookform/resolvers/zod"
import { differenceInDays, format, formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { AlignLeft, CalendarDays, Clock, Layers, Plus, Tag, Trash2, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

type CardType = Database["public"]["Tables"]["cards"]["Row"]

interface CardDetailDialogProps {
  card: CardType | null
  boardId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CardDetailDialog({ card, boardId, open, onOpenChange }: CardDetailDialogProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [labelInput, setLabelInput] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { updateCardById, deleteCard } = useCards(boardId)
  const { members } = useBoardMembers(boardId)
  const columns = useColumnStore((s) => s.columns)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<UpdateCardInput>({
    resolver: zodResolver(updateCardSchema),
  })

  // Sync form when card changes
  useEffect(() => {
    if (card) {
      reset({
        title: card.title,
        description: card.description ?? "",
        priority: card.priority as Priority,
        due_date: card.due_date ?? "",
        labels: card.labels ?? [],
      })
    }
  }, [card, reset])

  if (!card) return null

  const currentColumn = columns.find((c) => c.id === card.column_id)

  // Cycle Time: days since moved_at (or created_at if never moved)
  const cycleStart = card.moved_at ? new Date(card.moved_at) : new Date(card.created_at)
  const cycleDays = differenceInDays(new Date(), cycleStart)

  const handleFieldSave = async (field: keyof UpdateCardInput, value: unknown) => {
    await updateCardById(card.id, { [field]: value })
  }

  const handleTitleSave = async (data: UpdateCardInput) => {
    await handleFieldSave("title", data.title)
    setIsEditingTitle(false)
  }

  const handleDescriptionSave = async (data: UpdateCardInput) => {
    await handleFieldSave("description", data.description)
    setIsEditingDescription(false)
  }

  const handlePriorityChange = async (value: string | null) => {
    if (!value) return
    setValue("priority", value as Priority)
    await handleFieldSave("priority", value)
  }

  const handleColumnChange = async (value: string | null) => {
    if (!value) return
    await updateCardById(card.id, {
      column_id: value,
      moved_at: new Date().toISOString(),
    })
  }

  const handleDueDateChange = async (value: string) => {
    await handleFieldSave("due_date", value || null)
  }

  const handleAssigneeChange = async (value: string | null) => {
    await updateCardById(card.id, { assignee_id: value || null })
  }

  const handleAddLabel = async () => {
    const trimmed = labelInput.trim()
    if (!trimmed) return
    const current = card.labels ?? []
    if (current.includes(trimmed)) return
    const updated = [...current, trimmed]
    await handleFieldSave("labels", updated)
    setLabelInput("")
  }

  const handleRemoveLabel = async (label: string) => {
    const updated = (card.labels ?? []).filter((l) => l !== label)
    await handleFieldSave("labels", updated)
  }

  const handleDelete = async () => {
    await deleteCard(card.id)
    setShowDeleteDialog(false)
    onOpenChange(false)
  }

  const priorityOptions: { value: Priority; label: string; emoji: string }[] = [
    { value: "critical", label: "Критично", emoji: "🔴" },
    { value: "high", label: "Высокий", emoji: "🟠" },
    { value: "medium", label: "Средний", emoji: "🟡" },
    { value: "low", label: "Низкий", emoji: "🟢" },
  ]

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-[45vw] min-w-[480px] max-w-none sm:max-w-none h-full overflow-y-auto bg-background border-l border-border flex flex-col gap-0 p-0"
          showCloseButton={false}
        >
          <SheetHeader className="px-6 pt-5 pb-4 border-b border-border shrink-0">
            <div className="flex items-start justify-between gap-3">
              {isEditingTitle ? (
                <form onSubmit={handleSubmit(handleTitleSave)} className="flex-1 flex gap-2">
                  <Input
                    {...register("title")}
                    className="text-base font-semibold bg-muted border-border text-foreground"
                    autoFocus
                    onBlur={handleSubmit(handleTitleSave)}
                  />
                </form>
              ) : (
                <SheetTitle
                  className="text-base font-semibold leading-snug cursor-pointer hover:text-brand transition-colors flex-1 text-foreground"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {card.title}
                </SheetTitle>
              )}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Column badge */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1.5">
              <Layers className="h-3.5 w-3.5" />
              <span>в колонке</span>
              <Badge variant="secondary" className="bg-muted text-muted-foreground border-border">
                {currentColumn?.title ?? "—"}
              </Badge>
            </div>
          </SheetHeader>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 py-5 flex-1">
            {/* ── Left column: main content ─────────────────────── */}
            <div className="sm:col-span-2 space-y-5">
              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <AlignLeft className="h-4 w-4" />
                  Описание
                </div>
                {isEditingDescription ? (
                  <form onSubmit={handleSubmit(handleDescriptionSave)} className="space-y-2">
                    <Textarea
                      {...register("description")}
                      rows={5}
                      placeholder="Добавьте описание задачи..."
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" disabled={isSubmitting}>
                        Сохранить
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingDescription(false)}
                      >
                        Отмена
                      </Button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    className="min-h-16 w-full p-3 rounded-md bg-muted border border-border cursor-pointer hover:bg-muted/80 transition-colors text-sm text-muted-foreground whitespace-pre-wrap text-left"
                    onClick={() => setIsEditingDescription(true)}
                  >
                    {card.description || (
                      <span className="text-muted-foreground italic">
                        Нажмите чтобы добавить описание...
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Labels */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  Метки
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(card.labels ?? []).map((label) => (
                    <Badge key={label} variant="secondary" className="gap-1 pr-1">
                      {label}
                      <button
                        type="button"
                        onClick={() => handleRemoveLabel(label)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={labelInput}
                    onChange={(e) => setLabelInput(e.target.value)}
                    placeholder="Добавить метку..."
                    className="h-8 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddLabel()
                      }
                    }}
                  />
                  <Button size="sm" variant="outline" className="h-8" onClick={handleAddLabel}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* PM Cycle Time */}
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Время в работе
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`text-2xl font-bold ${
                      cycleDays > 7
                        ? "text-red-600"
                        : cycleDays > 3
                          ? "text-orange-500"
                          : "text-green-600"
                    }`}
                  >
                    {cycleDays}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {cycleDays === 1 ? "день" : cycleDays < 5 ? "дня" : "дней"} в колонке
                    <br />
                    <span className="text-xs">
                      с {format(cycleStart, "d MMM yyyy", { locale: ru })}
                    </span>
                  </div>
                  {cycleDays > 7 && (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-600 border-red-200 text-xs dark:bg-red-950/40 dark:text-red-400 dark:border-red-900"
                    >
                      ⚠ Застряла
                    </Badge>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  Создана:{" "}
                  {formatDistanceToNow(new Date(card.created_at), {
                    addSuffix: true,
                    locale: ru,
                  })}
                </p>
                {card.moved_at && (
                  <p>
                    Перемещена:{" "}
                    {formatDistanceToNow(new Date(card.moved_at), {
                      addSuffix: true,
                      locale: ru,
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* ── Right column: metadata ────────────────────────── */}
            <div className="space-y-4">
              {/* Priority */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="priority-select"
                  className="text-xs text-muted-foreground uppercase tracking-wide"
                >
                  Приоритет
                </Label>
                <Select value={card.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue
                      placeholder={(() => {
                        const opt = priorityOptions.find((o) => o.value === card.priority)
                        return opt ? `${opt.emoji} ${opt.label}` : "Выберите"
                      })()}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.emoji} {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Move to column */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="column-select"
                  className="text-xs text-muted-foreground uppercase tracking-wide"
                >
                  Колонка
                </Label>
                <Select value={card.column_id} onValueChange={handleColumnChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Выберите колонку">
                      {currentColumn?.title ?? "..."}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="assignee-select"
                  className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1"
                >
                  <User className="h-3.5 w-3.5" />
                  Исполнитель
                </Label>
                <Select value={card.assignee_id ?? ""} onValueChange={handleAssigneeChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Не назначен">
                      {card.assignee_id
                        ? (members.find((m) => m.user_id === card.assignee_id)?.profile.full_name ??
                          "Участник")
                        : "Не назначен"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Не назначен</SelectItem>
                    {members.map((m) => (
                      <SelectItem key={m.user_id} value={m.user_id}>
                        {m.profile.full_name ?? "Участник"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Due date */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="due-date"
                  className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1"
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  Дедлайн
                </Label>
                <Input
                  id="due-date"
                  type="date"
                  defaultValue={card.due_date ?? ""}
                  className="h-9"
                  onChange={(e) => handleDueDateChange(e.target.value)}
                />
              </div>

              <Separator />

              {/* Delete */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-950/30"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить карточку
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить карточку?</AlertDialogTitle>
            <AlertDialogDescription>
              Карточка «{card.title}» будет удалена безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
