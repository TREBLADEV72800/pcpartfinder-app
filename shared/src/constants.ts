// Mappa per inferire anno di uscita dalle serie prodotto
export const PRODUCT_YEAR_MAP: Record<string, number> = {
  // AMD CPU
  "Ryzen 3000": 2019,
  "Ryzen 4000": 2020,
  "Ryzen 5000": 2020,
  "Ryzen 7000": 2022,
  "Ryzen 9000": 2024,
  // Intel CPU
  "Core 9th": 2019,
  "Core 10th": 2020,
  "Core 11th": 2021,
  "Core 12th": 2021,
  "Core 13th": 2022,
  "Core 14th": 2023,
  "Core Ultra 200": 2024,
  // NVIDIA GPU
  "GTX 16": 2019,
  "RTX 20": 2019,
  "RTX 30": 2020,
  "RTX 40": 2022,
  "RTX 50": 2025,
  // AMD GPU
  "RX 5": 2019,
  "RX 6": 2020,
  "RX 7": 2022,
  "RX 9": 2025,
  // Intel GPU
  "Arc A": 2022,
  "Arc B": 2024,
  // DDR
  "DDR5": 2021,
  // Socket
  "AM5": 2022,
  "LGA 1700": 2021,
  "LGA 1851": 2024,
};

// Gerarchia Form Factor
export const FORM_FACTOR_HIERARCHY = ["Mini-ITX", "MicroATX", "ATX", "EATX"] as const;

export type FormFactor = (typeof FORM_FACTOR_HIERARCHY)[number];

// Socket types are now handled in sockets.ts

// Chipset per socket
export const SOCKET_CHIPSETS: Record<string, string[]> = {
  AM4: ["A520", "B450", "B550", "X470", "X570"],
  AM5: ["A620", "B650", "B650E", "X670", "X670E", "X870", "X870E"],
  "LGA 1200": ["B460", "H410", "H470", "Z490", "B560", "H510", "H570", "Z590"],
  "LGA 1700": ["B660", "H610", "H670", "Z690", "B760", "H770", "Z790"],
  "LGA 1851": ["B860", "Z890"],
};

// Form factor supportati dai case
export const CASE_FORM_FACTORS: Record<string, string[]> = {
  "Mini-ITX": ["Mini-ITX"],
  "MicroATX": ["Mini-ITX", "MicroATX"],
  "ATX": ["Mini-ITX", "MicroATX", "ATX"],
  "EATX": ["Mini-ITX", "MicroATX", "ATX", "EATX"],
};
