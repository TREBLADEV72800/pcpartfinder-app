import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { priceService } from "../services/price.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { HonoEnv } from "../types/hono.js";

const prices = new Hono<HonoEnv>();

// Public routes
prices.get("/components/:id", async (c) => {
  const id = c.req.param("id");
  const result = await priceService.getLatestPrices(id);
  return c.json(result);
});

prices.get("/components/:id/history", async (c) => {
  const id = c.req.param("id");
  const result = await priceService.getPriceHistory(id);
  return c.json(result);
});

// Protected routes
const alertSchema = z.object({
  componentId: z.string(),
  targetPrice: z.number().positive(),
});

prices.post("/alerts", authMiddleware, zValidator("json", alertSchema), async (c) => {
  const user = c.get("user");
  const { componentId, targetPrice } = c.req.valid("json");
  const result = await priceService.createPriceAlert(user.userId, componentId, targetPrice);
  return c.json(result);
});

prices.get("/alerts", authMiddleware, async (c) => {
  const user = c.get("user");
  const result = await priceService.getUserAlerts(user.userId);
  return c.json(result);
});

prices.delete("/alerts/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  if (!user || !id) return c.json({ error: "Missing ID or user" }, 400);
  
  await priceService.deleteAlert(id, user.userId);
  return c.json({ success: true });
});

export default prices;
