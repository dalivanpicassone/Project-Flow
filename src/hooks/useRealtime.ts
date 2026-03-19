"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useColumnStore } from "@/store/columnStore"
import { useCardStore } from "@/store/cardStore"
import type { Database } from "@/types/database"

type Column = Database["public"]["Tables"]["columns"]["Row"]
type Card = Database["public"]["Tables"]["cards"]["Row"]

export function useRealtime(boardId: string) {
  const { addColumn, updateColumn, removeColumn } = useColumnStore()
  const { addCard, updateCard, removeCard } = useCardStore()
  const supabase = createClient()

  useEffect(() => {
    if (!boardId) return

    // Subscribe to columns changes
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

    // Subscribe to cards changes
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

    return () => {
      supabase.removeChannel(columnsChannel)
      supabase.removeChannel(cardsChannel)
    }
  }, [boardId])
}
