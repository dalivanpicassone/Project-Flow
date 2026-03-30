"use client"

import { useToast } from "@/hooks/useToast"
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
  const { toast } = useToast()
  // Мемоизируем клиент, чтобы не создавать новый экземпляр при каждом рендере
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (autoFetch) fetchBoards()
    // fetchBoards захватывает стабильные ссылки (мемоизированный supabase + Zustand сеттеры)
  }, [autoFetch])

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
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить доски. Попробуйте обновить страницу.",
      })
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
      toast({
        variant: "destructive",
        title: "Ошибка аутентификации",
        description: "Вы не авторизованы. Пожалуйста, войдите в систему.",
      })
      return { error: "Not authenticated" as const }
    }

    const user = sessionData.session.user

    const { data, error } = await supabase
      .from("boards")
      .insert({ ...input, owner_id: user.id })
      .select()
      .single()

    if (error) {
      console.error("Ошибка создания доски:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось создать доску.",
      })
      return { data: null, error }
    }

    if (data) {
      addBoard(data as Board)
      toast({
        variant: "success",
        title: "Доска создана",
        description: `Доска "${input.title}" успешно создана.`,
      })
    }
    return { data, error }
  }

  /** Обновляет поля существующей доски по идентификатору. */
  const updateBoardById = async (id: string, input: Partial<Board>) => {
    const { data, error } = await supabase
      .from("boards")
      .update(input)
      .eq("id", id)
      .select()
      .single()

    if (!error && data) {
      updateBoard(id, data)
      toast({
        variant: "success",
        title: "Изменения сохранены",
        description: "Доска успешно обновлена.",
      })
    } else if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось обновить доску.",
      })
    }
    return { data, error }
  }

  /** Переводит доску в архив (скрывает из общего списка, не удаляет). */
  const archiveBoard = async (id: string) => {
    const { error } = await supabase.from("boards").update({ is_archived: true }).eq("id", id)

    if (!error) {
      removeBoard(id)
      toast({
        variant: "success",
        title: "Доска архивирована",
        description: "Доска успешно перемещена в архив.",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось архивировать доску.",
      })
    }
    return { error }
  }

  /** Безвозвратно удаляет доску и все связанные данные. */
  const deleteBoard = async (id: string) => {
    const { error } = await supabase.from("boards").delete().eq("id", id)
    if (!error) {
      removeBoard(id)
      toast({
        variant: "success",
        title: "Доска удалена",
        description: "Доска и все связанные данные успешно удалены.",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось удалить доску.",
      })
    }
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
