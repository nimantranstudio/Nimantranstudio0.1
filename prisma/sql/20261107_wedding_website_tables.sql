-- ============================================================================
-- Wedding website tables — 2026-11-07
--
-- Creates (only if not present): enums ProductType, WebsiteTemplateStatus,
-- WebsiteStatus, PaymentStatus, MessageStatus; tables WebsiteTemplate,
-- WeddingWebsite, Payment.
-- Adds (only if not present) 10 new columns to "Order", two indexes on those
-- new columns, and two foreign keys from those new columns to the new tables.
--
-- Existing tables User, Wedding, WeddingEvent, RSVP and every other table are
-- not altered. No existing column is changed; nothing is dropped or deleted;
-- no existing row's existing values change. Existing orders read the new
-- columns' defaults (productType = 'CARD_BUNDLE', currency = 'INR',
-- refundedPaise = 0) and NULL for the rest.
--
-- Safe to run more than once. Runs in one transaction: any error undoes all.
-- Generated from prisma/schema.prisma (`prisma migrate diff` against the
-- live database), then guarded with IF NOT EXISTS.
-- ============================================================================

BEGIN;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "ProductType" AS ENUM ('CARD_BUNDLE', 'WEBSITE', 'WEBSITE_RENEWAL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "WebsiteTemplateStatus" AS ENUM ('DRAFT', 'COMING_SOON', 'ACTIVE', 'RETIRED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "WebsiteStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'PUBLISH_FAILED', 'UNPUBLISHED', 'EXPIRED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN IF NOT EXISTS "discountPaise" INTEGER,
ADD COLUMN IF NOT EXISTS "listPricePaise" INTEGER,
ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "productType" "ProductType" NOT NULL DEFAULT 'CARD_BUNDLE',
ADD COLUMN IF NOT EXISTS "refundedPaise" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "taxPaise" INTEGER,
ADD COLUMN IF NOT EXISTS "totalPaise" INTEGER,
ADD COLUMN IF NOT EXISTS "websiteTemplateId" TEXT,
ADD COLUMN IF NOT EXISTS "weddingWebsiteId" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "WebsiteTemplate" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "status" "WebsiteTemplateStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "listPricePaise" INTEGER NOT NULL,
    "salePricePaise" INTEGER NOT NULL,
    "gstRateBps" INTEGER NOT NULL DEFAULT 1800,
    "validityDays" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "WeddingWebsite" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "templateVersion" INTEGER NOT NULL,
    "status" "WebsiteStatus" NOT NULL DEFAULT 'DRAFT',
    "orderId" TEXT,
    "pricePaidPaise" INTEGER,
    "purchasedAt" TIMESTAMP(3),
    "publicUrl" TEXT,
    "firstPublishedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "publishAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastPublishError" TEXT,
    "expiresAt" TIMESTAMP(3),
    "unpublishedAt" TIMESTAMP(3),
    "unpublishReason" TEXT,
    "linkMessageStatus" "MessageStatus",
    "linkMessageId" TEXT,
    "linkSentTo" TEXT,
    "linkSentAt" TIMESTAMP(3),
    "linkDeliveredAt" TIMESTAMP(3),
    "linkMessageError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingWebsite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT,
    "gateway" TEXT NOT NULL DEFAULT 'RAZORPAY',
    "gatewayOrderId" TEXT NOT NULL,
    "gatewayPaymentId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "amountPaise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "method" TEXT,
    "errorCode" TEXT,
    "errorReason" TEXT,
    "errorDescription" TEXT,
    "authorizedAt" TIMESTAMP(3),
    "capturedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "refundedPaise" INTEGER NOT NULL DEFAULT 0,
    "refundId" TEXT,
    "refundedAt" TIMESTAMP(3),
    "refundReason" TEXT,
    "gatewayResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "WebsiteTemplate_code_key" ON "WebsiteTemplate"("code");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WebsiteTemplate_status_sortOrder_idx" ON "WebsiteTemplate"("status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "WeddingWebsite_weddingId_key" ON "WeddingWebsite"("weddingId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "WeddingWebsite_orderId_key" ON "WeddingWebsite"("orderId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WeddingWebsite_userId_idx" ON "WeddingWebsite"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WeddingWebsite_templateId_idx" ON "WeddingWebsite"("templateId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WeddingWebsite_status_expiresAt_idx" ON "WeddingWebsite"("status", "expiresAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Payment_status_createdAt_idx" ON "Payment"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_gateway_gatewayPaymentId_key" ON "Payment"("gateway", "gatewayPaymentId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Order_productType_status_paidAt_idx" ON "Order"("productType", "status", "paidAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Order_weddingWebsiteId_idx" ON "Order"("weddingWebsiteId");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "Order" ADD CONSTRAINT "Order_weddingWebsiteId_fkey" FOREIGN KEY ("weddingWebsiteId") REFERENCES "WeddingWebsite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "Order" ADD CONSTRAINT "Order_websiteTemplateId_fkey" FOREIGN KEY ("websiteTemplateId") REFERENCES "WebsiteTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "WeddingWebsite" ADD CONSTRAINT "WeddingWebsite_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "WeddingWebsite" ADD CONSTRAINT "WeddingWebsite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "WeddingWebsite" ADD CONSTRAINT "WeddingWebsite_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WebsiteTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "WeddingWebsite" ADD CONSTRAINT "WeddingWebsite_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Seed: the first design, only if not present. Price matches the ₹999 shown on
-- /websites today; update listPricePaise / salePricePaise when pricing is set.
INSERT INTO "WebsiteTemplate"
  ("id", "code", "name", "tagline", "description", "thumbnailUrl", "status",
   "version", "currency", "listPricePaise", "salePricePaise", "gstRateBps",
   "validityDays", "sortOrder", "updatedAt")
VALUES
  ('tpl_royal_sanctuary', 'royal-sanctuary', 'Royal Sanctuary',
   'A golden lotus seal that opens into your celebration',
   'Guests tap the seal to open your invitation, then see every ceremony with a countdown, venue maps, add-to-calendar, music and RSVP.',
   '/website-templates/royal-sanctuary/thumb.webp', 'ACTIVE',
   1, 'INR', 99900, 99900, 1800,
   NULL, 0, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;

COMMIT;
