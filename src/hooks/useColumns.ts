"use client"

import { createClient } from "@/lib/supabase/client"
import { useColumnStore } from "@/store/columnStore"
import type { Database } from "@/types/database"
import { useEffect, useMemo, useRef } from "react"

type Column = Database["public"]["Tables"]["columns"]["Row"]

export function useColumns(boardId: string) {
  const { columns, isLoading, setColumns, addColumn, updateColumn, removeColumn, setLoading } =
    useColumnStore()
  const supabase = useMemo(() => createClient(), [])
  const currentBoardIdRef = useRef(boardId)
  currentBoardIdRef.current = boardId

  useEffect(() => {
    if (boardId) fetchColumns()
  }, [boardId])

  const fetchColumns = async () => {
    const expectedBoardId = boardId
    setColumns([])
    setLoading(true)
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("board_id", boardId)
      .order("position", { ascending: true })

    // Discard result if boardId changed while fetching
    if (currentBoardIdRef.current !== expectedBoardId) return
    if (!error && data) setColumns(data as Column[])
    setLoading(false)
  }

  const createColumn = async (input: { title: string; wip_limit?: number | null }) => {
    // Read current state from store to avoid stale closure when creating columns rapidly
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

  const deleteColumn = async (id: string) => {
    const { error } = await supabase.from("columns").delete().eq("id", id)
    if (!error) removeColumn(id)
    return { error }
  }

  const reorderColumns = async (reordered: Column[]) => {
    const previous = useColumnStore.getState().columns
    setColumns(reordered)
    const updates = reordered.map((col, index) =>
      supabase
        .from("columns")
        .update({ position: index } as never)
        .eq("id", col.id)
    )
    const results = await Promise.all(updates)
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
