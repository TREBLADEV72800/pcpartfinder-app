import { SignJWT, jwtVerify } from "jose";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-this-in-prod"
);

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
}

export class AuthService {
  async generateToken(payload: JWTPayload): Promise<string> {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
      .sign(JWT_SECRET);
  }

  async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload as unknown as JWTPayload;
    } catch {
      return null;
    }
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findUserByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }
}

export const authService = new AuthService();
