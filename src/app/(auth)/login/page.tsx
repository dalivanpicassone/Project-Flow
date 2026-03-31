import { LoginForm } from "@/components/auth/LoginForm"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const metadata = { title: "Войти — ProjectFlow" }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">ProjectFlow</h1>
          <p className="mt-2 text-sm text-muted-foreground">Войдите в свой аккаунт</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-ring hover:underline font-medium">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
