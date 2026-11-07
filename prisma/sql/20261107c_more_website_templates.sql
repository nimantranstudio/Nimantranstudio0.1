-- ============================================================================
-- Three more website designs — 2026-11-07 (run after 20261107b_website_checkout_link.sql)
--
-- For each of royal-heritage, modern-romance, garden-of-love:
--   * one hidden Theme row and one hidden Bundle row (isActive = false), the
--     same pattern as Royal Sanctuary, so Order.bundleId / Wedding.themeId
--     have something to point at;
--   * one WebsiteTemplate row, ACTIVE, ₹999 incl. GST, linked to them.
--
-- Inserts only. No existing row or column is changed or removed.
-- Safe to run more than once (ON CONFLICT DO NOTHING).
-- ============================================================================

BEGIN;

INSERT INTO "Theme" ("id", "name", "description", "isActive", "sequence", "updatedAt") VALUES
  ('theme_website_royal_heritage', 'The Royal Heritage – Wedding Website',
   'Hidden. Records wedding website purchases of The Royal Heritage design. Not a card theme.', false, 999, CURRENT_TIMESTAMP),
  ('theme_website_modern_romance', 'The Modern Romance – Wedding Website',
   'Hidden. Records wedding website purchases of The Modern Romance design. Not a card theme.', false, 999, CURRENT_TIMESTAMP),
  ('theme_website_garden_of_love', 'The Garden of Love – Wedding Website',
   'Hidden. Records wedding website purchases of The Garden of Love design. Not a card theme.', false, 999, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Bundle" ("id", "themeId", "BundleName", "isActive", "bundleDescription", "modifiedDate") VALUES
  ('bundle_website_royal_heritage', 'theme_website_royal_heritage', 'The Royal Heritage – Wedding Website', false,
   'Hidden. Records wedding website purchases of The Royal Heritage design.', CURRENT_TIMESTAMP),
  ('bundle_website_modern_romance', 'theme_website_modern_romance', 'The Modern Romance – Wedding Website', false,
   'Hidden. Records wedding website purchases of The Modern Romance design.', CURRENT_TIMESTAMP),
  ('bundle_website_garden_of_love', 'theme_website_garden_of_love', 'The Garden of Love – Wedding Website', false,
   'Hidden. Records wedding website purchases of The Garden of Love design.', CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "WebsiteTemplate"
  ("id", "code", "name", "tagline", "description", "thumbnailUrl", "status",
   "version", "currency", "listPricePaise", "salePricePaise", "gstRateBps",
   "validityDays", "sortOrder", "cardThemeId", "cardBundleId", "updatedAt")
VALUES
  ('tpl_royal_heritage', 'royal-heritage', 'The Royal Heritage',
   'Palace archways, sandstone warmth, and regal Indian splendour',
   'Inspired by luxury Rajasthani palace weddings with carved jharokha arches, royal proclamation, ceremony pavilions, palace gallery, and guest RSVP register.',
   '/website-templates/royal-heritage/thumb.webp', 'ACTIVE',
   1, 'INR', 99900, 99900, 1800, NULL, 1,
   'theme_website_royal_heritage', 'bundle_website_royal_heritage', CURRENT_TIMESTAMP),
  ('tpl_modern_romance', 'modern-romance', 'The Modern Romance',
   'Minimalist couture typography and destination-wedding poise',
   'An international editorial wedding website in soft ivory, blush, and muted rose-gold with magazine-spread composition, horizontal itinerary, triptych gallery, and atelier RSVP.',
   '/website-templates/modern-romance/thumb.webp', 'ACTIVE',
   1, 'INR', 99900, 99900, 1800, NULL, 2,
   'theme_website_modern_romance', 'bundle_website_modern_romance', CURRENT_TIMESTAMP),
  ('tpl_garden_of_love', 'garden-of-love', 'The Garden of Love',
   'Watercolor botanicals and sunlit conservatory romance',
   'Inspired by exclusive outdoor European garden weddings in sage green, warm linen, and dusty rose with a botanical wreath gate, living vine timeline, arched gallery, and garden RSVP.',
   '/website-templates/garden-of-love/thumb.webp', 'ACTIVE',
   1, 'INR', 99900, 99900, 1800, NULL, 3,
   'theme_website_garden_of_love', 'bundle_website_garden_of_love', CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;

COMMIT;
