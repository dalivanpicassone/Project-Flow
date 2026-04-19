import { LoginForm } from "@/components/auth/LoginForm"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const metadata = { title: "Войти — Agora" }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/3 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,117,222,0.07) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] translate-y-1/2 -translate-x-1/3 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,117,222,0.05) 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 bg-[#0075de] rounded-xl flex items-center justify-center mb-4"
            style={{ boxShadow: "var(--shadow-brand)" }}
          >
            <span className="font-bold text-white text-xl tracking-tight">A</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-[-0.02em]">Agora</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Войдите в свой аккаунт</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-[#0075de] hover:text-[#005bab] font-semibold transition-colors">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
