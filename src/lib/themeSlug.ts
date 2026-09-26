import { prisma } from '@/lib/prisma';

export function slugifyTheme(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u2013\u2014]/g, '-') // en-dash, em-dash to hyphen
    .replace(/[^\w\s-]/g, '')        // remove special chars
    .trim()
    .replace(/\s+/g, '-')            // spaces to hyphen
    .replace(/-+/g, '-');            // collapse multiple hyphens
}

// Known aliases or custom short slugs for existing themes
const THEME_SLUG_ALIASES: Record<string, string> = {
  'cmqcje2n90006nuzv6wvq6kf9': 'elegant-lotus-reverie-luxury-indian-invitation-suite',
  'cmnkf7nv40000g2h3gyu2r9uq': 'suvarna-sohala',
  'cmqm8dyo8000056iquwgtu71l': 'royal-blue',
  'cmqcjqxtw0007nuzvkeukty3t': 'whimsical-funky-wedding-invitation-bundle',
};

const SHORT_SLUG_MAP: Record<string, string> = {
  'elegant-lotus-reverie': 'cmqcje2n90006nuzv6wvq6kf9',
  'elegant-lotus': 'cmqcje2n90006nuzv6wvq6kf9',
  'lotus-reverie': 'cmqcje2n90006nuzv6wvq6kf9',
  'suvarna-sohala': 'cmnkf7nv40000g2h3gyu2r9uq',
  'royal-blue': 'cmqm8dyo8000056iquwgtu71l',
  'whimsical-funky': 'cmqcjqxtw0007nuzvkeukty3t',
};

export function getThemeSlug(theme: { id: string; name?: string; slug?: string | null }): string {
  if (theme.slug) return theme.slug;
  if (THEME_SLUG_ALIASES[theme.id]) return THEME_SLUG_ALIASES[theme.id];
  if (theme.name) {
    const s = slugifyTheme(theme.name);
    if (s) return s;
  }
  return theme.id;
}

/**
 * Resolves a theme by ID, slug, or slugified name.
 */
export async function findThemeByIdOrSlug(themeIdentifier: string) {
  if (!themeIdentifier) return null;

  // 1. Direct short-alias match
  const mappedId = SHORT_SLUG_MAP[themeIdentifier];
  if (mappedId) {
    const theme = await prisma.theme.findUnique({
      where: { id: mappedId },
      include: {
        bundles: {
          include: {
            bundleInvoices: true,
            bundleItems: {
              include: { event: true },
            },
          },
        },
      },
    });
    if (theme) return theme;
  }

  // 2. Direct ID match (CUID)
  const directById = await prisma.theme.findUnique({
    where: { id: themeIdentifier },
    include: {
      bundles: {
        include: {
          bundleInvoices: true,
          bundleItems: {
            include: { event: true },
          },
        },
      },
    },
  });
  if (directById) return directById;

  // 3. Match by slugified theme name across active themes
  const allThemes = await prisma.theme.findMany({
    include: {
      bundles: {
        include: {
          bundleInvoices: true,
          bundleItems: {
            include: { event: true },
          },
        },
      },
    },
  });

  for (const theme of allThemes) {
    const s = getThemeSlug(theme);
    if (s === themeIdentifier || slugifyTheme(theme.name) === themeIdentifier) {
      return theme;
    }
  }

  return null;
}
