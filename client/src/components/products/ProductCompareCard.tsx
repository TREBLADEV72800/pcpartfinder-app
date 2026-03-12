import type { Component } from "@interfaces/component"
import { Card, CardContent } from "@components/ui/card"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"
import { PriceTag } from "@components/common/PriceTag"
import { X } from "lucide-react"
import { cn } from "@lib/utils"

interface ProductCompareCardProps {
  component: Component
  onRemove?: () => void
  highlightDifferent?: boolean
  compareTo?: Component
  className?: string
}

export function ProductCompareCard({
  component,
  onRemove,
  highlightDifferent = true,
  compareTo,
  className,
}: ProductCompareCardProps) {
  const cheapestPrice = component.prices?.[0]

  // Check if a spec differs from the comparison component
  const isDifferent = (key: string, value: any) => {
    if (!highlightDifferent || !compareTo) return false
    const compareValue = (compareTo.specs as any)[key]
    return compareValue !== undefined && compareValue !== value
  }

  return (
    <Card className={cn("relative", className)}>
      {/* Remove Button */}
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0 flex items-center justify-center">
            {component.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={component.imageUrl}
                alt={component.name}
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <span className="text-xs text-muted-foreground text-center px-2">No Image</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Badge variant="outline" className="text-xs mb-1">
              {component.brand}
            </Badge>
            <h3 className="font-medium text-sm line-clamp-2">{component.name}</h3>
          </div>
        </div>

        {/* Price */}
        {cheapestPrice && (
          <div className="mb-4">
            <PriceTag
              price={cheapestPrice.price}
              currency={cheapestPrice.currency}
              className="text-sm"
            />
          </div>
        )}

        {/* Key Specs */}
        <div className="space-y-2 text-sm">
          {/* Socket/Form Factor */}
          {(component.socket || component.formFactor) && (
            <div
              className={cn(
                "flex justify-between",
                isDifferent("socket", component.socket) && "bg-yellow-50 dark:bg-yellow-950/20 -mx-2 px-2 py-1 rounded"
              )}
            >
              <span className="text-muted-foreground">
                {component.socket ? "Socket" : "Form Factor"}
              </span>
              <span className="font-medium">
                {component.socket || component.formFactor}
              </span>
            </div>
          )}

          {/* TDP/Wattage */}
          {component.tdp && (
            <div
              className={cn(
                "flex justify-between",
                isDifferent("tdp", component.tdp) && "bg-yellow-50 dark:bg-yellow-950/20 -mx-2 px-2 py-1 rounded"
              )}
            >
              <span className="text-muted-foreground">TDP</span>
              <span className="font-medium">{component.tdp}W</span>
            </div>
          )}

          {/* Memory Type */}
          {component.memoryType && (
            <div
              className={cn(
                "flex justify-between",
                isDifferent("memoryType", component.memoryType) && "bg-yellow-50 dark:bg-yellow-950/20 -mx-2 px-2 py-1 rounded"
              )}
            >
              <span className="text-muted-foreground">Memory</span>
              <span className="font-medium">{component.memoryType}</span>
            </div>
          )}

          {/* Capacity */}
          {component.capacityGb && (
            <div
              className={cn(
                "flex justify-between",
                isDifferent("capacityGb", component.capacityGb) && "bg-yellow-50 dark:bg-yellow-950/20 -mx-2 px-2 py-1 rounded"
              )}
            >
              <span className="text-muted-foreground">Capacity</span>
              <span className="font-medium">{component.capacityGb}GB</span>
            </div>
          )}

          {/* Length/Height */}
          {(component.lengthMm || component.heightMm) && (
            <div
              className={cn(
                "flex justify-between",
                isDifferent("lengthMm", component.lengthMm) && "bg-yellow-50 dark:bg-yellow-950/20 -mx-2 px-2 py-1 rounded"
              )}
            >
              <span className="text-muted-foreground">
                {component.lengthMm ? "Length" : "Height"}
              </span>
              <span className="font-medium">
                {component.lengthMm || component.heightMm}mm
              </span>
            </div>
          )}
        </div>

        {/* Release Year */}
        {component.releaseYear && (
          <div className="mt-4 pt-4 border-t">
            <Badge variant="secondary" className="text-xs">
              {component.releaseYear}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
