"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export interface BoardMember {
  id: string
  user_id: string
  role: "owner" | "member"
  profile: {
    full_name: string | null
    avatar_url: string | null
    email: string
  }
}

export function useBoardMembers(boardId: string) {
  const [members, setMembers] = useState<BoardMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (boardId) fetchMembers()
  }, [boardId])

  const fetchMembers = async () => {
    setIsLoading(true)

    // Fetch board members with their profiles
    const { data: memberData, error } = await supabase
      .from("board_members")
      .select("id, user_id, role")
      .eq("board_id", boardId)

    if (error || !memberData) {
      setIsLoading(false)
      return
    }

    // Fetch profiles for each member
    const userIds = memberData.map((m) => m.user_id)
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", userIds)

    const enriched: BoardMember[] = memberData.map((m) => {
      const profile = profiles?.find((p) => p.id === m.user_id)
      return {
        id: m.id,
        user_id: m.user_id,
        role: m.role as "owner" | "member",
        profile: {
          full_name: profile?.full_name ?? null,
          avatar_url: profile?.avatar_url ?? null,
          email: m.user_id, // fallback; replaced below if available
        },
      }
    })

    setMembers(enriched)
    setIsLoading(false)
  }

  const inviteMember = async (email: string): Promise<{ error: string | null }> => {
    const res = await fetch("/api/board/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId, email }),
    })

    const json = await res.json()
    if (!res.ok) return { error: json.error ?? "Ошибка приглашения" }

    await fetchMembers()
    return { error: null }
  }

  const removeMember = async (memberId: string): Promise<{ error: string | null }> => {
    const { error } = await supabase
      .from("board_members")
      .delete()
      .eq("id", memberId)

    if (error) return { error: error.message }
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
    return { error: null }
  }

  const updateRole = async (
    memberId: string,
    role: "owner" | "member"
  ): Promise<{ error: string | null }> => {
    const { error } = await supabase
      .from("board_members")
      .update({ role })
      .eq("id", memberId)

    if (error) return { error: error.message }
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role } : m)))
    return { error: null }
  }

  return { members, isLoading, inviteMember, removeMember, updateRole, refetch: fetchMembers }
}
