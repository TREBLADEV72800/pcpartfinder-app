import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Badge } from "@components/ui/badge"
import { Zap, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@lib/utils"

interface WattageEstimatorProps {
  totalWattage: number
  psuWattage?: number
  className?: string
}

export function WattageEstimator({
  totalWattage,
  psuWattage,
  className,
}: WattageEstimatorProps) {
  const recommendedPsu = Math.ceil(totalWattage * 1.25)
  const psuStatus = psuWattage
    ? psuWattage < totalWattage
      ? "error"
      : psuWattage < recommendedPsu
        ? "warning"
        : "ok"
    : null

  const getStatusInfo = () => {
    switch (psuStatus) {
      case "error":
        return {
          icon: AlertTriangle,
          text: "Insufficient Power",
          color: "text-destructive",
          bg: "bg-destructive/10",
        }
      case "warning":
        return {
          icon: AlertTriangle,
          text: "Low Headroom",
          color: "text-yellow-600 dark:text-yellow-500",
          bg: "bg-yellow-500/10",
        }
      case "ok":
        return {
          icon: CheckCircle2,
          text: "Good Power",
          color: "text-green-600 dark:text-green-500",
          bg: "bg-green-500/10",
        }
      default:
        return null
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo?.icon

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Power Consumption
        </CardTitle>
        {statusInfo && StatusIcon && (
          <Badge className={cn("gap-1", statusInfo.bg, statusInfo.color)} variant="secondary">
            <StatusIcon className="h-3 w-3" />
            {statusInfo.text}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold">{totalWattage}W</div>
            <p className="text-xs text-muted-foreground">Estimated usage</p>
          </div>

          {psuWattage ? (
            <div className="text-right">
              <div className="text-xl font-semibold">{psuWattage}W</div>
              <p className="text-xs text-muted-foreground">Current PSU</p>
            </div>
          ) : (
            <div className="text-right">
              <div className="text-xl font-semibold text-primary">{recommendedPsu}W</div>
              <p className="text-xs text-muted-foreground">Recommended PSU</p>
            </div>
          )}
        </div>

        {/* Power Bar */}
        <div className="mt-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all",
                psuStatus === "error" && "bg-destructive",
                psuStatus === "warning" && "bg-yellow-500",
                psuStatus === "ok" && "bg-green-500",
                !psuStatus && "bg-primary"
              )}
              style={{
                width: psuWattage
                  ? `${Math.min((totalWattage / psuWattage) * 100, 100)}%`
                  : "0%",
              }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0W</span>
            {psuWattage && <span>{psuWattage}W</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
