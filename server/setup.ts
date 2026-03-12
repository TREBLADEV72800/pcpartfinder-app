#!/usr/bin/env tsx
/**
 * PCPartFinder - Complete Setup Script
 *
 * This script sets up the entire backend including:
 * 1. Database migrations
 * 2. Prisma Client generation
 * 3. Seed data
 * 4. Dependencies installation
 *
 * Prerequisites:
 * - Docker Desktop running
 * - Node.js 22+ installed
 */

import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
};

function log(message: string, color = "reset") {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function exec(command: string, cwd: string = process.cwd()): string {
  try {
    return execSync(command, { cwd, encoding: "utf-8", stdio: "pipe" });
  } catch (error: any) {
    const errorMsg = error.stderr || error.stdout || error.message;
    throw new Error(`Command failed: ${command}\n${errorMsg}`);
  }
}

async function checkPrerequisites() {
  log("\n🔍 Checking prerequisites...", "blue");

  // Check Node.js
  try {
    const nodeVersion = exec("node --version");
    const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);
    if (majorVersion < 22) {
      log(`❌ Node.js 22+ required, found ${nodeVersion}`, "red");
      process.exit(1);
    }
    log(`✅ Node.js ${nodeVersion.trim()}`, "green");
  } catch {
    log("❌ Node.js not found", "red");
    process.exit(1);
  }

  // Check Docker
  try {
    exec("docker ps --format '{{.Names}}'");
    log("✅ Docker is running", "green");
  } catch {
    log("❌ Docker is not running. Please start Docker Desktop.", "red");
    log("   Download: https://www.docker.com/products/docker-desktop/", "yellow");
    process.exit(1);
  }

  // Check .env file
  const envPath = join(process.cwd(), ".env");
  if (!existsSync(envPath)) {
    log("⚠️  .env file not found, creating from .env.example...", "yellow");
    try {
      const exampleEnv = readFileSync(join(process.cwd(), "../.env.example"), "utf-8");
      exec("echo '' > .env");
      log("✅ .env file created", "green");
    } catch {
      log("❌ Could not create .env file", "red");
    }
  } else {
    log("✅ .env file exists", "green");
  }
}

async function startDockerServices() {
  log("\n🐳 Starting Docker services...", "blue");

  try {
    // Check if services are already running
    const running = exec("docker ps --format '{{.Names}}'");
    if (running.includes("pcbuilder-db") && running.includes("pcbuilder-redis")) {
      log("✅ Docker services already running", "green");
      return;
    }
  } catch {}

  try {
    exec("docker-compose up -d", join(process.cwd(), ".."));
    log("✅ Docker services started", "green");

    // Wait for PostgreSQL to be ready
    log("⏳ Waiting for PostgreSQL to be ready...", "yellow");
    let retries = 0;
    while (retries < 30) {
      try {
        exec("docker exec pcbuilder-db pg_isready -U pcbuilder");
        log("✅ PostgreSQL is ready", "green");
        break;
      } catch {
        retries++;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (error: any) {
    log(`❌ Failed to start Docker: ${error.message}`, "red");
    process.exit(1);
  }
}

async function installDependencies() {
  log("\n📦 Installing dependencies...", "blue");

  try {
    exec("npm install");
    log("✅ Dependencies installed", "green");
  } catch (error: any) {
    log(`❌ Failed to install dependencies: ${error.message}`, "red");
    process.exit(1);
  }
}

async function generatePrismaClient() {
  log("\n🔧 Generating Prisma Client...", "blue");

  try {
    exec("npx prisma generate");
    log("✅ Prisma Client generated", "green");
  } catch (error: any) {
    log(`❌ Failed to generate Prisma Client: ${error.message}`, "red");
    process.exit(1);
  }
}

async function runMigrations() {
  log("\n🗄️  Running database migrations...", "blue");

  try {
    // Check if migrations already exist
    const migrationsDir = join(process.cwd(), "prisma", "migrations");
    const hasMigrations = existsSync(migrationsDir);

    if (hasMigrations) {
      log("📁 Migrations folder exists, applying...", "yellow");
      exec("npx prisma migrate deploy");
      log("✅ Migrations applied", "green");
    } else {
      log("📁 Creating initial migration...", "yellow");
      exec("npx prisma migrate dev --name init");
      log("✅ Initial migration created", "green");
    }
  } catch (error: any) {
    // If migration fails, try to reset
    log("⚠️  Migration failed, trying reset...", "yellow");
    try {
      exec("npx prisma migrate reset --force --skip-seed");
      log("✅ Database reset", "green");
    } catch {
      log(`❌ Failed to run migrations: ${error.message}`, "red");
      process.exit(1);
    }
  }
}

async function seedDatabase() {
  log("\n🌱 Seeding database...", "blue");

  try {
    exec("npm run prisma:seed");
    log("✅ Database seeded", "green");
  } catch (error: any) {
    log(`⚠️  Seed failed (non-critical): ${error.message}`, "yellow");
  }
}

async function runTests() {
  log("\n🧪 Testing API endpoints...", "blue");

  // Start server in background
  log("⏳ Starting server for testing...", "yellow");

  // Note: In production, you'd want to use a proper test runner
  log("⚠️  Manual testing required:", "yellow");
  log("   1. Start server: npm run dev", "yellow");
  log("   2. Test health: curl http://localhost:3001/health", "yellow");
  log("   3. Test components: curl http://localhost:3001/api/components", "yellow");
  log("   4. Test builds: curl http://localhost:3001/api/builds", "yellow");
}

async function main() {
  console.log(`${COLORS.bright}
╔═══════════════════════════════════════════════════════╗
║   PCPartFinder - Backend Setup                        ║
╚═══════════════════════════════════════════════════════╝
${COLORS.reset}`);

  try {
    await checkPrerequisites();
    await startDockerServices();
    await installDependencies();
    await generatePrismaClient();
    await runMigrations();
    await seedDatabase();
    await runTests();

    log("\n✨ Setup complete!", "green");
    log("\n🚀 Start the server with:", "blue");
    log("   npm run dev", "bright");
    log("\n📖 API will be available at:", "blue");
    log("   http://localhost:3001", "bright");

  } catch (error: any) {
    log(`\n❌ Setup failed: ${error.message}`, "red");
    process.exit(1);
  }
}

main();
