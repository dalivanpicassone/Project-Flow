import type { Database } from "@/types/database"
import { createBrowserClient } from "@supabase/ssr"

/**
 * Создаёт Supabase-клиент для использования в браузере (Client Components).
 * Переменные окружения проверяются при вызове, чтобы ошибка обнаружилась
 * как можно раньше — ещё до выполнения запросов к Supabase.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
