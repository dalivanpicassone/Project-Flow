import { z } from "zod"

export const priorityEnum = z.enum(["critical", "high", "medium", "low"])

export const createCardSchema = z.object({
  title: z.string().min(1, "Название обязательно").max(200, "Максимум 200 символов"),
  description: z.string().max(5000).optional().nullable(),
  priority: priorityEnum.default("medium"),
  assignee_id: z.string().uuid().optional().nullable(),
  due_date: z.string().optional().nullable(),
  labels: z.array(z.string()).optional().nullable(),
})

export const updateCardSchema = createCardSchema.partial()

export type CreateCardInput = z.infer<typeof createCardSchema>
export type UpdateCardInput = z.infer<typeof updateCardSchema>
