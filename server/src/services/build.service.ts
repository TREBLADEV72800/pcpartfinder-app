import { prisma } from "../lib/prisma.js";
import { cacheService } from "../services/cache.service.js";
import type { ComponentCategory, BuildUseCase } from "@prisma/client";
import { calculateTotalTDP, runAllCompatibilityChecks } from "./compatibility.service.js";

export interface CreateBuildInput {
  name?: string;
  description?: string;
  useCase?: BuildUseCase;
  isPublic?: boolean;
  items: Array<{
    componentId: string;
    categorySlot: ComponentCategory;
    quantity?: number;
    customPrice?: number;
    notes?: string;
  }>;
}

export interface UpdateBuildInput {
  name?: string;
  description?: string;
  useCase?: BuildUseCase;
  isPublic?: boolean;
  items?: CreateBuildInput["items"];
}

export class BuildService {
  async create(userId: string, input: CreateBuildInput) {
    const { items, ...buildData } = input;

    // Calculate totals
    const totalPrice = await this.calculateTotalPrice(items);
    const componentsData = await this.getComponentsForItems(items);
    const totalWattage = this.calculateWattage(componentsData);

    const build = await prisma.build.create({
      data: {
        userId,
        name: buildData.name || "Untitled Build",
        description: buildData.description,
        useCase: buildData.useCase,
        isPublic: buildData.isPublic ?? false,
        totalPrice,
        totalWattage,
        items: {
          create: items.map((item) => ({
            componentId: item.componentId,
            categorySlot: item.categorySlot,
            quantity: item.quantity ?? 1,
            customPrice: item.customPrice,
            notes: item.notes,
          })),
        },
      },
      include: {
        items: {
          include: {
            component: {
              include: {
                prices: true,
              },
            },
          },
        },
      },
    });

    // Run compatibility checks
    await this.runCompatibilityChecks(build.id, componentsData);

    await cacheService.invalidateBuildCache(build.id);
    return build;
  }

  async findById(id: string, incrementViews: boolean = false) {
    const cacheKey = `build:${id}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      if (incrementViews) {
        prisma.build
          .update({ where: { id }, data: { viewsCount: { increment: 1 } } })
          .catch(() => {});
      }
      return cached;
    }

    const build = await prisma.build.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            component: {
              include: {
                prices: true,
              },
            },
          },
        },
        compatibility: {
          include: {
            rule: true,
          },
        },
      },
    });

    if (build && incrementViews) {
      await prisma.build.update({
        where: { id },
        data: { viewsCount: { increment: 1 } },
      });
    }

    if (build) {
      await cacheService.set(cacheKey, build, 300);
    }

    return build;
  }

  async findByShareId(shareId: string, incrementViews: boolean = false) {
    const build = await prisma.build.findUnique({
      where: { shareId },
      include: {
        items: {
          include: {
            component: {
              include: {
                prices: true,
              },
            },
          },
        },
        compatibility: {
          include: {
            rule: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (build && incrementViews) {
      await prisma.build.update({
        where: { shareId },
        data: { viewsCount: { increment: 1 } },
      });
    }

    return build;
  }

  async findByUser(userId: string, page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [builds, total] = await Promise.all([
      prisma.build.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              component: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.build.count({ where: { userId } }),
    ]);

    return {
      items: builds,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findPublic(page: number = 1, pageSize: number = 12, useCase?: BuildUseCase) {
    const skip = (page - 1) * pageSize;
    const where: { isPublic: boolean; useCase?: BuildUseCase } = {
      isPublic: true,
    };
    if (useCase) where.useCase = useCase;

    const [builds, total] = await Promise.all([
      prisma.build.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
          items: {
            include: {
              component: true,
            },
          },
        },
        orderBy: { viewsCount: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.build.count({ where }),
    ]);

    return {
      items: builds,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async update(id: string, userId: string, input: UpdateBuildInput) {
    const build = await prisma.build.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!build) throw new Error("Build not found");
    if (build.userId !== userId) throw new Error("Unauthorized");

    const { items, ...buildData } = input;

    let totalPrice: number | undefined;
    let totalWattage: number | undefined;

    if (items) {
      totalPrice = await this.calculateTotalPrice(items);
      const componentsData = await this.getComponentsForItems(items);
      totalWattage = this.calculateWattage(componentsData);

      // Delete existing items and create new ones
      await prisma.buildItem.deleteMany({
        where: { buildId: id },
      });

      await prisma.build.update({
        where: { id },
        data: {
          ...buildData,
          totalPrice,
          totalWattage,
          items: {
            create: items.map((item) => ({
              componentId: item.componentId,
              categorySlot: item.categorySlot,
              quantity: item.quantity ?? 1,
              customPrice: item.customPrice,
              notes: item.notes,
            })),
          },
        },
      });

      // Re-run compatibility checks
      await this.runCompatibilityChecks(id, componentsData);
    } else {
      await prisma.build.update({
        where: { id },
        data: buildData,
      });
    }

    await cacheService.invalidateBuildCache(id);
    return this.findById(id);
  }

  async delete(id: string, userId: string) {
    const build = await prisma.build.findUnique({
      where: { id },
    });

    if (!build) throw new Error("Build not found");
    if (build.userId !== userId) throw new Error("Unauthorized");

    await prisma.build.delete({
      where: { id },
    });

    await cacheService.invalidateBuildCache(id);
    return { success: true };
  }

  private async calculateTotalPrice(items: CreateBuildInput["items"]): Promise<number> {
    let total = 0;

    for (const item of items) {
      if (item.customPrice !== undefined) {
        total += item.customPrice * (item.quantity ?? 1);
      } else {
        const component = await prisma.component.findUnique({
          where: { id: item.componentId },
          include: { prices: true },
        });

        if (component?.prices && component.prices.length > 0) {
          const lowestPrice = Math.min(...component.prices.map((p) => p.price));
          total += lowestPrice * (item.quantity ?? 1);
        }
      }
    }

    return total;
  }

  private async getComponentsForItems(items: CreateBuildInput["items"]) {
    const componentIds = items.map((i) => i.componentId);
    const components = await prisma.component.findMany({
      where: { id: { in: componentIds } },
    });

    const componentMap = new Map(components.map((c) => [c.id, c]));

    return items.map((item) => ({
      category: item.categorySlot,
      component: componentMap.get(item.componentId),
    }));
  }

  private calculateWattage(componentsData: any[]): number {
    const buildComponents: any = {};

    for (const { category, component } of componentsData) {
      if (component) {
        buildComponents[category.toLowerCase()] = component;
      }
    }

    return calculateTotalTDP(buildComponents);
  }

  private async runCompatibilityChecks(buildId: string, componentsData: any[]) {
    const buildComponents: any = {};

    for (const { category, component } of componentsData) {
      if (component) {
        buildComponents[category.toLowerCase()] = component;
      }
    }

    const results = runAllCompatibilityChecks(buildComponents);

    // Delete old results
    await prisma.compatibilityResult.deleteMany({
      where: { buildId },
    });

    // Get or create rules
    for (const result of results) {
      let rule = await prisma.compatibilityRule.findUnique({
        where: { name: result.ruleId },
      });

      if (!rule) {
        rule = await prisma.compatibilityRule.create({
          data: {
            name: result.ruleId,
            description: result.ruleName,
            categoryA: "CPU", // Default, will be updated
            categoryB: "MOTHERBOARD",
            ruleType: "validation",
            severity: result.status.toUpperCase() as any,
            ruleLogic: result.details || {},
          },
        });
      }

      await prisma.compatibilityResult.create({
        data: {
          buildId,
          ruleId: rule.id,
          status: result.status.toUpperCase() as any,
          message: result.message,
          details: result.details,
        },
      });
    }
  }

  async clone(buildId: string, userId: string) {
    const original = await prisma.build.findUnique({
      where: { id: buildId },
      include: {
        items: {
          include: {
            component: true,
          },
        },
      },
    });

    if (!original) throw new Error("Build not found");

    const { name, description, useCase, items } = original;

    return this.create(userId, {
      name: `${name} (Copy)`,
      description,
      useCase: useCase || undefined,
      items: items.map((item) => ({
        componentId: item.componentId,
        categorySlot: item.categorySlot,
        quantity: item.quantity,
        customPrice: item.customPrice || undefined,
        notes: item.notes || undefined,
      })),
    });
  }

  async toggleLike(buildId: string, userId: string) {
    // Check if user already liked (would need a Like table, simplified here)
    const build = await prisma.build.findUnique({
      where: { id: buildId },
    });

    if (!build) throw new Error("Build not found");

    // For now, just increment
    const updated = await prisma.build.update({
      where: { id: buildId },
      data: {
        likesCount: { increment: 1 },
      },
    });

    await cacheService.invalidateBuildCache(buildId);
    return updated;
  }
}

export const buildService = new BuildService();
