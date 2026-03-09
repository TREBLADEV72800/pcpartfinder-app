export interface ComponentSpecs {
  // CPU specs
  socket?: string;
  cores?: number;
  threads?: number;
  baseClock?: string;
  boostClock?: string;
  tdp?: number;
  integratedGraphics?: string;
  l3Cache?: string;

  // CPU Cooler specs
  type?: "air" | "liquid";
  fanRpm?: string;
  noiseLevelDb?: number;
  heightMm?: number;
  radiatorMm?: number;
  supportedSockets?: string[];
  maxTdp?: number;

  // Motherboard specs
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

  // RAM specs
  memoryType?: string;
  speedMhz?: number;
  capacityGb?: number;
  modules?: number;
  casLatency?: number;
  voltage?: string;

  // Storage specs
  type?: "SSD" | "HDD" | "NVMe";
  capacityGb?: number;
  interfaceType?: string;
  readSpeed?: string;
  writeSpeed?: string;
  formFactor?: string;

  // GPU specs
  chipset?: string;
  vramGb?: number;
  baseClock?: string;
  boostClock?: string;
  lengthMm?: number;
  tdp?: number;
  outputs?: string[];
  fans?: number;
  pciePowerConnectors?: number;

  // Case specs
  type?: string;
  supportedFormFactors?: string[];
  maxGpuLengthMm?: number;
  maxCoolerHeightMm?: number;
  driveBays25?: number;
  driveBays35?: number;
  fanSlots?: number;
  radiatorSupport?: number[];

  // PSU specs
  wattage?: number;
  efficiencyRating?: string;
  modularType?: "full" | "semi" | "none";
  formFactor?: string;
  pcieConnectors?: number;
  epsConnectors?: number;

  // Monitor specs
  sizeInches?: number;
  resolution?: string;
  panelType?: string;
  refreshRateHz?: number;
  responseTimeMs?: number;
  adaptiveSync?: string;
}
