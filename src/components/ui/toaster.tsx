"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/useToast"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"

const variantConfig = {
  default: {
    icon: <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />,
    stripe: "bg-border",
  },
  success: {
    icon: <CheckCircle2 className="h-4 w-4 text-[#448361] mt-0.5 shrink-0" />,
    stripe: "bg-[#448361]",
  },
  destructive: {
    icon: <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />,
    stripe: "bg-destructive",
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />,
    stripe: "bg-amber-500",
  },
} as const

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => {
        const config = variantConfig[(variant as keyof typeof variantConfig) ?? "default"] ?? variantConfig.default

        return (
          <Toast key={id} variant={variant} {...props}>
            {/* Left accent stripe */}
            <div className={`absolute left-0 inset-y-0 w-[3px] ${config.stripe}`} />

            {/* Variant icon */}
            {config.icon}

            {/* Content */}
            <div className="flex-1 min-w-0">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>

            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
