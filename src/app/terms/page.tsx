import { LegalPage } from '@/components/layout/LegalPage';

export const metadata = {
    title: 'Terms of Service — Nimantran Studio',
    description: 'Terms and conditions for using Nimantran Studio.',
};

const sections = [
    {
        title: 'Acceptance of Terms',
        content: [
            'By creating an account or using Nimantran Studio, you agree to these Terms of Service and our Privacy Policy.',
            'If you do not agree, please do not use the platform.',
            'These terms are governed by the laws of India. Any disputes are subject to the jurisdiction of courts in Pune, Maharashtra.',
        ],
    },
    {
        title: 'Eligibility',
        content: [
            'You must be at least 18 years old to use Nimantran Studio.',
            'You must provide accurate information when creating an account.',
            'One account per wedding. Accounts are non-transferable.',
        ],
    },
    {
        title: 'Your Content',
        content: [
            'You retain ownership of all content you upload — names, photos, invitation text, and event details.',
            'By uploading content, you grant Nimantran Studio a limited licence to display that content to guests who visit your RSVP link.',
            'You are responsible for ensuring you have the right to use any content you upload (e.g., photos).',
            'You must not upload content that is unlawful, obscene, defamatory, or infringes third-party intellectual property rights.',
        ],
    },
    {
        title: 'Payments',
        content: [
            'The platform fee is ₹999 (inclusive of applicable taxes) as a one-time payment.',
            'Payments are processed securely by Razorpay. We do not store your card details.',
            'Access to paid features is activated immediately upon successful payment confirmation.',
            'Pricing is subject to change. Changes will not affect purchases already completed.',
        ],
    },
    {
        title: 'Prohibited Use',
        content: [
            'You may not use Nimantran Studio for any commercial purpose other than your own wedding.',
            'You may not attempt to reverse-engineer, scrape, or copy the platform.',
            'You may not use the platform to send spam or unsolicited communications.',
            'Violation of these terms may result in immediate account termination without refund.',
        ],
    },
    {
        title: 'Limitation of Liability',
        content: [
            'Nimantran Studio\'s total liability to you for any claim is limited to the amount you paid for the service (₹999).',
            'We are not liable for indirect, incidental, or consequential damages.',
            'We are not responsible for errors in content you provide (e.g., incorrect event dates or venues).',
        ],
    },
];

export default function TermsPage() {
    return (
        <LegalPage
            title="Terms of Service"
            lastUpdated="May 2026"
            introduction="These Terms of Service govern your use of Nimantran Studio. Please read them carefully before using the platform."
            sections={sections}
        />
    );
}
