import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterState {
  // Filtro anno
  minYear: number;
  recentOnly: boolean;

  // Filtri generici
  maxPrice: number | null;
  minPrice: number | null;
  selectedBrands: string[];
  inStockOnly: boolean;

  // Filtri specifici per categoria
  socketFilter: string | null;
  formFactorFilter: string | null;
  memoryTypeFilter: string | null;
  searchQuery: string;

  // Actions
  setRecentOnly: (val: boolean) => void;
  setMinYear: (year: number) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  toggleBrand: (brand: string) => void;
  setInStockOnly: (val: boolean) => void;
  setSocketFilter: (socket: string | null) => void;
  setFormFactorFilter: (ff: string | null) => void;
  setMemoryTypeFilter: (mt: string | null) => void;
  setSearchQuery: (q: string) => void;
  resetFilters: () => void;
}

const DEFAULT_STATE = {
  minYear: 2019,
  recentOnly: true, // ★ DEFAULT ATTIVO
  maxPrice: null,
  minPrice: null,
  selectedBrands: [],
  inStockOnly: false,
  socketFilter: null,
  formFactorFilter: null,
  memoryTypeFilter: null,
  searchQuery: "",
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      setRecentOnly: (val) => set({ recentOnly: val }),

      setMinYear: (year) => set({ minYear: year }),

      setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max }),

      toggleBrand: (brand) =>
        set((s) => ({
          selectedBrands: s.selectedBrands.includes(brand)
            ? s.selectedBrands.filter((b) => b !== brand)
            : [...s.selectedBrands, brand],
        })),

      setInStockOnly: (val) => set({ inStockOnly: val }),

      setSocketFilter: (socket) => set({ socketFilter: socket }),

      setFormFactorFilter: (ff) => set({ formFactorFilter: ff }),

      setMemoryTypeFilter: (mt) => set({ memoryTypeFilter: mt }),

      setSearchQuery: (q) => set({ searchQuery: q }),

      resetFilters: () => set(DEFAULT_STATE),
    }),
    { name: "pcbuilder-filters" }
  )
);
