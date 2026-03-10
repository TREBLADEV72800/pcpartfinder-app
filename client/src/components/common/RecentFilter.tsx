import { Switch } from "@components/ui/switch"
import { Label } from "@components/ui/label"
import { cn } from "@lib/utils"

interface RecentFilterProps {
  checked: boolean
  onChange: (checked: boolean) => void
  year?: number
  className?: string
}

export function RecentFilter({
  checked,
  onChange,
  year = 2019,
  className,
}: RecentFilterProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Switch
        id="recent-filter"
        checked={checked}
        onCheckedChange={onChange}
      />
      <Label
        htmlFor="recent-filter"
        className="text-sm cursor-pointer"
      >
        Only components from {year} or later
      </Label>
    </div>
  )
}
