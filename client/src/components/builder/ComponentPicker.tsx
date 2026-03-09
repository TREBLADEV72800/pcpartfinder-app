import { useState } from "react";
import { X } from "lucide-react";
import { Component, ComponentCategory } from "@interfaces/component";
import { formatPrice } from "@lib/utils";

interface ComponentPickerProps {
  isOpen: boolean;
  category: ComponentCategory | null;
  components: Component[];
  loading: boolean;
  onClose: () => void;
  onSelectComponent: (component: Component) => void;
}

export default function ComponentPicker({
  isOpen,
  category,
  components,
  loading,
  onClose,
  onSelectComponent,
}: ComponentPickerProps) {
  const [search, setSearch] = useState("");

  if (!isOpen || !category) return null;

  const categoryMeta = {
    CPU: { name: "CPU", plural: "CPU" },
    CPU_COOLER: { name: "CPU Cooler", plural: "CPU Cooler" },
    MOTHERBOARD: { name: "Motherboard", plural: "Motherboard" },
    MEMORY: { name: "RAM", plural: "Memorie" },
    STORAGE: { name: "Storage", plural: "Storage" },
    VIDEO_CARD: { name: "Scheda Video", plural: "Schede Video" },
    CASE: { name: "Case", plural: "Case" },
    POWER_SUPPLY: { name: "Alimentatore", plural: "Alimentatori" },
    MONITOR: { name: "Monitor", plural: "Monitor" },
    OS: { name: "Sistema Operativo", plural: "Sistemi Operativi" },
    CASE_FAN: { name: "Ventola", plural: "Ventole" },
    THERMAL_PASTE: { name: "Pasta Termica", plural: "Pasta Termica" },
  }[category];

  const filteredComponents = components.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50">
      <div className="w-full max-w-2xl h-full bg-card border-l border-border shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Scegli {categoryMeta.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <input
            type="text"
            placeholder="Cerca per nome o brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Component List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredComponents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {search ? "Nessun componente trovato" : "Nessun componente disponibile"}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredComponents.map((component) => (
                <ComponentCard
                  key={component.id}
                  component={component}
                  onClick={() => onSelectComponent(component)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <button
            onClick={onClose}
            className="w-full py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}

interface ComponentCardProps {
  component: Component;
  onClick: () => void;
}

function ComponentCard({ component, onClick }: ComponentCardProps) {
  const price = component.prices?.[0];
  const specs = component.specs as Record<string, unknown>;

  const specLines = Object.entries(specs)
    .filter(([key]) => ["socket", "formFactor", "memoryType", "capacity_gb", "tdp", "wattage"].includes(key))
    .slice(0, 3)
    .map(([key, value]) => {
      const label = {
        socket: "Socket",
        formFactor: "Form Factor",
        memoryType: "Tipo",
        capacity_gb: "Capacità",
        tdp: "TDP",
        wattage: "Wattaggio",
      }[key];
      return `${label}: ${value}`;
    });

  return (
    <button
      onClick={onClick}
      className="w-full p-4 border border-border rounded-lg bg-card hover:bg-accent transition-colors text-left"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Image placeholder */}
        <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
          <span className="text-xs text-muted-foreground text-center px-1">
            {component.brand}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{component.brand}</p>
          <h3 className="font-medium truncate">{component.name}</h3>

          {specLines.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {specLines.map((spec) => (
                <span key={spec} className="text-xs px-2 py-1 bg-muted rounded">
                  {spec}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex-shrink-0 text-right">
          {price ? (
            <div>
              <span className="font-semibold text-primary">{formatPrice(price.price)}</span>
              <p className="text-xs text-muted-foreground">{price.retailer}</p>
            </div>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      </div>
    </button>
  );
}
