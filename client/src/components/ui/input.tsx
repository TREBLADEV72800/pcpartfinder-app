import * as React from "react"

import { cn } from "@lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "cyber" | "neon" | "ghost"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-sm border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          // Default variant
          variant === "default" && "border-input focus-visible:border-primary",
          // Cyber variant - tech input with glow
          variant === "cyber" && "border-border/60 bg-card/50 focus-visible:border-primary/50 focus-visible:shadow-[0_0_15px_rgba(59,130,246,0.2)]",
          // Neon variant - glowing border
          variant === "neon" && "border-primary/30 bg-transparent focus-visible:border-primary focus-visible:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
          // Ghost variant - minimal input
          variant === "ghost" && "border-transparent bg-transparent focus-visible:border-border/50 focus-visible:bg-accent/30",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
