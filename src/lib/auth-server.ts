import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuth } from '@/lib/firebase-admin';
import { getAdminPayload, ADMIN_COOKIE } from '@/lib/admin-session';

export async function verifyAuth(request: NextRequest) {
    try {
        // 1. Check signed admin session cookie first (for local OTP bypass session)
        const cookieToken = request.cookies.get(ADMIN_COOKIE)?.value;
        const adminPayload = await getAdminPayload(cookieToken);
        if (adminPayload && adminPayload.m) {
            const mobileNumber = adminPayload.m;
            const user = await prisma.user.findUnique({
                where: { mobileNumber }
            });
            if (user && user.status === 'active' && user.role === 'admin') {
                return { user, error: null };
            }
        }

        // 2. Fallback to Authorization Header (Firebase ID Token)
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error("Auth Server: Missing or invalid authorization header");
            return { user: null, error: 'Unauthorized: Missing token' };
        }

        const idToken = authHeader.split('Bearer ')[1];
        
        if (!idToken) {
            return { user: null, error: 'Unauthorized: Empty token' };
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const fullMobileNumber = decodedToken.phone_number;

        if (!fullMobileNumber) {
            console.error("Auth Server: Mobile number not found in token");
            return { user: null, error: 'Unauthorized: Invalid token payload' };
        }

        // Match the normalization logic from sync route
        const mobileNumber = fullMobileNumber.replace('+91', '');

        const user = await prisma.user.findUnique({
            where: { mobileNumber }
        });

        if (!user) {
            console.error("Auth Server: User not found in database for mobile:", mobileNumber);
            return { user: null, error: 'Unauthorized: User not found' };
        }

        if (user.status !== 'active') {
            return { user: null, error: 'Unauthorized: Account inactive' };
        }

        return { user, error: null };
    } catch (error: any) {
        console.error('Auth Server Error:', error.message);
        return { user: null, error: 'Unauthorized: Invalid or expired token' };
    }
}
