-- ============================================================================
-- Wedding.previousSlug — 2026-11-21
-- A retired link that permanently redirects to the wedding's current slug, so
-- links already shared with guests keep working after a slug change.
-- Adds one nullable column + unique index; no existing row or column changed.
-- Safe to run more than once.
-- ============================================================================
ALTER TABLE "Wedding" ADD COLUMN IF NOT EXISTS "previousSlug" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Wedding_previousSlug_key" ON "Wedding"("previousSlug");
