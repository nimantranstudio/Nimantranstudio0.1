import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/admin-session';
import { SESSION_COOKIE } from '@/lib/session';

export async function POST() {
    const response = NextResponse.json({ success: true });
    // Expire the real session cookie — verifyAuth()/middleware.ts check this for every
    // protected page and API route, for every user (admin or not). Previously this route
    // only cleared the separate legacy admin cookie below, so "logging out" left the
    // 30-day ns_session cookie valid: reloading any protected page silently re-authenticated
    // the same browser session (Navbar re-syncs from GET /api/auth/me on every mount).
    response.cookies.set(SESSION_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
    // Expire the admin session cookie
    response.cookies.set(ADMIN_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
    return response;
}
