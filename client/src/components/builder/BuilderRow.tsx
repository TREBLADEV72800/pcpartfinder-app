import { Component, ComponentCategory } from "@shared"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { ComponentIcon } from "@components/common/ComponentIcon"
import { PriceTag } from "@components/common/PriceTag"
import { Plus, Trash2, Edit } from "lucide-react"
import { cn } from "@lib/utils"

interface BuilderRowProps {
  category: ComponentCategory
  component?: Component
  customPrice?: number
  isOptional?: boolean
  onSelect?: () => void
  onRemove?: () => void
  onEditPrice?: () => void
  className?: string
}

const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  [ComponentCategory.CPU]: "CPU",
  [ComponentCategory.CPU_COOLER]: "CPU Cooler",
  [ComponentCategory.MOTHERBOARD]: "Motherboard",
  [ComponentCategory.MEMORY]: "Memory",
  [ComponentCategory.STORAGE]: "Storage",
  [ComponentCategory.VIDEO_CARD]: "Video Card",
  [ComponentCategory.CASE]: "Case",
  [ComponentCategory.POWER_SUPPLY]: "Power Supply",
  [ComponentCategory.MONITOR]: "Monitor",
  [ComponentCategory.OS]: "Operating System",
  [ComponentCategory.CASE_FAN]: "Case Fan",
  [ComponentCategory.THERMAL_PASTE]: "Thermal Paste",
}

const REQUIRED_CATEGORIES: Set<ComponentCategory> = new Set([
  ComponentCategory.CPU,
  ComponentCategory.MOTHERBOARD,
  ComponentCategory.MEMORY,
  ComponentCategory.STORAGE,
  ComponentCategory.CASE,
  ComponentCategory.POWER_SUPPLY,
])

export function BuilderRow({
  category,
  component,
  customPrice,
  isOptional,
  onSelect,
  onRemove,
  onEditPrice,
  className,
}: BuilderRowProps) {
  const isRequired = REQUIRED_CATEGORIES.has(category)
  const label = CATEGORY_LABELS[category]
  const price = component
    ? customPrice || component.prices?.[0]?.price || 0
    : 0

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 border-b hover:bg-muted/50 transition-colors",
        !component && "bg-muted/30",
        className
      )}
    >
      {/* Category Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
        <ComponentIcon category={category} className="h-5 w-5" />
      </div>

      {/* Category Name */}
      <div className="flex-shrink-0 w-40">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{label}</span>
          {!isRequired && <Badge variant="outline" className="text-xs">Optional</Badge>}
        </div>
      </div>

      {/* Component Info or Empty State */}
      <div className="flex-1 min-w-0">
        {component ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {component.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={component.imageUrl}
                  alt={component.name}
                  className="w-12 h-12 object-contain rounded bg-background flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <Badge variant="secondary" className="text-xs mb-1">
                  {component.brand}
                </Badge>
                <h4 className="font-medium text-sm truncate">{component.name}</h4>
                {component.tdp && (
                  <p className="text-xs text-muted-foreground">{component.tdp}W</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={onSelect}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isRequired ? "Select a component" : "Add component (optional)"}
          </Button>
        )}
      </div>

      {/* Price */}
      {component && (
        <div className="flex-shrink-0 w-32 text-right">
          {customPrice !== undefined ? (
            <div>
              <PriceTag price={customPrice} className="justify-end" />
              {onEditPrice && (
                <button
                  className="text-xs text-primary hover:underline mt-1"
                  onClick={onEditPrice}
                >
                  Edit price
                </button>
              )}
            </div>
          ) : (
            <PriceTag
              price={price}
              originalPrice={component.prices?.[0]?.price}
              currency={component.prices?.[0]?.currency}
              className="justify-end"
            />
          )}
        </div>
      )}

      {/* Actions */}
      {component && (
        <div className="flex-shrink-0 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSelect}
            title="Change component"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            title="Remove component"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
