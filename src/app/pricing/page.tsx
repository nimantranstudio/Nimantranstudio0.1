import Link from 'next/link';
import { Check, X } from 'lucide-react';

export const metadata = {
    title: 'Pricing — Nimantran Studio',
    description: 'One simple price for your entire wedding invitation suite. ₹999 one-time, no subscription.',
};

const features = [
    { label: 'Personalised digital invitation', included: true },
    { label: 'WhatsApp-ready sharing', included: true },
    { label: 'Unlimited guest RSVP responses', included: true },
    { label: 'Live RSVP dashboard', included: true },
    { label: 'Guest list CSV export', included: true },
    { label: 'Multiple events (Mehendi, Sangeet, Wedding)', included: true },
    { label: 'No Nimantran watermark', included: true },
    { label: 'Add to Google Calendar link', included: true },
    { label: 'Maps link for venue', included: true },
    { label: 'Companion / family headcount tracking', included: true },
    { label: 'Monthly subscription', included: false },
    { label: 'Hidden fees', included: false },
];

const faqs = [
    {
        q: 'Is this a one-time payment or a subscription?',
        a: 'One-time. You pay ₹999 once and your invitation stays live for your entire wedding season. No renewals.',
    },
    {
        q: 'How many guests can RSVP?',
        a: 'Unlimited. There is no cap on the number of guest responses your RSVP link can collect.',
    },
    {
        q: 'Can I create invitations for multiple events?',
        a: 'Yes. A single purchase covers all your wedding events — Mehendi, Sangeet, Haldi, Wedding ceremony, and Reception.',
    },
    {
        q: 'What happens after my wedding?',
        a: 'Your invitation link stays accessible for 12 months from purchase. After that it expires naturally.',
    },
    {
        q: 'Do you offer refunds?',
        a: 'Yes, within 7 days of purchase if you have not yet shared your invitation link. See our Refund Policy for details.',
    },
];

export default function PricingPage() {
    return (
        <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>

            {/* Hero */}
            <section style={{ padding: '5rem 1.5rem 4rem', textAlign: 'center', background: '#000', color: '#fff' }}>
                <div className="container">
                    <p style={{ letterSpacing: '0.15em', fontSize: '0.75rem', color: '#C8A951', fontWeight: 600, marginBottom: '1rem' }}>
                        PRICING
                    </p>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem' }}>
                        One Price.<br />Everything Included.
                    </h1>
                    <p style={{ color: '#CBD5E1', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
                        No subscriptions. No watermarks. No surprises.
                    </p>
                </div>
            </section>

            {/* Pricing Card */}
            <section style={{ padding: '4rem 1.5rem' }}>
                <div className="container" style={{ maxWidth: '480px', margin: '0 auto' }}>
                    <div style={{
                        background: '#fff',
                        border: '2px solid var(--primary)',
                        borderRadius: '16px',
                        padding: '2.5rem 2rem',
                        boxShadow: '0 8px 32px rgba(200, 169, 81, 0.12)',
                        textAlign: 'center',
                    }}>
                        <p style={{ letterSpacing: '0.12em', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '1rem' }}>
                            WHATSAPP ESSENTIALS PLAN
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.95rem', color: '#94A3B8', textDecoration: 'line-through', fontWeight: 500 }}>₹2,500</span>
                            <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', padding: '3px 10px', borderRadius: '100px' }}>SAVE ₹1,501</span>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', fontWeight: 700, color: 'var(--secondary)', lineHeight: 1 }}>
                                <span style={{ fontSize: '2rem', verticalAlign: 'super' }}>₹</span>999
                            </span>
                        </div>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '2rem' }}>one-time payment · no subscription ever</p>

                        <Link
                            href="/themes"
                            style={{
                                display: 'block',
                                background: '#000',
                                color: '#fff',
                                padding: '1rem',
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                letterSpacing: '0.05em',
                                textDecoration: 'none',
                                marginBottom: '0.75rem',
                            }}
                        >
                            GET STARTED — ₹999
                        </Link>
                        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94A3B8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            Preview free · 7-day refund guarantee · Trusted by Indian couples
                        </p>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
                            {features.map((f) => (
                                <li key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid #F1F5F9' }}>
                                    {f.included
                                        ? <Check size={16} color="#22C55E" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                                        : <X size={16} color="#EF4444" strokeWidth={2.5} style={{ flexShrink: 0 }} />}
                                    <span style={{ color: f.included ? '#1E293B' : '#94A3B8', fontSize: '0.9rem', textDecoration: f.included ? 'none' : 'line-through' }}>
                                        {f.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem', marginTop: '1.5rem' }}>
                        Secure payment via Razorpay. UPI, cards, net banking accepted.
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section style={{ padding: '4rem 1.5rem 5rem', background: '#F1EDE4' }}>
                <div className="container" style={{ maxWidth: '680px', margin: '0 auto' }}>
                    <p style={{ textAlign: 'center', letterSpacing: '0.15em', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
                        FREQUENTLY ASKED
                    </p>
                    <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--secondary)', marginBottom: '2.5rem' }}>
                        Common questions
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {faqs.map((f) => (
                            <div key={f.q} style={{ background: '#fff', borderRadius: '10px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                                <h3 style={{ fontWeight: 600, color: 'var(--secondary)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{f.q}</h3>
                                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
