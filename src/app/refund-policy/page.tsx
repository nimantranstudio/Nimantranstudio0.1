import { LegalPage } from '@/components/layout/LegalPage';

export const metadata = {
    title: 'Refund & Cancellation Policy — Nimantran Studio',
    description: 'Nimantran Studio refund and cancellation policy.',
    alternates: {
        canonical: 'https://www.nimantranstudio.in/refund-policy',
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: 'Refund & Cancellation Policy — Nimantran Studio',
        description: 'Nimantran Studio refund and cancellation policy.',
        url: 'https://www.nimantranstudio.in/refund-policy',
        siteName: 'Nimantran Studio',
        images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Nimantran Studio Refund Policy' }],
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Refund & Cancellation Policy — Nimantran Studio',
        description: 'Nimantran Studio refund and cancellation policy.',
        images: ['/og-image.jpg'],
    },
};

const sections = [
    {
        title: 'Strict No-Refund Policy',
        content: [
            'Nimantran Studio provides access to digital design assets and software-as-a-service (SaaS) features. Due to the immediate, digital nature of these services, all purchases are final and non-refundable.',
            'Once a payment is successfully processed and access to the premium suite or digital invitations is granted, the user waives any right to a refund for reasons such as change of mind, event cancellation, or dissatisfaction with aesthetic elements.',
        ],
    },
    {
        title: 'Exceptions: Technical & System Errors',
        type: 'checklist' as const,
        content: [
            'Refunds are exclusively entertained in the event of verifiable technical anomalies originating from our payment gateway or systems.',
            'Duplicate charges for a single transaction.',
            'Successful deduction of funds from the user\'s account without the corresponding activation of services within 24 hours.',
        ],
    },
    {
        title: 'When Refunds Are Explicitly Denied',
        type: 'crosslist' as const,
        content: [
            'Post-purchase buyer\'s remorse or change of mind.',
            'Cancellation, postponement, or modification of the wedding event.',
            'Inability to use the platform due to lack of technical proficiency.',
            'Requests for theme changes (users may modify event details within the dashboard independently).',
        ],
    },
    {
        title: 'Initiating a Technical Refund Claim',
        type: 'list' as const,
        content: [
            'In the event of a system error, users must initiate a claim within 48 hours of the erroneous transaction.',
            'Claims must be directed to our official support channel with the registered mobile number, Razorpay transaction ID, and proof of deduction.',
            'Upon verification of a system anomaly, refunds will be processed and credited to the original source account within 7–10 business days, subject to banking procedures.',
        ],
    },
];

export default function RefundPolicyPage() {
    return (
        <LegalPage
            title="Refund & Cancellation Policy"
            subtitle="LEGAL & POLICIES"
            lastUpdated="May 2026"
            introduction="This Refund and Cancellation Policy governs the terms of financial transactions on Nimantran Studio. By completing a purchase, you acknowledge and consent to these legally binding terms."
            sections={sections}
        />
    );
}
