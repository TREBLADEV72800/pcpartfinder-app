import { prisma } from "../lib/prisma.js";
import { cacheService } from "../services/cache.service.js";
import type { ComponentCategory } from "@prisma/client";

export interface ComponentFilters {
  category?: ComponentCategory;
  minYear?: number;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  socket?: string;
  formFactor?: string;
  memoryType?: string;
  search?: string;
  inStockOnly?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class ComponentService {
  async findAll(filters: ComponentFilters = {}): Promise<PaginatedResponse<any>> {
    const {
      category,
      minYear,
      minPrice,
      maxPrice,
      brands,
      socket,
      formFactor,
      memoryType,
      search,
      inStockOnly,
      page = 1,
      pageSize = 24,
      sortBy = "name",
      sortOrder = "asc",
    } = filters;

    const cacheKey = `components:${JSON.stringify(filters)}`;
    const cached = await cacheService.get<PaginatedResponse<any>>(cacheKey);
    if (cached) return cached;

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (category) where.category = category;
    if (minYear) where.releaseYear = { gte: minYear };
    if (socket) where.socket = socket;
    if (formFactor) where.formFactor = formFactor;
    if (memoryType) where.memoryType = memoryType;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
      ];
    }
    if (brands && brands.length > 0) {
      where.brand = { in: brands };
    }

    // Price filtering requires joining with prices table
    let priceWhere: Record<string, unknown> | undefined;
    if (minPrice !== undefined || maxPrice !== undefined) {
      priceWhere = {};
      if (minPrice !== undefined) priceWhere.price = { ...priceWhere.price, gte: minPrice };
      if (maxPrice !== undefined) priceWhere.price = { ...priceWhere.price, lte: maxPrice };
      if (inStockOnly) priceWhere.inStock = true;
    }

    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      prisma.component.findMany({
        where,
        include: {
          prices: priceWhere ? { where: priceWhere } : true,
        },
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.component.count({ where }),
    ]);

    const result: PaginatedResponse<any> = {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    await cacheService.set(cacheKey, result, 300); // Cache for 5 minutes
    return result;
  }

  async findById(id: string): Promise<any | null> {
    const cacheKey = `component:${id}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const component = await prisma.component.findUnique({
      where: { id },
      include: {
        prices: {
          orderBy: { price: "asc" },
        },
        priceHistory: {
          orderBy: { recordedAt: "desc" },
          take: 30,
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (component) {
      await cacheService.set(cacheKey, component, 600); // Cache for 10 minutes
    }

    return component;
  }

  async findByPcppId(pcppId: string): Promise<any | null> {
    return prisma.component.findUnique({
      where: { pcppId },
      include: { prices: true },
    });
  }

  async findCategories(): Promise<{ category: string; count: number }[]> {
    const cacheKey = "component-categories";
    const cached = await cacheService.get<any[]>(cacheKey);
    if (cached) return cached;

    const categories = await prisma.component.groupBy({
      by: ["category"],
      where: { isActive: true },
      _count: true,
    });

    const result = categories.map((c) => ({
      category: c.category,
      count: c._count,
    }));

    await cacheService.set(cacheKey, result, 3600); // Cache for 1 hour
    return result;
  }

  async findBrands(category?: ComponentCategory): Promise<string[]> {
    const cacheKey = `component-brands:${category || "all"}`;
    const cached = await cacheService.get<string[]>(cacheKey);
    if (cached) return cached;

    const where = category ? { category, isActive: true } : { isActive: true };
    const components = await prisma.component.findMany({
      where,
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    });

    const result = components.map((c) => c.brand);
    await cacheService.set(cacheKey, result, 3600);
    return result;
  }

  async findPriceHistory(componentId: string, days: number = 30): Promise<any[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return prisma.priceHistory.findMany({
      where: {
        componentId,
        recordedAt: { gte: since },
      },
      orderBy: { recordedAt: "asc" },
    });
  }
}

export const componentService = new ComponentService();
