'use client';

import { useState, useEffect } from 'react';
import { X, Package, CheckCircle, Info, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import styles from './BundleModal.module.css';
import { clsx } from 'clsx';
import Image from 'next/image';

interface Theme {
    id: string;
    name: string;
}

interface PackageModel {
    id: string;
    name: string;
    level: number;
    price: number;
    allowedItems: string;
}

interface BundleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any | null;
}

export function BundleModal({ isOpen, onClose, onSuccess, initialData }: BundleModalProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isPopular, setIsPopular] = useState(false);
    const [themeId, setThemeId] = useState('');
    const [tierPrices, setTierPrices] = useState<{ [key: string]: string }>({});
    const [itemFiles, setItemFiles] = useState<{ [key: string]: File }>({});
    const [itemPreviews, setItemPreviews] = useState<{ [key: string]: string }>({});

    const [themes, setThemes] = useState<Theme[]>([]);
    const [packages, setPackages] = useState<PackageModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!isOpen) return;
            setIsLoading(true);
            setError(null);
            try {
                const [themesRes, packagesRes] = await Promise.all([
                    fetch('/api/admin/themes'),
                    fetch('/api/admin/packages')
                ]);

                if (themesRes.ok) {
                    const data = await themesRes.json();
                    setThemes(data.themes || []);
                }

                if (packagesRes.ok) {
                    const data = await packagesRes.json();
                    if (data.packages && data.packages.length > 0) {
                        setPackages(data.packages);
                    } else if (data.error) {
                        setError(data.error);
                    } else {
                        setPackages([]);
                    }
                } else {
                    const errData = await packagesRes.json().catch(() => ({}));
                    setError(errData.error || `HTTP ${packagesRes.status}`);
                }
            } catch (err: any) {
                setError(err.message || "Network Error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setPrice(initialData.price || '');
            setDescription(initialData.description || '');
            setIsActive(initialData.isActive ?? true);
            setIsPopular(initialData.isPopular || false);
            setThemeId(initialData.themeId || '');

            setTierPrices({
                'WhatsApp Essentials': initialData.whatsappPrice ? String(initialData.whatsappPrice) : '',
                'WhatsApp + Posters': initialData.printablePrice ? String(initialData.printablePrice) : '',
                'Complete Wedding Suite': initialData.completePrice ? String(initialData.completePrice) : ''
            });

            if (initialData.itemImages) {
                try {
                    const existingItemImages = JSON.parse(initialData.itemImages);
                    setItemPreviews(existingItemImages);
                } catch (e) {
                    console.error("Failed to parse itemImages", e);
                }
            } else {
                setItemPreviews({});
            }
            setItemFiles({});
        } else {
            setName('');
            setPrice('');
            setDescription('');
            setIsActive(true);
            setIsPopular(false);
            setTierPrices({});
            setItemFiles({});
            setItemPreviews({});
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleTierPriceChange = (packageName: string, value: string) => {
        setTierPrices(prev => ({ ...prev, [packageName]: value }));
    };

    const handleItemFileChange = (itemName: string, file: File) => {
        setItemFiles(prev => ({ ...prev, [itemName]: file }));
        setItemPreviews(prev => ({ ...prev, [itemName]: URL.createObjectURL(file) }));
    };

    const removeItemFile = (itemName: string) => {
        setItemFiles(prev => {
            const next = { ...prev };
            delete next[itemName];
            return next;
        });
        setItemPreviews(prev => {
            const next = { ...prev };
            delete next[itemName];
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price || "0");
            formData.append('description', description);
            formData.append('isActive', String(isActive));
            formData.append('isPopular', String(isPopular));
            formData.append('themeId', themeId);
            formData.append('tierPrices', JSON.stringify(tierPrices));

            Object.entries(itemFiles).forEach(([name, file]) => {
                formData.append(`itemFile_${name}`, file);
            });

            formData.append('existingItemImages', JSON.stringify(itemPreviews));

            const url = initialData ? `/api/admin/bundles/${initialData.id}` : '/api/admin/bundles';
            const method = initialData ? 'PUT' : 'POST';

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
                            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                                <label className={styles.label}>Pricing by Package</label>
                                <div className={styles.pricingContainer}>
                                    {packages.length > 0 ? (
                                        packages.map(p => (
                                            <div key={p.id} className={styles.packagePricingRow}>
                                                <span className={styles.packageName}>{p.name}</span>
                                                <div className={styles.priceInputWrapper}>
                                                    <span className={styles.currencyPrefix}>₹</span>
                                                    <input
                                                        type="text"
                                                        className={styles.input}
                                                        style={{ paddingLeft: '1.8rem' }}
                                                        placeholder={String(p.price)}
                                                        value={tierPrices[p.name] || ''}
                                                        onChange={e => handleTierPriceChange(p.name, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.emptyPackages}>
                                            {isLoading ? (
                                                <div className={styles.loaderContainer}>
                                                    <div className={styles.spinner}></div>
                                                    Fetching package definitions...
                                                </div>
                                            ) : (
                                                <div className={styles.errorContainer}>
                                                    {error ? (
                                                        <>
                                                            <AlertCircle size={24} color="#ef4444" />
                                                            <p className={styles.errorText}>{error}</p>
                                                        </>
                                                    ) : (
                                                        <p>No active packages found in database.</p>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className={styles.retryBtn}
                                                        onClick={() => window.location.reload()}
                                                    >
                                                        Retry Connection
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.row}>
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

                        {packages.length > 0 && (
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Item-wise Invite Uploads (All Tiers)</label>
                                <div className={styles.itemUploadGrid}>
                                    {(() => {
                                        const allItemsSet = new Set<string>();
                                        packages.forEach(p => {
                                            try {
                                                const items = JSON.parse(p.allowedItems);
                                                items.forEach((item: string) => allItemsSet.add(item));
                                            } catch (e) { }
                                        });
                                        const allUniqueItems = Array.from(allItemsSet);

                                        return allUniqueItems.map((item: string) => (
                                            <div key={item} className={styles.itemUploadField}>
                                                <span className={styles.itemName}>{item}</span>
                                                <div className={styles.itemUploadControls}>
                                                    {itemPreviews[item] ? (
                                                        <div className={styles.itemPreviewWrapper}>
                                                            <Image
                                                                src={itemPreviews[item]}
                                                                alt={item}
                                                                width={24}
                                                                height={24}
                                                                className={styles.itemPreview}
                                                                unoptimized={itemPreviews[item].startsWith('blob:')}
                                                            />
                                                            <button type="button" className={styles.itemRemoveBtn} onClick={() => removeItemFile(item)}>
                                                                <X size={10} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <label className={styles.itemUploadBtn}>
                                                            <Upload size={14} />
                                                            <input
                                                                type="file"
                                                                hidden
                                                                accept="image/*"
                                                                onChange={(e) => e.target.files?.[0] && handleItemFileChange(item, e.target.files[0])}
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        )}
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
