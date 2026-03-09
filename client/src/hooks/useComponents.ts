import { useQuery } from "@tanstack/react-query";
import { ComponentCategory } from "@interfaces/component";
import { Paginated } from "@interfaces/api";

const API_BASE = "/api";

export interface Component {
  id: string;
  name: string;
  brand: string;
  model?: string;
  category: ComponentCategory;
  releaseYear?: number;
  specs: Record<string, unknown>;
  socket?: string;
  formFactor?: string;
  chipset?: string;
  memoryType?: string;
  tdp?: number;
  wattage?: number;
  lengthMm?: number;
  heightMm?: number;
  radiatorMm?: number;
  capacityGb?: number;
  interfaceType?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  prices?: Price[];
}

export interface Price {
  id: string;
  componentId: string;
  retailer: string;
  price: number;
  currency: string;
  url: string;
  inStock: boolean;
  scrapedAt: string;
}

export function useComponents(category?: ComponentCategory) {
  return useQuery({
    queryKey: ["components", category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      params.append("minYear", "2019");
      params.append("pageSize", "100");

      const response = await fetch(`${API_BASE}/components?${params}`);
      if (!response.ok) throw new Error("Failed to fetch components");
      const data: Paginated<Component> = await response.json();
      return data.items;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useComponent(id: string) {
  return useQuery({
    queryKey: ["component", id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/components/${id}`);
      if (!response.ok) throw new Error("Failed to fetch component");
      return response.json() as Promise<Component>;
    },
    enabled: !!id,
  });
}

export function usePriceHistory(componentId: string, days: number = 30) {
  return useQuery({
    queryKey: ["priceHistory", componentId, days],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/components/${componentId}/price-history?days=${days}`);
      if (!response.ok) throw new Error("Failed to fetch price history");
      return response.json();
    },
    enabled: !!componentId,
  });
}

export function useBuilds(page: number = 1, useCase?: string) {
  return useQuery({
    queryKey: ["builds", page, useCase],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("pageSize", "12");
      if (useCase) params.append("useCase", useCase);

      const response = await fetch(`${API_BASE}/builds?${params}`);
      if (!response.ok) throw new Error("Failed to fetch builds");
      return response.json();
    },
  });
}

export function useBuild(shareId: string) {
  return useQuery({
    queryKey: ["build", shareId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/builds/by-share/${shareId}`);
      if (!response.ok) throw new Error("Failed to fetch build");
      return response.json();
    },
    enabled: !!shareId,
  });
}
