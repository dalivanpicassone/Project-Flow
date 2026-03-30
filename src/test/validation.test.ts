import { describe, expect, it } from "vitest"

describe("Validation Schemas", () => {
  it("должен валидировать правильные данные для входа", async () => {
    const { loginSchema } = await import("@/lib/validations/auth.schema")
    const result = loginSchema.safeParse({ email: "test@example.com", password: "password123" })
    expect(result.success).toBe(true)
  })

  it("должен отклонять неправильный email", async () => {
    const { loginSchema } = await import("@/lib/validations/auth.schema")
    const result = loginSchema.safeParse({ email: "invalid", password: "password123" })
    expect(result.success).toBe(false)
  })

  it("должен отклонять короткий пароль", async () => {
    const { loginSchema } = await import("@/lib/validations/auth.schema")
    const result = loginSchema.safeParse({ email: "test@example.com", password: "123" })
    expect(result.success).toBe(false)
  })

  it("должен валидировать правильные данные для регистрации", async () => {
    const { registerSchema } = await import("@/lib/validations/auth.schema")
    const result = registerSchema.safeParse({
      full_name: "Иван Иванов",
      email: "test@example.com",
      password: "password123",
      confirm_password: "password123",
    })
    expect(result.success).toBe(true)
  })

  it("должен отклонять регистрацию с несовпадающими паролями", async () => {
    const { registerSchema } = await import("@/lib/validations/auth.schema")
    const result = registerSchema.safeParse({
      full_name: "Иван Иванов",
      email: "test@example.com",
      password: "password123",
      confirm_password: "password456",
    })
    expect(result.success).toBe(false)
  })

  it("должен валидировать создание доски", async () => {
    const { createBoardSchema } = await import("@/lib/validations/board.schema")
    const result = createBoardSchema.safeParse({ title: "Моя доска" })
    expect(result.success).toBe(true)
  })

  it("должен отклонять доску без названия", async () => {
    const { createBoardSchema } = await import("@/lib/validations/board.schema")
    const result = createBoardSchema.safeParse({ title: "" })
    expect(result.success).toBe(false)
  })

  it("должен валидировать создание карточки", async () => {
    const { createCardSchema } = await import("@/lib/validations/card.schema")
    const result = createCardSchema.safeParse({ title: "Задача", priority: "high" })
    expect(result.success).toBe(true)
  })

  it("должен валидировать создание колонки", async () => {
    const { createColumnSchema } = await import("@/lib/validations/column.schema")
    const result = createColumnSchema.safeParse({ title: "В работе" })
    expect(result.success).toBe(true)
  })
})
