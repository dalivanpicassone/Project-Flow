import { describe, expect, it } from "vitest"

describe("Utils", () => {
  it("должен импортировать cn функцию", async () => {
    const { cn } = await import("@/lib/utils")
    expect(cn).toBeDefined()
  })

  it("должен объединять классы через cn", async () => {
    const { cn } = await import("@/lib/utils")
    expect(cn("class1", "class2")).toBe("class1 class2")
    expect(cn("class1", false && "class2", null)).toBe("class1")
  })
})
