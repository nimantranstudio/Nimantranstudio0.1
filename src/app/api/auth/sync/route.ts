import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { adminAuth } from '@/lib/firebase-admin';
import { createAdminToken, ADMIN_COOKIE } from '@/lib/admin-session';
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/session';
import { toTenDigits } from '@/lib/messaging/types';

// Only this number gets admin access. Configurable via env; defaults to the owner's number.
const ADMIN_MOBILE = process.env.ADMIN_MOBILE || '8884678194';

export async function POST(request: Request) {
    try {
        const { idToken } = await request.json();
        console.log("Auth Sync: Received idToken (last 10 chars):", idToken?.slice(-10));

        if (!idToken) {
            console.error("Auth Sync: No idToken provided");
            return NextResponse.json({ error: 'ID Token required' }, { status: 400 });
        }

        // Verify the ID token securely using Firebase Admin
        console.log("Auth Sync: Verifying idToken with Firebase Admin...");
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const fullMobileNumber = decodedToken.phone_number;
        console.log("Auth Sync: Decoded token phone_number:", fullMobileNumber);

        if (!fullMobileNumber) {
            console.error("Auth Sync: Mobile number not found in token");
            return NextResponse.json({ error: 'Mobile number not found in token' }, { status: 400 });
        }

        // Every other mobileNumber lookup in this app (OTP send/verify, ADMIN_MOBILE,
        // the dev bypass) uses this same shared 10-digit normalizer — reusing it here
        // instead of a hardcoded "+91" strip keeps this in sync with that convention,
        // and unlike a hardcoded prefix it degrades gracefully for other country codes.
        const mobileNumber = toTenDigits(fullMobileNumber);
        console.log("Auth Sync: Normalized mobileNumber:", mobileNumber);

        const isUserAdmin = mobileNumber === ADMIN_MOBILE;

        // Sync with local DB
        console.log("Auth Sync: Searching for user in Prisma...");
        let user = await prisma.user.findUnique({
            where: { mobileNumber }
        });

        if (!user) {
            console.log("Auth Sync: User not found, creating new user...");
            user = await prisma.user.create({
                data: {
                    mobileNumber,
                    isMobileVerified: true,
                    role: isUserAdmin ? 'admin' : 'user',
                    status: 'active'
                }
            });
            console.log("Auth Sync: Created new user:", user.id);
        } else {
            console.log("Auth Sync: Found existing user:", user.id);
            // Update users to verified if they weren't
            if (!user.isMobileVerified || (isUserAdmin && user.role !== 'admin')) {
                console.log("Auth Sync: Updating existing user status/role...");
                user = await prisma.user.update({
                    where: { mobileNumber },
                    data: {
                        isMobileVerified: true,
                        role: isUserAdmin ? 'admin' : user.role
                    }
                });
                console.log("Auth Sync: Updated existing user.");
            }
        }

        console.log("Auth Sync: SUCCESS");
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

        // The real, universal session — the same ns_session cookie the OTP-verify flow
        // grants, checked by verifyAuth()/middleware.ts for every protected page and API
        // route. Previously this route only ever set the separate admin-only cookie below,
        // so a regular user completing Firebase Phone Auth here (e.g. on the checkout
        // page) authenticated with Firebase in the browser but was never actually
        // recognized as logged in server-side.
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
        console.error('Auth Sync Error - FULL DETAILS:', error);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}
