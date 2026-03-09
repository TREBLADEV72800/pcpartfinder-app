import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { componentService } from "../services/component.service.js";

const componentsRoute = new Hono();

// Validation schemas
const categorySchema = z.enum([
  "CPU",
  "CPU_COOLER",
  "MOTHERBOARD",
  "MEMORY",
  "STORAGE",
  "VIDEO_CARD",
  "CASE",
  "POWER_SUPPLY",
  "MONITOR",
  "OS",
  "CASE_FAN",
  "THERMAL_PASTE",
]);

const filtersSchema = z.object({
  category: categorySchema.optional(),
  minYear: z.coerce.number().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  brands: z.array(z.string()).optional(),
  socket: z.string().optional(),
  formFactor: z.string().optional(),
  memoryType: z.string().optional(),
  search: z.string().optional(),
  inStockOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(24),
  sortBy: z.string().default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// GET /api/components - List components with filters
componentsRoute.get("/", zValidator("query", filtersSchema), async (c) => {
  const filters = c.req.valid("query");
  const result = await componentService.findAll(filters);
  return c.json(result);
});

// GET /api/components/categories - Get all categories with counts
componentsRoute.get("/categories", async (c) => {
  const categories = await componentService.findCategories();
  return c.json(categories);
});

// GET /api/components/brands - Get all brands
componentsRoute.get("/brands", async (c) => {
  const category = c.req.query("category") as typeof categorySchema.Enum | undefined;
  const brands = await componentService.findBrands(category);
  return c.json(brands);
});

// GET /api/components/:id - Get component by ID
componentsRoute.get("/:id", async (c) => {
  const { id } = c.req.param();
  const component = await componentService.findById(id);

  if (!component) {
    return c.json({ error: "Component not found" }, 404);
  }

  return c.json(component);
});

// GET /api/components/:id/price-history - Get price history
componentsRoute.get("/:id/price-history", async (c) => {
  const { id } = c.req.param();
  const days = c.req.query("days") ? parseInt(c.req.query("days")) : 30;

  try {
    const history = await componentService.findPriceHistory(id, days);
    return c.json(history);
  } catch (error) {
    return c.json({ error: "Failed to fetch price history" }, 500);
  }
});

export default componentsRoute;
