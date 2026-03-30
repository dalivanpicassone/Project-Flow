import { createClient } from "@/lib/supabase/client"
import type {
  BoardInsert,
  BoardUpdate,
  CardInsert,
  CardUpdate,
  ColumnInsert,
  ColumnUpdate,
} from "@/types/database"

/**
 * Централизованный API-слой для работы с Supabase.
 * Предоставляет типизированные методы для CRUD-операций.
 */
export const boardApi = {
  /** Получить все неархивированные доски пользователя */
  async getActiveBoards() {
    const supabase = createClient()
    return await supabase
      .from("boards")
      .select("*")
      .eq("is_archived", false)
      .order("created_at", { ascending: false })
  },

  /** Создать новую доску */
  async createBoard(input: Omit<BoardInsert, "id" | "created_at" | "is_archived">) {
    const supabase = createClient()
    return await supabase.from("boards").insert(input).select().single()
  },

  /** Обновить доску по ID */
  async updateBoard(id: string, input: BoardUpdate) {
    const supabase = createClient()
    return await supabase.from("boards").update(input).eq("id", id).select().single()
  },

  /** Архивировать доску */
  async archiveBoard(id: string) {
    const supabase = createClient()
    return await supabase.from("boards").update({ is_archived: true }).eq("id", id)
  },

  /** Удалить доску */
  async deleteBoard(id: string) {
    const supabase = createClient()
    return await supabase.from("boards").delete().eq("id", id)
  },

  /** Получить доску по ID */
  async getBoardById(id: string) {
    const supabase = createClient()
    return await supabase.from("boards").select().eq("id", id).single()
  },
}

export const columnApi = {
  /** Получить колонки доски */
  async getByBoardId(boardId: string) {
    const supabase = createClient()
    return await supabase
      .from("columns")
      .select("*")
      .eq("board_id", boardId)
      .order("position", { ascending: true })
  },

  /** Создать колонку */
  async createColumn(input: Omit<ColumnInsert, "id" | "created_at">) {
    const supabase = createClient()
    return await supabase.from("columns").insert(input).select().single()
  },

  /** Обновить колонку */
  async updateColumn(id: string, input: ColumnUpdate) {
    const supabase = createClient()
    return await supabase.from("columns").update(input).eq("id", id).select().single()
  },

  /** Удалить колонку */
  async deleteColumn(id: string) {
    const supabase = createClient()
    return await supabase.from("columns").delete().eq("id", id)
  },

  /** Массовое обновление позиций колонок */
  async updatePositions(updates: Array<{ id: string; position: number }>) {
    const supabase = createClient()
    const queries = updates.map(({ id, position }) =>
      supabase.from("columns").update({ position }).eq("id", id)
    )
    return await Promise.all(queries)
  },
}

export const cardApi = {
  /** Получить карточки доски */
  async getByBoardId(boardId: string) {
    const supabase = createClient()
    return await supabase
      .from("cards")
      .select("*")
      .eq("board_id", boardId)
      .order("position", { ascending: true })
  },

  /** Получить карточки колонки */
  async getByColumnId(columnId: string) {
    const supabase = createClient()
    return await supabase
      .from("cards")
      .select("*")
      .eq("column_id", columnId)
      .order("position", { ascending: true })
  },

  /** Создать карточку */
  async createCard(input: Omit<CardInsert, "id" | "created_at">) {
    const supabase = createClient()
    return await supabase.from("cards").insert(input).select().single()
  },

  /** Обновить карточку */
  async updateCard(id: string, input: CardUpdate) {
    const supabase = createClient()
    return await supabase.from("cards").update(input).eq("id", id).select().single()
  },

  /** Удалить карточку */
  async deleteCard(id: string) {
    const supabase = createClient()
    return await supabase.from("cards").delete().eq("id", id)
  },

  /** Массовое обновление позиций карточек */
  async updatePositions(
    updates: Array<{ id: string; position: number; column_id?: string; moved_at?: string }>
  ) {
    const supabase = createClient()
    const queries = updates.map(({ id, position, column_id, moved_at }) => {
      const patch: Record<string, unknown> = { position }
      if (column_id !== undefined) patch.column_id = column_id
      if (moved_at !== undefined) patch.moved_at = moved_at
      return supabase.from("cards").update(patch).eq("id", id)
    })
    return await Promise.all(queries)
  },
}

/** API для работы с участниками доски */
export const boardMembersApi = {
  /** Получить участников доски */
  async getByBoardId(boardId: string) {
    const supabase = createClient()
    return await supabase.from("board_members").select("id, user_id, role").eq("board_id", boardId)
  },

  /** Пригласить участника */
  async inviteMember(boardId: string, userId: string, role: "owner" | "member" = "member") {
    const supabase = createClient()
    return await supabase.from("board_members").insert({ board_id: boardId, user_id: userId, role })
  },

  /** Удалить участника */
  async removeMember(memberId: string) {
    const supabase = createClient()
    return await supabase.from("board_members").delete().eq("id", memberId)
  },

  /** Обновить роль участника */
  async updateRole(memberId: string, role: "owner" | "member") {
    const supabase = createClient()
    return await supabase.from("board_members").update({ role }).eq("id", memberId)
  },
}

/** API для работы с профилем пользователя */
export const profileApi = {
  /** Получить профиль */
  async getProfile(userId: string) {
    const supabase = createClient()
    return await supabase.from("profiles").select().eq("id", userId).single()
  },

  /** Обновить профиль */
  async updateProfile(
    userId: string,
    input: { full_name?: string | null; avatar_url?: string | null }
  ) {
    const supabase = createClient()
    return await supabase.from("profiles").update(input).eq("id", userId)
  },
}
