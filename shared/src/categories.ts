export const ComponentCategory = {
  CPU: "CPU",
  CPU_COOLER: "CPU_COOLER",
  MOTHERBOARD: "MOTHERBOARD",
  MEMORY: "MEMORY",
  STORAGE: "STORAGE",
  VIDEO_CARD: "VIDEO_CARD",
  CASE: "CASE",
  POWER_SUPPLY: "POWER_SUPPLY",
  MONITOR: "MONITOR",
  OS: "OS",
  CASE_FAN: "CASE_FAN",
  THERMAL_PASTE: "THERMAL_PASTE",
} as const;

export type ComponentCategory = (typeof ComponentCategory)[keyof typeof ComponentCategory];

export interface CategoryMetadata {
  slug: string;
  name: string;
  icon: string;
  description: string;
  required: boolean;
  multiple: boolean;
}

export const CATEGORIES: Record<ComponentCategory, CategoryMetadata> = {
  [ComponentCategory.CPU]: {
    slug: "cpu",
    name: "CPU",
    icon: "Cpu",
    description: "Unità di elaborazione centrale",
    required: true,
    multiple: false,
  },
  [ComponentCategory.CPU_COOLER]: {
    slug: "cpu-cooler",
    name: "CPU Cooler",
    icon: "Fan",
    description: "Sistema di raffreddamento CPU",
    required: false,
    multiple: false,
  },
  [ComponentCategory.MOTHERBOARD]: {
    slug: "motherboard",
    name: "Motherboard",
    icon: "Server",
    description: "Scheda madre",
    required: true,
    multiple: false,
  },
  [ComponentCategory.MEMORY]: {
    slug: "memory",
    name: "RAM",
    icon: "Memory",
    description: "Memoria di sistema",
    required: true,
    multiple: false,
  },
  [ComponentCategory.STORAGE]: {
    slug: "storage",
    name: "Storage",
    icon: "HardDrive",
    description: "Unità di archiviazione",
    required: true,
    multiple: true,
  },
  [ComponentCategory.VIDEO_CARD]: {
    slug: "video-card",
    name: "GPU",
    icon: "Monitor",
    description: "Scheda video",
    required: false,
    multiple: false,
  },
  [ComponentCategory.CASE]: {
    slug: "case",
    name: "Case",
    icon: "Box",
    description: "Case PC",
    required: true,
    multiple: false,
  },
  [ComponentCategory.POWER_SUPPLY]: {
    slug: "power-supply",
    name: "PSU",
    icon: "Zap",
    description: "Alimentatore",
    required: true,
    multiple: false,
  },
  [ComponentCategory.MONITOR]: {
    slug: "monitor",
    name: "Monitor",
    icon: "MonitorPlay",
    description: "Display",
    required: false,
    multiple: true,
  },
  [ComponentCategory.OS]: {
    slug: "os",
    name: "OS",
    icon: "Disc",
    description: "Sistema operativo",
    required: false,
    multiple: false,
  },
  [ComponentCategory.CASE_FAN]: {
    slug: "case-fan",
    name: "Case Fan",
    icon: "Wind",
    description: "Ventole case",
    required: false,
    multiple: true,
  },
  [ComponentCategory.THERMAL_PASTE]: {
    slug: "thermal-paste",
    name: "Thermal Paste",
    icon: "Droplet",
    description: "Pasta termica",
    required: false,
    multiple: false,
  },
};
