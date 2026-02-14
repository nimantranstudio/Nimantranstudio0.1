import { NextResponse } from 'next/server';
import { getThemes } from '@/lib/data-access/themes';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const themes = await getThemes();
        return NextResponse.json({ themes });
    } catch (error: any) {
        // getThemes currently catches errors and returns [], so this catch block might be unreachable
        // unless getThemes logic changes. keeping it for safety.
        console.error('Failed to fetch themes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch themes' },
            { status: 500 }
        );
    }
}
