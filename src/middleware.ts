import { NextResponse, type NextRequest } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/admin-session';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/session';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Public read: pricing packages are shown on the preview/payment pages.
    if (pathname === '/api/admin/packages' && req.method === 'GET') {
        return NextResponse.next();
    }

    const sessionToken = req.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySessionToken(sessionToken);

    const isAdminArea =
        pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

    // Admin area: accept a session with role=admin, or the legacy admin cookie.
    if (isAdminArea) {
        const legacyAdmin = await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
        if (session?.role === 'admin' || legacyAdmin) {
            return NextResponse.next();
        }
        if (pathname.startsWith('/api/admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // Dashboard area: a couple's own suite (cards, RSVPs, assets). Requires any
    // logged-in session — previously unguarded, so opening the "Download My
    // Suite" WhatsApp link in a fresh browser (no session cookie, e.g. the
    // in-app browser) silently fell through to the page's generic empty-state
    // instead of asking the visitor to log in with their WhatsApp number.
    if (pathname.startsWith('/dashboard')) {
        if (session) {
            return NextResponse.next();
        }
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin',
        '/admin/:path*',
        '/api/admin/:path*',
        '/dashboard',
        '/dashboard/:path*',
    ],
};
