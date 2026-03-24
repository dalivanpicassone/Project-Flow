"use client"

import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

/**
 * Хук для управления состоянием аутентификации пользователя.
 * Подписывается на изменения сессии через Supabase Auth и
 * предоставляет метод выхода из системы.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  // Мемоизируем клиент, чтобы не создавать новый экземпляр при каждом рендере
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    // Supabase v2 генерирует INITIAL_SESSION синхронно, поэтому используем только
    // подписчик вместо отдельного вызова getSession(). Это исключает гонку, при которой
    // запоздавший getSession() мог бы перезаписать более свежее событие SIGNED_OUT.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Отписываемся при размонтировании компонента
    return () => subscription.unsubscribe()
  }, [supabase])

  /**
   * Выполняет выход пользователя из системы и перенаправляет на страницу входа.
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (!error) {
      setUser(null)
      router.replace("/login")
      router.refresh()
    }
  }

  return { user, isLoading, signOut }
}
