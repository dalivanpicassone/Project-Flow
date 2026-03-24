import type { Database } from "@/types/database"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Создаёт Supabase-клиент для использования на сервере (Server Components, Route Handlers).
 * Читает куки из входящего запроса; запись куки игнорируется в Server Component-контексте.
 */
export async function createClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // В контексте Server Component куки устанавливать нельзя — игнорируем
        }
      },
    },
  })
}
