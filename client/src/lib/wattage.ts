import type { BuildComponents } from "./compatibility/types";

const BASE_SYSTEM_WATTAGE = 50; // Mobo + ventole + periferiche

export function calculateTotalTDP(build: BuildComponents): number {
  let total = BASE_SYSTEM_WATTAGE;

  if (build.cpu) {
    total += (build.cpu.specs.tdp as number) || build.cpu.tdp || 65;
  }

  if (build.video_card) {
    total += (build.video_card.specs.tdp as number) || build.video_card.tdp || 150;
  }

  if (build.memory) {
    const modules = (build.memory.specs.modules as number) || 2;
    const perModule = build.memory.specs.memory_type === "DDR5" ? 5 : 3;
    total += modules * perModule;
  }

  if (build.storage) {
    for (const s of build.storage) {
      if (
        (s.specs.interface_type as string)?.includes("NVMe") ||
        (s.specs.interface_type as string)?.includes("M.2")
      ) {
        total += 8;
      } else {
        total += s.specs.type === "HDD" ? 10 : 5;
      }
    }
  }

  if (build.cpu_cooler) {
    total += build.cpu_cooler.specs.type === "liquid" ? 15 : 5;
  }

  if (build.case_fan) {
    for (const f of build.case_fan) {
      total += ((f.specs.quantity as number) || 1) * 3;
    }
  }

  return total;
}

export function getWattageBreakdown(
  build: BuildComponents
): Array<{ label: string; wattage: number; color: string }> {
  const breakdown = [];

  if (build.cpu) {
    breakdown.push({
      label: "CPU",
      wattage: (build.cpu.specs.tdp as number) || 65,
      color: "#ef4444",
    });
  }
  if (build.video_card) {
    breakdown.push({
      label: "GPU",
      wattage: (build.video_card.specs.tdp as number) || 150,
      color: "#3b82f6",
    });
  }
  if (build.memory) {
    const modules = (build.memory.specs.modules as number) || 2;
    const perModule = build.memory.specs.memory_type === "DDR5" ? 5 : 3;
    breakdown.push({
      label: "RAM",
      wattage: modules * perModule,
      color: "#22c55e",
    });
  }

  let storageW = 0;
  if (build.storage) {
    for (const s of build.storage) {
      storageW += (s.specs.interface_type as string)?.includes("NVMe") ? 8 : 5;
    }
  }
  if (storageW > 0) {
    breakdown.push({ label: "Storage", wattage: storageW, color: "#f59e0b" });
  }

  breakdown.push({
    label: "Sistema base",
    wattage: BASE_SYSTEM_WATTAGE,
    color: "#8b5cf6",
  });

  return breakdown;
}
