import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

export const metadata = {
    title: 'Refund Policy — Nimantran Studio',
    description: 'Nimantran Studio refund and cancellation policy.',
};

export default function RefundPolicyPage() {
    return (
        <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>

            <section style={{ background: '#000', color: '#fff', padding: '4rem 1.5rem 3rem', textAlign: 'center' }}>
                <div className="container">
                    <p style={{ letterSpacing: '0.15em', fontSize: '0.75rem', color: '#C8A951', fontWeight: 600, marginBottom: '0.75rem' }}>
                        LEGAL
                    </p>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, marginBottom: '1rem' }}>
                        Refund Policy
                    </h1>
                    <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Last updated: April 2026</p>
                </div>
            </section>

            <section style={{ padding: '4rem 1.5rem 5rem' }}>
                <div className="container" style={{ maxWidth: '740px', margin: '0 auto' }}>

                    <p style={{ color: '#475569', lineHeight: 1.85, fontSize: '1rem', marginBottom: '3rem' }}>
                        We want you to be fully satisfied with Nimantran Studio. This policy explains when and how you can request a refund for your ₹999 purchase.
                    </p>

                    {/* Eligibility */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E2E8F0' }}>
                            1. When You Are Eligible for a Refund
                        </h2>
                        <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                            You may request a full refund if:
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                'Your refund request is submitted within 7 days of purchase.',
                                'You have not yet shared your RSVP invitation link with any guest.',
                                'No guest has submitted an RSVP response through your link.',
                            ].map((item, i) => (
                                <li key={i} style={{ display: 'flex', gap: '0.75rem', color: '#475569', lineHeight: 1.75, fontSize: '0.95rem' }}>
                                    <span style={{ color: '#22C55E', flexShrink: 0, marginTop: '0.3rem', fontWeight: 700 }}>✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Not Eligible */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E2E8F0' }}>
                            2. When Refunds Are Not Available
                        </h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                'More than 7 days have passed since your purchase.',
                                'Your RSVP link has been shared and accessed by guests.',
                                'One or more guests have already submitted an RSVP response.',
                                'The request is for a change of theme or event details (you can update these yourself from your dashboard).',
                            ].map((item, i) => (
                                <li key={i} style={{ display: 'flex', gap: '0.75rem', color: '#475569', lineHeight: 1.75, fontSize: '0.95rem' }}>
                                    <span style={{ color: '#EF4444', flexShrink: 0, marginTop: '0.3rem', fontWeight: 700 }}>✕</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Process */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E2E8F0' }}>
                            3. How to Request a Refund
                        </h2>
                        <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1rem' }}>
                            Email us at <a href="mailto:hello@nimantranstudio.com" style={{ color: 'var(--secondary)', fontWeight: 600 }}>hello@nimantranstudio.com</a> with:
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {[
                                'Your registered mobile number',
                                'Your Razorpay order ID or payment reference',
                                'Reason for the refund request',
                            ].map((item, i) => (
                                <li key={i} style={{ display: 'flex', gap: '0.75rem', color: '#475569', lineHeight: 1.75, fontSize: '0.95rem' }}>
                                    <span style={{ color: 'var(--primary)', flexShrink: 0 }}>—</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Timeline */}
                    <div style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E2E8F0' }}>
                            4. Refund Timeline
                        </h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                'We will respond to your refund request within 2 business days.',
                                'If approved, the refund is processed within 5–7 business days.',
                                'Refunds are credited to the original payment method (UPI, card, or bank account).',
                                'Processing times may vary depending on your bank or payment provider.',
                            ].map((item, i) => (
                                <li key={i} style={{ display: 'flex', gap: '0.75rem', color: '#475569', lineHeight: 1.75, fontSize: '0.95rem' }}>
                                    <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.3rem' }}>—</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact CTA */}
                    <div style={{ background: '#F1EDE4', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
                        <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--secondary)', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                            Still have questions?
                        </h3>
                        <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                            Our team typically replies within a few hours on weekdays.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a
                                href="mailto:hello@nimantranstudio.com"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#000', color: '#fff', padding: '0.7rem 1.25rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}
                            >
                                <Mail size={15} /> Email Us
                            </a>
                            <a
                                href="tel:+918010581916"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1.5px solid var(--secondary)', color: 'var(--secondary)', padding: '0.7rem 1.25rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}
                            >
                                <Phone size={15} /> Call Us
                            </a>
                        </div>
                    </div>

                    <p style={{ marginTop: '2rem', color: '#94A3B8', fontSize: '0.8rem', textAlign: 'center' }}>
                        See also: <Link href="/terms" style={{ color: 'var(--secondary)' }}>Terms of Service</Link> · <Link href="/privacy" style={{ color: 'var(--secondary)' }}>Privacy Policy</Link>
                    </p>
                </div>
            </section>

        </main>
    );
}
