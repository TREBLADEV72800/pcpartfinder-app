import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function formatWattage(watts: number): string {
  return `${watts}W`;
}

export function calculateTotalTDP(components: Record<string, any>): number {
  const BASE_SYSTEM_WATTAGE = 50;
  let total = BASE_SYSTEM_WATTAGE;

  for (const component of Object.values(components)) {
    if (!component) continue;

    // CPU TDP
    if (component.tdp || component.wattage) {
      total += component.tdp || component.wattage;
    }

    // GPU TDP
    if (component.specs?.tdp || component.specs?.wattage) {
      total += component.specs.tdp || component.specs.wattage;
    }

    // RAM
    if (component.category === "MEMORY" || component.category === "MEMORY") {
      total += 5; // Base RAM wattage
    }

    // Storage
    if (component.category === "STORAGE") {
      total += component.specs?.type === "NVMe" ? 8 : 5;
    }
  }

  return total;
}
