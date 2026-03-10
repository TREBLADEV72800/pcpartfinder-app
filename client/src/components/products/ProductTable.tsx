import { Component } from "@shared"
import { ProductRow } from "./ProductRow"
import { EmptyState } from "@components/common/EmptyState"
import { LoadingSpinner } from "@components/common/LoadingSpinner"
import { Search } from "lucide-react"
import { cn } from "@lib/utils"

interface ProductTableProps {
  components: Component[] | undefined
  isLoading?: boolean
  selectedIds?: Set<string>
  onSelectionChange?: (selectedIds: Set<string>) => void
  onViewDetails?: (component: Component) => void
  onAddToBuild?: (component: Component) => void
  showCheckbox?: boolean
  showActions?: boolean
  className?: string
}

export function ProductTable({
  components,
  isLoading,
  selectedIds = new Set(),
  onSelectionChange,
  onViewDetails,
  onAddToBuild,
  showCheckbox = true,
  showActions = true,
  className,
}: ProductTableProps) {
  const handleSelectChange = (componentId: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(componentId)
    } else {
      newSelected.delete(componentId)
    }
    onSelectionChange?.(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (!components) return
    const newSelected = checked
      ? new Set(components.map((c) => c.id))
      : new Set<string>()
    onSelectionChange?.(newSelected)
  }

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
        description="Try adjusting your filters or search terms"
        className={className}
      />
    )
  }

  const allSelected =
    components.length > 0 && selectedIds.size === components.length
  const someSelected = selectedIds.size > 0 && !allSelected

  return (
    <div className={cn("", className)}>
      {/* Header with Select All */}
      {showCheckbox && components.length > 0 && (
        <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) {
                input.indeterminate = someSelected
              }
            }}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm text-muted-foreground">
            {selectedIds.size > 0
              ? `${selectedIds.size} selected`
              : `${components.length} components`}
          </span>
        </div>
      )}

      {/* Component List */}
      <div className="divide-y">
        {components.map((component) => (
          <ProductRow
            key={component.id}
            component={component}
            isSelected={selectedIds.has(component.id)}
            onSelectChange={(checked) => handleSelectChange(component.id, checked)}
            onViewDetails={() => onViewDetails?.(component)}
            onAddToBuild={() => onAddToBuild?.(component)}
            showCheckbox={showCheckbox}
            showActions={showActions}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/50">
        <p className="text-sm text-muted-foreground">
          Showing {components.length} component{components.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  )
}
