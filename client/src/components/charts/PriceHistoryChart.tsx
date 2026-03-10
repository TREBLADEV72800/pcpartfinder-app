import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { formatPrice } from "@lib/utils"

interface PriceDataPoint {
  date: string
  price: number
  retailer: string
}

interface PriceHistoryChartProps {
  data: PriceDataPoint[]
  currency?: string
  className?: string
}

export function PriceHistoryChart({
  data,
  currency = "USD",
  className,
}: PriceHistoryChartProps) {
  // Group data by retailer
  const retailers = Array.from(new Set(data.map((d) => d.retailer)))
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">
            {formatDate(payload[0].payload.date)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatPrice(entry.value, currency)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No price history available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Price History</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-xs"
            />
            <YAxis
              tickFormatter={(value) => formatPrice(value, currency)}
              className="text-xs"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {retailers.map((retailer, index) => (
              <Line
                key={retailer}
                type="monotone"
                dataKey="price"
                data={data.filter((d) => d.retailer === retailer)}
                name={retailer}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
