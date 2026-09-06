/**
 * Canonical event-type classifier, shared between the wedding form's local event
 * names (e.g. "Haldi") and the DB's stable `Event.eventName` (e.g. "Haldi Invitation").
 *
 * Neither side can reference the other's id directly — the wedding form's events are
 * local/user-editable (`formData.events[i].id` is 'haldi', not an `Event.eventId`), and
 * `evt_N` ids are opaque. Classifying both sides down to the same small set of stable
 * type strings turns "match by event id" into an exact comparison instead of fuzzy
 * substring matching against a filename that can vary in formatting (spaces vs
 * underscores, casing, extra words) between admin uploads.
 */

export type EventType = 'save-the-date' | 'wedding' | 'haldi' | 'mehendi' | 'sangeet' | 'reception';

export function classifyEventType(rawName: string | undefined | null): EventType | null {
    const n = (rawName || '').toLowerCase();
    if (!n) return null;
    if (n.includes('save the date') || n.includes('savethedate') || n.includes('save-the-date')) return 'save-the-date';
    if (n.includes('haldi')) return 'haldi';
    if (n.includes('mehendi') || n.includes('mehndi') || n.includes('mehendhi')) return 'mehendi';
    if (n.includes('sangeet')) return 'sangeet';
    if (n.includes('reception')) return 'reception';
    if (n.includes('wedding') || n.includes('invitation')) return 'wedding';
    return null;
}
