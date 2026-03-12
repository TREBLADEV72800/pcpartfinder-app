import type { Component } from "@interfaces/component"
import { ComponentCategory } from "@shared"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Badge } from "@components/ui/badge"
import { Separator } from "@components/ui/separator"
import { PriceTag } from "@components/common/PriceTag"
import { ComponentIcon } from "@components/common/ComponentIcon"
import { Receipt, Zap, CheckCircle2, AlertTriangle } from "lucide-react"
import { calculateTotalTDP } from "@lib/utils"

interface BuildSummaryProps {
  components: Partial<Record<ComponentCategory, Component>>
  customPrices?: Partial<Record<ComponentCategory, number>>
  totalPrice?: number
  totalWattage?: number
  compatibilityErrors?: number
  compatibilityWarnings?: number
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
  [ComponentCategory.OS]: "OS",
  [ComponentCategory.CASE_FAN]: "Case Fan",
  [ComponentCategory.THERMAL_PASTE]: "Thermal Paste",
}

export function BuildSummary({
  components,
  customPrices,
  totalPrice,
  totalWattage,
  compatibilityErrors = 0,
  compatibilityWarnings = 0,
  className,
}: BuildSummaryProps) {
  // Calculate totals if not provided
  const calculatedTotal = totalPrice !== undefined
    ? totalPrice
    : Object.values(components).reduce((sum, component) => {
        if (!component) return sum
        const category = component.category
        const customPrice = category ? customPrices?.[category] : undefined
        const price = customPrice || component.prices?.[0]?.price || 0
        return sum + price
      }, 0)

  const calculatedWattage = totalWattage !== undefined
    ? totalWattage
    : calculateTotalTDP(components as any)

  const componentList = Object.entries(components).filter(
    ([, component]) => component !== undefined
  ) as [ComponentCategory, Component][]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Summary
          </span>
          {(compatibilityErrors > 0 || compatibilityWarnings > 0) && (
            <Badge
              variant={compatibilityErrors > 0 ? "destructive" : "secondary"}
              className="gap-1"
            >
              {compatibilityErrors > 0 ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <CheckCircle2 className="h-3 w-3" />
              )}
              {compatibilityErrors} Error{compatibilityErrors !== 1 ? "s" : ""}, {compatibilityWarnings} Warning
              {compatibilityWarnings !== 1 ? "s" : ""}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Components List */}
        {componentList.length > 0 ? (
          <div className="space-y-3 mb-4">
            {componentList.map(([category, component]) => {
              const customPrice = customPrices?.[category]
              const price = customPrice || component.prices?.[0]?.price || 0

              return (
                <div key={category} className="flex items-center gap-3">
                  <ComponentIcon category={category} className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{component.name}</p>
                    <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[category]}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {price > 0 ? (
                      <PriceTag
                        price={price}
                        currency={component.prices?.[0]?.currency}
                        className="text-sm justify-end"
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">No components added yet</p>
        )}

        <Separator className="my-4" />

        {/* Totals */}
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">
              ${calculatedTotal.toFixed(2)}
            </span>
          </div>

          {/* Estimated Tax (8%) */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Tax</span>
            <span className="font-medium">
              ${(calculatedTotal * 0.08).toFixed(2)}
            </span>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${(calculatedTotal * 1.08).toFixed(2)}</span>
          </div>

          {/* Wattage */}
          <div className="flex items-center justify-between text-sm pt-2 border-t">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Zap className="h-4 w-4" />
              Estimated Wattage
            </span>
            <span className="font-bold">{calculatedWattage}W</span>
          </div>

          {/* Recommended PSU */}
          {calculatedWattage > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Recommended PSU</span>
              <span className="font-medium text-primary">
                {Math.ceil(calculatedWattage * 1.25)}W
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
