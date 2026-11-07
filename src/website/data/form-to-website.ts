import type { WeddingFormData } from '@/lib/schemas/wedding-form';
import { PREVIEW_DEFAULTS, resolvePreviewField } from '@/lib/templates/preview-defaults';
import type { WebsiteEvent, WebsiteWedding } from '../templates/types';

interface MapOptions {
    /**
     * Field keys the customer has touched (the wedding store's touchedFields).
     * When given, untouched couple fields show the sample names, the same way
     * the card preview does. Omit it to show only what the customer entered.
     */
    touchedFields?: string[];
}

const text = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

/**
 * Builds the wedding a website template renders from the details form, before
 * any database record exists (pre-payment there is no session, so the form only
 * lives in the browser).
 *
 * The event list deliberately mirrors what POST /api/wedding and
 * /api/payment/verify create from the same form: every form event in order,
 * plus a "Wedding Ceremony" built from the primary date/time/venue, put first,
 * only when no event already looks like the wedding. Keeping these rules
 * identical is what makes the review match the site guests will see.
 */
export function formDataToWebsiteWedding(formData: WeddingFormData, options: MapOptions = {}): WebsiteWedding {
    const { touchedFields } = options;
    const field = (key: 'groomName' | 'brideName' | 'groomParents' | 'brideParents', fallback: string) => {
        const raw = text(formData[key]);
        return touchedFields ? resolvePreviewField(raw, touchedFields.includes(key), fallback) : raw;
    };

    const events: WebsiteEvent[] = (formData.events || []).map((event) => ({
        id: event.id,
        name: text(event.name) || 'Untitled Event',
        date: text(event.date),
        time: text(event.time),
        venue: text(event.venue),
        mapLink: text(event.mapLink),
        description: text(event.description),
        eventType: text(event.eventType),
    }));

    const hasWedding = events.some((e) => e.name.toLowerCase().includes('wedding') || e.eventType === 'Wedding');
    if (!hasWedding) {
        events.unshift({
            id: 'wedding-ceremony',
            name: 'Wedding Ceremony',
            date: text(formData.primaryDate),
            time: text(formData.primaryTime),
            venue: text(formData.defaultVenueName),
            mapLink: text(formData.primaryMapLink),
            description: 'The Wedding Ceremony',
            eventType: 'Wedding',
        });
    }

    return {
        id: 'preview',
        groomName: field('groomName', PREVIEW_DEFAULTS.groomName),
        brideName: field('brideName', PREVIEW_DEFAULTS.brideName),
        groomParents: field('groomParents', PREVIEW_DEFAULTS.groomParents),
        brideParents: field('brideParents', PREVIEW_DEFAULTS.brideParents),
        invitationMessage: text(formData.invitationMessage),
        rsvpContact: text(formData.rsvpContact),
        rsvpDeadline: text(formData.rsvpDeadline) || null,
        events,
    };
}
