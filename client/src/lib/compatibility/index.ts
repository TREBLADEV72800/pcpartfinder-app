import { checkCpuMotherboard } from "./rules";
import { checkMotherboardRam } from "./rules";
import { checkMotherboardCase } from "./rules";
import { checkGpuCase } from "./rules";
import { checkCoolerCase } from "./rules";
import { checkCoolerCpu } from "./rules";
import { checkPsuSystem } from "./rules";
import { checkStorageMotherboard } from "./rules";
import type { BuildComponents, CompatResult } from "./types";

export function runAllCompatibilityChecks(build: BuildComponents): CompatResult[] {
  const results: CompatResult[] = [];

  // Regole che restituiscono singolo result
  const singleChecks = [
    checkCpuMotherboard,
    checkMotherboardCase,
    checkGpuCase,
    checkCoolerCase,
    checkPsuSystem,
  ];

  for (const check of singleChecks) {
    const result = check(build);
    if (result) results.push(result);
  }

  // Regole che restituiscono array
  results.push(...checkMotherboardRam(build));
  results.push(...checkCoolerCpu(build));
  results.push(...checkStorageMotherboard(build));

  return results;
}

export function hasErrors(results: CompatResult[]): boolean {
  return results.some((r) => r.status === "error");
}

export function hasWarnings(results: CompatResult[]): boolean {
  return results.some((r) => r.status === "warning");
}

export * from "./types";
export * from "./rules";
