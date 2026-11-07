import type { ComponentType } from 'react';

/**
 * One ceremony as a website template receives it. Same field names the live
 * guest site (/rsvp/[id]) gets from a WeddingEvent row, so a template renders
 * identically whether the data came from the database or the details form.
 */
export interface WebsiteEvent {
    id: string;
    name: string;
    date?: string;
    time?: string;
    venue?: string;
    mapLink?: string;
    description?: string;
    eventType?: string;
}

/** The wedding as a website template receives it (mirrors the Wedding row). */
export interface WebsiteWedding {
    id: string;
    groomName: string;
    brideName: string;
    groomParents?: string;
    brideParents?: string;
    invitationMessage?: string;
    rsvpContact?: string;
    rsvpDeadline?: string | null;
    events: WebsiteEvent[];
}

export interface WebsiteTemplateProps {
    wedding: WebsiteWedding;
    isPreview?: boolean;
}

export interface WebsiteTemplate {
    /** Stable id used in URLs (/websites/[templateId]). Never rename once live. */
    id: string;
    name: string;
    tagline: string;
    description: string;
    /** Path under /public. */
    thumbnail: string;
    /**
     * Price shown on the design list, in whole rupees (GST included). Display
     * only: checkout charges WebsiteTemplate.salePricePaise from the database
     * (row with code = id), so keep the two in step.
     */
    price: number;
    status: 'active' | 'coming-soon';
    /** Lazily loaded so a page only downloads the template it shows. */
    load: () => Promise<{ default: ComponentType<WebsiteTemplateProps> }>;
}
