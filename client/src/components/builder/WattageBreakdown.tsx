import { Component } from "@shared"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { WattageDonut } from "@components/charts/WattageDonut"
import { Zap } from "lucide-react"
import { cn, calculateTotalTDP } from "@lib/utils"

interface WattageBreakdownProps {
  components: (Component | undefined)[]
  className?: string
}

export function WattageBreakdown({ components, className }: WattageBreakdownProps) {
  // Calculate wattage per component
  const breakdown = components
    .filter((c): c is Component => c !== undefined)
    .map((component) => {
      const wattage = component.tdp || component.wattage || 0
      return {
        name: component.category.replace(/_/g, " "),
        wattage,
      }
    })
    .filter((item) => item.wattage > 0)

  const totalWattage = breakdown.reduce((sum, item) => sum + item.wattage, 0)
  const recommendedPsu = Math.ceil(totalWattage * 1.25)

  // Add base system power if we have components
  const chartData =
    breakdown.length > 0
      ? [
          ...breakdown,
          {
            name: "Base System",
            wattage: 50,
          },
        ]
      : []

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Wattage Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <WattageDonut
            data={chartData}
            totalWattage={totalWattage + 50}
            recommendedPsu={recommendedPsu}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Add components to see wattage breakdown</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
