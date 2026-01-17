import { CheckCircle, Heart } from 'lucide-react';
import Link from 'next/link';

export default function ThankYouPage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#FDFBF7'
        }}>
            <div style={{
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                border: '1px solid #E6E2D6'
            }}>
                <CheckCircle size={64} color="#2E594A" style={{ marginBottom: '1.5rem' }} />
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>Thank You!</h1>
                <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '2rem' }}>
                    Your RSVP has been sent to the couple. We're so excited to see you there!
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#D4AF37', fontWeight: 600 }}>
                    Sent with love <Heart size={16} fill="#D4AF37" />
                </div>

                <div style={{ marginTop: '3rem', borderTop: '1px solid #E6E2D6', paddingTop: '2rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '1rem' }}>
                        Planning your own wedding?
                    </p>
                    <Link href="/" className="btn btn-outline" style={{ fontSize: '0.875rem' }}>
                        Create Your Invitation Today
                    </Link>
                </div>
            </div>
        </div>
    );
}
