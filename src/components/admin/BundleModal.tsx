'use client';

import { useState, useEffect } from 'react';
import { X, Package, CheckCircle, Info } from 'lucide-react';
import styles from './BundleModal.module.css';

interface Theme {
    id: string;
    name: string;
}

interface BundleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any | null;
}

const CHECKLIST_ITEMS = [
    "Image Invitations",
    "Video Invitations",
    "RSVP Link",
    "Guest Manager",
    "Printable Posters",
    "Complete Stationery"
];

export function BundleModal({ isOpen, onClose, onSuccess, initialData }: BundleModalProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [highlights, setHighlights] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isPopular, setIsPopular] = useState(false);
    const [themeId, setThemeId] = useState('');
    const [checklist, setChecklist] = useState<string[]>([]);

    const [themes, setThemes] = useState<Theme[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const res = await fetch('/api/admin/themes');
                if (res.ok) {
                    const data = await res.json();
                    setThemes(data.themes || []);
                }
            } catch (error) {
                console.error("Failed to fetch themes", error);
            }
        };

        if (isOpen) {
            fetchThemes();
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPrice(initialData.price);
            setDescription(initialData.description || '');
            setHighlights(initialData.highlights || '');
            setIsActive(initialData.isActive);
            setIsPopular(initialData.isPopular || false);
            setThemeId(initialData.themeId || '');
            setChecklist(initialData.checklist ? JSON.parse(initialData.checklist) : []);
        } else {
            setName('');
            setPrice('');
            setDescription('');
            setHighlights('');
            setIsActive(true);
            setIsPopular(false);
            setThemeId('');
            setChecklist([]);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const toggleChecklist = (item: string) => {
        setChecklist(prev =>
            prev.includes(item)
                ? prev.filter(i => i !== item)
                : [...prev, item]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = initialData ? `/api/admin/bundles/${initialData.id}` : '/api/admin/bundles';
            const method = initialData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    price,
                    description,
                    highlights,
                    isActive,
                    isPopular,
                    themeId,
                    checklist: JSON.stringify(checklist)
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save bundle');
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{initialData ? 'Edit Bundle' : 'Create New Bundle'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.body}>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Bundle Name</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="e.g. Essential Wedding Kit"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Base Theme</label>
                                <select
                                    className={styles.select}
                                    value={themeId}
                                    onChange={e => setThemeId(e.target.value)}
                                >
                                    <option value="">Select a theme</option>
                                    {themes.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Price (INR)</label>
                                <div className={styles.priceInputWrapper}>
                                    <span className={styles.currencyPrefix}>₹</span>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        style={{ paddingLeft: '2rem' }}
                                        placeholder="0"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Status</label>
                                <div className={styles.toggles}>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            className={styles.toggleInput}
                                            checked={isActive}
                                            onChange={e => setIsActive(e.target.checked)}
                                        />
                                        <span className={styles.toggleSwitch}></span>
                                        <span className={styles.toggleLabel}>{isActive ? 'Public' : 'Draft'}</span>
                                    </label>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            className={styles.toggleInput}
                                            checked={isPopular}
                                            onChange={e => setIsPopular(e.target.checked)}
                                        />
                                        <span className={styles.toggleSwitch}></span>
                                        <span className={styles.toggleLabel}>Popular</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Bundle Description</label>
                            <textarea
                                className={styles.textarea}
                                placeholder="Summarize what makes this bundle special..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>"What You Get" Checklist</label>
                            <div className={styles.checklistGrid}>
                                {CHECKLIST_ITEMS.map(item => (
                                    <label key={item} className={styles.checkItem}>
                                        <input
                                            type="checkbox"
                                            checked={checklist.includes(item)}
                                            onChange={() => toggleChecklist(item)}
                                        />
                                        <span>{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Product Highlights (Bullet Points)</label>
                            <textarea
                                className={styles.textarea}
                                style={{ height: '100px' }}
                                placeholder="• 4K Video Quality&#10;• 24/7 Guest Support&#10;• Premium Typography"
                                value={highlights}
                                onChange={e => setHighlights(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.btnCancel} onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.btnSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : (initialData ? 'Update Bundle' : 'Create Bundle')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
