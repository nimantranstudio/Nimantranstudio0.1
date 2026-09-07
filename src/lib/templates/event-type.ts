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

/** Minimal shape a BundleItem needs for resolveEventSections — matches the fields the
 * customer-facing `/api/themes/[id]` route actually returns (it includes `event: true`). */
export interface BundleItemLike {
    eventId: string;
    templatePath?: string | null;
    templateName?: string | null;
    eventType?: string | null;
    event?: { eventName?: string | null } | null;
}

/** A wedding-form local event ('haldi', 'mehendi', ... — formData.events[i]) or the
 * implicit default 'wedding' section, which has no formData.events entry of its own. */
export interface LocalEventLike {
    id: string;
    name?: string | null;
}

/**
 * One "Celebrate Every Moment" section, joined to its BundleItem via eventId.
 *
 * bundleItem.eventId *is* Event.id (it's the Prisma foreign key) — that half of the join
 * needs no resolving. The actual gap is on the other side: the wedding form's own event
 * list carries no field linking a local event ('haldi') back to a DB Event.id at all, so
 * there is no way to compare them directly. classifyEventType() bridges that gap — once,
 * here, to assign each section its eventId — so every lookup after this point (switching
 * events, resolving a template) is a plain `bundleItem.eventId === section.eventId`
 * equality check, never a name or filename comparison again.
 */
export interface ResolvedEventSection<T extends BundleItemLike = BundleItemLike> {
    /** The wedding form's local event id ('haldi', 'mehendi', ...), or 'wedding' for the
     * implicit default section that has no formData.events entry. */
    localEventId: string;
    /** Event.id, taken directly from bundleItem.eventId — the source of truth. */
    eventId: string;
    eventName: string;
    bundleItem: T;
}

export function resolveEventSections<T extends BundleItemLike>(
    bundleItems: readonly T[] | undefined | null,
    localEvents: readonly LocalEventLike[] | undefined | null
): ResolvedEventSection<T>[] {
    const sections: ResolvedEventSection<T>[] = [];
    for (const item of bundleItems || []) {
        if (!item.templatePath) continue;
        const type = classifyEventType(item.event?.eventName || item.templateName || item.eventType);
        if (!type) continue;
        const localEvent = (localEvents || []).find((e) => classifyEventType(e.name || e.id) === type);
        const localEventId = localEvent?.id ?? (type === 'wedding' ? 'wedding' : undefined);
        if (!localEventId) continue;
        sections.push({
            localEventId,
            eventId: item.eventId,
            eventName: item.event?.eventName || item.templateName || '',
            bundleItem: item,
        });
    }
    return sections;
}
