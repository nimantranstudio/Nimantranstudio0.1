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

    if (isAdminArea) {
        // Admin: accept a session with role=admin, or the legacy admin cookie.
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

    // Dashboard: any valid session is enough.
    if (session?.uid) {
        return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
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
