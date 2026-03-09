import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Component, ComponentCategory } from "../types/component";

export interface BuildSlot {
  category: ComponentCategory;
  component?: Component;
  customPrice?: number;
  notes?: string;
}

interface BuildState {
  slots: BuildSlot[];
  name: string;
  description?: string;
  useCase?: string;
  isPublic: boolean;

  // Actions
  setSlot: (category: ComponentCategory, component: Component | undefined) => void;
  setSlotCustomPrice: (category: ComponentCategory, price: number | undefined) => void;
  setSlotNotes: (category: ComponentCategory, notes: string | undefined) => void;
  setName: (name: string) => void;
  setDescription: (description: string | undefined) => void;
  setUseCase: (useCase: string | undefined) => void;
  setIsPublic: (isPublic: boolean) => void;
  clearBuild: () => void;
  getSlot: (category: ComponentCategory) => BuildSlot | undefined;
  getTotalPrice: () => number;
  getTotalWattage: () => number;
  hasComponent: (componentId: string) => boolean;
}

const INITIAL_SLOTS: BuildSlot[] = [
  { category: "CPU" as ComponentCategory },
  { category: "CPU_COOLER" as ComponentCategory },
  { category: "MOTHERBOARD" as ComponentCategory },
  { category: "MEMORY" as ComponentCategory },
  { category: "STORAGE" as ComponentCategory },
  { category: "VIDEO_CARD" as ComponentCategory },
  { category: "CASE" as ComponentCategory },
  { category: "POWER_SUPPLY" as ComponentCategory },
  { category: "MONITOR" as ComponentCategory },
  { category: "OS" as ComponentCategory },
  { category: "CASE_FAN" as ComponentCategory },
  { category: "THERMAL_PASTE" as ComponentCategory },
];

export const useBuildStore = create<BuildState>()(
  persist(
    (set, get) => ({
      slots: INITIAL_SLOTS,
      name: "Untitled Build",
      description: undefined,
      useCase: undefined,
      isPublic: false,

      setSlot: (category, component) =>
        set((state) => ({
          slots: state.slots.map((slot) =>
            slot.category === category ? { ...slot, component } : slot
          ),
        })),

      setSlotCustomPrice: (category, customPrice) =>
        set((state) => ({
          slots: state.slots.map((slot) =>
            slot.category === category ? { ...slot, customPrice } : slot
          ),
        })),

      setSlotNotes: (category, notes) =>
        set((state) => ({
          slots: state.slots.map((slot) =>
            slot.category === category ? { ...slot, notes } : slot
          ),
        })),

      setName: (name) => set({ name }),

      setDescription: (description) => set({ description }),

      setUseCase: (useCase) => set({ useCase }),

      setIsPublic: (isPublic) => set({ isPublic }),

      clearBuild: () => ({
        slots: INITIAL_SLOTS,
        name: "Untitled Build",
        description: undefined,
        useCase: undefined,
        isPublic: false,
      }),

      getSlot: (category) => get().slots.find((s) => s.category === category),

      getTotalPrice: () => {
        const slots = get().slots;
        let total = 0;
        for (const slot of slots) {
          if (slot.component) {
            const price = slot.customPrice || slot.component.prices?.[0]?.price || 0;
            total += price;
          }
        }
        return total;
      },

      getTotalWattage: () => {
        const slots = get().slots;
        let total = 50; // Base system wattage
        for (const slot of slots) {
          if (slot.component) {
            total += slot.component.tdp || slot.component.wattage || 0;
          }
        }
        return total;
      },

      hasComponent: (componentId) => {
        return get().slots.some(
          (slot) => slot.component?.id === componentId
        );
      },
    }),
    {
      name: "pcbuilder-build",
      partialize: (state) => ({
        slots: state.slots,
        name: state.name,
        description: state.description,
        useCase: state.useCase,
        isPublic: state.isPublic,
      }),
    }
  )
);
