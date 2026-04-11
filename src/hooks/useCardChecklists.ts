"use client"

import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/types/database"
import { useEffect, useState } from "react"

type Checklist = Database["public"]["Tables"]["card_checklists"]["Row"]
type ChecklistItem = Database["public"]["Tables"]["card_checklist_items"]["Row"]

export interface ChecklistWithItems extends Checklist {
  items: ChecklistItem[]
}

export function useCardChecklists(cardId: string | null) {
  const [checklists, setChecklists] = useState<ChecklistWithItems[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!cardId) {
      setChecklists([])
      return
    }

    const supabase = createClient()
    let cancelled = false

    const load = async () => {
      setIsLoading(true)

      const { data: clData } = await supabase
        .from("card_checklists")
        .select("*")
        .eq("card_id", cardId)
        .order("position", { ascending: true })

      if (cancelled) return

      if (!clData) {
        setIsLoading(false)
        return
      }

      const clRows = clData as Checklist[]
      const ids = clRows.map((cl) => cl.id)
      let itemData: ChecklistItem[] = []

      if (ids.length > 0) {
        const { data } = await supabase
          .from("card_checklist_items")
          .select("*")
          .in("checklist_id", ids)
          .order("position", { ascending: true })
        itemData = (data as ChecklistItem[] | null) ?? []
      }

      if (!cancelled) {
        setChecklists(
          clRows.map((cl) => ({
            ...cl,
            items: itemData.filter((i) => i.checklist_id === cl.id),
          }))
        )
        setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [cardId])

  // ── Checklists CRUD ────────────────────────────────────────────────────────

  const createChecklist = async (title = "Чеклист"): Promise<ChecklistWithItems | null> => {
    if (!cardId) return null
    const supabase = createClient()
    const { data, error } = await supabase
      .from("card_checklists")
      .insert({ card_id: cardId, title, position: checklists.length })
      .select()
      .single()
    if (error || !data) return null
    const withItems: ChecklistWithItems = { ...(data as Checklist), items: [] }
    setChecklists((prev) => [...prev, withItems])
    return withItems
  }

  const updateChecklistTitle = async (checklistId: string, title: string) => {
    setChecklists((prev) =>
      prev.map((cl) => (cl.id === checklistId ? { ...cl, title } : cl))
    )
    const supabase = createClient()
    await supabase.from("card_checklists").update({ title }).eq("id", checklistId)
  }

  const deleteChecklist = async (checklistId: string): Promise<boolean> => {
    setChecklists((prev) => prev.filter((cl) => cl.id !== checklistId))
    const supabase = createClient()
    const { error } = await supabase
      .from("card_checklists")
      .delete()
      .eq("id", checklistId)
    return !error
  }

  // ── Items CRUD ─────────────────────────────────────────────────────────────

  const addItem = async (
    checklistId: string,
    title: string
  ): Promise<ChecklistItem | null> => {
    const checklist = checklists.find((cl) => cl.id === checklistId)
    if (!checklist) return null
    const supabase = createClient()
    const { data, error } = await supabase
      .from("card_checklist_items")
      .insert({ checklist_id: checklistId, title, position: checklist.items.length })
      .select()
      .single()
    if (error || !data) return null
    const newItem = data as ChecklistItem
    setChecklists((prev) =>
      prev.map((cl) =>
        cl.id === checklistId ? { ...cl, items: [...cl.items, newItem] } : cl
      )
    )
    return newItem
  }

  const toggleItem = async (
    checklistId: string,
    itemId: string,
    is_checked: boolean
  ) => {
    // Optimistic update
    setChecklists((prev) =>
      prev.map((cl) =>
        cl.id === checklistId
          ? {
              ...cl,
              items: cl.items.map((i) =>
                i.id === itemId ? { ...i, is_checked } : i
              ),
            }
          : cl
      )
    )
    const supabase = createClient()
    const { error } = await supabase
      .from("card_checklist_items")
      .update({ is_checked })
      .eq("id", itemId)
    if (error) {
      // Roll back on failure
      setChecklists((prev) =>
        prev.map((cl) =>
          cl.id === checklistId
            ? {
                ...cl,
                items: cl.items.map((i) =>
                  i.id === itemId ? { ...i, is_checked: !is_checked } : i
                ),
              }
            : cl
        )
      )
    }
  }

  const deleteItem = async (checklistId: string, itemId: string): Promise<boolean> => {
    setChecklists((prev) =>
      prev.map((cl) =>
        cl.id === checklistId
          ? { ...cl, items: cl.items.filter((i) => i.id !== itemId) }
          : cl
      )
    )
    const supabase = createClient()
    const { error } = await supabase
      .from("card_checklist_items")
      .delete()
      .eq("id", itemId)
    return !error
  }

  // ── Aggregate progress ─────────────────────────────────────────────────────
  const totalItems = checklists.reduce((sum, cl) => sum + cl.items.length, 0)
  const checkedItems = checklists.reduce(
    (sum, cl) => sum + cl.items.filter((i) => i.is_checked).length,
    0
  )

  return {
    checklists,
    isLoading,
    totalItems,
    checkedItems,
    createChecklist,
    updateChecklistTitle,
    deleteChecklist,
    addItem,
    toggleItem,
    deleteItem,
  }
}
