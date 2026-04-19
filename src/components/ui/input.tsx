import { Input as InputPrimitive } from "@base-ui/react/input"
import type * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded border border-input bg-white px-2.5 py-1 text-sm transition-colors outline-none placeholder:text-[#a39e98] focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:bg-[rgba(255,255,255,0.05)] dark:border-input dark:placeholder:text-muted-foreground/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
