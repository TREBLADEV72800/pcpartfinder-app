export const SOCKET_CPU_GENERATIONS = {
  AM4: ["Ryzen 1000", "Ryzen 2000", "Ryzen 3000", "Ryzen 4000", "Ryzen 5000"],
  AM5: ["Ryzen 7000", "Ryzen 8000", "Ryzen 9000"],
  "LGA 1200": ["Core 10th", "Core 11th"],
  "LGA 1700": ["Core 12th", "Core 13th", "Core 14th"],
  "LGA 1851": ["Core Ultra 200"],
} as const;

export type Socket = keyof typeof SOCKET_CPU_GENERATIONS;
export const MODERN_SOCKETS = Object.keys(SOCKET_CPU_GENERATIONS) as Socket[];
