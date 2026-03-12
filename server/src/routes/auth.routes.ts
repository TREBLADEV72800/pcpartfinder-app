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

// POST /auth/register - Create new user account with bcrypt password hashing
auth.post("/register", zValidator("json", registerSchema), async (c) => {
  const { email, username, password } = c.req.valid("json");

  // Check if email already exists
  const existingEmail = await authService.findUserByEmail(email);
  if (existingEmail) {
    return c.json({ error: "Email already registered" }, 400);
  }

  // Check if username already exists
  const existingUser = await authService.findUserByUsername(username);
  if (existingUser) {
    return c.json({ error: "Username already taken" }, 400);
  }

  // Hash password using bcrypt before storing
  const passwordHash = await authService.hashPassword(password);

  // Create user with hashed password
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
    },
  });

  // Generate JWT token
  const token = await authService.generateToken({
    userId: user.id,
    email: user.email,
    username: user.username,
  });

  return c.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

// POST /auth/login - Authenticate user with bcrypt password verification
auth.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  // Validate credentials using bcrypt compare
  const user = await authService.validateCredentials(email, password);

  if (!user) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  // Generate JWT token
  const token = await authService.generateToken({
    userId: user.id,
    email: user.email,
    username: user.username,
  });

  return c.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

export default auth;
