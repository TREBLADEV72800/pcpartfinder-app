import type { Component, Price } from "@interfaces/component"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"
import { ExternalLink } from "lucide-react"
import { cn } from "@lib/utils"

interface ProductPricesProps {
  component: Component
  onBuyClick?: (price: Price) => void
  className?: string
}

export function ProductPrices({ component, onBuyClick, className }: ProductPricesProps) {
  const prices = component.prices || []

  if (prices.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No pricing information available</p>
        </CardContent>
      </Card>
    )
  }

  const cheapestPrice = prices.reduce((min, p) => (p.price < min.price ? p : min), prices[0])

  const formatPrice = (value: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value)
  }

  const getStockBadge = (inStock: boolean) => {
    if (inStock) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">In Stock</Badge>
    }
    return <Badge variant="destructive">Out of Stock</Badge>
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prices.map((price) => {
            const isCheapest = price.price === cheapestPrice.price
            const totalPrice = price.total || price.price

            return (
              <div
                key={price.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-colors",
                  isCheapest && "border-green-500 bg-green-50 dark:bg-green-950/20"
                )}
              >
                {/* Retailer Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{price.retailer}</span>
                    {isCheapest && (
                      <Badge variant="default" className="text-xs">Best Price</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStockBadge(price.inStock)}
                  </div>
                  {/* Price breakdown */}
                  <div className="mt-2 text-sm text-muted-foreground space-y-1">
                    {price.basePrice && (
                      <div>Base: {formatPrice(price.basePrice, price.currency)}</div>
                    )}
                    {price.shipping !== undefined && price.shipping !== null && (
                      <div>Shipping: {price.shipping === 0 ? "Free" : formatPrice(price.shipping, price.currency)}</div>
                    )}
                    {price.tax !== undefined && price.tax !== null && (
                      <div>Tax: {formatPrice(price.tax, price.currency)}</div>
                    )}
                  </div>
                </div>

                {/* Total Price */}
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {formatPrice(totalPrice, price.currency)}
                  </div>
                  {price.total && price.price !== price.total && (
                    <div className="text-sm text-muted-foreground line-through">
                      {formatPrice(price.price, price.currency)}
                    </div>
                  )}
                </div>

                {/* Buy Button */}
                <Button
                  variant={price.inStock ? "default" : "secondary"}
                  size="sm"
                  onClick={() => onBuyClick?.(price)}
                  disabled={!price.inStock}
                  className="ml-4"
                  asChild={price.inStock}
                >
                  {price.inStock ? (
                    <a
                      href={price.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Buy <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span>Unavailable</span>
                  )}
                </Button>
              </div>
            )
          })}
        </div>

        {/* Footer Note */}
        <p className="text-xs text-muted-foreground mt-4">
          Prices are updated daily and may vary from actual retailer pricing.
          Purchasing through our links may earn us a commission.
        </p>
      </CardContent>
    </Card>
  )
}
