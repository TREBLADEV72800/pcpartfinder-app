import { SignJWT, jwtVerify } from "jose";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-this-in-prod"
);

const SALT_ROUNDS = 10;

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

  /**
   * Hash a password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compare a plain text password with a hashed password
   */
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
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

  /**
   * Validate user credentials
   */
  async validateCredentials(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await this.comparePassword(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return user;
  }
}

export const authService = new AuthService();
