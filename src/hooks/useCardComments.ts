"use client"

import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/types/database"
import { useEffect, useState } from "react"

type Comment = Database["public"]["Tables"]["card_comments"]["Row"]

export function useCardComments(cardId: string | null) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!cardId) {
      setComments([])
      return
    }

    const supabase = createClient()
    let cancelled = false

    const fetchComments = async () => {
      setIsLoading(true)
      const { data } = await supabase
        .from("card_comments")
        .select("*")
        .eq("card_id", cardId)
        .order("created_at", { ascending: true })
      if (!cancelled && data) setComments(data as Comment[])
      if (!cancelled) setIsLoading(false)
    }

    fetchComments()

    const channel = supabase
      .channel(`card_comments:${cardId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "card_comments",
          filter: `card_id=eq.${cardId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setComments((prev) => {
              // Avoid duplicates if we already got it via optimistic insert
              if (prev.some((c) => c.id === (payload.new as Comment).id)) return prev
              return [...prev, payload.new as Comment]
            })
          } else if (payload.eventType === "UPDATE") {
            setComments((prev) =>
              prev.map((c) => (c.id === payload.new.id ? (payload.new as Comment) : c))
            )
          } else if (payload.eventType === "DELETE") {
            setComments((prev) => prev.filter((c) => c.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [cardId])

  const addComment = async (body: string): Promise<Comment | null> => {
    if (!cardId) return null

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    // Fetch display name for denormalization
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()

    const author_name =
      profile?.full_name ?? user.email?.split("@")[0] ?? "Пользователь"

    const { data, error } = await supabase
      .from("card_comments")
      .insert({ card_id: cardId, author_id: user.id, author_name, body })
      .select()
      .single()

    if (error || !data) return null

    // Optimistic add (realtime may arrive slightly later)
    setComments((prev) =>
      prev.some((c) => c.id === (data as Comment).id) ? prev : [...prev, data as Comment]
    )

    return data as Comment
  }

  const updateComment = async (id: string, body: string): Promise<boolean> => {
    const supabase = createClient()
    const { error } = await supabase
      .from("card_comments")
      .update({ body })
      .eq("id", id)
    return !error
  }

  const deleteComment = async (id: string): Promise<boolean> => {
    // Optimistic delete
    setComments((prev) => prev.filter((c) => c.id !== id))
    const supabase = createClient()
    const { error } = await supabase.from("card_comments").delete().eq("id", id)
    if (error) {
      // Rollback would require re-fetching; just leave it deleted since this
      // should be very rare and a page reload will recover state.
    }
    return !error
  }

  return { comments, isLoading, addComment, updateComment, deleteComment }
}
