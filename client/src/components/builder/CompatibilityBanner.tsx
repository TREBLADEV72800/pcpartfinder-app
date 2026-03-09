import { useState, useEffect } from "react";
import { useBuildStore } from "@stores/useBuildStore";
import { runAllCompatibilityChecks, BuildComponents } from "@lib/compatibility";
import { CompatResult } from "@interfaces/compatibility";
import { AlertTriangle, CheckCircle, Info, XCircle, Zap } from "lucide-react";

export default function CompatibilityBanner() {
  const { slots } = useBuildStore();
  const [results, setResults] = useState<CompatResult[]>([]);

  useEffect(() => {
    const buildComponents = toBuildComponents(slots);
    const checks = runAllCompatibilityChecks(buildComponents);
    setResults(checks);
  }, [slots]);

  const errors = results.filter((r) => r.status === "error");
  const warnings = results.filter((r) => r.status === "warning");
  const info = results.filter((r) => r.status === "info");
  const totalWattage = calculateWattage(slots);

  return (
    <div className="space-y-4">
      {/* Wattage Box */}
      <WattageBox wattage={totalWattage} />

      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <div className="flex items-center gap-2 text-destructive font-semibold mb-2">
            <XCircle className="h-5 w-5" />
            <span>{errors.length} Error{errors.length > 1 ? "i" : ""} di Compatibilità</span>
          </div>
          <ul className="space-y-2">
            {errors.map((result) => (
              <li key={result.ruleId} className="text-sm">
                {result.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-500 font-semibold mb-2">
            <AlertTriangle className="h-5 w-5" />
            <span>{warnings.length} Avvertimento{warnings.length > 1 ? "i" : ""}</span>
          </div>
          <ul className="space-y-2">
            {warnings.map((result) => (
              <li key={result.ruleId} className="text-sm">
                {result.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Info */}
      {info.length > 0 && (
        <div className="p-4 bg-muted border border-border rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground font-semibold mb-2">
            <Info className="h-5 w-5" />
            <span>Note</span>
          </div>
          <ul className="space-y-2">
            {info.map((result) => (
              <li key={result.ruleId} className="text-sm">
                {result.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* All Good */}
      {errors.length === 0 && warnings.length === 0 && results.length > 0 && (
        <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
          <div className="flex items-center gap-2 text-green-500 font-semibold">
            <CheckCircle className="h-5 w-5" />
            <span>Tutti i componenti sono compatibili!</span>
          </div>
        </div>
      )}
    </div>
  );
}

function toBuildComponents(slots: any[]): BuildComponents {
  const build: BuildComponents = {};

  for (const slot of slots) {
    if (slot.component) {
      if (slot.category === "CASE_FAN") {
        if (!build.case_fan) build.case_fan = [];
        build.case_fan.push(slot.component);
      } else if (slot.category === "STORAGE") {
        if (!build.storage) build.storage = [];
        build.storage.push(slot.component);
      } else if (slot.category === "MONITOR") {
        if (!build.monitor) build.monitor = [];
        build.monitor.push(slot.component);
      } else {
        const key = slot.category.toLowerCase() as keyof BuildComponents;
        (build as any)[key] = slot.component;
      }
    }
  }

  return build;
}

function calculateWattage(slots: any[]): number {
  let total = 50; // Base system

  for (const slot of slots) {
    if (slot.component) {
      total += slot.component.tdp || slot.component.wattage || 0;
    }
  }

  return total;
}

interface WattageBoxProps {
  wattage: number;
}

function WattageBox({ wattage }: WattageBoxProps) {
  const recommended = Math.ceil(wattage * 1.25);

  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <span className="font-semibold">Wattaggio Stimato</span>
        </div>
        <span className="text-2xl font-bold">{wattage}W</span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
          style={{ width: `${Math.min((wattage / 1000) * 100, 100)}%` }}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        PSU consigliata: minimo <span className="font-semibold text-primary">{recommended}W</span>
      </p>
    </div>
  );
}
