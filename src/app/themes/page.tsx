'use client';

import { useRouter } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import { THEMES } from '@/lib/constants/themes';
import { ThemeCard } from '@/components/ui/ThemeCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import styles from './themes.module.css';

export default function ThemesPage() {
    const router = useRouter();
    const { setThemeId } = useWeddingStore();

    const handleThemeSelect = (id: string) => {
        router.push(`/themes/${id}`);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Themes', active: true },
                        ]}
                    />
                    <h1 className={styles.title}>Choose your wedding theme</h1>
                    <p className={styles.subtitle}>Select a visual language that resonates with your family's style.</p>
                </div>
            </header>

            <main className="container">
                <div className={styles.grid}>
                    {THEMES.map((theme) => (
                        <ThemeCard
                            key={theme.id}
                            theme={theme}
                            onSelect={handleThemeSelect}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
