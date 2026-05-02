import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const bundleDir = path.join(process.cwd(), 'public/Image/bundle');

    if (!fs.existsSync(bundleDir)) {
        return NextResponse.json({ assets: {} });
    }

    const files = fs.readdirSync(bundleDir).filter(f => f.endsWith('.png'));

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
}
