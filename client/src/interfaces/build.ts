import type { Component } from "./component";

export type BuildUseCase =
  | "GAMING"
  | "WORKSTATION"
  | "STREAMING"
  | "OFFICE"
  | "HOME_SERVER"
  | "HTPC"
  | "BUDGET"
  | "CUSTOM";

export interface Build {
  id: string;
  shareId: string;
  userId?: string;
  name: string;
  description?: string;
  useCase?: BuildUseCase;
  isPublic: boolean;
  totalPrice?: number;
  totalWattage?: number;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  items: BuildItem[];
}

export interface BuildItem {
  id: string;
  buildId: string;
  componentId: string;
  component: Component;
  categorySlot: Component["category"];
  quantity: number;
  customPrice?: number;
  notes?: string;
}

export interface BuildInput {
  name?: string;
  description?: string;
  useCase?: BuildUseCase;
  isPublic?: boolean;
  items: Array<{
    componentId: string;
    categorySlot: string;
    quantity?: number;
    customPrice?: number;
    notes?: string;
  }>;
}
