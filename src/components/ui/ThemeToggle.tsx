"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggle = () => setTheme(resolvedTheme === "dark" ? "light" : "dark")

  return (
    <button
      type="button"
      onClick={toggle}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground"
      title={resolvedTheme === "dark" ? "Светлая тема" : "Тёмная тема"}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </button>
  )
}
