import { LegalPage } from '@/components/layout/LegalPage';

export const metadata = {
    title: 'Privacy Policy — Nimantran Studio',
    description: 'Privacy Policy and Data Protection Framework for Nimantran Studio.',
    openGraph: {
        title: 'Privacy Policy — Nimantran Studio',
        description: 'Privacy Policy and Data Protection Framework for Nimantran Studio.',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Privacy Policy — Nimantran Studio',
        description: 'Privacy Policy and Data Protection Framework for Nimantran Studio.',
        images: ['/og-image.png'],
    },
};

const sections = [
    {
        title: '1. Framework and Applicability',
        content: [
            'This Privacy Policy outlines the methodology by which Nimantran Studio collects, processes, and safeguards personal data in compliance with the Digital Personal Data Protection Act (DPDP), 2023, and applicable Indian cybersecurity regulations.',
            'By accessing our platform, you provide explicit consent to the data practices described herein.',
        ],
    },
    {
        title: '2. Data Collection Protocols',
        content: [
            'Account Information: We collect verified mobile numbers for secure OTP-based authentication and service communication.',
            'Event Data: We process names, event dates, geographical venue data, and customized textual content submitted by the user to generate digital assets.',
            'Guest Data: When guests interact with RSVP systems, we collect their identifiers, attendance status, and any provided dietary or logistical preferences on your behalf.',
            'Financial Data: We do not directly capture or retain primary payment card data; transactions are securely tokenized and handled by PCI-DSS compliant partners (Razorpay).',
        ],
    },
    {
        title: '3. Data Processing and Utilization',
        content: [
            'The primary purpose of data processing is the execution of requested services: rendering personalized digital invitations and compiling RSVP analytics for the host.',
            'We utilize anonymized, aggregated telemetry to diagnose system performance, monitor service health, and optimize the user interface.',
            'We strictly do not engage in the sale, rental, or unauthorized commercialization of user or guest data to third-party advertising networks.',
        ],
    },
    {
        title: '4. Third-Party Disclosures',
        content: [
            'Data is shared strictly on a need-to-know basis with critical infrastructure providers (e.g., cloud hosting, SMS gateways for authentication) bound by stringent confidentiality agreements.',
            'We may disclose personal data if compelled by a lawful order from a judicial authority, or to protect the statutory rights, property, and safety of Nimantran Studio and its users.',
        ],
    },
    {
        title: '5. Data Security and Retention',
        content: [
            'We implement industry-standard cryptographic protocols (HTTPS/TLS) and strict access controls to prevent unauthorized access, alteration, or data exfiltration.',
            'Authentication is deliberately passwordless (OTP-based) to mitigate risks associated with credential stuffing or password breaches.',
            'Active event data is retained for a period of 12 months post-event to facilitate access to digital assets, after which it is subject to secure deletion protocols.',
        ],
    },
    {
        title: '6. User Rights and Compliance',
        content: [
            'Users retain the right to request access to, or the deletion of, their personal data by formally contacting our designated Grievance Officer.',
            'Essential session cookies are deployed strictly to maintain secure authentication states. We abstain from utilizing invasive third-party tracking pixels for behavioral advertising.',
        ],
    },
];

export default function PrivacyPage() {
    return (
        <LegalPage
            title="Privacy Policy"
            lastUpdated="May 2026"
            introduction="Nimantran Studio maintains a steadfast commitment to data privacy and digital security. This policy delineates our comprehensive approach to the collection, stewardship, and protection of your personal information."
            sections={sections}
        />
    );
}
