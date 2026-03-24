"use client"

import { useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useColumnStore } from "@/store/columnStore"
import { useCardStore } from "@/store/cardStore"
import type { Database } from "@/types/database"

type Column = Database["public"]["Tables"]["columns"]["Row"]
type Card = Database["public"]["Tables"]["cards"]["Row"]

/**
 * Хук для подписки на реальновременные изменения колонок и карточек через Supabase Realtime.
 * Автоматически синхронизирует локальные хранилища без полной перезагрузки.
 */
export function useRealtime(boardId: string) {
  const { addColumn, updateColumn, removeColumn } = useColumnStore()
  const { addCard, updateCard, removeCard } = useCardStore()
  // Мемоизируем клиент, чтобы не создавать новые подписки при каждом рендере
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!boardId) return

    // Подписка на изменения колонок доски
    const columnsChannel = supabase
      .channel(`columns:${boardId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "columns",
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            addColumn(payload.new as Column)
          } else if (payload.eventType === "UPDATE") {
            updateColumn(payload.new.id, payload.new as Partial<Column>)
          } else if (payload.eventType === "DELETE") {
            removeColumn(payload.old.id)
          }
        }
      )
      .subscribe()

    // Подписка на изменения карточек доски
    const cardsChannel = supabase
      .channel(`cards:${boardId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cards",
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            addCard(payload.new as Card)
          } else if (payload.eventType === "UPDATE") {
            updateCard(payload.new.id, payload.new as Partial<Card>)
          } else if (payload.eventType === "DELETE") {
            removeCard(payload.old.id)
          }
        }
      )
      .subscribe()

    // Отписываемся от обоих каналов при размонтировании компонента
    return () => {
      supabase.removeChannel(columnsChannel)
      supabase.removeChannel(cardsChannel)
    }
  }, [boardId, supabase, addColumn, updateColumn, removeColumn, addCard, updateCard, removeCard])
}
