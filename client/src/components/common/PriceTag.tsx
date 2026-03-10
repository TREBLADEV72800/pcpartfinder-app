import { Badge } from "@components/ui/badge"
import { cn } from "@lib/utils"

interface PriceTagProps {
  price: number
  originalPrice?: number
  currency?: string
  className?: string
  showDiscount?: boolean
}

export function PriceTag({
  price,
  originalPrice,
  currency = "USD",
  className,
  showDiscount = true,
}: PriceTagProps) {
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value)
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="font-semibold text-foreground">
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(originalPrice)}
          </span>
          {showDiscount && discount > 0 && (
            <Badge variant="destructive" className="text-xs">
              -{discount}%
            </Badge>
          )}
        </>
      )}
    </div>
  )
}
