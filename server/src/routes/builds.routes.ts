import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { buildService } from "../services/build.service.js";
import type { BuildUseCase, ComponentCategory } from "@prisma/client";

const buildsRoute = new Hono();

// Validation schemas
const buildItemSchema = z.object({
  componentId: z.string(),
  categorySlot: z.custom<ComponentCategory>(),
  quantity: z.number().min(1).default(1),
  customPrice: z.number().min(0).optional(),
  notes: z.string().optional(),
});

const createBuildSchema = z.object({
  name: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  useCase: z.custom<BuildUseCase>().optional(),
  isPublic: z.boolean().default(false),
  items: z.array(buildItemSchema).min(1),
});

const updateBuildSchema = createBuildSchema.partial();

// GET /api/builds - List public builds
buildsRoute.get("/", async (c) => {
  const page = c.req.query("page") ? parseInt(c.req.query("page")) : 1;
  const pageSize = c.req.query("pageSize") ? parseInt(c.req.query("pageSize")) : 12;
  const useCase = c.req.query("useCase") as BuildUseCase | undefined;

  const result = await buildService.findPublic(page, pageSize, useCase);
  return c.json(result);
});

// GET /api/builds/my - Get user's builds (requires auth)
buildsRoute.get("/my", async (c) => {
  // TODO: Implement auth middleware
  const userId = c.req.header("x-user-id"); // Temporary
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const page = c.req.query("page") ? parseInt(c.req.query("page")) : 1;
  const pageSize = c.req.query("pageSize") ? parseInt(c.req.query("pageSize")) : 10;

  const result = await buildService.findByUser(userId, page, pageSize);
  return c.json(result);
});

// GET /api/builds/:id - Get build by ID
buildsRoute.get("/:id", async (c) => {
  const { id } = c.req.param();
  const build = await buildService.findById(id, true);

  if (!build) {
    return c.json({ error: "Build not found" }, 404);
  }

  return c.json(build);
});

// GET /api/builds/by-share/:shareId - Get build by share ID
buildsRoute.get("/by-share/:shareId", async (c) => {
  const { shareId } = c.req.param();
  const build = await buildService.findByShareId(shareId, true);

  if (!build) {
    return c.json({ error: "Build not found" }, 404);
  }

  return c.json(build);
});

// POST /api/builds - Create new build
buildsRoute.post("/", zValidator("json", createBuildSchema), async (c) => {
  const userId = c.req.header("x-user-id") || "anonymous"; // Temporary
  const input = c.req.valid("json");

  try {
    const build = await buildService.create(userId, input);
    return c.json(build, 201);
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to create build" },
      400
    );
  }
});

// PUT /api/builds/:id - Update build
buildsRoute.put("/:id", zValidator("json", updateBuildSchema), async (c) => {
  const { id } = c.req.param();
  const userId = c.req.header("x-user-id"); // Temporary

  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const input = c.req.valid("json");

  try {
    const build = await buildService.update(id, userId, input);
    return c.json(build);
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to update build" },
      error instanceof Error && error.message === "Unauthorized" ? 403 : 400
    );
  }
});

// DELETE /api/builds/:id - Delete build
buildsRoute.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const userId = c.req.header("x-user-id"); // Temporary

  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    await buildService.delete(id, userId);
    return c.json({ success: true });
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to delete build" },
      error instanceof Error && error.message === "Unauthorized" ? 403 : 400
    );
  }
});

// POST /api/builds/:id/clone - Clone build
buildsRoute.post("/:id/clone", async (c) => {
  const { id } = c.req.param();
  const userId = c.req.header("x-user-id"); // Temporary

  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const build = await buildService.clone(id, userId);
    return c.json(build, 201);
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to clone build" },
      400
    );
  }
});

// POST /api/builds/:id/like - Toggle like
buildsRoute.post("/:id/like", async (c) => {
  const { id } = c.req.param();
  const userId = c.req.header("x-user-id"); // Temporary

  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const build = await buildService.toggleLike(id, userId);
    return c.json({ likesCount: build.likesCount });
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to like build" },
      400
    );
  }
});

export default buildsRoute;
