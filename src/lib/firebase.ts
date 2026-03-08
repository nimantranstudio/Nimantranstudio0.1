// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// REPLACE THESE VALUES WITH YOUR FIREBASE PROJECT CONFIG
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
let auth;

try {
    if (typeof window !== 'undefined' && (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your_api_key')) {
        console.warn('Firebase API keys missing. Authentication features will be disabled.');
        // Create a dummy auth object to prevent immediate crashes in components
        auth = {
            currentUser: null,
            onAuthStateChanged: () => () => { },
            signInWithPopup: async () => { throw new Error("Firebase not configured"); },
            signOut: async () => { },
        } as any;
    } else {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        auth = getAuth(app);
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
    auth = {
        currentUser: null,
        onAuthStateChanged: () => () => { },
    } as any;
}

export { app, auth };
