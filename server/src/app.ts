import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import componentsRoute from "./routes/components.routes.js";
import buildsRoute from "./routes/builds.routes.js";
import chatRoute from "./routes/chat.routes.js";

// Create Hono app
const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors({
  origin: ["http://localhost:5173", "https://pcpartfinder-app.vercel.app"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-User-ID"],
}));

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.route("/api/components", componentsRoute);
app.route("/api/builds", buildsRoute);
app.route("/api/chat", chatRoute);

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json(
    {
      error: "Internal server error",
      message: err.message,
    },
    500
  );
});

export default app;
