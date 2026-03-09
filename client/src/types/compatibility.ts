export type CompatStatus = "ok" | "warning" | "error" | "info";

export interface CompatResult {
  ruleId: string;
  ruleName: string;
  status: CompatStatus;
  message: string;
  details?: Record<string, unknown>;
}

export interface BuildComponents {
  cpu?: ComponentData;
  cpu_cooler?: ComponentData;
  motherboard?: ComponentData;
  memory?: ComponentData;
  storage?: ComponentData[];
  video_card?: ComponentData;
  case?: ComponentData;
  power_supply?: ComponentData;
  case_fan?: ComponentData[];
  monitor?: ComponentData;
}

export interface ComponentData {
  id: string;
  name: string;
  brand: string;
  category: string;
  specs: Record<string, unknown>;
  tdp?: number;
  socket?: string;
  formFactor?: string;
  memoryType?: string;
  lengthMm?: number;
  heightMm?: number;
  radiatorMm?: number;
  wattage?: number;
}

export type CategorySlot =
  | "cpu"
  | "cpu_cooler"
  | "motherboard"
  | "memory"
  | "storage"
  | "video_card"
  | "case"
  | "power_supply"
  | "monitor"
  | "os"
  | "case_fan"
  | "thermal_paste";

import type { Component } from "./component";

export interface BuildItem {
  id: string;
  buildId: string;
  componentId: string;
  component: Component;
  categorySlot: Component["category"];
  quantity: number;
  customPrice?: number;
  notes?: string;
}
