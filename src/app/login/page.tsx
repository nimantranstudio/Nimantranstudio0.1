'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import styles from './login.module.css';

const LoginFormContent = dynamic(() => import('./LoginFormContent'), {
    ssr: false,
    loading: () => <div className={styles.page} />
});

export default function LoginPage() {
    return (
        <Suspense fallback={<div className={styles.page} />}>
            <LoginFormContent />
        </Suspense>
    );
}

// Add Type Definition for Window
declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}
