import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/session';
import { getAdminPayload, ADMIN_COOKIE } from '@/lib/admin-session';

/**
 * Resolves the authenticated user for an API route.
 *
 * Auth is cookie-based: the HttpOnly `ns_session` cookie is signed server-side
 * and sent automatically on every same-origin request, so callers no longer
 * need to pass a bearer token. The legacy admin cookie is still honored during
 * the transition. Firebase ID-token verification has been removed.
 */
export async function verifyAuth(request: NextRequest) {
    try {
        // 1. Universal session cookie (all users, including admin).
        const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
        const session = await verifySessionToken(sessionToken);
        if (session?.uid) {
            const user = await prisma.user.findUnique({ where: { id: session.uid } });
            if (user && user.status === 'active') {
                return { user, error: null };
            }
        }

        // 2. Legacy signed admin cookie (backward compatibility).
        const adminToken = request.cookies.get(ADMIN_COOKIE)?.value;
        const adminPayload = await getAdminPayload(adminToken);
        if (adminPayload?.m) {
            const user = await prisma.user.findUnique({
                where: { mobileNumber: adminPayload.m },
            });
            if (user && user.status === 'active' && user.role === 'admin') {
                return { user, error: null };
            }
        }

        return { user: null, error: 'Unauthorized' };
    } catch (error: any) {
        console.error('Auth Server Error:', error?.message);
        return { user: null, error: 'Unauthorized: session check failed' };
    }
}
