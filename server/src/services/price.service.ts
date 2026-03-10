import { prisma } from "../lib/prisma.js";
import { cacheService } from "./cache.service.js";

export class PriceService {
  async getLatestPrices(componentId: string) {
    return prisma.price.findMany({
      where: { componentId },
      orderBy: { price: "asc" },
    });
  }

  async getPriceHistory(componentId: string) {
    const cacheKey = `price-history:${componentId}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const history = await prisma.priceHistory.findMany({
      where: { componentId },
      orderBy: { recordedAt: "asc" },
    });

    await cacheService.set(cacheKey, history, 3600); // 1 hour cache
    return history;
  }

  async createPriceAlert(userId: string, componentId: string, targetPrice: number) {
    return prisma.priceAlert.create({
      data: {
        userId,
        componentId,
        targetPrice,
      },
    });
  }

  async getUserAlerts(userId: string) {
    return prisma.priceAlert.findMany({
      where: { userId },
      include: {
        component: true,
      },
    });
  }

  async deleteAlert(alertId: string, userId: string) {
    return prisma.priceAlert.delete({
      where: { id: alertId, userId },
    });
  }
}

export const priceService = new PriceService();
