/**
 * Site-wide date/time display formatting. One place, so every surface (dashboard,
 * cards, RSVP, inputs) shows dates consistently.
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

/** Format a date representation as "20 December 2025". */
export function formatLongDisplayDate(v?: string | Date | null): string {
    if (!v) return '';
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    if (v instanceof Date) {
        return isNaN(v.getTime()) ? '' : `${v.getDate()} ${months[v.getMonth()]} ${v.getFullYear()}`;
    }

    const s = String(v).trim();
    if (!s) return '';

    // ISO YYYY-MM-DD
    let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
    if (m) {
        const mIdx = parseInt(m[2], 10) - 1;
        return `${parseInt(m[3], 10)} ${months[mIdx] || m[2]} ${m[1]}`;
    }

    // DD-MM-YYYY or DD/MM/YYYY
    m = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(s);
    if (m) {
        const mIdx = parseInt(m[2], 10) - 1;
        return `${parseInt(m[1], 10)} ${months[mIdx] || m[2]} ${m[3]}`;
    }

    const d = new Date(s.replace(/(\d+)(st|nd|rd|th)/i, '$1'));
    if (!isNaN(d.getTime())) {
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    return s;
}

/**
 * Safely parse any date representation into a JavaScript Date object.
 * Handles ISO (YYYY-MM-DD), DD-MM-YYYY, DD/MM/YYYY, human strings ("20 December 2025").
 */
export function parseWeddingDate(v?: string | Date | null, timeStr?: string | null): Date | null {
    if (!v) return null;
    if (v instanceof Date) {
        return isNaN(v.getTime()) ? null : v;
    }
    const s = String(v).trim();
    if (!s) return null;

    let year = 0, month = 0, day = 0;

    // 1. ISO YYYY-MM-DD
    let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
    if (m) {
        year = parseInt(m[1], 10);
        month = parseInt(m[2], 10) - 1;
        day = parseInt(m[3], 10);
    } else {
        // 2. DD-MM-YYYY or DD/MM/YYYY
        m = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/.exec(s);
        if (m) {
            day = parseInt(m[1], 10);
            month = parseInt(m[2], 10) - 1;
            year = parseInt(m[3], 10);
        } else {
            // 3. Human string like "20 December 2025" or "20th Dec 2025"
            const cleaned = s.replace(/(\d+)(st|nd|rd|th)/i, '$1');
            const d = new Date(cleaned);
            if (!isNaN(d.getTime())) {
                year = d.getFullYear();
                month = d.getMonth();
                day = d.getDate();
            }
        }
    }

    if (!year || isNaN(month) || !day) return null;

    let hour = 9, minute = 0;
    if (timeStr && typeof timeStr === 'string') {
        const tMatch = /(\d{1,2}):(\d{2})\s*(am|pm)?/i.exec(timeStr.trim());
        if (tMatch) {
            let h = parseInt(tMatch[1], 10);
            const min = parseInt(tMatch[2], 10);
            const ampm = tMatch[3]?.toLowerCase();
            if (ampm === 'pm' && h < 12) h += 12;
            if (ampm === 'am' && h === 12) h = 0;
            hour = h;
            minute = min;
        }
    }

    return new Date(year, month, day, hour, minute, 0, 0);
}

/**
 * Calculates remaining days from today to the wedding date in real-time.
 * Returns { days: number, isPast: boolean, isToday: boolean, text: string }
 */
export function calculateDaysRemaining(dateVal?: string | Date | null): {
    days: number;
    isPast: boolean;
    isToday: boolean;
    text: string;
} {
    const target = parseWeddingDate(dateVal);
    if (!target) {
        return { days: 0, isPast: false, isToday: false, text: 'Date TBD' };
    }

    const now = new Date();
    // Compare start-of-day in local time for exact calendar day difference
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
    const diffMs = targetStart - todayStart;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { days: Math.abs(diffDays), isPast: true, isToday: false, text: 'Celebrated' };
    }
    if (diffDays === 0) {
        return { days: 0, isPast: false, isToday: true, text: 'Today is the Big Day!' };
    }
    if (diffDays === 1) {
        return { days: 1, isPast: false, isToday: false, text: '1 day to go' };
    }
    return { days: diffDays, isPast: false, isToday: false, text: `${diffDays} days to go` };
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
