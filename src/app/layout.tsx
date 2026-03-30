import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "ProjectFlow",
  description: "Kanban board for personal and team project management",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${manrope.variable} dark`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
