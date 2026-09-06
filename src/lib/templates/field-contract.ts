/**
 * Canonical field IDs for HTML invitation templates.
 *
 * ## How to mark fields in a template HTML file:
 *
 *   Option A — data-field attribute (PREFERRED for new templates):
 *     <span data-field="groom-name">Placeholder</span>
 *     Receives live updates via postMessage on every form keystroke.
 *
 *   Option B — element id (legacy, still supported):
 *     <span id="groom-name">Placeholder</span>
 *     Injected once after iframe load via DOM scraping.
 *
 *   Option C — mustache tokens in text nodes:
 *     {{groom-name}} anywhere in the HTML.
 *     Replaced once on load.
 *
 * The postMessage bridge sends:
 *   { type: 'NIMANTRAN_UPDATE', payload: TemplateFieldMap }
 * to the iframe after every form prop change.
 */
export const FIELD_IDS = {
    GROOM_NAME:    'groom-name',
    BRIDE_NAME:    'bride-name',
    GROOM_PARENTS: 'groom-parents',
    BRIDE_PARENTS: 'bride-parents',
    EVENT_NAME:    'event-name',
    EVENT_DATE:    'event-date',
    EVENT_TIME:    'event-time',
    EVENT_VENUE:   'event-venue',
    VENUE:         'venue',
    HEADING:       'heading',
    SUBHEADING:    'subheading',
} as const;

export type FieldId = typeof FIELD_IDS[keyof typeof FIELD_IDS];

/** Flat map of fieldId → display string sent over postMessage. */
export type TemplateFieldMap = Partial<Record<string, string>>;

export interface FieldPayloadInput {
    groomName?: string;
    brideName?: string;
    groomParents?: string;
    brideParents?: string;
    eventName?: string;
    eventDate?: string;
    eventTime?: string;
    eventVenue?: string;
    heading?: string;
    subheading?: string;
}

/** Builds the postMessage payload from component props. Skips empty/undefined values. */
export function buildFieldPayload(input: FieldPayloadInput): TemplateFieldMap {
    const map: TemplateFieldMap = {};
    const set = (key: string, val?: string) => {
        if (val !== undefined && val !== null && val !== '') map[key] = val;
    };
    set(FIELD_IDS.GROOM_NAME,    input.groomName);
    set(FIELD_IDS.BRIDE_NAME,    input.brideName);
    set(FIELD_IDS.GROOM_PARENTS, input.groomParents);
    set(FIELD_IDS.BRIDE_PARENTS, input.brideParents);
    set(FIELD_IDS.EVENT_NAME,    input.eventName);
    set(FIELD_IDS.EVENT_DATE,    input.eventDate);
    set(FIELD_IDS.EVENT_TIME,    input.eventTime);
    set(FIELD_IDS.EVENT_VENUE,   input.eventVenue);
    set(FIELD_IDS.VENUE,         input.eventVenue); // alias used by some templates
    set(FIELD_IDS.HEADING,       input.heading);
    set(FIELD_IDS.SUBHEADING,    input.subheading);
    return map;
}
