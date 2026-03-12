import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-md shadow-primary/20",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-md shadow-destructive/20",
        outline: "text-foreground border-border/60",
        success:
          "border-transparent bg-success text-white hover:bg-success/80 shadow-md shadow-success/20",
        warning:
          "border-transparent bg-warning text-foreground hover:bg-warning/80 shadow-md shadow-warning/20",
        info:
          "border-transparent bg-info text-white hover:bg-info/80 shadow-md shadow-info/20",
        // Cyber variants
        cyber:
          "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
        "cyber-accent":
          "border-accent/50 bg-accent/10 text-accent hover:bg-accent/20 shadow-[0_0_10px_rgba(139,92,246,0.2)]",
        neon:
          "border-2 border-primary text-primary bg-transparent shadow-[0_0_10px_rgba(59,130,246,0.3)]",
        "neon-accent":
          "border-2 border-accent text-accent bg-transparent shadow-[0_0_10px_rgba(139,92,246,0.3)]",
        "neon-success":
          "border-2 border-success text-success bg-transparent shadow-[0_0_10px_rgba(16,185,129,0.3)]",
        "neon-danger":
          "border-2 border-destructive text-destructive bg-transparent shadow-[0_0_10px_rgba(239,68,68,0.3)]",
        holographic:
          "relative overflow-hidden border-white/20 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 text-white backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
