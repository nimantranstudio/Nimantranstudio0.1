export const metadata = {
    title: 'Privacy Policy — Nimantran Studio',
    description: 'How Nimantran Studio collects, uses, and protects your personal data.',
};

const sections = [
    {
        title: '1. Information We Collect',
        content: [
            'When you create an account, we collect your mobile number for OTP-based authentication.',
            'When you build a wedding invitation, we store the names, event dates, venue details, and invitation message you provide.',
            'When your guests submit an RSVP, we collect their name, phone number (optional), attendance status, guest count, and dietary preference (optional).',
            'We do not collect payment card details directly. Payments are processed by Razorpay under their own privacy policy.',
        ],
    },
    {
        title: '2. How We Use Your Information',
        content: [
            'To display your personalised invitation to guests who visit your RSVP link.',
            'To show you real-time RSVP responses on your dashboard.',
            'To send you OTP codes for login. We do not send marketing SMS without your explicit consent.',
            'To improve the platform based on anonymised usage patterns.',
        ],
    },
    {
        title: '3. Data Sharing',
        content: [
            'We do not sell, rent, or share your personal data or your guests\' data with any third party for advertising or marketing purposes.',
            'We share data only with service providers required to operate the platform (e.g., database hosting, SMS gateway for OTP delivery). These providers are bound by confidentiality agreements.',
            'We may disclose data if required by Indian law or a valid court order.',
        ],
    },
    {
        title: '4. Data Retention',
        content: [
            'Your invitation and RSVP data is retained for 12 months from your last login or the date of your event, whichever is later.',
            'You may request deletion of your account and all associated data at any time by emailing hello@nimantranstudio.com.',
        ],
    },
    {
        title: '5. Security',
        content: [
            'We use industry-standard security measures including HTTPS encryption and secure database access controls.',
            'OTP-based login means we never store passwords.',
            'No security measure is 100% foolproof. In the unlikely event of a data breach, we will notify affected users within 72 hours.',
        ],
    },
    {
        title: '6. Cookies',
        content: [
            'We use minimal, essential cookies to keep you logged in across sessions.',
            'We do not use advertising cookies or third-party tracking pixels.',
        ],
    },
    {
        title: '7. Children\'s Privacy',
        content: [
            'Nimantran Studio is intended for users 18 years and older. We do not knowingly collect data from minors.',
        ],
    },
    {
        title: '8. Changes to This Policy',
        content: [
            'We may update this Privacy Policy from time to time. Material changes will be announced on our website at least 14 days before taking effect.',
            'Continued use of the platform after changes take effect constitutes acceptance of the updated policy.',
        ],
    },
    {
        title: '9. Contact Us',
        content: [
            'For any privacy-related queries or data deletion requests, email us at hello@nimantranstudio.com or call +91 88846 78194.',
        ],
    },
];

export default function PrivacyPage() {
    return (
        <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>

            <section style={{ background: 'var(--secondary)', color: '#fff', padding: '4rem 1.5rem 3rem', textAlign: 'center' }}>
                <div className="container">
                    <p style={{ letterSpacing: '0.15em', fontSize: '0.75rem', color: '#C8A951', fontWeight: 600, marginBottom: '0.75rem' }}>
                        LEGAL
                    </p>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, marginBottom: '1rem' }}>
                        Privacy Policy
                    </h1>
                    <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Last updated: April 2026</p>
                </div>
            </section>

            <section style={{ padding: '4rem 1.5rem 5rem' }}>
                <div className="container" style={{ maxWidth: '740px', margin: '0 auto' }}>
                    <p style={{ color: '#475569', lineHeight: 1.85, fontSize: '1rem', marginBottom: '2.5rem' }}>
                        Nimantran Studio ("we", "us", "our") is committed to protecting your privacy. This policy explains what data we collect, why we collect it, and how we use it when you use our platform at nimantranstudio.com.
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
