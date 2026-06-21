import { NextResponse } from 'next/server';

export async function GET() {
    // In production Vercel, the local filesystem is read-only, so we return empty assets.
    // This also prevents Turbopack from tracing and bundling the public/Image/bundle folder.
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ assets: {} });
    }

    try {
        const fs = eval("require('fs')");
        const path = eval("require('path')");
        const bundleDir = path.join(process.cwd(), 'public/Image/bundle');

        if (!fs.existsSync(bundleDir)) {
            return NextResponse.json({ assets: {} });
        }

        const files = fs.readdirSync(bundleDir).filter((f: string) => f.endsWith('.png'));

        // Track best (most recent) file per event key
        const best: Record<string, { path: string; ts: number }> = {};

        for (const file of files) {
            const match = file.match(/^item-(.+?)-(\d+)-\d+\.png$/);
            if (!match) continue;

            const rawName = match[1]; // e.g. "Haldi_Invitation"
            const ts = parseInt(match[2], 10);
            const key = rawName.toLowerCase().replace(/_/g, ' '); // "haldi invitation"

            if (!best[key] || ts > best[key].ts) {
                best[key] = { path: `/Image/bundle/${file}`, ts };
            }
        }

        const assets: Record<string, string> = {};
        for (const [key, val] of Object.entries(best)) {
            assets[key] = val.path;
        }

        return NextResponse.json({ assets });
    } catch (e) {
        console.error("Failed to read bundle assets dynamically:", e);
        return NextResponse.json({ assets: {} });
    }
}

