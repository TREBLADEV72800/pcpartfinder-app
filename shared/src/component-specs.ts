// CPU specs
export interface CpuSpecs {
  socket?: string;
  cores?: number;
  threads?: number;
  baseClock?: string;
  boostClock?: string;
  tdp?: number;
  integratedGraphics?: string;
  l3Cache?: string;
}

// CPU Cooler specs
export interface CpuCoolerSpecs {
  type?: "air" | "liquid";
  fanRpm?: string;
  noiseLevelDb?: number;
  heightMm?: number;
  radiatorMm?: number;
  supportedSockets?: string[];
  maxTdp?: number;
}

// Motherboard specs
export interface MotherboardSpecs {
  formFactor?: string;
  chipset?: string;
  ramSlots?: number;
  maxRamGb?: number;
  memoryType?: string;
  m2Slots?: number;
  sataPorts?: number;
  pcieSlots?: number;
  wifi?: boolean;
  usbPorts?: number;
}

// RAM specs
export interface RamSpecs {
  memoryType?: string;
  speedMhz?: number;
  capacityGb?: number;
  modules?: number;
  casLatency?: number;
  voltage?: string;
}

// Storage specs
export interface StorageSpecs {
  type?: "SSD" | "HDD" | "NVMe";
  capacityGb?: number;
  interfaceType?: string;
  readSpeed?: string;
  writeSpeed?: string;
  formFactor?: string;
}

// GPU specs
export interface GpuSpecs {
  chipset?: string;
  vramGb?: number;
  baseClock?: string;
  boostClock?: string;
  lengthMm?: number;
  tdp?: number;
  outputs?: string[];
  fans?: number;
  pciePowerConnectors?: number;
}

// Case specs
export interface CaseSpecs {
  type?: string;
  supportedFormFactors?: string[];
  maxGpuLengthMm?: number;
  maxCoolerHeightMm?: number;
  driveBays25?: number;
  driveBays35?: number;
  fanSlots?: number;
  radiatorSupport?: number[];
}

// PSU specs
export interface PsuSpecs {
  wattage?: number;
  efficiencyRating?: string;
  modularType?: "full" | "semi" | "none";
  formFactor?: string;
  pcieConnectors?: number;
  epsConnectors?: number;
}

// Monitor specs
export interface MonitorSpecs {
  sizeInches?: number;
  resolution?: string;
  panelType?: string;
  refreshRateHz?: number;
  responseTimeMs?: number;
  adaptiveSync?: string;
}

// Union of all specs
export type ComponentSpecs =
  | CpuSpecs
  | CpuCoolerSpecs
  | MotherboardSpecs
  | RamSpecs
  | StorageSpecs
  | GpuSpecs
  | CaseSpecs
  | PsuSpecs
  | MonitorSpecs;
