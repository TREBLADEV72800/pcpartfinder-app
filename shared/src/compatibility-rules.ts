import { ComponentCategory } from "./categories";

export type CompatStatus = "OK" | "WARNING" | "ERROR" | "INFO";

export interface CompatibilityRuleDefinition {
  id: string;
  name: string;
  description: string;
  categoryA: ComponentCategory;
  categoryB: ComponentCategory;
  ruleType: string;
  severity: CompatStatus;
}

export const COMPATIBILITY_RULES: CompatibilityRuleDefinition[] = [
  {
    id: "cpu-mobo-socket",
    name: "CPU / Motherboard Socket",
    description: "La CPU deve avere lo stesso socket della scheda madre.",
    categoryA: "CPU",
    categoryB: "MOTHERBOARD",
    ruleType: "socket_match",
    severity: "ERROR",
  },
  {
    id: "mobo-ram-ddr",
    name: "Motherboard / RAM DDR Type",
    description: "Il tipo di memoria DDR deve essere supportato dalla scheda madre.",
    categoryA: "MOTHERBOARD",
    categoryB: "MEMORY",
    ruleType: "memory_type_match",
    severity: "ERROR",
  },
  {
    id: "mobo-ram-slots",
    name: "Motherboard / RAM Slots",
    description: "Il numero di moduli RAM non deve superare gli slot disponibili.",
    categoryA: "MOTHERBOARD",
    categoryB: "MEMORY",
    ruleType: "slot_count",
    severity: "ERROR",
  },
  {
    id: "mobo-case-ff",
    name: "Motherboard / Case Form Factor",
    description: "Il case deve supportare il form factor della scheda madre.",
    categoryA: "MOTHERBOARD",
    categoryB: "CASE",
    ruleType: "form_factor_check",
    severity: "ERROR",
  },
  {
    id: "gpu-case-len",
    name: "GPU / Case Clearance",
    description: "La lunghezza della scheda video non deve superare il massimo consentito dal case.",
    categoryA: "VIDEO_CARD",
    categoryB: "CASE",
    ruleType: "length_check",
    severity: "ERROR",
  },
  {
    id: "cooler-case-h",
    name: "Cooler / Case Height",
    description: "L'altezza del dissipatore CPU non deve superare il massimo consentito dal case.",
    categoryA: "CPU_COOLER",
    categoryB: "CASE",
    ruleType: "height_check",
    severity: "ERROR",
  },
  {
    id: "cooler-cpu-socket",
    name: "Cooler / CPU Socket",
    description: "Il dissipatore deve supportare il socket della CPU.",
    categoryA: "CPU_COOLER",
    categoryB: "CPU",
    ruleType: "socket_support",
    severity: "ERROR",
  },
  {
    id: "psu-wattage",
    name: "PSU / Wattaggio Sistema",
    description: "L'alimentatore deve fornire potenza sufficiente per l'intero sistema.",
    categoryA: "POWER_SUPPLY",
    categoryB: "CPU", // Dummy target for system-wide check
    ruleType: "wattage_check",
    severity: "WARNING",
  },
];
