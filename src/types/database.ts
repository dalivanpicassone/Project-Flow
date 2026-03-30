/** Приоритет карточки: critical > high > medium > low */
export type Priority = "critical" | "high" | "medium" | "low"
/** Роль пользователя на доске */
export type BoardRole = "owner" | "member"

/**
 * Типы таблиц базы данных Supabase.
 * Генерируется вручную на основе схемы миграций в /supabase/migrations/.
 */
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Relationships: []
      }
      boards: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          color: string | null
          is_archived: boolean
          created_at: string
        }
        Insert: {
          owner_id: string
          title: string
          description?: string | null
          color?: string | null
        }
        Update: {
          owner_id?: string
          title?: string
          description?: string | null
          color?: string | null
          is_archived?: boolean
        }
        Relationships: []
      }
      board_members: {
        Row: {
          id: string
          board_id: string
          user_id: string
          role: BoardRole
          joined_at: string
        }
        Insert: {
          board_id: string
          user_id: string
          role: BoardRole
        }
        Update: {
          board_id?: string
          user_id?: string
          role?: BoardRole
        }
        Relationships: []
      }
      columns: {
        Row: {
          id: string
          board_id: string
          title: string
          position: number
          wip_limit: number | null
          color: string | null
          created_at: string
        }
        Insert: {
          board_id: string
          title: string
          position: number
          wip_limit?: number | null
          color?: string | null
        }
        Update: {
          board_id?: string
          title?: string
          position?: number
          wip_limit?: number | null
          color?: string | null
        }
        Relationships: []
      }
      cards: {
        Row: {
          id: string
          column_id: string
          board_id: string
          title: string
          description: string | null
          priority: Priority
          assignee_id: string | null
          due_date: string | null
          labels: string[] | null
          position: number
          moved_at: string | null
          created_at: string
        }
        Insert: {
          column_id: string
          board_id: string
          title: string
          description?: string | null
          priority: Priority
          assignee_id?: string | null
          due_date?: string | null
          labels?: string[] | null
          position: number
          moved_at?: string | null
        }
        Update: {
          column_id?: string
          board_id?: string
          title?: string
          description?: string | null
          priority?: Priority
          assignee_id?: string | null
          due_date?: string | null
          labels?: string[] | null
          position?: number
          moved_at?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      board_role: BoardRole
      priority: Priority
    }
    CompositeTypes: Record<string, never>
  }
}

// Convenience type aliases for table Insert/Update shapes
export type BoardRow = Database["public"]["Tables"]["boards"]["Row"]
export type BoardInsert = Database["public"]["Tables"]["boards"]["Insert"]
export type BoardUpdate = Database["public"]["Tables"]["boards"]["Update"]

export type ColumnRow = Database["public"]["Tables"]["columns"]["Row"]
export type ColumnInsert = Database["public"]["Tables"]["columns"]["Insert"]
export type ColumnUpdate = Database["public"]["Tables"]["columns"]["Update"]

export type CardRow = Database["public"]["Tables"]["cards"]["Row"]
export type CardInsert = Database["public"]["Tables"]["cards"]["Insert"]
export type CardUpdate = Database["public"]["Tables"]["cards"]["Update"]
