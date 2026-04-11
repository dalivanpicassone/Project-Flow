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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { CardChecklist } from "@/components/kanban/CardChecklist"
import { CardComments } from "@/components/kanban/CardComments"
import { useBoardMembers } from "@/hooks/useBoardMembers"
import { useCards } from "@/hooks/useCards"
import { type UpdateCardInput, updateCardSchema } from "@/lib/validations/card.schema"
import { useColumnStore } from "@/store/columnStore"
import type { Database } from "@/types/database"
import type { Priority } from "@/types/database"
import { zodResolver } from "@hookform/resolvers/zod"
import { differenceInDays, format, formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { AlignLeft, CalendarDays, Clock, Layers, Plus, Trash2, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

type CardType = Database["public"]["Tables"]["cards"]["Row"]

interface CardDetailDialogProps {
  card: CardType | null
  boardId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const priorityOrder: Priority[] = ["critical", "high", "medium", "low"]

const priorityLabels: Record<Priority, string> = {
  critical: "Критично",
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
}

const priorityChipStyles: Record<Priority, string> = {
  critical:
    "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400",
  high: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-400",
  medium:
    "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-400",
  low: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400",
}

const priorityDotColors: Record<Priority, string> = {
  critical: "#dc2626",
  high: "#b45309",
  medium: "#1d4ed8",
  low: "#059669",
}

export function CardDetailDialog({ card, boardId, open, onOpenChange }: CardDetailDialogProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [labelInput, setLabelInput] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<"checklist" | "activity">("checklist")
  const [datePopoverOpen, setDatePopoverOpen] = useState(false)

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
  const currentColumnIndex = columns.findIndex((c) => c.id === card.column_id)
  const prevColumn = currentColumnIndex > 0 ? columns[currentColumnIndex - 1] : null
  const nextColumn = currentColumnIndex < columns.length - 1 ? columns[currentColumnIndex + 1] : null

  const cycleStart = card.moved_at ? new Date(card.moved_at) : new Date(card.created_at)
  const cycleDays = differenceInDays(new Date(), cycleStart)

  const currentPriority = (card.priority as Priority) ?? "medium"

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

  const handlePriorityChange = async (value: Priority) => {
    setValue("priority", value)
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
    const trimmed = (labelInput ?? "").trim()
    if (!trimmed) { setLabelInput(null); return }
    const current = card.labels ?? []
    if (current.includes(trimmed)) { setLabelInput(null); return }
    const updated = [...current, trimmed]
    await handleFieldSave("labels", updated)
    setLabelInput(null)
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

  const isOverdue = card.due_date && new Date(card.due_date) < new Date()

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-[45vw] min-w-[500px] max-w-none sm:max-w-none h-full flex flex-col gap-0 p-0 overflow-hidden bg-background border-l border-border"
          showCloseButton={false}
        >
          {/* ── Pipeline bar ── */}
          <div className="flex items-center h-10 px-5 bg-muted/40 border-b border-border shrink-0 gap-0 overflow-x-auto">
            {columns.map((col, idx) => {
              const isPast = idx < currentColumnIndex
              const isCurrent = idx === currentColumnIndex
              return (
                <div key={col.id} className="flex items-center shrink-0">
                  <button
                    type="button"
                    onClick={() => !isCurrent && handleColumnChange(col.id)}
                    className={[
                      "flex items-center gap-1.5 text-[11px] font-semibold transition-colors duration-150 px-1 whitespace-nowrap",
                      isCurrent
                        ? "text-emerald-600 dark:text-emerald-400 cursor-default"
                        : "text-muted-foreground/50 hover:text-muted-foreground cursor-pointer",
                    ].join(" ")}
                  >
                    <span
                      className="size-1.5 rounded-full shrink-0 transition-colors duration-150"
                      style={{
                        background: isCurrent ? "#059669" : isPast ? "#a7f3d0" : undefined,
                        opacity: isPast || isCurrent ? 1 : 0.35,
                        backgroundColor: !isCurrent && !isPast ? "currentColor" : undefined,
                      }}
                    />
                    {col.title}
                  </button>
                  {idx < columns.length - 1 && (
                    <span className="text-border mx-1 text-[10px] select-none">›</span>
                  )}
                </div>
              )
            })}
            <div className="ml-auto flex items-center gap-2 shrink-0 pl-4">
              {prevColumn && (
                <button
                  type="button"
                  onClick={() => handleColumnChange(prevColumn.id)}
                  className="h-6 px-2.5 text-[11px] font-semibold rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-colors duration-150 whitespace-nowrap"
                >
                  ← {prevColumn.title}
                </button>
              )}
              {nextColumn && (
                <button
                  type="button"
                  onClick={() => handleColumnChange(nextColumn.id)}
                  className="h-6 px-2.5 text-[11px] font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-150 whitespace-nowrap"
                >
                  {nextColumn.title} →
                </button>
              )}
            </div>
          </div>

          {/* ── Header ── */}
          <div className="relative flex gap-3 px-6 pt-5 pb-4 border-b border-border shrink-0">
            {/* Priority stripe */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full transition-colors duration-200"
              style={{
                background: card.priority
                  ? `var(--priority-${card.priority})`
                  : "var(--border)",
              }}
            />

            <div className="flex-1 min-w-0 pl-1">
              {/* Card ref */}
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50 mb-2 flex items-center gap-2">
                <span className="bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                  #{card.id.slice(0, 8).toUpperCase()}
                </span>
                <span>
                  создана{" "}
                  {formatDistanceToNow(new Date(card.created_at), { addSuffix: true, locale: ru })}
                </span>
              </p>

              {/* Editable title */}
              {isEditingTitle ? (
                <form onSubmit={handleSubmit(handleTitleSave)} className="mb-3">
                  <input
                    {...register("title")}
                    className="w-full text-[19px] font-extrabold text-foreground leading-snug tracking-tight bg-transparent border-0 border-b-2 border-emerald-400 outline-none pb-0.5 placeholder:text-muted-foreground/40"
                    autoFocus
                    onBlur={handleSubmit(handleTitleSave)}
                  />
                </form>
              ) : (
                <SheetTitle
                  className="text-[19px] font-extrabold leading-snug tracking-tight text-foreground cursor-pointer rounded-lg px-2 py-1 -mx-2 hover:bg-muted/60 transition-colors duration-150 mb-3"
                  onClick={() => setIsEditingTitle(true)}
                  title="Нажмите чтобы изменить"
                >
                  {card.title}
                </SheetTitle>
              )}

              {/* Meta chips row */}
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Priority chip — cycles on click */}
                <button
                  type="button"
                  onClick={() => {
                    const nextPriority =
                      priorityOrder[
                        (priorityOrder.indexOf(currentPriority) + 1) % priorityOrder.length
                      ]
                    handlePriorityChange(nextPriority)
                  }}
                  className={[
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11.5px] font-semibold transition-all duration-150 hover:opacity-80",
                    priorityChipStyles[currentPriority],
                  ].join(" ")}
                  title="Нажмите чтобы изменить приоритет"
                >
                  <span
                    className="size-1.5 rounded-full shrink-0"
                    style={{ background: priorityDotColors[currentPriority] }}
                  />
                  {priorityLabels[currentPriority]}
                </button>

                {/* Assignee chip */}
                <Select value={card.assignee_id ?? ""} onValueChange={handleAssigneeChange}>
                  <SelectTrigger className="h-auto py-1 px-2.5 border rounded-lg text-[11.5px] font-semibold gap-1.5 bg-muted/40 border-border hover:border-muted-foreground/40 transition-colors w-auto min-w-0">
                    <SelectValue>
                      <span className="flex items-center gap-1.5">
                        <span className="inline-flex size-4 rounded-[4px] bg-gradient-to-br from-emerald-500 to-emerald-400 items-center justify-center text-[8px] font-bold text-white shrink-0">
                          {card.assignee_id
                            ? (
                                members.find((m) => m.user_id === card.assignee_id)?.profile
                                  .full_name ?? "?"
                              )
                                .charAt(0)
                                .toUpperCase()
                            : "?"}
                        </span>
                        <span className="truncate max-w-[120px]">
                          {card.assignee_id
                            ? (members.find((m) => m.user_id === card.assignee_id)?.profile
                                .full_name ?? "Участник")
                            : "Не назначен"}
                        </span>
                      </span>
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

                {/* Label chips */}
                {(card.labels ?? []).map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 text-[11px] font-semibold dark:bg-indigo-950/30 dark:border-indigo-900 dark:text-indigo-400"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => handleRemoveLabel(label)}
                      className="hover:text-red-500 transition-colors leading-none ml-0.5"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}

                {/* Label input */}
                {labelInput !== null && (
                  <div className="flex items-center gap-1">
                    <input
                      value={labelInput}
                      onChange={(e) => setLabelInput(e.target.value)}
                      placeholder="Метка..."
                      autoFocus
                      className="h-7 w-24 text-[11.5px] px-2 rounded-lg border border-border bg-muted/40 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddLabel()
                        }
                        if (e.key === "Escape") setLabelInput(null)
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddLabel}
                      className="text-emerald-600 text-[11px] font-semibold hover:text-emerald-700"
                    >
                      OK
                    </button>
                  </div>
                )}

                {/* Add label button */}
                {labelInput === null && (
                  <button
                    type="button"
                    onClick={() => setLabelInput("")}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-dashed border-border text-[11px] font-semibold text-muted-foreground hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-colors dark:hover:bg-emerald-950/20 dark:hover:border-emerald-800 dark:hover:text-emerald-400"
                  >
                    <Plus className="h-3 w-3" />
                    метка
                  </button>
                )}
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="size-8 shrink-0 flex items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-colors mt-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="grid grid-cols-[1fr_200px] flex-1 min-h-0 overflow-hidden">
            {/* Left: content */}
            <div className="flex flex-col overflow-y-auto px-6 py-5 border-r border-border">
              {/* Description label */}
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 mb-2 flex items-center gap-1.5">
                <AlignLeft className="h-3 w-3" />
                Описание
              </p>

              {/* Description editor */}
              {isEditingDescription ? (
                <form onSubmit={handleSubmit(handleDescriptionSave)} className="space-y-2 mb-5">
                  <Textarea
                    {...register("description")}
                    rows={4}
                    placeholder="Добавьте описание задачи..."
                    autoFocus
                    className="text-[13px] leading-relaxed bg-muted/40 border-border focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 rounded-xl resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmitting}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs"
                    >
                      Сохранить
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => setIsEditingDescription(false)}
                    >
                      Отмена
                    </Button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  className="w-full min-h-16 p-3 mb-5 rounded-xl bg-muted/40 border border-border text-[13px] text-left leading-relaxed whitespace-pre-wrap cursor-text hover:border-emerald-300 hover:ring-2 hover:ring-emerald-500/10 transition-all duration-150"
                  onClick={() => setIsEditingDescription(true)}
                >
                  {card.description ? (
                    <span className="text-foreground">{card.description}</span>
                  ) : (
                    <span className="text-muted-foreground/50 italic">
                      Нажмите чтобы добавить описание...
                    </span>
                  )}
                </button>
              )}

              {/* Tab strip */}
              <div className="flex border-b border-border -mx-6 px-6 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("checklist")}
                  className={[
                    "flex items-center gap-1.5 pb-2.5 mr-5 text-[12px] font-semibold border-b-2 transition-colors duration-150",
                    activeTab === "checklist"
                      ? "border-emerald-500 text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  Чеклист
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("activity")}
                  className={[
                    "flex items-center gap-1.5 pb-2.5 text-[12px] font-semibold border-b-2 transition-colors duration-150",
                    activeTab === "activity"
                      ? "border-emerald-500 text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  Комментарии
                </button>
              </div>

              {/* Tab content */}
              <div className="pt-4 flex-1">
                {activeTab === "checklist" && <CardChecklist cardId={card.id} />}
                {activeTab === "activity" && <CardComments cardId={card.id} />}
              </div>
            </div>

            {/* Right: properties sidebar */}
            <div className="overflow-y-auto bg-muted/20 p-5 flex flex-col gap-4">
              {/* Column */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 mb-1.5 flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  Колонка
                </p>
                <Select value={card.column_id} onValueChange={handleColumnChange}>
                  <SelectTrigger className="h-8 text-[12px] bg-background border-border hover:border-muted-foreground/40 transition-colors">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        <span
                          className="size-2 rounded-sm shrink-0"
                          style={{ background: currentColumn?.color ?? "#6b7280" }}
                        />
                        {currentColumn?.title ?? "—"}
                      </span>
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
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 mb-1.5 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Исполнитель
                </p>
                <Select value={card.assignee_id ?? ""} onValueChange={handleAssigneeChange}>
                  <SelectTrigger className="h-8 text-[12px] bg-background border-border hover:border-muted-foreground/40 transition-colors">
                    <SelectValue>
                      {card.assignee_id
                        ? (members.find((m) => m.user_id === card.assignee_id)?.profile
                            .full_name ?? "Участник")
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

              {/* Due date — Calendar popover */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 mb-1.5 flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  Дедлайн
                </p>
                <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                  <PopoverTrigger
                    render={
                      <button
                        type="button"
                        className={[
                          "w-full h-8 px-2.5 rounded-lg border text-[12px] font-semibold flex items-center gap-2 transition-colors duration-150",
                          isOverdue
                            ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400"
                            : card.due_date
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400"
                              : "bg-background border-border text-muted-foreground hover:border-muted-foreground/40",
                        ].join(" ")}
                      >
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        {card.due_date
                          ? format(new Date(card.due_date), "d MMMM", { locale: ru })
                          : "Выбрать дату"}
                      </button>
                    }
                  />
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={card.due_date ? new Date(card.due_date) : undefined}
                      onSelect={(date) => {
                        handleDueDateChange(date ? format(date, "yyyy-MM-dd") : "")
                        setDatePopoverOpen(false)
                      }}
                      initialFocus
                    />
                    {card.due_date && (
                      <div className="border-t border-border p-2">
                        <button
                          type="button"
                          className="w-full text-[11px] font-semibold text-muted-foreground hover:text-destructive transition-colors py-1"
                          onClick={() => {
                            handleDueDateChange("")
                            setDatePopoverOpen(false)
                          }}
                        >
                          Снять дедлайн
                        </button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>

              {/* Cycle time */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 mb-1.5 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Время в работе
                </p>
                <div className="bg-background border border-border rounded-lg px-3 py-2 text-center">
                  <p
                    className={[
                      "text-2xl font-black leading-none",
                      cycleDays > 7
                        ? "text-red-600 dark:text-red-400"
                        : cycleDays > 3
                          ? "text-amber-500 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400",
                    ].join(" ")}
                  >
                    {cycleDays}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 font-semibold mt-1 uppercase tracking-[0.05em]">
                    {cycleDays === 1 ? "день" : cycleDays < 5 ? "дня" : "дней"}
                  </p>
                  <p className="text-[10px] text-muted-foreground/40 mt-0.5">
                    с {format(cycleStart, "d MMM", { locale: ru })}
                  </p>
                </div>
              </div>

              <div className="flex-1" />

              {/* Delete */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 text-[11.5px] font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-100 hover:border-red-200 dark:border-red-900/50 dark:hover:bg-red-950/30 transition-colors"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Удалить карточку
              </Button>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="shrink-0 border-t border-border bg-muted/20 px-6 py-3">
            <p className="text-[11px] text-muted-foreground/40 font-medium leading-none">
              Создана{" "}
              {formatDistanceToNow(new Date(card.created_at), { addSuffix: true, locale: ru })}
              {card.moved_at && (
                <>
                  {" · "}Перемещена{" "}
                  {formatDistanceToNow(new Date(card.moved_at), { addSuffix: true, locale: ru })}
                </>
              )}
            </p>
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
