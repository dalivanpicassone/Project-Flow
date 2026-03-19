"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useBoards } from "@/hooks/useBoards"
import { type CreateBoardInput, createBoardSchema } from "@/lib/validations/board.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

const BOARD_COLORS = [
  "#1E40AF",
  "#065F46",
  "#7C3AED",
  "#B45309",
  "#BE123C",
  "#0E7490",
  "#1D4ED8",
  "#374151",
]

export function CreateBoardDialog() {
  const [open, setOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(BOARD_COLORS[0])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { createBoard } = useBoards()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBoardInput>({
    resolver: zodResolver(createBoardSchema),
  })

  const onSubmit = async (data: CreateBoardInput) => {
    setSubmitError(null)
    const { error } = await createBoard({ ...data, color: selectedColor })

    if (error) {
      setSubmitError("Не удалось создать доску. Попробуйте ещё раз.")
      return
    }

    reset()
    setSelectedColor(BOARD_COLORS[0])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[#6366f1] hover:bg-[#4f52d4] text-white text-xs font-semibold h-[30px] px-3.5 rounded-lg" />
        }
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Новая доска
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Создать доску</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Название *</Label>
            <Input id="title" placeholder="Мой проект" {...register("title")} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Краткое описание проекта..."
              rows={3}
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="board-color">Цвет доски</Label>
            <div id="board-color" className="flex gap-2 flex-wrap">
              {BOARD_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColor === color ? "#000" : "transparent",
                  }}
                />
              ))}
            </div>
          </div>

          {submitError && (
            <p className="text-sm text-red-500">{submitError}</p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Создание..." : "Создать"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
