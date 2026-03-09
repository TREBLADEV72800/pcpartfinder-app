// Compatibility engine - server side implementation
// This mirrors the client-side logic but runs on the server with full component data

const BASE_SYSTEM_WATTAGE = 50;

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

export interface CompatResult {
  ruleId: string;
  ruleName: string;
  status: "ok" | "warning" | "error" | "info";
  message: string;
  details?: Record<string, unknown>;
}

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

export function runAllCompatibilityChecks(build: BuildComponents): CompatResult[] {
  const results: CompatResult[] = [];

  // CPU / Motherboard Socket
  const { cpu, motherboard } = build;
  if (cpu && motherboard) {
    const cpuSocket = (cpu.specs.socket as string) || cpu.socket;
    const moboSocket = (motherboard.specs.socket as string) || motherboard.socket;

    if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
      results.push({
        ruleId: "cpu-mobo-socket",
        ruleName: "CPU / Motherboard Socket",
        status: "error",
        message: `CPU ${cpu.name} (${cpuSocket}) incompatibile con ${motherboard.name} (${moboSocket}).`,
        details: { cpuSocket, moboSocket },
      });
    } else if (cpuSocket && moboSocket) {
      results.push({
        ruleId: "cpu-mobo-socket",
        ruleName: "CPU / Motherboard Socket",
        status: "ok",
        message: `Socket ${cpuSocket} compatibile.`,
      });
    }
  }

  // Motherboard / RAM
  const { memory } = build;
  if (motherboard && memory) {
    const moboDdr = motherboard.specs.memory_type as string;
    const ramDdr = memory.specs.memory_type as string;

    if (moboDdr && ramDdr && moboDdr !== ramDdr) {
      results.push({
        ruleId: "mobo-ram-ddr",
        ruleName: "Motherboard / RAM DDR Type",
        status: "error",
        message: `Motherboard supporta ${moboDdr}, RAM è ${ramDdr}.`,
      });
    }

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
  }

  // Motherboard / Case Form Factor
  const { case: pcCase } = build;
  if (motherboard && pcCase) {
    const moboFF = motherboard.specs.form_factor as string;
    const caseSupportedFF = (pcCase.specs.supported_form_factors as string[]) || [];

    if (moboFF && caseSupportedFF.length > 0 && !caseSupportedFF.includes(moboFF)) {
      results.push({
        ruleId: "mobo-case-ff",
        ruleName: "Motherboard / Case Form Factor",
        status: "error",
        message: `Motherboard ${moboFF} non supportata dal case ${pcCase.name}.`,
      });
    }
  }

  // GPU / Case Length
  const { video_card } = build;
  if (video_card && pcCase) {
    const gpuLen = (video_card.specs.length_mm as number) || video_card.lengthMm;
    const caseMax = pcCase.specs.max_gpu_length_mm as number;

    if (gpuLen && caseMax && gpuLen > caseMax) {
      results.push({
        ruleId: "gpu-case-len",
        ruleName: "GPU / Case Clearance",
        status: "error",
        message: `GPU ${video_card.name} è ${gpuLen}mm, case max ${caseMax}mm. Non entra.`,
      });
    } else if (gpuLen && caseMax && caseMax - gpuLen < 15) {
      results.push({
        ruleId: "gpu-case-len",
        ruleName: "GPU / Case Clearance",
        status: "warning",
        message: `GPU entra con solo ${Math.round(caseMax - gpuLen)}mm di margine.`,
      });
    }
  }

  // Cooler / Case
  const { cpu_cooler } = build;
  if (cpu_cooler && pcCase) {
    const coolerH = (cpu_cooler.specs.height_mm as number) || cpu_cooler.heightMm;
    const caseMaxH = pcCase.specs.max_cooler_height_mm as number;

    if (coolerH && caseMaxH && coolerH > caseMaxH) {
      results.push({
        ruleId: "cooler-case-h",
        ruleName: "Cooler / Case Height",
        status: "error",
        message: `Cooler ${coolerH}mm supera il max del case (${caseMaxH}mm).`,
      });
    }
  }

  // PSU / Wattage
  const { power_supply } = build;
  if (power_supply) {
    const totalTdp = calculateTotalTDP(build);
    const psuW = (power_supply.specs.wattage as number) || power_supply.wattage || 0;
    const recommended = Math.ceil(totalTdp * 1.25);

    if (totalTdp > 0 && psuW < totalTdp) {
      results.push({
        ruleId: "psu-wattage",
        ruleName: "PSU / Wattaggio Sistema",
        status: "error",
        message: `Sistema richiede ~${totalTdp}W, PSU fornisce solo ${psuW}W. Minimo: ${recommended}W.`,
      });
    } else if (totalTdp > 0 && psuW < recommended) {
      results.push({
        ruleId: "psu-wattage",
        ruleName: "PSU / Wattaggio Sistema",
        status: "warning",
        message: `PSU ${psuW}W sufficiente ma margine basso. Raccomandato: ${recommended}W.`,
      });
    }
  }

  return results;
}
