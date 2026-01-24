'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Package, CheckCircle, Info, Upload, Image as ImageIcon } from 'lucide-react';
import styles from './BundleModal.module.css';
import { clsx } from 'clsx';

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

    // Image state
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

            setFiles([]);
            const existingImages = initialData.previewImages ? JSON.parse(initialData.previewImages) : (initialData.thumbnailUrl ? [initialData.thumbnailUrl] : []);
            setPreviews(existingImages);
        } else {
            setName('');
            setPrice('');
            setDescription('');
            setHighlights('');
            setIsActive(true);
            setIsPopular(false);
            setThemeId('');
            setChecklist([]);
            setFiles([]);
            setPreviews([]);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
        // Note: in a real update we'd need to identify which files are new vs existing to update 'files' state correctly
    };

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
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('description', description);
            formData.append('highlights', highlights);
            formData.append('isActive', String(isActive));
            formData.append('isPopular', String(isPopular));
            formData.append('themeId', themeId);
            formData.append('checklist', JSON.stringify(checklist));

            files.forEach(file => {
                formData.append('images', file);
            });

            const url = initialData ? `/api/admin/bundles/${initialData.id}` : '/api/admin/bundles';
            const method = initialData ? 'PUT' : 'POST';

            console.log(`[CLIENT] Sending ${method} for bundle:`, { name, isActive, isPopular });

            const response = await fetch(url, {
                method,
                body: formData,
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

                <form onSubmit={handleSubmit} className={styles.form}>
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
                                        <span className={styles.toggleLabel}>{isActive ? 'Active' : 'Inactive'}</span>
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
                            <label className={styles.label}>Bundle Images</label>
                            <div
                                className={styles.fileUploadArea}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <Upload size={24} color="#6366f1" />
                                <div className={styles.uploadText}>
                                    <span style={{ fontWeight: 600, color: '#6366f1' }}>Click to upload</span> or drag and drop
                                </div>
                                <div className={styles.uploadHint}>SVG, PNG, JPG or GIF (max. 800x400px)</div>
                            </div>

                            {previews.length > 0 && (
                                <div className={styles.previewGrid}>
                                    {previews.map((src, index) => (
                                        <div key={index} className={styles.previewItem}>
                                            <img src={src} alt="Preview" className={styles.previewImg} />
                                            <button
                                                type="button"
                                                className={styles.removeBtn}
                                                onClick={() => removeFile(index)}
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
