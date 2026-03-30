"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { createClient } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const profileSchema = z.object({
  full_name: z.string().min(2, "Минимум 2 символа").max(100),
})

type ProfileInput = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.user_metadata?.full_name ?? "",
    },
  })

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0].toUpperCase() ?? "U")

  const onSubmit = async (data: ProfileInput) => {
    setSaved(false)

    // Update Supabase Auth metadata
    await supabase.auth.updateUser({
      data: { full_name: data.full_name },
    })

    // Update profiles table
    await supabase
      .from("profiles")
      .update({ full_name: data.full_name })
      .eq("id", user?.id ?? "")

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      {/* Topbar */}
      <div className="h-12 border-b border-[#141420] px-5 flex items-center shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="text-[#9ca3af] hover:text-[#f1f5f9] h-[30px] px-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Назад
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-5">
        <div className="max-w-lg mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-[#6366f1]/10 text-[#818cf8] text-xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">
                    {user?.user_metadata?.full_name ?? "Профиль"}
                  </CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="full_name">Полное имя</Label>
                  <Input id="full_name" {...register("full_name")} />
                  {errors.full_name && (
                    <p className="text-sm text-red-500">{errors.full_name.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email ?? ""} disabled className="bg-[#16161e]" />
                  <p className="text-xs text-muted-foreground">Email изменить нельзя</p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#6366f1] hover:bg-[#4f52d4]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Сохранение..." : saved ? "✓ Сохранено!" : "Сохранить"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
