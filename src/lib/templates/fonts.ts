/**
 * Curated web-font set used by templates (the fonts already used across the
 * existing HTML designs). CardRenderer renders in the main document, so these
 * must be loaded wherever a card is shown/edited — use <TemplateFonts/>.
 */

export const TEMPLATE_FONTS: string[] = [
    'Playfair Display',
    'Great Vibes',
    'Cormorant Garamond',
    'Montserrat',
    'Alex Brush',
    'Pinyon Script',
    'Dancing Script',
];

/** Google Fonts stylesheet URL covering the template font set + common weights. */
export function templateFontsHref(): string {
    const families = [
        'Playfair+Display:ital,wght@0,300..700;1,400..600',
        'Great+Vibes',
        'Cormorant+Garamond:ital,wght@0,300..700;1,300..600',
        'Montserrat:ital,wght@0,300..700;1,400..600',
        'Alex+Brush',
        'Pinyon+Script',
        'Dancing+Script:wght@400..700',
    ]
        .map((f) => `family=${f}`)
        .join('&');
    return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
