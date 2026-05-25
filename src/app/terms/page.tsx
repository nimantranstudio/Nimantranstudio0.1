import { LegalPage } from '@/components/layout/LegalPage';

export const metadata = {
    title: 'Terms of Service — Nimantran Studio',
    description: 'Terms and conditions for using Nimantran Studio.',
    openGraph: {
        title: 'Terms of Service — Nimantran Studio',
        description: 'Terms and conditions for using Nimantran Studio.',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Terms of Service — Nimantran Studio',
        description: 'Terms and conditions for using Nimantran Studio.',
        images: ['/og-image.png'],
    },
};

const sections = [
    {
        title: '1. Acceptance of Terms',
        content: [
            'By accessing, browsing, or utilizing the Nimantran Studio platform, you unequivocally agree to be bound by these Terms of Service, our Privacy Policy, and any other applicable operating rules or policies.',
            'If you do not agree to all the terms and conditions of this agreement, you must immediately cease usage of the platform.',
            'These Terms are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts located in Pune, Maharashtra.',
        ],
    },
    {
        title: '2. User Eligibility and Account Obligations',
        content: [
            'You affirm that you are 18 years of age or older and possess the legal capacity to enter into a binding contract.',
            'You are solely responsible for maintaining the confidentiality of your account credentials (OTP access) and for all activities that occur under your account.',
            'Accounts are provisioned on a per-event basis and are strictly non-transferable. You agree to provide accurate, current, and complete information during the registration process.',
        ],
    },
    {
        title: '3. Intellectual Property and User Content',
        content: [
            'While you retain all ownership rights to the personal data and imagery you upload ("User Content"), you grant Nimantran Studio a worldwide, non-exclusive, royalty-free license to host, display, and process this content solely for the purpose of operating the service.',
            'You warrant that you possess all necessary rights and authorizations to distribute the User Content, and that such content does not infringe upon the intellectual property, privacy, or statutory rights of any third party.',
            'Nimantran Studio retains absolute copyright and intellectual property rights over its templates, software architecture, UI/UX designs, and proprietary systems. Reverse engineering, unauthorized reproduction, or commercial exploitation is strictly prohibited.',
        ],
    },
    {
        title: '4. Payments and Financial Terms',
        content: [
            'Services are rendered upon the successful realization of a one-time payment. All fees are inclusive of applicable statutory taxes unless otherwise explicitly stated.',
            'Payments are processed securely via authorized third-party gateways (e.g., Razorpay). Nimantran Studio does not capture or store your raw financial data.',
            'All transactions are final. Refunds are strictly governed by our Refund Policy and are limited solely to instances of verifiable technical or systemic failure.',
        ],
    },
    {
        title: '5. Prohibited Conduct',
        content: [
            'You shall not utilize the platform for any unlawful purpose, or for the distribution of malicious software, spam, or unsolicited communications.',
            'Commercial exploitation, reselling of templates, or unauthorized automated scraping of the platform is a material breach of these Terms.',
            'Nimantran Studio reserves the right to suspend or terminate accounts immediately, without prior notice or liability, for conduct that violates these Terms.',
        ],
    },
    {
        title: '6. Limitation of Liability and Indemnification',
        content: [
            'To the maximum extent permitted by applicable law, Nimantran Studio and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.',
            'Our aggregate liability for any claims arising out of this agreement shall be strictly capped at the total amount paid by you for the specific service in dispute.',
            'You agree to indemnify and hold harmless Nimantran Studio against any claims, liabilities, damages, or costs arising out of your violation of these Terms or your infringement of any third-party rights.',
        ],
    },
];

export default function TermsPage() {
    return (
        <LegalPage
            title="Terms of Service"
            lastUpdated="May 2026"
            introduction="This document constitutes a legally binding agreement between you (the User) and Nimantran Studio. It dictates the permitted usage, obligations, and limitations of liability regarding our digital invitation software services."
            sections={sections}
        />
    );
}
