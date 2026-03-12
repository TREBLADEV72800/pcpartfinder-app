-- CreateEnum
CREATE TYPE "ComponentCategory" AS ENUM ('CPU', 'CPU_COOLER', 'MOTHERBOARD', 'MEMORY', 'STORAGE', 'VIDEO_CARD', 'CASE', 'POWER_SUPPLY', 'MONITOR', 'OS', 'CASE_FAN', 'THERMAL_PASTE');

-- CreateEnum
CREATE TYPE "CompatStatus" AS ENUM ('OK', 'WARNING', 'ERROR', 'INFO');

-- CreateEnum
CREATE TYPE "BuildUseCase" AS ENUM ('GAMING', 'WORKSTATION', 'STREAMING', 'OFFICE', 'HOME_SERVER', 'HTPC', 'BUDGET', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ReviewSource" AS ENUM ('PCPARTPICKER', 'USER', 'IMPORTED');

-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('SYSTEM', 'USER', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "ScrapeStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED', 'PARTIAL');

-- CreateTable
CREATE TABLE "components" (
    "id" TEXT NOT NULL,
    "pcpp_id" TEXT,
    "pcpp_url" TEXT,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT,
    "part_number" TEXT,
    "category" "ComponentCategory" NOT NULL,
    "release_year" INTEGER,
    "image_url" TEXT,
    "thumbnail_url" TEXT,
    "specs" JSONB NOT NULL DEFAULT '{}',
    "socket" TEXT,
    "form_factor" TEXT,
    "chipset" TEXT,
    "memory_type" TEXT,
    "tdp" INTEGER,
    "wattage" INTEGER,
    "length_mm" DOUBLE PRECISION,
    "height_mm" DOUBLE PRECISION,
    "radiator_mm" INTEGER,
    "capacity_gb" DOUBLE PRECISION,
    "interface_type" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "components_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "components_category_idx" ON "components"("category");

-- CreateIndex
CREATE INDEX "components_category_releaseYear_idx" ON "components"("category", "release_year");

-- CreateIndex
CREATE INDEX "components_category_is_active_releaseYear_idx" ON "components"("category", "is_active", "release_year");

-- CreateIndex
CREATE INDEX "components_brand_idx" ON "components"("brand");

-- CreateIndex
CREATE INDEX "components_socket_idx" ON "components"("socket");

-- CreateIndex
CREATE INDEX "components_form_factor_idx" ON "components"("form_factor");

-- CreateIndex
CREATE INDEX "components_memory_type_idx" ON "components"("memory_type");

-- CreateIndex
CREATE INDEX "components_name_idx" ON "components"("name");

-- CreateIndex
CREATE INDEX "components_pcpp_id_key" ON "components"("pcpp_id");

-- CreateTable
CREATE TABLE "prices" (
    "id" TEXT NOT NULL,
    "component_id" TEXT NOT NULL,
    "retailer" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "base_price" DOUBLE PRECISION,
    "shipping" DOUBLE PRECISION,
    "tax" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "url" TEXT NOT NULL,
    "in_stock" BOOLEAN NOT NULL DEFAULT true,
    "scraped_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prices_component_id_idx" ON "prices"("component_id");

-- CreateIndex
CREATE INDEX "prices_retailer_idx" ON "prices"("retailer");

-- CreateIndex
CREATE INDEX "prices_price_idx" ON "prices"("price");

-- CreateIndex
CREATE INDEX "prices_component_id_retailer_key" ON "prices"("component_id", "retailer");

-- CreateTable
CREATE TABLE "price_history" (
    "id" TEXT NOT NULL,
    "component_id" TEXT NOT NULL,
    "retailer" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "price_history_component_id_recordedAt_idx" ON "price_history"("component_id", "recorded_at");

-- CreateIndex
CREATE INDEX "price_history_component_id_retailer_recordedAt_idx" ON "price_history"("component_id", "retailer", "recorded_at");

-- CreateTable
CREATE TABLE "price_alerts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "component_id" TEXT NOT NULL,
    "target_price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "triggered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "builds" (
    "id" TEXT NOT NULL,
    "share_id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" TEXT NOT NULL DEFAULT 'Untitled Build',
    "description" TEXT,
    "use_case" "BuildUseCase",
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "total_price" DOUBLE PRECISION,
    "total_wattage" INTEGER,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "builds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "builds_user_id_idx" ON "builds"("user_id");

-- CreateIndex
CREATE INDEX "builds_is_public_created_at_idx" ON "builds"("is_public", "created_at");

-- CreateIndex
CREATE INDEX "builds_share_id_key" ON "builds"("share_id");

-- CreateTable
CREATE TABLE "build_items" (
    "id" TEXT NOT NULL,
    "build_id" TEXT NOT NULL,
    "component_id" TEXT NOT NULL,
    "category_slot" "ComponentCategory" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "custom_price" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "build_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "build_items_build_id_idx" ON "build_items"("build_id");

-- CreateIndex
CREATE INDEX "build_items_build_id_category_slot_component_id_key" ON "build_items"("build_id", "category_slot", "component_id");

-- CreateTable
CREATE TABLE "compatibility_results" (
    "id" TEXT NOT NULL,
    "build_id" TEXT NOT NULL,
    "rule_id" TEXT NOT NULL,
    "status" "CompatStatus" NOT NULL,
    "message" TEXT NOT NULL,
    "details" JSONB,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compatibility_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "compatibility_results_build_id_idx" ON "compatibility_results"("build_id");

-- CreateTable
CREATE TABLE "compatibility_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_a" "ComponentCategory" NOT NULL,
    "category_b" "ComponentCategory" NOT NULL,
    "rule_type" TEXT NOT NULL,
    "severity" "CompatStatus" NOT NULL DEFAULT 'ERROR',
    "rule_logic" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compatibility_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "compatibility_rules_name_key" ON "compatibility_rules"("name");

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "avatar_url" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_key" ON "users"("username");

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "component_id" TEXT NOT NULL,
    "user_id" TEXT,
    "rating" DOUBLE PRECISION NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "author_name" TEXT,
    "source" "ReviewSource" NOT NULL DEFAULT 'PCPARTPICKER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reviews_component_id_idx" ON "reviews"("component_id");

-- CreateIndex
CREATE INDEX "reviews_component_id_rating_idx" ON "reviews"("component_id", "rating");

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "build_id" TEXT,
    "model_used" TEXT NOT NULL DEFAULT 'default',
    "total_tokens" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_sessions_user_id_idx" ON "chat_sessions"("user_id");

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "role" "ChatRole" NOT NULL,
    "content" TEXT NOT NULL,
    "tokens_input" INTEGER,
    "tokens_output" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scrape_logs" (
    "id" TEXT NOT NULL,
    "category" "ComponentCategory",
    "region" TEXT NOT NULL DEFAULT 'us',
    "status" "ScrapeStatus" NOT NULL,
    "items_scraped" INTEGER NOT NULL DEFAULT 0,
    "items_updated" INTEGER NOT NULL DEFAULT 0,
    "items_new" INTEGER NOT NULL DEFAULT 0,
    "errors_count" INTEGER NOT NULL DEFAULT 0,
    "error_details" JSONB,
    "duration_ms" INTEGER,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "scrape_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "builds" ADD CONSTRAINT "builds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "build_items" ADD CONSTRAINT "build_items_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "builds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "build_items" ADD CONSTRAINT "build_items_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compatibility_results" ADD CONSTRAINT "compatibility_results_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "builds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compatibility_results" ADD CONSTRAINT "compatibility_results_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "compatibility_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "builds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
