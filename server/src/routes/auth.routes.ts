import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authService } from "../services/auth.service.js";
import { prisma } from "../lib/prisma.js";

const auth = new Hono();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Mock password hashing for now - TODO: add bcrypt
auth.post("/register", zValidator("json", registerSchema), async (c) => {
  const { email, username, password } = c.req.valid("json");

  const existingEmail = await authService.findUserByEmail(email);
  if (existingEmail) return c.json({ error: "Email already registered" }, 400);

  const existingUser = await authService.findUserByUsername(username);
  if (existingUser) return c.json({ error: "Username already taken" }, 400);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash: password, // TODO: Hash this!
    },
  });

  const token = await authService.generateToken({
    userId: user.id,
    email: user.email,
    username: user.username,
  });

  return c.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

auth.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await authService.findUserByEmail(email);
  if (!user || user.passwordHash !== password) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = await authService.generateToken({
    userId: user.id,
    email: user.email,
    username: user.username,
  });

  return c.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

export default auth;
