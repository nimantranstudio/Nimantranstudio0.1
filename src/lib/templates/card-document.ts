/**
 * The structured invitation-template model. A template is this object (no longer
 * a hand-authored HTML file): a background plus percentage-positioned text layers
 * that bind to couple/event data. One document renders as a static card, an
 * animated video, and in the admin editor — see CardRenderer.
 *
 * All geometry is in PERCENT of the canvas, so a single document renders crisp at
 * any output size (card preview, high-res download, 1080×1440 video frame).
 */

/** Fields a text layer can bind to. `static` renders the layer's own `text`. */
export type Binding =
    // couple-level (from WeddingFormData)
    | 'groomName'
    | 'brideName'
    | 'groomParents'
    | 'brideParents'
    // event-level (from the selected WeddingEvent)
    | 'eventName'
    | 'eventDate'
    | 'eventTime'
    | 'venue'
    | 'mapLink'
    | 'heading'
    | 'tagline'
    | 'description'
    // literal text
    | 'static';

export const BINDINGS: { value: Binding; label: string }[] = [
    { value: 'groomName', label: 'Groom name' },
    { value: 'brideName', label: 'Bride name' },
    { value: 'groomParents', label: 'Groom parents' },
    { value: 'brideParents', label: 'Bride parents' },
    { value: 'eventName', label: 'Event name' },
    { value: 'eventDate', label: 'Event date' },
    { value: 'eventTime', label: 'Event time' },
    { value: 'venue', label: 'Venue' },
    { value: 'mapLink', label: 'Map link' },
    { value: 'heading', label: 'Heading' },
    { value: 'tagline', label: 'Tagline' },
    { value: 'description', label: 'Description' },
    { value: 'static', label: 'Static text' },
];

/** Position + size, in percent of the canvas. */
export interface Box {
    x: number; // % from left
    y: number; // % from top
    w: number; // % width
    h: number; // % height
}

export interface LayerStyle {
    fontFamily: string;
    fontSize: number; // in cqw (≈ % of canvas width) — resolution independent
    weight?: number;
    italic?: boolean;
    color?: string;
    align?: 'left' | 'center' | 'right';
    lineHeight?: number;
    letterSpacing?: number; // em
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

/** Video-only reveal for a layer. Ignored by the static card. */
export interface LayerAnim {
    type: 'none' | 'fade' | 'fade-up' | 'scale-in';
    delay: number; // ms
    duration: number; // ms
}

export interface Layer {
    id: string;
    binding: Binding;
    text?: string; // used when binding === 'static'
    box: Box;
    style: LayerStyle;
    anim?: LayerAnim;
}

export interface Background {
    imageUrl: string;
    fit?: 'cover' | 'contain';
    /** Video-only gentle motion. Ignored by the static card. */
    motion?: { type: 'none' | 'zoom'; amount?: number };
}

export interface CardDocument {
    id?: string;
    name: string;
    eventType?: string;
    canvas: { aspectRatio: string }; // e.g. "3:4"
    background: Background;
    layers: Layer[];
    audio?: { url: string }; // video only
}

/** Flat, already-resolved values the renderer reads. Built via buildCardData. */
export type CardData = Partial<Record<Exclude<Binding, 'static'>, string>>;

/** Resolve a layer's display text from data (or its own static text). */
export function resolveText(layer: Layer, data: CardData): string {
    if (layer.binding === 'static') return layer.text ?? '';
    return data[layer.binding] ?? '';
}

/** Parse an "W:H" aspect ratio to a number (falls back to 3/4). */
export function aspectRatioValue(aspectRatio: string): number {
    const [w, h] = aspectRatio.split(':').map(Number);
    return w > 0 && h > 0 ? w / h : 3 / 4;
}

/** Build the flat CardData the renderer needs from couple form data + one event. */
export function buildCardData(couple: any, event: any): CardData {
    return {
        groomName: couple?.groomName || '',
        brideName: couple?.brideName || '',
        groomParents: couple?.groomParents || '',
        brideParents: couple?.brideParents || '',
        eventName: event?.name || '',
        eventDate: event?.date || couple?.primaryDate || '',
        eventTime: event?.time || couple?.primaryTime || '',
        venue: event?.venue || couple?.defaultVenueName || '',
        mapLink: event?.mapLink || couple?.primaryMapLink || '',
        heading: event?.heading || '',
        tagline: event?.tagline || couple?.globalTagline || '',
        description: event?.description || '',
    };
}

/** Placeholder data for previews / the editor. */
export const SAMPLE_DATA: CardData = {
    groomName: 'Vivek Sunil Mhatre',
    brideName: 'Priyanka Bhagavan Dhage',
    groomParents: 'Mr. Sunil & Mrs. Sanjivani Mhatre',
    brideParents: 'Mr. Bhagavan & Mrs. Bharti Dhage',
    eventName: 'Wedding',
    eventDate: '12th August 2026',
    eventTime: '7:30 PM',
    venue: 'Raj Youg Lawns, Padegaon, Aurangabad',
    heading: 'We are pleased to invite you',
    tagline: 'Together with their families',
    description: '',
};
