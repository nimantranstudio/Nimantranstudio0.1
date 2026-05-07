import { LegalPage } from '@/components/layout/LegalPage';

export const metadata = {
    title: 'Privacy Policy — Nimantran Studio',
    description: 'How Nimantran Studio collects, uses, and protects your personal data.',
};

const sections = [
    {
        title: 'Information We Collect',
        content: [
            'When you create an account, we collect your mobile number for OTP-based authentication.',
            'When you build a wedding invitation, we store the names, event dates, venue details, and invitation text.',
            'When your guests submit an RSVP, we collect their name, attendance status, and optional guest counts or dietary preferences.',
            'We do not collect payment card details directly. Payments are processed by Razorpay securely.',
        ],
    },
    {
        title: 'How We Use Your Information',
        content: [
            'To display your personalised invitation to guests who visit your RSVP link.',
            'To show you real-time RSVP responses on your dashboard.',
            'To send you OTP codes for login securely.',
            'To improve the platform experience based on anonymised usage patterns.',
        ],
    },
    {
        title: 'Data Sharing',
        content: [
            'We do not sell, rent, or share your personal data with any third party for advertising purposes.',
            'We share data only with essential service providers (e.g., database hosting, SMS gateway for OTP).',
            'We may disclose data if required by Indian law or a valid court order.',
        ],
    },
    {
        title: 'Data Retention & Security',
        content: [
            'Invitation and RSVP data is retained for 12 months from your last login or event date.',
            'You may request account deletion at any time by emailing our support team.',
            'We use industry-standard HTTPS encryption and secure database access controls.',
            'OTP-based login ensures we never store passwords, adding an extra layer of security.',
        ],
    },
    {
        title: 'Cookies',
        content: [
            'We use minimal, essential cookies only to keep you logged in across sessions.',
            'We do not use advertising cookies or third-party tracking pixels.',
        ],
    },
];

export default function PrivacyPage() {
    return (
        <LegalPage
            title="Privacy Policy"
            lastUpdated="May 2026"
            introduction="Nimantran Studio is committed to protecting your privacy. This policy explains what data we collect, why we collect it, and how we use it to provide you with the best digital invitation experience."
            sections={sections}
        />
    );
}
