import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
    try {
        const { user, error } = await verifyAuth(request);
        if (error || !user) {
            return NextResponse.json({ authenticated: false }, { status: 200 });
        }
        return NextResponse.json({
            authenticated: true,
            user: {
                id: user.id,
                mobileNumber: user.mobileNumber,
                role: user.role,
            },
            isAdmin: user.role === 'admin',
        });
    } catch (err: any) {
        return NextResponse.json({ authenticated: false }, { status: 200 });
    }
}
