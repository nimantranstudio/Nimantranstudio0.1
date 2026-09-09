import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { adminAuth } from '@/lib/firebase-admin';
import { createAdminToken, ADMIN_COOKIE } from '@/lib/admin-session';
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/session';
import { toTenDigits } from '@/lib/messaging/types';

// Only this number gets admin access. Configurable via env; defaults to the owner's number.
const ADMIN_MOBILE = process.env.ADMIN_MOBILE || '8884678194';

/**
 * The one place a Firebase Phone Auth login (both the main /login page and the
 * checkout page's LoginModal call this) becomes an application session. The
 * client has already completed signInWithPhoneNumber + confirm() with Firebase
 * and hands over the resulting ID token here — this route verifies it with
 * Firebase Admin (never trusts the client's own claim of who it is), resolves
 * the matching Prisma User, and mints the same ns_session cookie every
 * existing protected route already checks via verifyAuth()/middleware.ts.
 * Nothing downstream of the cookie needed to change for this migration.
 */
export async function POST(request: Request) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json({ error: 'ID Token required' }, { status: 400 });
        }

        // Verify the ID token securely using Firebase Admin — this is the actual
        // authentication check; everything else here is just resolving identity.
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const firebaseUid = decodedToken.uid;
        const fullMobileNumber = decodedToken.phone_number;

        if (!fullMobileNumber) {
            return NextResponse.json({ error: 'Mobile number not found in token' }, { status: 400 });
        }

        // Every mobileNumber lookup in this app normalizes through this same shared
        // helper, so a number entered as "9876543210" or returned by Firebase as
        // "+919876543210" always resolves to the same User row.
        const mobileNumber = toTenDigits(fullMobileNumber);
        const isUserAdmin = mobileNumber === ADMIN_MOBILE;

        // 1. Prefer the stable Firebase UID — set on every user's first Firebase
        //    login, so this is the fast path for every login after that.
        let user = await prisma.user.findUnique({ where: { firebaseUid } });

        if (!user) {
            // 2. First Firebase login for this account. Match the existing user by
            //    phone number (accounts created before this migration, or via the
            //    checkout flow) and link the Firebase UID onto that same row —
            //    never creates a duplicate for someone who already has an account.
            const existing = await prisma.user.findUnique({ where: { mobileNumber } });
            if (existing) {
                user = await prisma.user.update({
                    where: { mobileNumber },
                    data: {
                        firebaseUid,
                        isMobileVerified: true,
                        role: isUserAdmin ? 'admin' : existing.role,
                    },
                });
            } else {
                // 3. Genuinely new user.
                user = await prisma.user.create({
                    data: {
                        mobileNumber,
                        firebaseUid,
                        isMobileVerified: true,
                        role: isUserAdmin ? 'admin' : 'user',
                        status: 'active',
                    },
                });
            }
        } else if (isUserAdmin && user.role !== 'admin') {
            user = await prisma.user.update({ where: { id: user.id }, data: { role: 'admin' } });
        }

        const isAdmin = user.role === 'admin';
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                mobileNumber: user.mobileNumber,
                role: user.role
            },
            isAdmin,
        });

        // The real, universal session — checked by verifyAuth()/middleware.ts for
        // every protected page and API route, for every user (admin or not).
        const token = await createSessionToken(user);
        response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());

        // Also keep granting the legacy admin cookie for admins — unrelated existing
        // behavior, left untouched.
        if (isAdmin) {
            const adminToken = await createAdminToken(mobileNumber);
            response.cookies.set(ADMIN_COOKIE, adminToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 86400,
            });
        }

        return response;

    } catch (error: any) {
        console.error('Auth Sync Error:', error?.message);
        return NextResponse.json({ error: 'Sign-in failed' }, { status: 500 });
    }
}
