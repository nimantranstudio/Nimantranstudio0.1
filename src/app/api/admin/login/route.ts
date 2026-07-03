import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { passcode } = await req.json();

        // Passcode is validated server-side so it never ships in the client bundle.
        // Set ADMIN_PASSCODE in your environment; falls back to the legacy code.
        const expected = process.env.ADMIN_PASSCODE || '422101';

        if (!passcode || passcode !== expected) {
            return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
