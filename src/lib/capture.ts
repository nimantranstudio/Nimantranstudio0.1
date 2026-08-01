/**
 * Client-side element → PNG capture, shared by the designed-card surfaces.
 *
 * html2canvas is not an npm dependency in this project; it is loaded on demand
 * from the same CDN the HTML InvitationCard uses, and attached to window. We read
 * getComputedStyle values, so container-query font units (cqw) are already
 * resolved to pixels by the time we capture — no special handling needed.
 */

const CDN = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';

export function loadHtml2Canvas(): Promise<any> {
    const w = window as any;
    if (w.html2canvas) return Promise.resolve(w.html2canvas);

    return new Promise((resolve, reject) => {
        const existing = document.getElementById('html2canvas-cdn') as HTMLScriptElement | null;
        if (existing) {
            if (w.html2canvas) return resolve(w.html2canvas);
            existing.addEventListener('load', () => resolve(w.html2canvas));
            existing.addEventListener('error', reject);
            return;
        }
        const s = document.createElement('script');
        s.id = 'html2canvas-cdn';
        s.src = CDN;
        s.onload = () => resolve(w.html2canvas);
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

/** Capture an element to a PNG data URL. Never throws; resolves null on failure. */
export async function captureElementToDataUrl(el: HTMLElement | null): Promise<string | null> {
    if (!el) return null;
    try {
        const html2canvas = await loadHtml2Canvas();
        if (!html2canvas) return null;
        const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: null, logging: false });
        return canvas.toDataURL('image/png');
    } catch {
        return null;
    }
}
