/**
 * Sample values shown in the invitation preview before the couple has entered
 * their own details, so the card reads as a finished invitation immediately
 * instead of showing raw field names like "Primary Person Name".
 *
 * These are presentation-only. They are never written into `formData` and
 * never reach `saveWedding()` — callers resolve them at the point they build
 * props for the preview (see `resolvePreviewField`), gated on whether the
 * user has ever touched that specific field (tracked in the wedding store's
 * `touchedFields`). Bride/groom (not "primary"/"secondary") is the deliberate
 * choice here: InvitationCard's own invitationFor-driven primary/secondary
 * resolution already turns these into the right primary/secondary ordering,
 * so this file doesn't duplicate that logic.
 */
export const PREVIEW_DEFAULTS = {
    brideName: 'Priyanka',
    groomName: 'Vivek',
    brideParents: 'Bhartee Bhagwan Dhage',
    groomParents: 'Sanjeevni sunil mhatre',
    eventDate: '12 Feb 2023',
    eventTime: '7.00 Pm',
    eventVenue: 'Chinar garden Road, Gulmohar Colony, Padegaon, Chhatrapati Sambhajinagar, Maharashtra 431002',
} as const;

/**
 * Resolves the value to show in the preview for one field.
 *
 * - Touched (the user has set this field at least once, even to empty) →
 *   always the raw value, so an intentional clear stays cleared.
 * - Untouched → the sample default. Untouched fields are always '' by
 *   construction (nothing else ever writes them), so this doesn't need to
 *   re-check rawValue.
 */
export function resolvePreviewField(rawValue: string, isTouched: boolean, fallback: string): string {
    return isTouched ? rawValue : fallback;
}
