-- ============================================================================
-- Website checkout link — 2026-11-07 (run after 20261107_wedding_website_tables.sql)
--
-- Order.bundleId and Wedding.themeId are required, so each website design is
-- sold through its own hidden card theme + bundle:
--   1. Adds WebsiteTemplate.cardThemeId / cardBundleId (new table only).
--   2. Inserts ONE new Theme row and ONE new Bundle row, both inactive
--      (isActive = false), so they never appear in the card gallery, the
--      sitemap or headline pricing. No BundleInvoice is created: the website
--      price comes from WebsiteTemplate.
--   3. Points Royal Sanctuary at them.
--
-- No existing row or column is changed or removed. Safe to run more than once.
-- ============================================================================

BEGIN;

ALTER TABLE "WebsiteTemplate" ADD COLUMN IF NOT EXISTS "cardBundleId" TEXT,
ADD COLUMN IF NOT EXISTS "cardThemeId" TEXT;

DO $$ BEGIN
    ALTER TABLE "WebsiteTemplate" ADD CONSTRAINT "WebsiteTemplate_cardThemeId_fkey" FOREIGN KEY ("cardThemeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "WebsiteTemplate" ADD CONSTRAINT "WebsiteTemplate_cardBundleId_fkey" FOREIGN KEY ("cardBundleId") REFERENCES "Bundle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO "Theme" ("id", "name", "description", "isActive", "sequence", "updatedAt")
VALUES ('theme_website_royal_sanctuary', 'Royal Sanctuary – Wedding Website',
        'Hidden. Records wedding website purchases of the Royal Sanctuary design. Not a card theme.',
        false, 999, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Bundle" ("id", "themeId", "BundleName", "isActive", "bundleDescription", "modifiedDate")
VALUES ('bundle_website_royal_sanctuary', 'theme_website_royal_sanctuary',
        'Royal Sanctuary – Wedding Website', false,
        'Hidden. Records wedding website purchases of the Royal Sanctuary design.',
        CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

UPDATE "WebsiteTemplate"
SET "cardThemeId" = 'theme_website_royal_sanctuary',
    "cardBundleId" = 'bundle_website_royal_sanctuary',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" = 'royal-sanctuary' AND "cardThemeId" IS NULL;

COMMIT;
