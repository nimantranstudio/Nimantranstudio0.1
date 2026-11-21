-- ============================================================================
-- Retire replica website templates — 2026-11-21
-- Only Royal Sanctuary + Royal Heritage ship. Modern Romance and Garden of Love
-- (and the never-seeded Blossom & Oud / Midnight Velour) are removed from the
-- product so they can't be listed or bought. RETIRED keeps any already-published
-- site working (there are none on these templates). Idempotent.
-- ============================================================================
UPDATE "WebsiteTemplate" SET "status" = 'RETIRED', "updatedAt" = NOW()
WHERE "code" IN ('modern-romance', 'garden-of-love') AND "status" <> 'RETIRED';
