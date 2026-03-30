import { RegisterForm } from "@/components/auth/RegisterForm"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const metadata = { title: "Регистрация — ProjectFlow" }

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">ProjectFlow</h1>
          <p className="mt-2 text-sm text-gray-600">Создайте аккаунт</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-gray-600">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
