import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

/**
 * Next.js middleware для защиты маршрутов через Supabase Auth.
 *
 * Логика:
 * - Неаутентифицированные пользователи перенаправляются на /login
 *   при попытке зайти на защищённые маршруты.
 * - Аутентифицированные пользователи перенаправляются на /dashboard
 *   при попытке зайти на страницы входа/регистрации.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  // Создаём server-клиент с пробросом куки через запрос и ответ
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        // Сначала обновляем куки в объекте запроса
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }

        // Пересоздаём объект ответа с обновлённым запросом
        supabaseResponse = NextResponse.next({ request })

        // Затем устанавливаем куки в ответе, чтобы браузер их сохранил
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options)
        }
      },
    },
  })

  // ВАЖНО: используем getUser() вместо getSession() для серверной валидации
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register")

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/board") ||
    request.nextUrl.pathname.startsWith("/profile")

  // Перенаправляем неаутентифицированных пользователей на вход
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Перенаправляем аутентифицированных пользователей с auth-страниц
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}

/** Применяем middleware ко всем маршрутам, кроме статических ресурсов */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
