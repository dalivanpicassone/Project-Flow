"use client"

import { createClient } from "@/lib/supabase/client"
import { useBoardStore } from "@/store/boardStore"
import type { Database } from "@/types/database"
import { useEffect, useMemo } from "react"

type Board = Database["public"]["Tables"]["boards"]["Row"]

/**
 * Хук для работы с досками пользователя.
 * Загружает доски при монтировании и предоставляет методы CRUD.
 * Состояние синхронизируется с глобальным хранилищем Zustand (boardStore).
 */
export function useBoards({ autoFetch = true }: { autoFetch?: boolean } = {}) {
  const { boards, isLoading, setBoards, addBoard, updateBoard, removeBoard, setLoading } =
    useBoardStore()
  // Мемоизируем клиент, чтобы не создавать новый экземпляр при каждом рендере
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (autoFetch) fetchBoards()
  // fetchBoards захватывает стабильные ссылки (мемоизированный supabase + Zustand сеттеры)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Загружает все не-архивированные доски текущего пользователя. */
  const fetchBoards = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("is_archived", false)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Ошибка загрузки досок:", error)
      setLoading(false)
      return
    }

    if (data) {
      setBoards(data as Board[])
    } else {
      console.warn("Доски не возвращены — проверьте RLS-политики и аутентификацию")
    }

    setLoading(false)
  }

  /** Создаёт новую доску и добавляет её в локальное состояние. */
  const createBoard = async (input: { title: string; description?: string; color?: string }) => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      console.error("Ошибка аутентификации:", sessionError)
      return { error: "Not authenticated" }
    }

    const user = sessionData.session.user

    const { data, error } = await supabase
      .from("boards")
      .insert({ ...input, owner_id: user.id } as never)
      .select()
      .single()

    if (error) {
      console.error("Ошибка создания доски:", error)
      return { data: null, error }
    }

    if (data) addBoard(data as Board)
    return { data, error }
  }

  /** Обновляет поля существующей доски по идентификатору. */
  const updateBoardById = async (id: string, input: Partial<Board>) => {
    const { data, error } = await supabase
      .from("boards")
      .update(input as never)
      .eq("id", id)
      .select()
      .single()

    if (!error && data) updateBoard(id, data)
    return { data, error }
  }

  /** Переводит доску в архив (скрывает из общего списка, не удаляет). */
  const archiveBoard = async (id: string) => {
    const { error } = await supabase
      .from("boards")
      .update({ is_archived: true } as never)
      .eq("id", id)

    if (!error) removeBoard(id)
    return { error }
  }

  /** Безвозвратно удаляет доску и все связанные данные. */
  const deleteBoard = async (id: string) => {
    const { error } = await supabase.from("boards").delete().eq("id", id)
    if (!error) removeBoard(id)
    return { error }
  }

  return {
    boards,
    isLoading,
    createBoard,
    updateBoardById,
    archiveBoard,
    deleteBoard,
    refetch: fetchBoards,
  }
}
