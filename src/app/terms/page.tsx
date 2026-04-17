export const metadata = {
    title: 'Terms of Service — Nimantran Studio',
    description: 'Terms and conditions for using Nimantran Studio.',
};

const sections = [
    {
        title: '1. Acceptance of Terms',
        content: [
            'By creating an account or using Nimantran Studio, you agree to these Terms of Service and our Privacy Policy.',
            'If you do not agree, please do not use the platform.',
            'These terms are governed by the laws of India. Any disputes are subject to the jurisdiction of courts in Pune, Maharashtra.',
        ],
    },
    {
        title: '2. Eligibility',
        content: [
            'You must be at least 18 years old to use Nimantran Studio.',
            'You must provide accurate information when creating an account.',
            'One account per wedding. Accounts are non-transferable.',
        ],
    },
    {
        title: '3. Your Content',
        content: [
            'You retain ownership of all content you upload — names, photos, invitation text, and event details.',
            'By uploading content, you grant Nimantran Studio a limited licence to display that content to guests who visit your RSVP link.',
            'You are responsible for ensuring you have the right to use any content you upload (e.g., photos).',
            'You must not upload content that is unlawful, obscene, defamatory, or infringes third-party intellectual property rights.',
        ],
    },
    {
        title: '4. Payments',
        content: [
            'The platform fee is ₹999 (inclusive of applicable taxes) as a one-time payment.',
            'Payments are processed securely by Razorpay. We do not store your card details.',
            'Access to paid features is activated immediately upon successful payment confirmation.',
            'Pricing is subject to change. Changes will not affect purchases already completed.',
        ],
    },
    {
        title: '5. Refunds',
        content: [
            'Refunds are available within 7 days of purchase, provided you have not yet shared your RSVP link externally.',
            'No refund is available after the invitation link has been shared, as the service has been delivered.',
            'To request a refund, email hello@nimantranstudio.com with your registered mobile number and order details.',
            'Approved refunds are processed within 5–7 business days to the original payment method.',
        ],
    },
    {
        title: '6. Prohibited Use',
        content: [
            'You may not use Nimantran Studio for any commercial purpose other than your own wedding.',
            'You may not attempt to reverse-engineer, scrape, or copy the platform.',
            'You may not use the platform to send spam or unsolicited communications.',
            'Violation of these terms may result in immediate account termination without refund.',
        ],
    },
    {
        title: '7. Service Availability',
        content: [
            'We aim for 99.5% uptime but do not guarantee uninterrupted service.',
            'We may perform scheduled maintenance with advance notice.',
            'We are not liable for losses caused by service interruptions beyond our reasonable control.',
        ],
    },
    {
        title: '8. Limitation of Liability',
        content: [
            'Nimantran Studio\'s total liability to you for any claim is limited to the amount you paid for the service (₹999).',
            'We are not liable for indirect, incidental, or consequential damages.',
            'We are not responsible for errors in content you provide (e.g., incorrect event dates or venues).',
        ],
    },
    {
        title: '9. Changes to Terms',
        content: [
            'We may update these Terms of Service. Material changes will be communicated via email or a notice on the platform at least 14 days in advance.',
            'Continued use after changes take effect constitutes acceptance of the updated terms.',
        ],
    },
    {
        title: '10. Contact',
        content: [
            'For questions about these terms, email hello@nimantranstudio.com or call +91 88846 78194.',
        ],
    },
];

export default function TermsPage() {
    return (
        <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>

            <section style={{ background: 'var(--secondary)', color: '#fff', padding: '4rem 1.5rem 3rem', textAlign: 'center' }}>
                <div className="container">
                    <p style={{ letterSpacing: '0.15em', fontSize: '0.75rem', color: '#C8A951', fontWeight: 600, marginBottom: '0.75rem' }}>
                        LEGAL
                    </p>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, marginBottom: '1rem' }}>
                        Terms of Service
                    </h1>
                    <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Last updated: April 2026</p>
                </div>
            </section>

            <section style={{ padding: '4rem 1.5rem 5rem' }}>
                <div className="container" style={{ maxWidth: '740px', margin: '0 auto' }}>
                    <p style={{ color: '#475569', lineHeight: 1.85, fontSize: '1rem', marginBottom: '2.5rem' }}>
                        These Terms of Service ("Terms") govern your use of Nimantran Studio ("Platform"), operated by Nimantran Studio (sole proprietorship, Pune, India). Please read them carefully before using the platform.
                    </p>

                    {sections.map((s) => (
                        <div key={s.title} style={{ marginBottom: '2.5rem' }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E2E8F0' }}>
                                {s.title}
                            </h2>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {s.content.map((item, i) => (
                                    <li key={i} style={{ display: 'flex', gap: '0.75rem', color: '#475569', lineHeight: 1.75, fontSize: '0.95rem' }}>
                                        <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.3rem' }}>—</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

        </main>
    );
}
