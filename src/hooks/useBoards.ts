"use client"

import { createClient } from "@/lib/supabase/client"
import { useBoardStore } from "@/store/boardStore"
import type { Database } from "@/types/database"
import { useEffect, useMemo } from "react"

type Board = Database["public"]["Tables"]["boards"]["Row"]

export function useBoards() {
  const { boards, isLoading, setBoards, addBoard, updateBoard, removeBoard, setLoading } =
    useBoardStore()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    fetchBoards()
  // fetchBoards captures stable references (memoized supabase + Zustand setters)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchBoards = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("is_archived", false)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching boards:", error)
      setLoading(false)
      return
    }

    if (data) {
      setBoards(data as Board[])
    } else {
      console.warn("No boards returned - check RLS policies and authentication")
    }

    setLoading(false)
  }

  const createBoard = async (input: { title: string; description?: string; color?: string }) => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      console.error("Authentication error:", sessionError)
      return { error: "Not authenticated" }
    }

    const user = sessionData.session.user

    const { data, error } = await supabase
      .from("boards")
      .insert({ ...input, owner_id: user.id } as never)
      .select()
      .single()

    if (error) {
      console.error("Error creating board:", error)
      return { data: null, error }
    }

    if (data) addBoard(data as Board)
    return { data, error }
  }

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

  const archiveBoard = async (id: string) => {
    const { error } = await supabase
      .from("boards")
      .update({ is_archived: true } as never)
      .eq("id", id)

    if (!error) removeBoard(id)
    return { error }
  }

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
