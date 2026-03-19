"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useBoardMembers } from "@/hooks/useBoardMembers"
import { useBoards } from "@/hooks/useBoards"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, UserPlus, Trash2, Crown, UserMinus } from "lucide-react"

export default function BoardSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const { members, isLoading, inviteMember, removeMember, updateRole } = useBoardMembers(id)
  const { boards, archiveBoard } = useBoards()

  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)

  const board = boards.find((b) => b.id === id)
  const isOwner = board?.owner_id === user?.id

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return
    setIsInviting(true)
    setInviteError(null)
    setInviteSuccess(false)

    const { error } = await inviteMember(inviteEmail.trim())

    if (error) {
      setInviteError(error)
    } else {
      setInviteSuccess(true)
      setInviteEmail("")
    }
    setIsInviting(false)
  }

  const handleArchive = async () => {
    await archiveBoard(id)
    router.push("/dashboard")
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    }
    return email[0].toUpperCase()
  }

  return (
    <>
      {/* Topbar */}
      <div className="h-12 border-b border-[#141420] px-5 flex items-center shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/board/${id}`)}
          className="text-[#9ca3af] hover:text-[#f1f5f9] h-[30px] px-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Назад к доске
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-5">
        <div className="max-w-2xl mx-auto space-y-6">

        <h1 className="text-xl font-bold text-[#f1f5f9]">Настройки доски</h1>

        {/* Members */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Участники</CardTitle>
            <CardDescription>
              Управляйте доступом к доске
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Invite form */}
            {isOwner && (
              <div className="space-y-2">
                <Label htmlFor="invite-email">Пригласить по email</Label>
                <div className="flex gap-2">
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value)
                      setInviteError(null)
                      setInviteSuccess(false)
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  />
                  <Button onClick={handleInvite} disabled={isInviting || !inviteEmail.trim()}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {isInviting ? "..." : "Пригласить"}
                  </Button>
                </div>
                {inviteError && (
                  <p className="text-sm text-red-500">{inviteError}</p>
                )}
                {inviteSuccess && (
                  <p className="text-sm text-green-600">✓ Участник добавлен</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Пользователь должен быть зарегистрирован в ProjectFlow
                </p>
              </div>
            )}

            <Separator />

            {/* Members list */}
            <div className="space-y-3">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Загрузка...</p>
              ) : (
                members.map((member) => {
                  const isSelf = member.user_id === user?.id
                  const displayName =
                    member.profile.full_name ?? member.profile.email

                  return (
                    <div key={member.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                            {getInitials(member.profile.full_name, member.profile.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {displayName}
                            {isSelf && (
                              <span className="ml-1 text-xs text-muted-foreground">(вы)</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {member.role === "owner" ? (
                          <Badge variant="outline" className="gap-1 text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                            <Crown className="h-3 w-3" />
                            Владелец
                          </Badge>
                        ) : isOwner && !isSelf ? (
                          <Select
                            value={member.role}
                            onValueChange={(val) =>
                              updateRole(member.id, val as "owner" | "member")
                            }
                          >
                            <SelectTrigger className="h-7 text-xs w-28">
                              <SelectValue placeholder={{ owner: "Владелец", member: "Участник" }[member.role]} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Участник</SelectItem>
                              <SelectItem value="owner">Владелец</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Участник
                          </Badge>
                        )}

                        {isOwner && !isSelf && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-red-500"
                            onClick={() => removeMember(member.id)}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Danger zone */}
        {isOwner && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-base text-red-700">Опасная зона</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Архивировать доску</p>
                  <p className="text-xs text-muted-foreground">
                    Доска скроется из списка, данные сохранятся
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setShowArchiveDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Архивировать
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>

      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Архивировать доску?</AlertDialogTitle>
            <AlertDialogDescription>
              Доска «{board?.title}» будет скрыта из списка. Данные сохранятся.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              className="bg-red-600 hover:bg-red-700"
            >
              Архивировать
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
