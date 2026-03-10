import { Context, Next } from "hono";
import { authService } from "../services/auth.service.js";

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  const payload = await authService.verifyToken(token);

  if (!payload) {
    return c.json({ error: "Invalid token" }, 401);
  }

  // Set user context
  c.set("user", payload);
  await next();
};
