-- Add payment/identity fields to Order for the payment-as-onboarding flow.
-- All columns are nullable and additive; the unique index is on a new column
-- (all existing rows are NULL), so this migration is non-destructive.

ALTER TABLE "Order" ADD COLUMN "packageId" TEXT;
ALTER TABLE "Order" ADD COLUMN "razorpayOrderId" TEXT;
ALTER TABLE "Order" ADD COLUMN "razorpayPaymentId" TEXT;
ALTER TABLE "Order" ADD COLUMN "contactEmail" TEXT;
ALTER TABLE "Order" ADD COLUMN "contactPhone" TEXT;
ALTER TABLE "Order" ADD COLUMN "weddingId" TEXT;

CREATE UNIQUE INDEX "Order_razorpayOrderId_key" ON "Order"("razorpayOrderId");
