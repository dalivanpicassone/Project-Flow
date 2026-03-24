import { z } from "zod"

/** Схема валидации для создания новой доски */
export const createBoardSchema = z.object({
  title: z.string().min(1, "Название обязательно").max(100, "Максимум 100 символов"),
  description: z.string().max(500, "Максимум 500 символов").optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Неверный формат цвета")
    .optional(),
})

/** Схема валидации для обновления доски (все поля опциональны) */
export const updateBoardSchema = createBoardSchema.partial()

export type CreateBoardInput = z.infer<typeof createBoardSchema>
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>
