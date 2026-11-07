import { PREVIEW_DEFAULTS } from '@/lib/templates/preview-defaults';
import type { WebsiteWedding } from './types';

/** Dates relative to today so the sample countdown is always in the future. */
function daysFromNow(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * Sample couple shown on the design preview before the customer has entered
 * anything. Uses the same names as the card preview (PREVIEW_DEFAULTS). Never
 * read from or written to the database.
 */
export function getSampleWedding(): WebsiteWedding {
    return {
        id: 'preview',
        groomName: PREVIEW_DEFAULTS.groomName,
        brideName: PREVIEW_DEFAULTS.brideName,
        groomParents: PREVIEW_DEFAULTS.groomParents,
        brideParents: PREVIEW_DEFAULTS.brideParents,
        invitationMessage: `Together with their families, ${PREVIEW_DEFAULTS.groomName} & ${PREVIEW_DEFAULTS.brideName} invite you to share in the joy of their wedding celebration.`,
        rsvpContact: '+91 98765 43210',
        rsvpDeadline: daysFromNow(60),
        events: [
            {
                id: 'sample-haldi',
                name: 'Haldi Ceremony',
                eventType: 'Haldi',
                date: daysFromNow(89),
                time: '10:30',
                venue: 'The Courtyard Pavilion, Jaipur',
                description: 'Blessings of golden turmeric, marigold petals, and joyful laughter.',
            },
            {
                id: 'sample-mehendi',
                name: 'Mehendi Ceremony',
                eventType: 'Mehendi',
                date: daysFromNow(89),
                time: '16:00',
                venue: 'The Royal Palms Resort, Jaipur',
                description: 'Hands full of mehendi, hearts full of love.',
            },
            {
                id: 'sample-sangeet',
                name: 'Sangeet Night',
                eventType: 'Sangeet',
                date: daysFromNow(89),
                time: '20:00',
                venue: 'Grand Imperial Ballroom, Jaipur',
                description: 'An evening of rhythm, music and celebration.',
            },
            {
                id: 'sample-wedding',
                name: 'Wedding Ceremony',
                eventType: 'Wedding',
                date: daysFromNow(90),
                time: '11:00',
                venue: PREVIEW_DEFAULTS.eventVenue,
                description: 'The auspicious union and sacred pheras.',
            },
            {
                id: 'sample-reception',
                name: 'Grand Reception',
                eventType: 'Reception',
                date: daysFromNow(91),
                time: '20:00',
                venue: 'The Palace Lawns, Jaipur',
                description: 'Join us for a royal dinner and celebrations.',
            },
        ],
    };
}
