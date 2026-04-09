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
    <div className="w-[200px] flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col min-h-screen">

      {/* Logo + App name */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-white text-sm">P</span>
          </div>
          <div>
            <div className="text-sm font-bold text-sidebar-foreground leading-tight">ProjectFlow</div>
            <div className="text-[10px] text-muted-foreground leading-tight">Workspace</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3">
        <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-2 mb-2">
          Навигация
        </p>

        <Link
          href="/dashboard"
          className="relative flex items-center gap-3 px-2.5 py-2 rounded-lg transition-colors duration-150"
          style={isDashboardActive ? { background: "#6366f115" } : undefined}
          title="Мои доски"
        >
          {isDashboardActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#6366f1] rounded-r" />
          )}
          <LayoutGrid
            className={`h-[18px] w-[18px] flex-shrink-0 ${
              isDashboardActive ? "text-[#818cf8]" : "text-sidebar-foreground/40"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              isDashboardActive ? "text-[#818cf8]" : "text-sidebar-foreground/50"
            }`}
          >
            Мои доски
          </span>
        </Link>
      </nav>

      {/* User section */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          {!isLoading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer group">
                <div className="w-7 h-7 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center flex-shrink-0 group-hover:border-sidebar-ring transition-colors duration-150">
                  <span className="text-[#818cf8] text-xs font-semibold">{initial}</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-xs font-semibold text-sidebar-foreground truncate leading-tight">
                    {displayName}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate leading-tight">
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
