import { useBuildStore } from "@stores/useBuildStore";
import { CATEGORIES } from "@shared";
import { ComponentCategory } from "@interfaces/component";
import { Cpu, HardDrive, Monitor, Fan, Box, Zap, Server, Disc, Wind, Droplet, Plus, ChevronRight } from "lucide-react";
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
      {slots.map((slot, index) => (
        <BuilderRow
          key={slot.category}
          slot={slot}
          onClick={() => onOpenPicker(slot.category)}
          index={index}
        />
      ))}

      {/* Total Row - Industrial Style */}
      <div className="cyber-border p-5 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gradient-to-br from-primary/20 to-accent/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="block text-sm text-muted-foreground uppercase tracking-wider">Totale Build</span>
              <span className="text-xs text-muted-foreground/70">{slots.filter(s => s.component).length} componenti selezionati</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold gradient-text">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
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
  index: number;
}

function BuilderRow({ slot, onClick, index }: BuilderRowProps) {
  const categoryMeta = CATEGORIES[slot.category];
  const icon = CATEGORY_ICONS[slot.category] || <Cpu className="h-5 w-5" />;

  const price = slot.customPrice || slot.component?.prices?.[0]?.price;
  const displayName = slot.component?.name || `Scegli ${categoryMeta.name}`;
  const hasComponent = !!slot.component;

  return (
    <button
      onClick={onClick}
      className={`
        group relative w-full flex items-center gap-4 p-4 rounded-sm border
        transition-all duration-300 text-left overflow-hidden
        ${hasComponent
          ? "border-border/60 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
          : "border-dashed border-border/40 bg-card/30 hover:border-primary/30 hover:bg-card/50"
        }
      `}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Active indicator for selected components */}
      {hasComponent && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent" />
      )}

      {/* Icon */}
      <div className={`
        flex-shrink-0 w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-300
        ${hasComponent
          ? "bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110"
          : "bg-muted/50 text-muted-foreground"
        }
      `}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs uppercase tracking-wider text-muted-foreground/70">{categoryMeta.name}</span>
          {!categoryMeta.required && (
            <span className="text-[10px] px-1.5 py-0.5 bg-muted/50 text-muted-foreground rounded-sm border border-border/30">
              Opzionale
            </span>
          )}
        </div>
        <p className={`font-medium truncate ${hasComponent ? "text-foreground" : "text-muted-foreground/70"}`}>
          {displayName}
        </p>
      </div>

      {/* Price/Action */}
      <div className="flex items-center gap-3">
        {price ? (
          <span className="font-semibold text-foreground tabular-nums">{formatPrice(price)}</span>
        ) : (
          <span className="text-muted-foreground/50 text-sm">—</span>
        )}
        <div className={`
          flex h-8 w-8 items-center justify-center rounded-sm transition-all duration-200
          ${hasComponent
            ? "opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
            : "opacity-100"
          }
        `}>
          <Plus className="h-4 w-4 text-primary" />
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </button>
  );
}
