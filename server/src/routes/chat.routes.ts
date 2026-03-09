import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { aiService } from "../services/ai.service.js";

const chatRoute = new Hono();

// Validation schema
const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().optional(),
  buildId: z.string().optional(),
  model: z.string().optional(),
});

// POST /api/chat - Send chat message
chatRoute.post("/", zValidator("json", chatSchema), async (c) => {
  const userId = c.req.header("x-user-id"); // Optional, for logged-in users
  const input = c.req.valid("json");

  try {
    const response = await aiService.chat({
      ...input,
      userId,
    });
    return c.json(response);
  } catch (error) {
    console.error("Chat error:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to process chat message" },
      500
    );
  }
});

// GET /api/chat/:sessionId/history - Get chat session history
chatRoute.get("/:sessionId/history", async (c) => {
  const { sessionId } = c.req.param();

  try {
    const history = await aiService.getSessionHistory(sessionId);
    return c.json(history);
  } catch (error) {
    return c.json({ error: "Failed to fetch chat history" }, 500);
  }
});

// DELETE /api/chat/:sessionId - Delete chat session
chatRoute.delete("/:sessionId", async (c) => {
  const { sessionId } = c.req.param();
  const userId = c.req.header("x-user-id");

  try {
    await aiService.deleteSession(sessionId, userId);
    return c.json({ success: true });
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to delete session" },
      error instanceof Error && error.message === "Unauthorized" ? 403 : 400
    );
  }
});

export default chatRoute;
