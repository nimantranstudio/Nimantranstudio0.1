import { LegalPage } from '@/components/layout/LegalPage';

export const metadata = {
    title: 'Refund Policy — Nimantran Studio',
    description: 'Nimantran Studio refund and cancellation policy.',
};

const sections = [
    {
        title: 'Eligibility for a Refund',
        type: 'checklist' as const,
        content: [
            'Your refund request is submitted within 7 days of purchase.',
            'You have not yet shared your RSVP invitation link with any guest.',
            'No guest has submitted an RSVP response through your link.',
        ],
    },
    {
        title: 'When Refunds Are Not Available',
        type: 'crosslist' as const,
        content: [
            'More than 7 days have passed since your purchase.',
            'Your RSVP link has been shared and accessed by guests.',
            'One or more guests have already submitted an RSVP response.',
            'The request is for a change of theme or event details (you can update these yourself from your dashboard).',
        ],
    },
    {
        title: 'How to Request a Refund',
        type: 'list' as const,
        content: [
            'Your registered mobile number',
            'Your Razorpay order ID or payment reference',
            'Reason for the refund request',
        ],
    },
    {
        title: 'Refund Timeline',
        type: 'list' as const,
        content: [
            'We will respond to your refund request within 2 business days.',
            'If approved, the refund is processed within 5–7 business days.',
            'Refunds are credited to the original payment method (UPI, card, or bank account).',
            'Processing times may vary depending on your bank or payment provider.',
        ],
    },
];

export default function RefundPolicyPage() {
    return (
        <LegalPage
            title="Refund Policy"
            subtitle="LEGAL & POLICIES"
            lastUpdated="May 2026"
            introduction="We want you to be fully satisfied with Nimantran Studio. This policy explains when and how you can request a refund for your ₹999 purchase."
            sections={sections}
        />
    );
}
