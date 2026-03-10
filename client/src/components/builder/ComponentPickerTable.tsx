import { Component } from "@shared"
import { ComponentCard } from "./ComponentCard"
import { EmptyState } from "@components/common/EmptyState"
import { LoadingSpinner } from "@components/common/LoadingSpinner"
import { Search } from "lucide-react"
import { cn } from "@lib/utils"

interface ComponentPickerTableProps {
  components: Component[] | undefined
  isLoading?: boolean
  selectedId?: string
  onSelect?: (component: Component) => void
  isCompatible?: (component: Component) => boolean
  className?: string
}

export function ComponentPickerTable({
  components,
  isLoading,
  selectedId,
  onSelect,
  isCompatible,
  className,
}: ComponentPickerTableProps) {
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!components || components.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No components found"
        description="Try adjusting your filters"
        className={className}
      />
    )
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {components.map((component) => {
        const isSelected = component.id === selectedId
        const compatible = isCompatible ? isCompatible(component) : true

        return (
          <ComponentCard
            key={component.id}
            component={component}
            selected={isSelected}
            compatible={compatible}
            onClick={() => onSelect?.(component)}
          />
        )
      })}
    </div>
  )
}
