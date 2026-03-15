import { z } from "zod"

export const createColumnSchema = z.object({
  title: z.string().min(1, "Название обязательно").max(50, "Максимум 50 символов"),
  wip_limit: z.number().int().min(1).max(100).optional().nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .nullable(),
})

export const updateColumnSchema = createColumnSchema.partial()

export type CreateColumnInput = z.infer<typeof createColumnSchema>
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>
