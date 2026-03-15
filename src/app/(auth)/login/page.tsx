import { LoginForm } from "@/components/auth/LoginForm"
import Link from "next/link"

export const metadata = { title: "Войти — ProjectFlow" }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">ProjectFlow</h1>
          <p className="mt-2 text-sm text-gray-600">Войдите в свой аккаунт</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-gray-600">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
