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
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-[33px] h-[33px] rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-background text-sm tracking-tight">A</span>
          </div>
          <span className="text-[15px] font-semibold text-sidebar-foreground leading-tight tracking-[-0.01em]">
            Agora
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        <Link
          href="/dashboard"
          className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded transition-colors duration-100 ${
            isDashboardActive
              ? "bg-[#f2f9ff] text-[#0075de]"
              : "text-[#615d59] hover:bg-[#f6f5f4] hover:text-foreground"
          }`}
        >
          <LayoutGrid
            className={`h-3.5 w-3.5 flex-shrink-0 ${
              isDashboardActive ? "text-[#0075de]" : "text-[#a39e98] group-hover:text-[#615d59]"
            }`}
          />
          <span className={`text-[14px] font-medium ${isDashboardActive ? "font-semibold" : ""}`}>
            Мои доски
          </span>
        </Link>
      </nav>

      {/* User section */}
      <div className="px-2 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-1.5">
          {!isLoading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer group rounded px-2.5 py-1.5 hover:bg-[#f6f5f4] transition-colors duration-100">
                <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center flex-shrink-0">
                  <span className="text-background text-[10px] font-bold leading-none">{initial}</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-[13px] font-medium text-sidebar-foreground truncate leading-tight">
                    {displayName}
                  </div>
                  <div className="text-[11px] text-[#a39e98] truncate leading-tight">
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
