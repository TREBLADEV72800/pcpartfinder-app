import { Component } from "@shared"
import { Checkbox } from "@components/ui/checkbox"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { PriceTag } from "@components/common/PriceTag"
import { Eye, Plus } from "lucide-react"
import { cn } from "@lib/utils"

interface ProductRowProps {
  component: Component
  isSelected?: boolean
  onSelectChange?: (checked: boolean) => void
  onViewDetails?: () => void
  onAddToBuild?: () => void
  showCheckbox?: boolean
  showActions?: boolean
  className?: string
}

export function ProductRow({
  component,
  isSelected,
  onSelectChange,
  onViewDetails,
  onAddToBuild,
  showCheckbox = true,
  showActions = true,
  className,
}: ProductRowProps) {
  const cheapestPrice = component.prices?.[0]
  const hasDiscount = cheapestPrice && component.prices && component.prices.length > 1
    ? component.prices.some((p) => p.price < cheapestPrice.price)
    : false

  // Get key specs as badges
  const getKeySpecs = () => {
    const specs: string[] = []
    if (component.socket) specs.push(component.socket)
    if (component.tdp) specs.push(`${component.tdp}W`)
    if (component.memoryType) specs.push(component.memoryType)
    if (component.formFactor) specs.push(component.formFactor)
    if (component.capacityGb) specs.push(`${component.capacityGb}GB`)
    return specs.slice(0, 3)
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 border-b hover:bg-muted/50 transition-colors",
        className
      )}
    >
      {/* Selection Checkbox */}
      {showCheckbox && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelectChange?.(checked as boolean)}
        />
      )}

      {/* Thumbnail */}
      <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-md flex items-center justify-center">
        {component.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={component.imageUrl}
            alt={component.name}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <span className="text-xs text-muted-foreground text-center px-2">
            No Image
          </span>
        )}
      </div>

      {/* Component Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <Badge variant="outline" className="text-xs">
            {component.brand}
          </Badge>
          <h3 className="font-medium truncate flex-1">
            {component.name}
          </h3>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {getKeySpecs().map((spec) => (
            <Badge key={spec} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 w-32 text-right">
        {cheapestPrice ? (
          <PriceTag
            price={cheapestPrice.price}
            originalPrice={hasDiscount ? undefined : undefined}
            currency={cheapestPrice.currency}
          />
        ) : (
          <span className="text-sm text-muted-foreground">N/A</span>
        )}
        {cheapestPrice && (
          <p className="text-xs text-muted-foreground mt-1">
            at {cheapestPrice.retailer}
          </p>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex-shrink-0 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onViewDetails}
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddToBuild}
            title="Add to build"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
