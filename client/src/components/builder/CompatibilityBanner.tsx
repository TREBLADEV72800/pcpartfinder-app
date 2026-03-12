import { useState, useEffect } from "react";
import { useBuildStore } from "@stores/useBuildStore";
import { runAllCompatibilityChecks, BuildComponents } from "@lib/compatibility";
import { CompatResult } from "@interfaces/compatibility";
import { AlertTriangle, CheckCircle, Info, XCircle, Zap, Activity } from "lucide-react";

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
      {/* Wattage Box - Cyber Style */}
      <WattageBox wattage={totalWattage} />

      {/* Errors - Cyber Danger */}
      {errors.length > 0 && (
        <div className="cyber-border p-4 bg-destructive/5 border-l-4 border-l-destructive animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center gap-3 text-destructive mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-destructive/20">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold">{errors.length} Error{errors.length > 1 ? "i" : ""} di Compatibilità</span>
              <span className="ml-2 text-xs text-destructive/70 uppercase tracking-wider">Critical</span>
            </div>
          </div>
          <ul className="space-y-2">
            {errors.map((result) => (
              <li key={result.ruleId} className="text-sm text-destructive/90 pl-11 border-l-2 border-destructive/30">
                {result.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings - Cyber Warning */}
      {warnings.length > 0 && (
        <div className="cyber-border p-4 bg-warning/5 border-l-4 border-l-warning animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center gap-3 text-warning mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-warning/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold">{warnings.length} Avvertimento{warnings.length > 1 ? "i" : ""}</span>
              <span className="ml-2 text-xs text-warning/70 uppercase tracking-wider">Attenzione</span>
            </div>
          </div>
          <ul className="space-y-2">
            {warnings.map((result) => (
              <li key={result.ruleId} className="text-sm text-warning/90 pl-11 border-l-2 border-warning/30">
                {result.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Info - Cyber Info */}
      {info.length > 0 && (
        <div className="cyber-border p-4 bg-muted/30 border-l-4 border-l-info animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center gap-3 text-info mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-info/20">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold">Note</span>
              <span className="ml-2 text-xs text-info/70 uppercase tracking-wider">Info</span>
            </div>
          </div>
          <ul className="space-y-2">
            {info.map((result) => (
              <li key={result.ruleId} className="text-sm text-muted-foreground pl-11 border-l-2 border-info/30">
                {result.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* All Good - Cyber Success */}
      {errors.length === 0 && warnings.length === 0 && results.length > 0 && (
        <div className="cyber-border cyber-glow-success p-5 bg-success/5 animate-[fadeIn_0.5s_ease-out]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-success/20 blur-xl rounded-full animate-pulse" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-sm bg-success/20">
                <CheckCircle className="h-7 w-7 text-success" />
              </div>
            </div>
            <div>
              <span className="font-semibold text-success text-lg">Sistema Compatibile</span>
              <p className="text-sm text-muted-foreground mt-1">Tutti i componenti sono compatibili!</p>
            </div>
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
  const percentage = Math.min((wattage / 1000) * 100, 100);

  // Determine wattage status color
  const getStatusColor = () => {
    if (wattage < 300) return "from-success to-success/60";
    if (wattage < 500) return "from-success via-warning to-warning";
    if (wattage < 700) return "from-warning via-orange-500 to-orange-600";
    return "from-orange-500 via-red-500 to-red-600";
  };

  return (
    <div className="cyber-border p-5 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-sm bg-primary/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div>
            <span className="font-semibold text-foreground">Wattaggio Stimato</span>
            <span className="ml-2 text-xs text-muted-foreground uppercase tracking-wider">Power</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-primary tabular-nums">{wattage}</span>
          <span className="text-lg text-muted-foreground ml-1">W</span>
        </div>
      </div>

      {/* Cyber Progress Bar */}
      <div className="relative h-3 bg-muted/50 rounded-sm overflow-hidden mb-3">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,transparent_49%,rgba(0,0,0,0.3)_50%,transparent_51%,transparent_100%)] bg-[length:4px_100%]" />
        {/* Gradient bar */}
        <div
          className={`h-full bg-gradient-to-r ${getStatusColor()} relative overflow-hidden transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[holographic_2s_linear_infinite]" />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>PSU consigliata:</span>
        </div>
        <span className="font-semibold text-primary tabular-nums">
          minimo {recommended}W
        </span>
      </div>
    </div>
  );
}
