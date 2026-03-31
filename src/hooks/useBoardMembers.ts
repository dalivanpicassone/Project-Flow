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
   * Включает владельца доски (boards.owner_id), который не хранится в board_members.
   */
  const fetchMembers = async () => {
    setIsLoading(true)

    // Получаем owner_id доски и список участников параллельно
    const [boardResult, membersResult] = await Promise.all([
      supabase.from("boards").select("owner_id").eq("id", boardId).single(),
      supabase.from("board_members").select("id, user_id, role").eq("board_id", boardId),
    ])

    if (membersResult.error) {
      setIsLoading(false)
      return
    }

    const memberData = membersResult.data ?? []
    const ownerId = boardResult.data?.owner_id ?? null

    // Собираем уникальные user_id: участники + владелец (если его нет в board_members)
    const memberUserIds = new Set(memberData.map((m) => m.user_id))
    const ownerAlreadyMember = ownerId ? memberUserIds.has(ownerId) : true
    const allUserIds =
      ownerId && !ownerAlreadyMember ? [...memberUserIds, ownerId] : [...memberUserIds]

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", allUserIds)

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
          email: m.user_id,
        },
      }
    })

    // Добавляем владельца, если он не в board_members
    if (ownerId && !ownerAlreadyMember) {
      const ownerProfile = profiles?.find((p) => p.id === ownerId)
      enriched.unshift({
        id: `owner-${ownerId}`,
        user_id: ownerId,
        role: "owner",
        profile: {
          full_name: ownerProfile?.full_name ?? null,
          avatar_url: ownerProfile?.avatar_url ?? null,
          email: ownerId,
        },
      })
    }

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
