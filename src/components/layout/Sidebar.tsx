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
          <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-background text-xs tracking-tight">A</span>
          </div>
          <div className="text-sm font-semibold text-sidebar-foreground leading-tight tracking-[-0.01em]">Agora</div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        <Link
          href="/dashboard"
          className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors duration-150 hover:bg-sidebar-accent ${
            isDashboardActive ? "bg-sidebar-accent" : ""
          }`}
        >
          <LayoutGrid
            className={`h-3.5 w-3.5 flex-shrink-0 transition-colors duration-150 ${
              isDashboardActive
                ? "text-sidebar-foreground"
                : "text-muted-foreground group-hover:text-sidebar-foreground"
            }`}
          />
          <span
            className={`text-sm transition-colors duration-150 ${
              isDashboardActive
                ? "font-medium text-sidebar-foreground"
                : "text-muted-foreground group-hover:text-sidebar-foreground"
            }`}
          >
            Мои доски
          </span>
        </Link>
      </nav>

      {/* User section */}
      <div className="px-2 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-1.5">
          {!isLoading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer group rounded-md px-2.5 py-1.5 hover:bg-sidebar-accent transition-colors duration-150">
                <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center flex-shrink-0">
                  <span className="text-background text-[10px] font-bold leading-none">{initial}</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-xs font-medium text-sidebar-foreground truncate leading-tight">
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
