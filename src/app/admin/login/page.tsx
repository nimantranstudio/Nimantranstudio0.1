'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const { login } = useWeddingStore();
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!passcode) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passcode }),
            });

            if (res.ok) {
                login('admin', true);
                router.replace('/admin');
            } else {
                setError('Incorrect passcode');
            }
        } catch (err) {
            console.error('Admin login failed:', err);
            setError('Something went wrong. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#FDFBF7', fontFamily: 'var(--font-sans)'
        }}>
            <form onSubmit={handleSubmit} style={{
                background: 'white', padding: '2.5rem', borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '380px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem'
            }}>
                <div style={{
                    width: '56px', height: '56px', borderRadius: '50%', background: '#F3F4F6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1C1917'
                }}>
                    <Lock size={26} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: 0, color: '#1C1917' }}>
                        Admin Access
                    </h1>
                    <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                        Enter your passcode to continue
                    </p>
                </div>

                <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Passcode"
                    autoFocus
                    style={{
                        width: '100%', padding: '0.85rem 1rem', borderRadius: '10px',
                        border: '1px solid #E5E7EB', fontSize: '1rem', textAlign: 'center',
                        letterSpacing: '0.2rem', outline: 'none'
                    }}
                />

                {error && (
                    <p style={{ color: '#c62828', fontSize: '0.85rem', margin: 0 }}>{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        width: '100%', padding: '0.85rem', borderRadius: '9999px', border: 'none',
                        background: '#1C1917', color: 'white', fontWeight: 600, fontSize: '1rem',
                        cursor: isLoading ? 'default' : 'pointer', opacity: isLoading ? 0.7 : 1
                    }}
                >
                    {isLoading ? 'Verifying…' : 'Unlock'}
                </button>
            </form>
        </div>
    );
}
