"use client"

import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"


export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    // Supabase v2 fires INITIAL_SESSION synchronously, so we rely solely on the
    // listener instead of calling getSession() separately. This avoids a race
    // where a late-resolving getSession() could overwrite a more recent
    // SIGNED_OUT event emitted by the listener.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

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
