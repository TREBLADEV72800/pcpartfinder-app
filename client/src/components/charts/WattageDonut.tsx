import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { cn } from "@lib/utils"

interface WattageData {
  name: string
  wattage: number
  color: string
}

interface WattageDonutProps {
  data: WattageData[]
  totalWattage: number
  recommendedPsu?: number
  className?: string
}

const DEFAULT_COLORS = [
  "#3b82f6", // blue - CPU
  "#ef4444", // red - GPU
  "#10b981", // green - Motherboard
  "#f59e0b", // orange - RAM
  "#8b5cf6", // purple - Storage
  "#ec4899", // pink - PSU overhead
  "#06b6d4", // cyan - Cooling
  "#84cc16", // lime - Fans
]

export function WattageDonut({
  data,
  totalWattage,
  recommendedPsu,
  className,
}: WattageDonutProps) {
  // Add colors to data if not provided
  const coloredData = data.map((item, index) => ({
    ...item,
    color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.wattage / totalWattage) * 100).toFixed(1)
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.wattage}W ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const getPsuStatus = () => {
    if (!recommendedPsu) return null
    const headroom = recommendedPsu - totalWattage
    if (headroom >= 100) return { status: "ok", message: "Good headroom" }
    if (headroom >= 50) return { status: "warning", message: "Minimal headroom" }
    return { status: "error", message: "Insufficient power" }
  }

  const psuStatus = getPsuStatus()

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Power Consumption</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={coloredData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="wattage"
              >
                {coloredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text showing total */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-3xl font-bold">{totalWattage}W</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>

        {/* PSU Recommendation */}
        {recommendedPsu && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Recommended PSU</p>
                <p className="text-2xl font-bold">{recommendedPsu}W</p>
              </div>
              {psuStatus && (
                <div
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    psuStatus.status === "ok" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
                    psuStatus.status === "warning" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
                    psuStatus.status === "error" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  )}
                >
                  {psuStatus.message}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Breakdown list */}
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium mb-3">Breakdown</h4>
          {coloredData.map((item) => {
            const percentage = ((item.wattage / totalWattage) * 100).toFixed(1)
            return (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">{percentage}%</span>
                  <span className="font-medium w-12 text-right">{item.wattage}W</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
