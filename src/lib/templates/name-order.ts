/**
 * Single source of truth for the "Creating Invite For" display order.
 *
 * The details form stores the choice as `invitationFor` ('bride' | 'groom') and
 * keeps `nameOrder` ('bride_first' | 'groom_first') in step; a saved wedding
 * stores the resolved boolean `brideFirst`. Everything that needs the order —
 * the preview builder, the wedding-create APIs and the website templates —
 * resolves it through here so no section hard-codes its own ordering.
 *
 * Parent details are never swapped: ordering is purely presentational. The
 * bride's parents always stay the bride's; the groom's always the groom's.
 */
export function resolveBrideFirst(src: {
    brideFirst?: boolean | null;
    invitationFor?: string | null;
    nameOrder?: string | null;
}): boolean {
    if (typeof src?.brideFirst === 'boolean') return src.brideFirst;
    if (src?.invitationFor) return src.invitationFor === 'bride';
    if (src?.nameOrder) return src.nameOrder === 'bride_first';
    // Matches the details form's default selection (groom).
    return false;
}

/** Returns [primary, secondary] for the two people, per the resolved order. */
export function orderByBrideFirst<T>(brideFirst: boolean, bride: T, groom: T): [T, T] {
    return brideFirst ? [bride, groom] : [groom, bride];
}
