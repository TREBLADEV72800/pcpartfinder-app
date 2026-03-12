import type { Component } from "@interfaces/component"
import { Card, CardContent } from "@components/ui/card"
import { Badge } from "@components/ui/badge"
import { Check, X, AlertTriangle } from "lucide-react"
import { cn, formatPrice } from "@lib/utils"

interface ComponentCardProps {
  component: Component
  selected?: boolean
  compatible?: boolean
  onClick?: () => void
  className?: string
}

export function ComponentCard({
  component,
  selected,
  compatible = true,
  onClick,
  className,
}: ComponentCardProps) {
  const cheapestPrice = component.prices?.[0]

  // Get 2-3 key specs
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
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md relative",
        selected && "ring-2 ring-primary",
        !compatible && "opacity-50",
        className
      )}
      onClick={onClick}
    >
      {/* Selection Indicator */}
      {selected && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
          <Check className="h-3 w-3" />
        </div>
      )}

      {/* Compatibility Indicator */}
      {!compatible && (
        <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground rounded-full p-1" title="Incompatible with current build">
          <X className="h-3 w-3" />
        </div>
      )}

      <CardContent className="p-4">
        {/* Image */}
        <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center mb-3">
          {component.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={component.imageUrl}
              alt={component.name}
              className="max-w-full max-h-full object-contain p-2"
            />
          ) : (
            <span className="text-xs text-muted-foreground text-center px-2">No Image</span>
          )}
        </div>

        {/* Brand */}
        <Badge variant="outline" className="text-xs mb-2">
          {component.brand}
        </Badge>

        {/* Name */}
        <h4 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
          {component.name}
        </h4>

        {/* Specs */}
        <div className="flex flex-wrap gap-1 mb-3">
          {getKeySpecs().map((spec) => (
            <Badge key={spec} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>

        {/* Price */}
        {cheapestPrice ? (
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">
              {formatPrice(cheapestPrice.price, cheapestPrice.currency)}
            </span>
            <span className="text-xs text-muted-foreground">
              at {cheapestPrice.retailer}
            </span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">No pricing</span>
        )}

        {/* Warning if incompatible */}
        {!compatible && (
          <div className="mt-3 flex items-center gap-2 text-xs text-destructive">
            <AlertTriangle className="h-3 w-3" />
            <span>Incompatible with your build</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
