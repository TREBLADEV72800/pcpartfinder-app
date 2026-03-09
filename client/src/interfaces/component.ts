export type ComponentCategory =
  | "CPU"
  | "CPU_COOLER"
  | "MOTHERBOARD"
  | "MEMORY"
  | "STORAGE"
  | "VIDEO_CARD"
  | "CASE"
  | "POWER_SUPPLY"
  | "MONITOR"
  | "OS"
  | "CASE_FAN"
  | "THERMAL_PASTE";

export interface Component {
  id: string;
  pcppId?: string;
  pcppUrl?: string;
  name: string;
  brand: string;
  model?: string;
  partNumber?: string;
  category: ComponentCategory;
  releaseYear?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  specs: Record<string, unknown>;
  socket?: string;
  formFactor?: string;
  chipset?: string;
  memoryType?: string;
  tdp?: number;
  wattage?: number;
  lengthMm?: number;
  heightMm?: number;
  radiatorMm?: number;
  capacityGb?: number;
  interfaceType?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  prices?: Price[];
  priceHistory?: PriceHistory[];
}

export interface Price {
  id: string;
  componentId: string;
  retailer: string;
  price: number;
  basePrice?: number;
  shipping?: number;
  tax?: number;
  total?: number;
  currency: string;
  url: string;
  inStock: boolean;
  scrapedAt: string;
}

export interface PriceHistory {
  id: string;
  componentId: string;
  retailer: string;
  price: number;
  currency: string;
  recordedAt: string;
}

export interface ComponentSpecs {
  [key: string]: string | number | boolean | string[] | number[] | null;
}
