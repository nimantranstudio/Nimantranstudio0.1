/**
 * Canonical filename for a bundle's per-event template upload:
 * `{bundleId}_{eventId}_{sanitizedEventName}{ext}` — e.g.
 * `cmr61cf4k00014gio8gzhf6tp_evt6_Save_the_date.html`.
 *
 * Deterministic by design: re-uploading a template for the same bundle+event
 * overwrites the same file instead of accumulating `template-X-<timestamp>.html`
 * garbage, making this filename the canonical identifier for that slot.
 */

export function sanitizeForFilename(name: string): string {
    return (name || '')
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^A-Za-z0-9_-]/g, '');
}

export function buildTemplateFilename(bundleId: string, eventId: string, eventName: string, ext: string): string {
    const safeName = sanitizeForFilename(eventName) || 'template';
    return `${bundleId}_${eventId}_${safeName}${ext}`;
}
