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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createCardSchema } from "@/lib/validations/card.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { z } from "zod"

interface CreateCardDialogProps {
  columnId: string
  onCreate: (columnId: string, input: { title: string; priority: string }) => Promise<unknown>
}

type CreateCardFormValues = z.input<typeof createCardSchema>

export function CreateCardDialog({ columnId, onCreate }: CreateCardDialogProps) {
  const [open, setOpen] = useState(false)
  const [priority, setPriority] = useState("medium")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCardFormValues>({
    resolver: zodResolver(createCardSchema),
  })

  const onSubmit = async (data: CreateCardFormValues) => {
    await onCreate(columnId, { title: data.title, priority })
    reset()
    setPriority("medium")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-foreground/20 hover:bg-muted/60 rounded-lg transition-all duration-150"
          />
        }
      >
        <Plus className="mr-1 h-4 w-4" />
        Добавить карточку
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Новая карточка</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="card-title">Название *</Label>
            <Input id="card-title" placeholder="Что нужно сделать?" {...register("title")} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="card-priority">Приоритет</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value ?? "medium")}>
              <SelectTrigger id="card-priority">
                <SelectValue
                  placeholder={
                    {
                      critical: "Критично",
                      high: "Высокий",
                      medium: "Средний",
                      low: "Низкий",
                    }[priority] ?? "Средний"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Критично</SelectItem>
                <SelectItem value="high">Высокий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="low">Низкий</SelectItem>
              </SelectContent>
            </Select>
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
