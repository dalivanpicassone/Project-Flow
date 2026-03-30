import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

/**
 * POST /api/board/invite
 *
 * Приглашает пользователя по email на доску.
 * Доступно только владельцу (owner) доски.
 * Использует admin-клиент для поиска пользователя по email.
 */
export async function POST(request: Request) {
  const { boardId, email } = await request.json()

  if (!boardId || !email) {
    return NextResponse.json({ error: "boardId and email are required" }, { status: 400 })
  }

  const supabase = await createClient()

  // Проверяем, что запрос делает аутентифицированный пользователь
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Проверяем, что текущий пользователь является владельцем доски
  const { data: board } = (await supabase
    .from("boards")
    .select("owner_id")
    .eq("id", boardId)
    .single()) as { data: { owner_id: string } | null; error: unknown }

  if (!board || board.owner_id !== user.id) {
    return NextResponse.json({ error: "Only the board owner can invite members" }, { status: 403 })
  }

  // Используем admin-клиент для поиска пользователя по email
  // (service role key НЕ должен передаваться на клиент; обрабатывается только на сервере)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      { error: "Server configuration error: missing Supabase credentials" },
      { status: 500 }
    )
  }

  const adminClient = createAdminClient(supabaseUrl, supabaseServiceRoleKey)

  const {
    data: { users },
    error: listError,
  } = await adminClient.auth.admin.listUsers()
  if (listError) {
    return NextResponse.json({ error: "Failed to look up users" }, { status: 500 })
  }

  // Ищем пользователя с указанным email
  const targetUser = users.find((u) => u.email === email)
  if (!targetUser) {
    return NextResponse.json(
      { error: "Пользователь с таким email не зарегистрирован в ProjectFlow" },
      { status: 404 }
    )
  }

  // Проверяем, не является ли пользователь уже участником
  const { data: existing } = await supabase
    .from("board_members")
    .select("id")
    .eq("board_id", boardId)
    .eq("user_id", targetUser.id)
    .single()

  if (existing) {
    return NextResponse.json(
      { error: "Пользователь уже является участником доски" },
      { status: 409 }
    )
  }

  // Добавляем пользователя в участники с ролью "member"
  const { error: insertError } = await supabase
    .from("board_members")
    .insert({ board_id: boardId, user_id: targetUser.id, role: "member" })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
