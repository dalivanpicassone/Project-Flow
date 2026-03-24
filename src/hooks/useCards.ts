"use client"

import { createClient } from "@/lib/supabase/client"
import { useCardStore } from "@/store/cardStore"
import type { Database } from "@/types/database"
import { useEffect, useMemo, useRef } from "react"

type Card = Database["public"]["Tables"]["cards"]["Row"]

/**
 * Хук для работы с карточками на конкретной доске.
 * Реализует оптимистичные обновления при перемещении карточек
 * и защиту от гонки запросов при смене boardId.
 */
export function useCards(boardId: string) {
  const { cards, isLoading, setCards, addCard, updateCard, removeCard, setLoading } = useCardStore()
  // Мемоизируем клиент, чтобы не создавать новый экземпляр при каждом рендере
  const supabase = useMemo(() => createClient(), [])
  // ref для отмены устаревших запросов при быстрой смене boardId
  const currentBoardIdRef = useRef(boardId)
  currentBoardIdRef.current = boardId

  useEffect(() => {
    if (boardId) fetchCards()
  }, [boardId])

  /** Загружает карточки текущей доски, отсортированные по позиции. */
  const fetchCards = async () => {
    // Сохраняем boardId на момент начала запроса для защиты от гонки
    const expectedBoardId = boardId
    setCards([])
    setLoading(true)
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("board_id", boardId)
      .order("position", { ascending: true })

    // Отбрасываем результат, если boardId изменился пока шёл запрос
    if (currentBoardIdRef.current !== expectedBoardId) return
    if (!error && data) setCards(data as Card[])
    setLoading(false)
  }

  /** Создаёт карточку в конце указанной колонки. */
  const createCard = async (columnId: string, input: { title: string; priority?: string }) => {
    // Читаем актуальное состояние из хранилища, чтобы избежать устаревшего замыкания
    // при быстром последовательном создании карточек
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

  /** Обновляет поля карточки по идентификатору. */
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

  /** Удаляет карточку по идентификатору. */
  const deleteCard = async (id: string) => {
    const { error } = await supabase.from("cards").delete().eq("id", id)
    if (!error) removeCard(id)
    return { error }
  }

  /**
   * Перемещает карточку в другую колонку с оптимистичным обновлением UI.
   * При ошибке БД откатывает состояние к предыдущему.
   */
  const moveCard = async (
    cardId: string,
    newColumnId: string,
    updatedCards: Card[]
  ) => {
    const previousCards = useCardStore.getState().cards
    // Немедленно обновляем UI (оптимистичное обновление)
    setCards(updatedCards)

    // Один пакетный запрос: переупорядочиваем все карточки в целевой колонке.
    // Перемещаемая карточка получает column_id + moved_at в том же UPDATE,
    // чтобы избежать второго конфликтующего запроса.
    const affected = updatedCards.filter((c) => c.column_id === newColumnId)
    const updates = affected.map((card, index) => {
      const patch =
        card.id === cardId
          ? { column_id: newColumnId, position: index, moved_at: new Date().toISOString() }
          : { position: index }
      return supabase.from("cards").update(patch as never).eq("id", card.id)
    })

    const results = await Promise.all(updates)
    // Откатываем оптимистичное обновление при ошибке
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
