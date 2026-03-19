"use client"

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

  const isDashboardActive = pathname.startsWith("/dashboard")

  return (
    <div className="w-[52px] flex-shrink-0 bg-[#0a0a12] border-r border-[#141420] flex flex-col items-center py-3 gap-1.5 min-h-screen">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center mb-3"
      >
        <span className="font-bold text-white text-sm">P</span>
      </Link>

      {/* Divider */}
      <div className="w-6 h-px bg-[#1a1a24] my-1" />

      {/* Nav items */}
      <Link
        href="/dashboard"
        className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
        style={isDashboardActive ? { background: "#6366f115" } : undefined}
        title="Мои доски"
      >
        {isDashboardActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-[#6366f1] rounded-r" />
        )}
        <LayoutGrid
          className={`h-[18px] w-[18px] ${isDashboardActive ? "text-[#818cf8]" : "text-[#4b5563] hover:text-[#9ca3af]"}`}
        />
      </Link>

      {/* Spacer */}
      <div className="mt-auto" />

      {/* User avatar */}
      {!isLoading && user && (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-7 h-7 rounded-full bg-[#1e1e2a] border border-[#2a2a3a] flex items-center justify-center cursor-pointer hover:border-[#3a3a4a] transition-colors">
            <span className="text-[#818cf8] text-xs font-semibold">{initial}</span>
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
    </div>
  )
}
