"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useMemo, useState } from "react"

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

/**
 * Хук для управления участниками доски.
 * Предоставляет методы приглашения, удаления и смены роли участника.
 */
export function useBoardMembers(boardId: string) {
  const [members, setMembers] = useState<BoardMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // Мемоизируем клиент, чтобы не создавать новый экземпляр при каждом рендере
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (boardId) fetchMembers()
  }, [boardId])

  /**
   * Загружает участников доски вместе с их профилями.
   * Выполняет два запроса: сначала участники, затем профили по user_id.
   */
  const fetchMembers = async () => {
    setIsLoading(true)

    // Запрашиваем список участников доски
    const { data: memberData, error } = await supabase
      .from("board_members")
      .select("id, user_id, role")
      .eq("board_id", boardId)

    if (error || !memberData) {
      setIsLoading(false)
      return
    }

    // Запрашиваем профили для каждого участника
    const userIds = memberData.map((m) => m.user_id)
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", userIds)

    // Объединяем данные участников с их профилями
    const enriched: BoardMember[] = memberData.map((m) => {
      const profile = profiles?.find((p) => p.id === m.user_id)
      return {
        id: m.id,
        user_id: m.user_id,
        role: m.role as "owner" | "member",
        profile: {
          full_name: profile?.full_name ?? null,
          avatar_url: profile?.avatar_url ?? null,
          // Используем user_id как запасное значение, если email недоступен
          email: m.user_id,
        },
      }
    })

    setMembers(enriched)
    setIsLoading(false)
  }

  /**
   * Отправляет приглашение пользователю по email через API-маршрут.
   * Только владелец доски может приглашать участников.
   */
  const inviteMember = async (email: string): Promise<{ error: string | null }> => {
    const res = await fetch("/api/board/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId, email }),
    })

    const json = await res.json()
    if (!res.ok) return { error: json.error ?? "Ошибка приглашения" }

    // Обновляем список участников после успешного приглашения
    await fetchMembers()
    return { error: null }
  }

  /** Удаляет участника из доски по его идентификатору (не user_id). */
  const removeMember = async (memberId: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.from("board_members").delete().eq("id", memberId)

    if (error) return { error: error.message }
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
    return { error: null }
  }

  /** Изменяет роль участника в доске. */
  const updateRole = async (
    memberId: string,
    role: "owner" | "member"
  ): Promise<{ error: string | null }> => {
    const { error } = await supabase.from("board_members").update({ role }).eq("id", memberId)

    if (error) return { error: error.message }
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role } : m)))
    return { error: null }
  }

  return { members, isLoading, inviteMember, removeMember, updateRole, refetch: fetchMembers }
}
