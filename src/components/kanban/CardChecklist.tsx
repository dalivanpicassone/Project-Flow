"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type ChecklistWithItems, useCardChecklists } from "@/hooks/useCardChecklists"
import { CheckSquare, Plus, Trash2, X } from "lucide-react"
import { useState } from "react"

interface CardChecklistProps {
  cardId: string
}

export function CardChecklist({ cardId }: CardChecklistProps) {
  const {
    checklists,
    isLoading,
    totalItems,
    checkedItems,
    createChecklist,
    updateChecklistTitle,
    deleteChecklist,
    addItem,
    toggleItem,
    deleteItem,
  } = useCardChecklists(cardId)

  const [isAdding, setIsAdding] = useState(false)

  const handleAddChecklist = async () => {
    setIsAdding(true)
    await createChecklist()
    setIsAdding(false)
  }

  const overallPercent =
    totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Section heading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-[#c4c7d1]">
          <CheckSquare className="h-4 w-4 text-[#6366f1]" />
          Чеклисты
          {totalItems > 0 && (
            <span className="text-[#4b5563] text-xs">
              {checkedItems}/{totalItems}
            </span>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-[11px] text-[#6b7280] hover:text-[#818cf8] hover:bg-[#16161e]"
          disabled={isAdding || isLoading}
          onClick={handleAddChecklist}
        >
          <Plus className="h-3 w-3 mr-1" />
          Добавить
        </Button>
      </div>

      {/* Global progress bar */}
      {totalItems > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#4b5563] w-7 shrink-0 text-right">
            {overallPercent}%
          </span>
          <div className="flex-1 h-1.5 bg-[#1e1e2a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6366f1] rounded-full transition-all duration-300"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      )}

      {isLoading && <p className="text-xs text-[#4b5563]">Загрузка...</p>}

      {/* Each checklist */}
      {checklists.map((cl) => (
        <ChecklistBlock
          key={cl.id}
          checklist={cl}
          onTitleChange={(title) => updateChecklistTitle(cl.id, title)}
          onDelete={() => deleteChecklist(cl.id)}
          onAddItem={(title) => addItem(cl.id, title)}
          onToggle={(itemId, checked) => toggleItem(cl.id, itemId, checked)}
          onDeleteItem={(itemId) => deleteItem(cl.id, itemId)}
        />
      ))}

      {checklists.length === 0 && !isLoading && (
        <p className="text-xs text-[#4b5563] italic">
          Чеклистов нет. Нажмите «Добавить» чтобы создать первый.
        </p>
      )}
    </div>
  )
}

// ── Individual checklist block ────────────────────────────────────────────────

interface ChecklistBlockProps {
  checklist: ChecklistWithItems
  onTitleChange: (title: string) => void
  onDelete: () => void
  onAddItem: (title: string) => Promise<unknown>
  onToggle: (itemId: string, checked: boolean) => void
  onDeleteItem: (itemId: string) => void
}

function ChecklistBlock({
  checklist,
  onTitleChange,
  onDelete,
  onAddItem,
  onToggle,
  onDeleteItem,
}: ChecklistBlockProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(checklist.title)
  const [newItemTitle, setNewItemTitle] = useState("")
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [showNewItemInput, setShowNewItemInput] = useState(false)

  const checkedCount = checklist.items.filter((i) => i.is_checked).length
  const total = checklist.items.length
  const percent = total > 0 ? Math.round((checkedCount / total) * 100) : 0

  const handleTitleSave = () => {
    const trimmed = titleValue.trim()
    if (trimmed && trimmed !== checklist.title) onTitleChange(trimmed)
    setIsEditingTitle(false)
  }

  const handleAddItem = async () => {
    const trimmed = newItemTitle.trim()
    if (!trimmed || isAddingItem) return
    setIsAddingItem(true)
    await onAddItem(trimmed)
    setNewItemTitle("")
    setIsAddingItem(false)
  }

  return (
    <div className="space-y-2">
      {/* Checklist header */}
      <div className="flex items-center gap-2 group/cl">
        {isEditingTitle ? (
          <Input
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            className="h-7 text-xs flex-1 bg-[#111118] border-[#1e1e2a] text-[#e2e8f0]"
            autoFocus
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSave()
              if (e.key === "Escape") {
                setTitleValue(checklist.title)
                setIsEditingTitle(false)
              }
            }}
          />
        ) : (
          <button
            type="button"
            className="text-xs font-semibold text-[#c4c7d1] hover:text-white transition-colors flex-1 text-left"
            onClick={() => setIsEditingTitle(true)}
          >
            {checklist.title}
          </button>
        )}
        {total > 0 && (
          <span className="text-[10px] text-[#4b5563] shrink-0">
            {checkedCount}/{total}
          </span>
        )}
        <button
          type="button"
          className="opacity-0 group-hover/cl:opacity-100 transition-opacity text-[#4b5563] hover:text-red-400"
          onClick={onDelete}
          title="Удалить чеклист"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Progress bar for this checklist */}
      {total > 0 && (
        <div className="flex items-center gap-2 pl-0">
          <div className="flex-1 h-1 bg-[#1e1e2a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6366f1] rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-1 pl-1">
        {checklist.items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 group/item">
            {/* Custom checkbox */}
            <button
              type="button"
              className={`h-4 w-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                item.is_checked
                  ? "bg-[#6366f1] border-[#6366f1]"
                  : "border-[#2a2a3a] bg-transparent hover:border-[#6366f1]"
              }`}
              onClick={() => onToggle(item.id, !item.is_checked)}
            >
              {item.is_checked && (
                <svg
                  className="h-2.5 w-2.5 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <span
              className={`text-sm flex-1 leading-tight ${
                item.is_checked
                  ? "line-through text-[#4b5563]"
                  : "text-[#c4c7d1]"
              }`}
            >
              {item.title}
            </span>
            <button
              type="button"
              className="opacity-0 group-hover/item:opacity-100 transition-opacity text-[#374151] hover:text-red-400 shrink-0"
              onClick={() => onDeleteItem(item.id)}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Add item */}
      {showNewItemInput ? (
        <div className="flex gap-1.5 pl-1">
          <Input
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="Новый пункт..."
            className="h-7 text-xs flex-1 bg-[#111118] border-[#1e1e2a] text-[#e2e8f0] placeholder:text-[#4b5563]"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddItem()
              }
              if (e.key === "Escape") {
                setShowNewItemInput(false)
                setNewItemTitle("")
              }
            }}
          />
          <Button
            size="sm"
            className="h-7 px-2 text-xs bg-[#6366f1] hover:bg-[#4f52d4] shrink-0"
            disabled={isAddingItem || !newItemTitle.trim()}
            onClick={handleAddItem}
          >
            Добавить
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-[#6b7280]"
            onClick={() => {
              setShowNewItemInput(false)
              setNewItemTitle("")
            }}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs text-[#4b5563] hover:text-[#818cf8] transition-colors pl-1 py-0.5"
          onClick={() => setShowNewItemInput(true)}
        >
          <Plus className="h-3 w-3" />
          Добавить пункт
        </button>
      )}
    </div>
  )
}
