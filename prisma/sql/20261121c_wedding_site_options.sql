-- ============================================================================
-- Wedding.siteOptions — 2026-11-21
-- Per-wedding display options for the wedding website (JSON). NULL = default
-- design for every existing wedding. Adds one nullable column; nothing else.
-- Safe to run more than once.
-- ============================================================================
ALTER TABLE "Wedding" ADD COLUMN IF NOT EXISTS "siteOptions" JSONB;
