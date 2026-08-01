/**
 * Site-wide date/time display formatting. One place, so every surface (dashboard,
 * cards, RSVP, inputs) shows dates the same way: DD-MM-YYYY and 12-hour time.
 */

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Format any date representation for display as DD-MM-YYYY.
 * Accepts ISO (YYYY-MM-DD), a Date, DD-MM-YYYY / DD/MM/YYYY, or human strings
 * like "18th August 2026" / "18 Aug 2026". Returns the input unchanged if it
 * cannot be parsed (never throws).
 */
export function formatDisplayDate(v?: string | Date | null): string {
    if (!v) return '';
    if (v instanceof Date) {
        return isNaN(v.getTime()) ? '' : `${pad(v.getDate())}-${pad(v.getMonth() + 1)}-${v.getFullYear()}`;
    }
    const s = String(v).trim();
    if (!s) return '';

    // ISO YYYY-MM-DD (optionally with a time part)
    let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;

    // Already DD-MM-YYYY or DD/MM/YYYY
    m = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(s);
    if (m) return `${pad(+m[1])}-${pad(+m[2])}-${m[3]}`;

    // Human strings: strip the ordinal suffix ("18th" -> "18") then parse.
    const d = new Date(s.replace(/(\d+)(st|nd|rd|th)/i, '$1'));
    if (!isNaN(d.getTime())) return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;

    return s;
}

/** Format a time for display as 12-hour with AM/PM. Strings already carrying
 *  am/pm (or non-time text) pass through unchanged. */
export function formatDisplayTime(v?: string | null): string {
    if (!v) return '';
    const s = String(v).trim();
    if (/[ap]\.?m\.?/i.test(s)) return s;
    const m = /^(\d{1,2}):(\d{2})/.exec(s);
    if (!m) return s;
    let h = parseInt(m[1], 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m[2]} ${ampm}`;
}
