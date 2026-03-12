import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react"
import type { CompatStatus } from "@interfaces/compatibility"
import { cn } from "@lib/utils"

interface CompatibilityIconProps {
  status: CompatStatus
  className?: string
}

export function CompatibilityIcon({ status, className }: CompatibilityIconProps) {
  const icons = {
    ok: CheckCircle2,
    warning: AlertTriangle,
    error: XCircle,
    info: Info,
  }

  const colors = {
    ok: "text-green-600 dark:text-green-500",
    warning: "text-yellow-600 dark:text-yellow-500",
    error: "text-red-600 dark:text-red-500",
    info: "text-blue-600 dark:text-blue-500",
  }

  const Icon = icons[status]

  return (
    <Icon className={cn("h-5 w-5", colors[status], className)} />
  )
}
