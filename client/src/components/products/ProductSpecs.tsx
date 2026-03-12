import type { Component } from "@interfaces/component"
import { ComponentCategory } from "@shared"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Badge } from "@components/ui/badge"

interface ProductSpecsProps {
  component: Component
  className?: string
}

export function ProductSpecs({ component, className }: ProductSpecsProps) {
  // Category-specific specs to highlight
  const getHighlightedSpecs = () => {
    switch (component.category) {
      case ComponentCategory.CPU:
        return [
          { label: "Socket", value: component.socket },
          { label: "Cores/Threads", value: `${component.specs.cores || "?"}/${component.specs.threads || "?"}` },
          { label: "Base Clock", value: component.specs.base_clock || "?" },
          { label: "Boost Clock", value: component.specs.boost_clock || "?" },
          { label: "TDP", value: component.tdp ? `${component.tdp}W` : undefined },
          { label: "L3 Cache", value: component.specs.l3_cache },
        ]
      case ComponentCategory.VIDEO_CARD:
        return [
          { label: "Chipset", value: component.specs.chipset },
          { label: "VRAM", value: component.specs.vram_gb ? `${component.specs.vram_gb}GB` : undefined },
          { label: "Base Clock", value: component.specs.base_clock },
          { label: "Boost Clock", value: component.specs.boost_clock },
          { label: "TDP", value: component.tdp ? `${component.tdp}W` : undefined },
          { label: "Length", value: component.lengthMm ? `${component.lengthMm}mm` : undefined },
        ]
      case ComponentCategory.MOTHERBOARD:
        return [
          { label: "Socket", value: component.socket },
          { label: "Form Factor", value: component.formFactor },
          { label: "Chipset", value: component.chipset },
          { label: "RAM Slots", value: component.specs.ram_slots },
          { label: "Max RAM", value: component.specs.max_ram_gb ? `${component.specs.max_ram_gb}GB` : undefined },
          { label: "M.2 Slots", value: component.specs.m2_slots },
        ]
      case ComponentCategory.MEMORY:
        return [
          { label: "Type", value: component.memoryType },
          { label: "Speed", value: component.specs.speed_mhz ? `${component.specs.speed_mhz}MHz` : undefined },
          { label: "Capacity", value: component.capacityGb ? `${component.capacityGb}GB` : undefined },
          { label: "Modules", value: component.specs.modules },
          { label: "CAS Latency", value: component.specs.cas_latency },
        ]
      case ComponentCategory.STORAGE:
        return [
          { label: "Type", value: component.specs.type },
          { label: "Capacity", value: component.capacityGb ? `${component.capacityGb}GB` : undefined },
          { label: "Interface", value: component.interfaceType },
          { label: "Read Speed", value: component.specs.read_speed },
          { label: "Write Speed", value: component.specs.write_speed },
        ]
      case ComponentCategory.POWER_SUPPLY:
        return [
          { label: "Wattage", value: component.wattage ? `${component.wattage}W` : undefined },
          { label: "Efficiency", value: component.specs.efficiency_rating },
          { label: "Modular", value: component.specs.modular_type },
          { label: "Form Factor", value: component.formFactor },
        ]
      case ComponentCategory.CASE:
        return [
          { label: "Type", value: component.formFactor },
          { label: "Max GPU Length", value: component.specs.max_gpu_length_mm ? `${component.specs.max_gpu_length_mm}mm` : undefined },
          { label: "Max Cooler Height", value: component.specs.max_cooler_height_mm ? `${component.specs.max_cooler_height_mm}mm` : undefined },
          { label: "Drive Bays 2.5\"", value: component.specs.drive_bays_25 },
          { label: "Drive Bays 3.5\"", value: component.specs.drive_bays_35 },
        ]
      default:
        return []
    }
  }

  const highlightedSpecs = getHighlightedSpecs().filter((s) => s.value)

  // Get all specs for detailed view
  const getAllSpecs = () => {
    return Object.entries(component.specs || {}).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  }

  const allSpecs = getAllSpecs()

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Highlighted Specs */}
        {highlightedSpecs.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Key Specifications</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {highlightedSpecs.map((spec) => (
                <div key={spec.label} className="space-y-1">
                  <p className="text-xs text-muted-foreground">{spec.label}</p>
                  <p className="font-medium">{String(spec.value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Specs */}
        {allSpecs.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">All Specifications</h4>
            <div className="space-y-2">
              {allSpecs.map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-start justify-between py-2 border-b last:border-0"
                >
                  <span className="text-sm text-muted-foreground capitalize">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="text-sm font-medium text-right">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Component Info */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex flex-wrap gap-2">
            {component.brand && (
              <Badge variant="outline">Brand: {component.brand}</Badge>
            )}
            {component.partNumber && (
              <Badge variant="outline">PN: {component.partNumber}</Badge>
            )}
            {component.releaseYear && (
              <Badge variant="secondary">Released: {component.releaseYear}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
