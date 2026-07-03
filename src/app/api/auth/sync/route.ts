import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { adminAuth } from '@/lib/firebase-admin';
import { createAdminToken, ADMIN_COOKIE } from '@/lib/admin-session';

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

        // Remove country code usually (assuming +91 for Indian numbers as per login flow)
        // Adjust logic if you want to store full number or just 10 digits.
        // The existing code seemed to expect just the 10-digit identifier for "mobileNumber"
        // based on "identifier.replace(/\D/g, '').slice(0, 10)" in login page.
        // However, Firebase returns E.164 format (+91XXXXXXXXXX).
        // Let's normalize to the 10-digit format to match existing DB records if that's the convention.
        // OR store the full number. Existing DB check: "where: { mobileNumber }"

        // Strategy: Flexible 10-digit extraction for matching
        const mobileNumber = fullMobileNumber.replace('+91', '');
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
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                mobileNumber: user.mobileNumber,
                role: user.role
            }
        });

        // Grant a signed, httpOnly admin session cookie only to admins
        if (user.role === 'admin') {
            const token = await createAdminToken(mobileNumber);
            response.cookies.set(ADMIN_COOKIE, token, {
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
