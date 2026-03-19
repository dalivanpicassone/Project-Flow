"use client"

import { createClient } from "@/lib/supabase/client"
import { useCardStore } from "@/store/cardStore"
import type { Database } from "@/types/database"
import { useEffect, useMemo, useRef } from "react"

type Card = Database["public"]["Tables"]["cards"]["Row"]

export function useCards(boardId: string) {
  const { cards, isLoading, setCards, addCard, updateCard, removeCard, setLoading } = useCardStore()
  const supabase = useMemo(() => createClient(), [])
  const currentBoardIdRef = useRef(boardId)
  currentBoardIdRef.current = boardId

  useEffect(() => {
    if (boardId) fetchCards()
  }, [boardId])

  const fetchCards = async () => {
    const expectedBoardId = boardId
    setCards([])
    setLoading(true)
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("board_id", boardId)
      .order("position", { ascending: true })

    // Discard result if boardId changed while fetching
    if (currentBoardIdRef.current !== expectedBoardId) return
    if (!error && data) setCards(data as Card[])
    setLoading(false)
  }

  const createCard = async (columnId: string, input: { title: string; priority?: string }) => {
    // Read current state from store to avoid stale closure when creating cards rapidly
    const currentCards = useCardStore.getState().cards
    const columnCards = currentCards.filter((c) => c.column_id === columnId)
    const maxPosition =
      columnCards.length > 0 ? Math.max(...columnCards.map((c) => c.position)) : -1

    const { data, error } = await supabase
      .from("cards")
      .insert({
        title: input.title,
        priority: input.priority ?? "medium",
        column_id: columnId,
        board_id: boardId,
        position: maxPosition + 1,
      } as never)
      .select()
      .single()

    if (!error && data) addCard(data as Card)
    return { data, error }
  }

  const updateCardById = async (id: string, input: Partial<Card>) => {
    const { data, error } = await supabase
      .from("cards")
      .update(input as never)
      .eq("id", id)
      .select()
      .single()

    if (!error && data) updateCard(id, data)
    return { data, error }
  }

  const deleteCard = async (id: string) => {
    const { error } = await supabase.from("cards").delete().eq("id", id)
    if (!error) removeCard(id)
    return { error }
  }

  const moveCard = async (
    cardId: string,
    newColumnId: string,
    updatedCards: Card[]
  ) => {
    const previousCards = useCardStore.getState().cards
    setCards(updatedCards)

    // Single batch: reorder all cards in the target column.
    // The moved card gets column_id + moved_at updated here too,
    // so we avoid a second conflicting UPDATE.
    const affected = updatedCards.filter((c) => c.column_id === newColumnId)
    const updates = affected.map((card, index) => {
      const patch =
        card.id === cardId
          ? { column_id: newColumnId, position: index, moved_at: new Date().toISOString() }
          : { position: index }
      return supabase.from("cards").update(patch as never).eq("id", card.id)
    })

    const results = await Promise.all(updates)
    if (results.some((r) => r.error)) {
      setCards(previousCards)
    }
  }

  return {
    cards,
    isLoading,
    createCard,
    updateCardById,
    deleteCard,
    moveCard,
    refetch: fetchCards,
  }
}
