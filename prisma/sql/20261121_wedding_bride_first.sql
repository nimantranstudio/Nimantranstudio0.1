-- ============================================================================
-- Wedding.brideFirst — 2026-11-21
-- Lets a wedding website list the bride ("Daughter of …") before the groom.
-- Adds one column with a default; no existing row or column is changed.
-- Safe to run more than once.
-- ============================================================================
ALTER TABLE "Wedding" ADD COLUMN IF NOT EXISTS "brideFirst" BOOLEAN NOT NULL DEFAULT false;
