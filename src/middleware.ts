import { NextResponse, type NextRequest } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/admin-session';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Public read: pricing packages are shown on the preview/payment pages.
    if (pathname === '/api/admin/packages' && req.method === 'GET') {
        return NextResponse.next();
    }

    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    const isAdmin = await verifyAdminToken(token);

    if (isAdmin) {
        return NextResponse.next();
    }

    // Admin API calls get a hard 401 — cannot be hit without a valid session.
    if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin pages redirect to the login screen.
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
