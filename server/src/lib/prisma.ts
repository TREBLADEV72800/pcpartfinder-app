import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Try different Supabase formats
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:ITat04ALsh1109@db.pnppfdwlfxubkcmiensi.supabase.co:5432/postgres?pgbouncer=true&sslmode=require";

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
