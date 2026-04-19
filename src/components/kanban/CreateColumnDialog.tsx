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
import { type CreateColumnInput, createColumnSchema } from "@/lib/validations/column.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface CreateColumnDialogProps {
  onCreate: (input: { title: string; wip_limit?: number | null }) => Promise<unknown>
}

export function CreateColumnDialog({ onCreate }: CreateColumnDialogProps) {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateColumnInput>({
    resolver: zodResolver(createColumnSchema),
  })

  const onSubmit = async (data: CreateColumnInput) => {
    await onCreate({ title: data.title, wip_limit: data.wip_limit ?? null })
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-2 h-9 px-3 text-[13px] font-medium text-[#a39e98] hover:text-[#615d59] hover:bg-[rgba(0,0,0,0.04)] rounded-md border border-dashed border-[rgba(0,0,0,0.12)] hover:border-[rgba(0,0,0,0.2)] transition-colors duration-150 whitespace-nowrap shrink-0"
          />
        }
      >
        <Plus className="h-4 w-4 shrink-0" />
        Добавить колонку
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Новая колонка</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="col-title">Название *</Label>
            <Input id="col-title" placeholder="To Do" {...register("title")} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="wip_limit">WIP-лимит (необязательно)</Label>
            <Input
              id="wip_limit"
              type="number"
              min={1}
              max={100}
              placeholder="Например: 3"
              {...register("wip_limit", {
                setValueAs: (v) => {
                  if (v === "" || v === null || v === undefined) return null
                  const num = Number(v)
                  return Number.isNaN(num) ? null : num
                },
              })}
            />
            <p className="text-xs text-muted-foreground">Максимальное число задач в колонке</p>
          </div>
          <div className="flex justify-end gap-2 pt-1">
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
