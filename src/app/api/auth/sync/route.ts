import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { adminAuth } from '@/lib/firebase-admin';

const ADMIN_MOBILE = '8884678194';

export async function POST(request: Request) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json({ error: 'ID Token required' }, { status: 400 });
        }

        // Verify the ID token securely using Firebase Admin
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const fullMobileNumber = decodedToken.phone_number;

        if (!fullMobileNumber) {
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

        const isUserAdmin = mobileNumber === ADMIN_MOBILE;

        // Sync with local DB using upsert to handle race conditions and reduce logic
        const user = await prisma.user.upsert({
            where: { mobileNumber },
            create: {
                mobileNumber,
                isMobileVerified: true,
                role: isUserAdmin ? 'admin' : 'user',
                status: 'active'
            },
            update: {
                isMobileVerified: true,
                ...(isUserAdmin ? { role: 'admin' } : {})
            }
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                mobileNumber: user.mobileNumber,
                role: user.role
            }
        });

    } catch (error: any) {
        console.error('Auth Sync Error:', error);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}
