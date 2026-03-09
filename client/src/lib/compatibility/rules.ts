import type { CompatResult, BuildComponents } from "./types";

// ═══════════════════════════════════════════
// CPU / Motherboard Socket
// ═══════════════════════════════════════════
export function checkCpuMotherboard(build: BuildComponents): CompatResult | null {
  const { cpu, motherboard } = build;
  if (!cpu || !motherboard) return null;

  const cpuSocket = (cpu.specs.socket as string) || cpu.socket;
  const moboSocket = (motherboard.specs.socket as string) || motherboard.socket;

  if (!cpuSocket || !moboSocket) {
    return {
      ruleId: "cpu-mobo-socket",
      ruleName: "CPU / Motherboard Socket",
      status: "info",
      message: "Impossibile verificare compatibilità socket: dati mancanti.",
    };
  }

  if (cpuSocket !== moboSocket) {
    return {
      ruleId: "cpu-mobo-socket",
      ruleName: "CPU / Motherboard Socket",
      status: "error",
      message: `CPU ${cpu.name} (${cpuSocket}) incompatibile con ${motherboard.name} (${moboSocket}).`,
      details: { cpuSocket, moboSocket },
    };
  }

  return {
    ruleId: "cpu-mobo-socket",
    ruleName: "CPU / Motherboard Socket",
    status: "ok",
    message: `Socket ${cpuSocket} compatibile.`,
  };
}

// ═══════════════════════════════════════════
// Motherboard / RAM
// ═══════════════════════════════════════════
export function checkMotherboardRam(build: BuildComponents): CompatResult[] {
  const { motherboard, memory } = build;
  if (!motherboard || !memory) return [];
  const results: CompatResult[] = [];

  // DDR Type
  const moboDdr = motherboard.specs.memory_type as string;
  const ramDdr = memory.specs.memory_type as string;
  if (moboDdr && ramDdr && moboDdr !== ramDdr) {
    results.push({
      ruleId: "mobo-ram-ddr",
      ruleName: "Motherboard / RAM DDR Type",
      status: "error",
      message: `Motherboard supporta ${moboDdr}, RAM è ${ramDdr}.`,
    });
  } else if (moboDdr && ramDdr) {
    results.push({
      ruleId: "mobo-ram-ddr",
      ruleName: "RAM DDR Type",
      status: "ok",
      message: `${ramDdr} compatibile.`,
    });
  }

  // Slot count
  const ramModules = (memory.specs.modules as number) || 1;
  const moboSlots = (motherboard.specs.ram_slots as number) || 4;
  if (ramModules > moboSlots) {
    results.push({
      ruleId: "mobo-ram-slots",
      ruleName: "Motherboard / RAM Slots",
      status: "error",
      message: `${ramModules} moduli RAM selezionati, solo ${moboSlots} slot disponibili.`,
    });
  }

  // Max capacity
  const ramCapacity = (memory.specs.capacity_gb as number) || 0;
  const ramTotal = ramCapacity;
  const moboMax = (motherboard.specs.max_ram_gb as number) || 128;
  if (ramTotal > moboMax) {
    results.push({
      ruleId: "mobo-ram-capacity",
      ruleName: "Motherboard / RAM Capacity",
      status: "error",
      message: `${ramTotal}GB totali superano il limite motherboard di ${moboMax}GB.`,
    });
  }

  return results;
}

// ═══════════════════════════════════════════
// Motherboard / Case Form Factor
// ═══════════════════════════════════════════
const FF_HIERARCHY: Record<string, number> = {
  "Mini-ITX": 0,
  "MicroATX": 1,
  "ATX": 2,
  "EATX": 3,
};

export function checkMotherboardCase(build: BuildComponents): CompatResult | null {
  const { motherboard, case: pcCase } = build;
  if (!motherboard || !pcCase) return null;

  const moboFF = motherboard.specs.form_factor as string;
  const caseSupportedFF = (pcCase.specs.supported_form_factors as string[]) || [];

  if (!moboFF || caseSupportedFF.length === 0) {
    return {
      ruleId: "mobo-case-ff",
      ruleName: "Motherboard / Case",
      status: "info",
      message: "Dati form factor mancanti.",
    };
  }

  if (!caseSupportedFF.includes(moboFF)) {
    const moboRank = FF_HIERARCHY[moboFF] ?? -1;
    const caseMaxRank = Math.max(...caseSupportedFF.map((f) => FF_HIERARCHY[f] ?? -1));
    if (moboRank > caseMaxRank) {
      return {
        ruleId: "mobo-case-ff",
        ruleName: "Motherboard / Case Form Factor",
        status: "error",
        message: `Motherboard ${moboFF} troppo grande per case ${pcCase.name} (supporta: ${caseSupportedFF.join(", ")}).`,
      };
    }
  }

  return {
    ruleId: "mobo-case-ff",
    ruleName: "Motherboard / Case",
    status: "ok",
    message: "Form factor compatibile.",
  };
}

// ═══════════════════════════════════════════
// GPU / Case Length
// ═══════════════════════════════════════════
export function checkGpuCase(build: BuildComponents): CompatResult | null {
  const { video_card, case: pcCase } = build;
  if (!video_card || !pcCase) return null;

  const gpuLen = (video_card.specs.length_mm as number) || video_card.lengthMm;
  const caseMax = pcCase.specs.max_gpu_length_mm as number;

  if (!gpuLen || !caseMax) return null;

  if (gpuLen > caseMax) {
    return {
      ruleId: "gpu-case-len",
      ruleName: "GPU / Case Clearance",
      status: "error",
      message: `GPU ${video_card.name} è ${gpuLen}mm, case max ${caseMax}mm. Non entra.`,
    };
  }

  if (caseMax - gpuLen < 15) {
    return {
      ruleId: "gpu-case-len",
      ruleName: "GPU / Case Clearance",
      status: "warning",
      message: `GPU entra con solo ${Math.round(caseMax - gpuLen)}mm di margine. Cable management difficile.`,
    };
  }

  return {
    ruleId: "gpu-case-len",
    ruleName: "GPU / Case",
    status: "ok",
    message: "GPU entra nel case.",
  };
}

// ═══════════════════════════════════════════
// Cooler / Case
// ═══════════════════════════════════════════
export function checkCoolerCase(build: BuildComponents): CompatResult | null {
  const { cpu_cooler, case: pcCase } = build;
  if (!cpu_cooler || !pcCase) return null;

  // Air cooler height check
  const coolerH = (cpu_cooler.specs.height_mm as number) || cpu_cooler.heightMm;
  const caseMaxH = pcCase.specs.max_cooler_height_mm as number;

  if (coolerH && caseMaxH && coolerH > caseMaxH) {
    return {
      ruleId: "cooler-case-h",
      ruleName: "Cooler / Case Height",
      status: "error",
      message: `Cooler ${coolerH}mm supera il max del case (${caseMaxH}mm).`,
    };
  }

  // AIO radiator check
  const radSize = (cpu_cooler.specs.radiator_mm as number) || cpu_cooler.radiatorMm;
  const caseRads = (pcCase.specs.radiator_support as number[]) || [];

  if (radSize && caseRads.length > 0 && !caseRads.includes(radSize)) {
    return {
      ruleId: "cooler-case-rad",
      ruleName: "Cooler / Case Radiator",
      status: "error",
      message: `Radiatore da ${radSize}mm non supportato. Case supporta: ${caseRads.join(", ")}mm.`,
    };
  }

  return {
    ruleId: "cooler-case-h",
    ruleName: "Cooler / Case",
    status: "ok",
    message: "Cooler compatibile con case.",
  };
}

// ═══════════════════════════════════════════
// Cooler / CPU
// ═══════════════════════════════════════════
export function checkCoolerCpu(build: BuildComponents): CompatResult[] {
  const { cpu_cooler, cpu } = build;
  if (!cpu_cooler || !cpu) return [];
  const results: CompatResult[] = [];

  // Socket
  const cpuSocket = (cpu.specs.socket as string) || cpu.socket;
  const coolerSockets = (cpu_cooler.specs.supported_sockets as string[]) || [];

  if (coolerSockets.length > 0 && cpuSocket && !coolerSockets.includes(cpuSocket)) {
    results.push({
      ruleId: "cooler-cpu-socket",
      ruleName: "Cooler / CPU Socket",
      status: "error",
      message: `Cooler non supporta socket ${cpuSocket}. Supportati: ${coolerSockets.join(", ")}.`,
    });
  }

  // TDP
  const cpuTdp = (cpu.specs.tdp as number) || cpu.tdp || 0;
  const coolerMaxTdp = (cpu_cooler.specs.max_tdp as number) || 0;

  if (coolerMaxTdp > 0 && cpuTdp > coolerMaxTdp) {
    results.push({
      ruleId: "cooler-cpu-tdp",
      ruleName: "Cooler / CPU TDP",
      status: "warning",
      message: `CPU TDP ${cpuTdp}W supera il rating cooler di ${coolerMaxTdp}W. Raffreddamento potrebbe essere insufficiente.`,
    });
  }

  if (results.length === 0) {
    results.push({
      ruleId: "cooler-cpu-socket",
      ruleName: "Cooler / CPU",
      status: "ok",
      message: "Cooler compatibile con CPU.",
    });
  }

  return results;
}

// ═══════════════════════════════════════════
// PSU / Wattage Sistema
// ═══════════════════════════════════════════
import { calculateTotalTDP } from "../wattage";

export function checkPsuSystem(build: BuildComponents): CompatResult | null {
  const { power_supply } = build;
  if (!power_supply) return null;

  const totalTdp = calculateTotalTDP(build);
  const psuW = (power_supply.specs.wattage as number) || power_supply.wattage || 0;
  const recommended = Math.ceil(totalTdp * 1.25);

  if (totalTdp === 0) return null;

  if (psuW < totalTdp) {
    return {
      ruleId: "psu-wattage",
      ruleName: "PSU / Wattaggio Sistema",
      status: "error",
      message: `Sistema richiede ~${totalTdp}W, PSU fornisce solo ${psuW}W. Minimo: ${recommended}W.`,
    };
  }

  if (psuW < recommended) {
    return {
      ruleId: "psu-wattage",
      ruleName: "PSU / Wattaggio Sistema",
      status: "warning",
      message: `PSU ${psuW}W sufficiente (${totalTdp}W richiesti) ma margine basso. Raccomandato: ${recommended}W.`,
    };
  }

  return {
    ruleId: "psu-wattage",
    ruleName: "PSU / Wattaggio",
    status: "ok",
    message: `PSU ${psuW}W adeguato per ${totalTdp}W.`,
  };
}

// ═══════════════════════════════════════════
// Storage / Motherboard
// ═══════════════════════════════════════════
export function checkStorageMotherboard(build: BuildComponents): CompatResult[] {
  const { motherboard, storage } = build;
  if (!motherboard || !storage || storage.length === 0) return [];
  const results: CompatResult[] = [];

  const moboM2 = (motherboard.specs.m2_slots as number) || 0;
  const moboSata = (motherboard.specs.sata_ports as number) || 0;

  const m2Count = storage.filter((s) =>
    (s.specs.interface_type as string)?.includes("M.2") ||
    (s.specs.interface_type as string)?.includes("NVMe")
  ).length;
  const sataCount = storage.filter((s) =>
    (s.specs.interface_type as string) === "SATA" ||
    (s.specs.form_factor as string) === '2.5"'
  ).length;

  if (m2Count > moboM2) {
    results.push({
      ruleId: "storage-mobo-m2",
      ruleName: "Storage / M.2 Slots",
      status: "error",
      message: `${m2Count} M.2 selezionati, solo ${moboM2} slot disponibili.`,
    });
  }

  if (sataCount > moboSata) {
    results.push({
      ruleId: "storage-mobo-sata",
      ruleName: "Storage / SATA Ports",
      status: "error",
      message: `${sataCount} SATA selezionati, solo ${moboSata} porte disponibili.`,
    });
  }

  // M.2 condivide lane con SATA (warning comune)
  if (m2Count > 0 && sataCount > 0 && moboM2 > 0) {
    results.push({
      ruleId: "storage-mobo-shared",
      ruleName: "Storage / Shared Lanes",
      status: "info",
      message: "Nota: alcuni slot M.2 potrebbero disabilitare porte SATA. Consulta il manuale della motherboard.",
    });
  }

  return results;
}
