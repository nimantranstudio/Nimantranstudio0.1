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
            'Inspired by luxury Rajasthani palace weddings with carved jharokha arches, royal proclamation, ceremony pavilions, palace gallery, and guest RSVP register.',
        thumbnail: '/website-templates/royal-heritage/thumb.webp',
        price: 999,
        status: 'active',
        load: () => import('./royal-heritage'),
    },
    {
        id: 'modern-romance',
        name: 'The Modern Romance',
        tagline: 'Minimalist couture typography and destination-wedding poise',
        description:
            'An international editorial wedding website in soft ivory, blush, and muted rose-gold with magazine-spread composition, horizontal itinerary, triptych gallery, and atelier RSVP.',
        thumbnail: '/website-templates/modern-romance/thumb.webp',
        price: 999,
        status: 'active',
        load: () => import('./modern-romance'),
    },
    {
        id: 'garden-of-love',
        name: 'The Garden of Love',
        tagline: 'Watercolor botanicals and sunlit conservatory romance',
        description:
            'Inspired by exclusive outdoor European garden weddings in sage green, warm linen, and dusty rose with a botanical wreath gate, living vine timeline, arched gallery, and garden RSVP.',
        thumbnail: '/website-templates/garden-of-love/thumb.webp',
        price: 999,
        status: 'active',
        load: () => import('./garden-of-love'),
    },
];

export const DEFAULT_TEMPLATE_ID = WEBSITE_TEMPLATES[0].id;

export function getWebsiteTemplate(id: string | null | undefined): WebsiteTemplate | undefined {
    if (!id) return undefined;
    return WEBSITE_TEMPLATES.find((t) => t.id === id);
}
