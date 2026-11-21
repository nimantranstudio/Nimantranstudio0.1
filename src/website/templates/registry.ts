import type { WebsiteTemplate } from './types';

/**
 * Every wedding website design customers can choose. Adding a design is a new
 * folder under src/website/templates plus one entry here — the selection,
 * preview, details and review pages read this list and never need changing.
 */
export const WEBSITE_TEMPLATES: WebsiteTemplate[] = [
    {
        id: 'royal-sanctuary',
        name: 'Royal Sanctuary',
        tagline: 'A golden lotus seal that opens into your celebration',
        description:
            'Guests tap the seal to open your invitation, then see every ceremony with a countdown, venue maps, add-to-calendar, music and RSVP.',
        thumbnail: '/website-templates/royal-sanctuary/thumb.webp',
        // Display price. Checkout charges WebsiteTemplate.salePricePaise (99900) from the database.
        price: 999,
        status: 'active',
        load: () => import('./royal-sanctuary'),
    },
    {
        id: 'royal-heritage',
        name: 'The Royal Heritage',
        tagline: 'Palace archways, sandstone warmth, and regal Indian splendour',
        description:
            'A carved haveli door you knock to open, a courtyard hero, a petal-sweep save-the-date, a live countdown, jharokha event windows, palace gallery and guest RSVP register.',
        thumbnail: '/website-templates/royal-heritage/thumb.webp',
        price: 999,
        status: 'active',
        load: () => import('./royal-heritage'),
    },
];

export const DEFAULT_TEMPLATE_ID = WEBSITE_TEMPLATES[0].id;

export function getWebsiteTemplate(id: string | null | undefined): WebsiteTemplate | undefined {
    if (!id) return undefined;
    return WEBSITE_TEMPLATES.find((t) => t.id === id);
}
