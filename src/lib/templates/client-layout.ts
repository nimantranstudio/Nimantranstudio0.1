'use client';

import type { CardDocument } from './card-document';

export const STRUCTURED_PREFIX = 'structured:';
export const isStructuredMarker = (v?: string | null): boolean =>
    typeof v === 'string' && v.startsWith(STRUCTURED_PREFIX);
export const structuredIdOf = (v: string): string => v.slice(STRUCTURED_PREFIX.length);

// In-flight/result cache so a template layout is fetched at most once per session.
const cache = new Map<string, Promise<CardDocument | null>>();

/** Fetch a designed template's CardDocument layout by id (cached). Never throws. */
export function fetchTemplateLayout(id: string): Promise<CardDocument | null> {
    const hit = cache.get(id);
    if (hit) return hit;
    const p = fetch(`/api/templates/${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => (d?.template?.layout ?? null) as CardDocument | null)
        .catch(() => null);
    cache.set(id, p);
    return p;
}
