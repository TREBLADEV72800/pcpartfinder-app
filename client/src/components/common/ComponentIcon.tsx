import { Cpu, Fan, HardDrive, Monitor, Zap, CircuitBoard, Plus, Minus, MoreHorizontal } from "lucide-react"
import { ComponentCategory } from "@shared"
import { cn } from "@lib/utils"

interface ComponentIconProps {
  category: ComponentCategory
  className?: string
}

export function ComponentIcon({ category, className }: ComponentIconProps) {
  const iconMap: Record<ComponentCategory, React.ElementType> = {
    CPU: Cpu,
    CPU_COOLER: Fan,
    MOTHERBOARD: CircuitBoard,
    MEMORY: CircuitBoard,
    STORAGE: HardDrive,
    VIDEO_CARD: Monitor,
    CASE: Minus,
    POWER_SUPPLY: Zap,
    MONITOR: Monitor,
    OS: MoreHorizontal,
    CASE_FAN: Fan,
    THERMAL_PASTE: Plus,
  }

  const Icon = iconMap[category] || MoreHorizontal

  return <Icon className={cn("h-5 w-5", className)} />
}
