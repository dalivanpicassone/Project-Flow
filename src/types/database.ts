export type Priority = "critical" | "high" | "medium" | "low"
export type BoardRole = "owner" | "member"

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>
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
        Insert: Omit<
          Database["public"]["Tables"]["boards"]["Row"],
          "id" | "created_at" | "is_archived"
        >
        Update: Partial<Database["public"]["Tables"]["boards"]["Insert"]>
      }
      board_members: {
        Row: {
          id: string
          board_id: string
          user_id: string
          role: BoardRole
          joined_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["board_members"]["Row"], "id" | "joined_at">
        Update: Partial<Database["public"]["Tables"]["board_members"]["Insert"]>
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
        Insert: Omit<Database["public"]["Tables"]["columns"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["columns"]["Insert"]>
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
        Insert: Omit<Database["public"]["Tables"]["cards"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["cards"]["Insert"]>
      }
    }
  }
}
