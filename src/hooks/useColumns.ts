"use client"

import { createClient } from "@/lib/supabase/client"
import { useColumnStore } from "@/store/columnStore"
import type { Database } from "@/types/database"
import { useEffect, useMemo, useRef } from "react"

type Column = Database["public"]["Tables"]["columns"]["Row"]

/**
 * Хук для работы с колонками Kanban-доски.
 * Реализует оптимистичное переупорядочивание и защиту от гонки запросов.
 */
export function useColumns(boardId: string) {
  const { columns, isLoading, setColumns, addColumn, updateColumn, removeColumn, setLoading } =
    useColumnStore()
  // Мемоизируем клиент, чтобы не создавать новый экземпляр при каждом рендере
  const supabase = useMemo(() => createClient(), [])
  // ref для отмены устаревших запросов при быстрой смене boardId
  const currentBoardIdRef = useRef(boardId)
  currentBoardIdRef.current = boardId

  useEffect(() => {
    if (boardId) fetchColumns()
  }, [boardId])

  /** Загружает колонки текущей доски, отсортированные по позиции. */
  const fetchColumns = async () => {
    // Сохраняем boardId на момент начала запроса для защиты от гонки
    const expectedBoardId = boardId
    setColumns([])
    setLoading(true)
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("board_id", boardId)
      .order("position", { ascending: true })

    // Отбрасываем результат, если boardId изменился пока шёл запрос
    if (currentBoardIdRef.current !== expectedBoardId) return
    if (!error && data) setColumns(data as Column[])
    setLoading(false)
  }

  /** Создаёт колонку в конце списка на текущей доске. */
  const createColumn = async (input: { title: string; wip_limit?: number | null }) => {
    // Читаем актуальное состояние из хранилища, чтобы избежать устаревшего замыкания
    // при быстром последовательном создании колонок
    const currentColumns = useColumnStore.getState().columns
    const maxPosition = currentColumns.length > 0 ? Math.max(...currentColumns.map((c) => c.position)) : -1
    const { data, error } = await supabase
      .from("columns")
      .insert({ ...input, board_id: boardId, position: maxPosition + 1 } as never)
      .select()
      .single()

    if (!error && data) addColumn(data as Column)
    return { data, error }
  }

  /** Обновляет поля колонки по идентификатору. */
  const updateColumnById = async (id: string, input: Partial<Column>) => {
    const { data, error } = await supabase
      .from("columns")
      .update(input as never)
      .eq("id", id)
      .select()
      .single()

    if (!error && data) updateColumn(id, data as Column)
    return { data, error }
  }

  /** Удаляет колонку и все её карточки (CASCADE на уровне БД). */
  const deleteColumn = async (id: string) => {
    const { error } = await supabase.from("columns").delete().eq("id", id)
    if (!error) removeColumn(id)
    return { error }
  }

  /**
   * Переупорядочивает колонки с оптимистичным обновлением UI.
   * При ошибке БД откатывает порядок к предыдущему.
   */
  const reorderColumns = async (reordered: Column[]) => {
    const previous = useColumnStore.getState().columns
    // Немедленно обновляем UI (оптимистичное обновление)
    setColumns(reordered)
    const updates = reordered.map((col, index) =>
      supabase
        .from("columns")
        .update({ position: index } as never)
        .eq("id", col.id)
    )
    const results = await Promise.all(updates)
    // Откатываем оптимистичное обновление при ошибке
    if (results.some((r) => r.error)) {
      setColumns(previous)
    }
  }

  return {
    columns,
    isLoading,
    createColumn,
    updateColumnById,
    deleteColumn,
    reorderColumns,
    refetch: fetchColumns,
  }
}
