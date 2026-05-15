import "server-only";
import { getApps, initializeApp, cert, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

// Parse private key for server-side usage (rendering newlines correctly)
const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

const firebaseAdminConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
    storageBucket,
};

export function initAdmin() {
    if (getApps().length <= 0) {
        if (!firebaseAdminConfig.privateKey || !firebaseAdminConfig.clientEmail) {
            console.warn("Missing FIREBASE_PRIVATE_KEY or FIREBASE_CLIENT_EMAIL. Admin features may fail.");
        }
        return initializeApp({
            credential: cert(firebaseAdminConfig),
            storageBucket,
        });
    }
    return getApp();
}

export function getAdminStorage() {
    return getStorage(initAdmin());
}

export const adminAuth = getAuth(initAdmin());
