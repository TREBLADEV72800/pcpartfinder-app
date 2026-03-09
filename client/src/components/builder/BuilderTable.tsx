import { useBuildStore } from "@stores/useBuildStore";
import { CATEGORIES } from "@shared";
import { ComponentCategory } from "@interfaces/component";
import { Cpu, HardDrive, Monitor, Fan, Box, Zap, Server, Disc, Wind, Droplet } from "lucide-react";
import { formatPrice } from "@lib/utils";

const CATEGORY_ICONS: Record<string, React.ReactElement> = {
  CPU: <Cpu className="h-5 w-5" />,
  CPU_COOLER: <Fan className="h-5 w-5" />,
  MOTHERBOARD: <Server className="h-5 w-5" />,
  MEMORY: <HardDrive className="h-5 w-5" />,
  STORAGE: <HardDrive className="h-5 w-5" />,
  VIDEO_CARD: <Monitor className="h-5 w-5" />,
  CASE: <Box className="h-5 w-5" />,
  POWER_SUPPLY: <Zap className="h-5 w-5" />,
  MONITOR: <Monitor className="h-5 w-5" />,
  OS: <Disc className="h-5 w-5" />,
  CASE_FAN: <Wind className="h-5 w-5" />,
  THERMAL_PASTE: <Droplet className="h-5 w-5" />,
};

interface BuilderTableProps {
  onOpenPicker: (category: ComponentCategory) => void;
}

export default function BuilderTable({ onOpenPicker }: BuilderTableProps) {
  const { slots, getTotalPrice } = useBuildStore();
  const totalPrice = getTotalPrice();

  return (
    <div className="space-y-2">
      {slots.map((slot) => (
        <BuilderRow
          key={slot.category}
          slot={slot}
          onClick={() => onOpenPicker(slot.category)}
        />
      ))}

      {/* Total Row */}
      <div className="flex items-center justify-between p-4 border-t-2 border-primary bg-muted/50">
        <span className="font-semibold text-lg">Totale Build</span>
        <span className="font-bold text-xl text-primary">
          {formatPrice(totalPrice)}
        </span>
      </div>
    </div>
  );
}

interface BuilderRowProps {
  slot: {
    category: ComponentCategory;
    component?: any;
    customPrice?: number;
  };
  onClick: () => void;
}

function BuilderRow({ slot, onClick }: BuilderRowProps) {
  const categoryMeta = CATEGORIES[slot.category];
  const icon = CATEGORY_ICONS[slot.category] || <Cpu className="h-5 w-5" />;

  const price = slot.customPrice || slot.component?.prices?.[0]?.price;
  const displayName = slot.component?.name || `Scegli ${categoryMeta.name}`;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 border border-border rounded-lg bg-card hover:bg-accent transition-colors text-left"
    >
      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{categoryMeta.name}</span>
          {!categoryMeta.required && (
            <span className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
              Opzionale
            </span>
          )}
        </div>
        <p className="font-medium truncate">{displayName}</p>
      </div>

      <div className="text-right">
        {price ? (
          <span className="font-semibold">{formatPrice(price)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
    </button>
  );
}
