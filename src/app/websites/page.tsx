import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { TemplateSelection } from '@/website/components/TemplateSelection';
import styles from './websites.module.css';

export const metadata: Metadata = {
    title: 'Wedding Website Designs | Nimantran Studio',
    description:
        'Choose a wedding website design for your Indian wedding. Share every ceremony, venue maps and online RSVP with your guests in one link.',
    alternates: { canonical: 'https://www.nimantranstudio.in/websites' },
};

export default function WebsitesPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Wedding Websites', active: true },
                        ]}
                    />
                </div>
            </header>
            <main className="container">
                <div className={styles.hero}>
                    <span className={styles.eyebrow}>Step 1 of 3 · Choose a design</span>
                    <h1 className={styles.title}>Choose your wedding website</h1>
                    <p className={styles.subtitle}>
                        One link for your guests with every ceremony, venue maps and RSVP. Pick a design and
                        add your details. Tap Preview to see the whole website first.
                    </p>
                </div>
                <TemplateSelection />
            </main>
        </div>
    );
}
