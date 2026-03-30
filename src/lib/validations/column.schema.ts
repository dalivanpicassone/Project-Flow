import { z } from "zod"

/** Схема валидации для создания новой колонки; wip_limit=null означает отсутствие лимита */
export const createColumnSchema = z.object({
  title: z.string().min(1, "Название обязательно").max(50, "Максимум 50 символов"),
  wip_limit: z
    .union([z.number().int().min(1, "Минимум 1").max(100, "Максимум 100"), z.null()])
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .nullable(),
})

/** Схема валидации для обновления колонки (все поля опциональны) */
export const updateColumnSchema = createColumnSchema.partial()

export type CreateColumnInput = z.infer<typeof createColumnSchema>
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>
