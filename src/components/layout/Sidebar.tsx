"use client"

import { ThemeToggle } from "@/components/ui/ThemeToggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { LayoutGrid, LogOut, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const { user, isLoading, signOut } = useAuth()
  const pathname = usePathname()

  const email = user?.email ?? ""
  const fullName =
    typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name : ""

  const initial = fullName
    ? fullName.charAt(0).toUpperCase()
    : email
      ? email.charAt(0).toUpperCase()
      : "U"

  const displayName = fullName || email || "User"
  const isDashboardActive = pathname.startsWith("/dashboard")

  return (
    <div className="w-[220px] flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col min-h-screen">

      {/* Logo + App name */}
      <div className="px-4 pt-5 pb-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-shadow duration-200 bg-gradient-to-br from-emerald-500 to-emerald-400"
            style={{ boxShadow: "var(--shadow-brand)" }}
          >
            <span className="font-bold text-white text-sm tracking-tight">A</span>
          </div>
          <div>
            <div className="text-sm font-bold text-sidebar-foreground leading-tight tracking-[-0.01em]">Agora</div>
            <div className="text-[10px] text-muted-foreground/60 leading-tight">Workspace</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.12em] px-2 mb-3">
          Навигация
        </p>

        <Link
          href="/dashboard"
          className="group relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150 hover:bg-sidebar-accent"
          style={isDashboardActive ? { background: "rgba(5,150,105,0.08)" } : undefined}
        >
          {isDashboardActive && (
            <div className="absolute left-0 inset-y-[6px] w-[3px] bg-emerald-500 rounded-r-full" />
          )}
          <LayoutGrid
            className={`h-4 w-4 flex-shrink-0 transition-colors duration-150 ${
              isDashboardActive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-sidebar-foreground/35 group-hover:text-sidebar-foreground/65"
            }`}
          />
          <span
            className={`text-sm transition-colors duration-150 ${
              isDashboardActive
                ? "font-semibold text-emerald-700 dark:text-emerald-400"
                : "font-medium text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
            }`}
          >
            Мои доски
          </span>
        </Link>
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-1.5">
          {!isLoading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer group rounded-lg px-2 py-2 hover:bg-sidebar-accent transition-colors duration-150">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150 bg-gradient-to-br from-emerald-500 to-emerald-400"
                >
                  <span className="text-white text-xs font-bold leading-none">{initial}</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-xs font-semibold text-sidebar-foreground truncate leading-tight">
                    {displayName}
                  </div>
                  <div className="text-[10px] text-muted-foreground/60 truncate leading-tight">
                    {email}
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right" className="w-40">
                <DropdownMenuItem render={<Link href="/profile" />}>
                  <User className="mr-2 h-4 w-4" />
                  Профиль
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={signOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ThemeToggle />
        </div>
      </div>

    </div>
  )
}
