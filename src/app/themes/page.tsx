'use client';

import { useRouter } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import { useState, useEffect } from 'react';
import type { Theme } from '@/lib/constants/themes';
import { ThemeCard } from '@/components/ui/ThemeCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import styles from './themes.module.css';
import { motion } from 'framer-motion';

export default function ThemesPage() {
    const router = useRouter();
    const { setThemeId } = useWeddingStore();
    const [themes, setThemes] = useState<Theme[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const res = await fetch('/api/themes');
                const data = await res.json();
                if (data.themes) {
                    setThemes(data.themes);
                }
            } catch (error) {
                console.error('Failed to fetch themes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchThemes();
    }, []);

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
                </div>
            </header>

            <main className="container">
                <div className={styles.hero}>
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Choose your wedding theme
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Select a visual language that resonates with your family's style.
                    </motion.p>
                </div>
                <div className={styles.grid}>
                    {loading ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#666' }}>Loading themes...</div>
                    ) : themes.length > 0 ? (
                        themes.map((theme, i) => (
                            <motion.div
                                key={theme.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                            >
                                <ThemeCard
                                    theme={theme}
                                    onSelect={handleThemeSelect}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#666' }}>No themes available.</div>
                    )}
                </div>
            </main>
        </div>
    );
}
