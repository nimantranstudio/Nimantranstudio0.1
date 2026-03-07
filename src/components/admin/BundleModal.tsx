'use client';

import { useState, useEffect } from 'react';
import { X, Package, CheckCircle, Info, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import styles from './BundleModal.module.css';
import { clsx } from 'clsx';

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

    // New Event Type Bundle Items
    const [activeEventType, setActiveEventType] = useState('SAVE_DATE');
    const [activeTemplateName, setActiveTemplateName] = useState('');
    const [activeTemplateFile, setActiveTemplateFile] = useState<File | null>(null);
    const [bundleItemsList, setBundleItemsList] = useState<Array<{ id: string, eventType: string, templateName: string, file: File | null, previewUrl: string | null }>>([]);

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
            if (initialData.bundleItems && Array.isArray(initialData.bundleItems)) {
                setBundleItemsList(initialData.bundleItems.map((item: any) => ({
                    id: item.id || Math.random().toString(),
                    eventType: item.eventType,
                    templateName: item.templateName,
                    file: null,
                    previewUrl: item.templateFile
                })));
            } else {
                setBundleItemsList([]);
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
            setActiveTemplateName('');
            setActiveTemplateFile(null);
            setBundleItemsList([]);
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

    const handleAddBundleItem = () => {
        if (!activeTemplateName.trim()) {
            alert('Template Name is required');
            return;
        }

        const previewUrl = activeTemplateFile ? URL.createObjectURL(activeTemplateFile) : null;

        setBundleItemsList(prev => [...prev, {
            id: Math.random().toString(),
            eventType: activeEventType,
            templateName: activeTemplateName,
            file: activeTemplateFile,
            previewUrl
        }]);

        setActiveTemplateName('');
        setActiveTemplateFile(null);
    };

    const removeBundleItem = (id: string) => {
        setBundleItemsList(prev => prev.filter(item => item.id !== id));
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

            // Append specific structured bundle items
            const structuredItems = bundleItemsList.map(item => ({
                id: item.id,
                eventType: item.eventType,
                templateName: item.templateName,
                existingUrl: !item.file ? item.previewUrl : null
            }));
            formData.append('bundleItemsMeta', JSON.stringify(structuredItems));

            bundleItemsList.forEach(item => {
                if (item.file) {
                    formData.append(`newBundleItem_${item.id}`, item.file);
                }
            });

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

                        <div className={styles.formGroup} style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', marginTop: '1rem' }}>
                            <label className={styles.label}>Bundle Items Configuration</label>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end', marginBottom: '1.5rem', background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Event Type</label>
                                    <select
                                        className={styles.select}
                                        value={activeEventType}
                                        onChange={(e) => setActiveEventType(e.target.value)}
                                    >
                                        <option value="SAVE_DATE">Save The Date</option>
                                        <option value="HALDI">Haldi</option>
                                        <option value="MEHENDI">Mehendi</option>
                                        <option value="SANGEET">Sangeet</option>
                                        <option value="WEDDING">Wedding</option>
                                        <option value="RECEPTION">Reception</option>
                                        <option value="RSVP">RSVP</option>
                                        <option value="THANK_YOU">Thank You</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Template Name</label>
                                    <input
                                        placeholder="e.g. Haldi Card"
                                        className={styles.input}
                                        value={activeTemplateName}
                                        onChange={(e) => setActiveTemplateName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Template File</label>
                                    <input
                                        type="file"
                                        className={styles.input}
                                        style={{ padding: '0.4rem' }}
                                        onChange={(e) => setActiveTemplateFile(e.target.files?.[0] || null)}
                                    />
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className={styles.btnSubmit}
                                        onClick={handleAddBundleItem}
                                        style={{ height: '42px', padding: '0 1.5rem' }}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            {bundleItemsList.length > 0 && (
                                <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse', border: '1px solid #eee' }}>
                                    <thead style={{ background: '#f9fafb', textAlign: 'left' }}>
                                        <tr>
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Event Type</th>
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Template Name</th>
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Preview</th>
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee', width: '50px' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bundleItemsList.map(item => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '0.75rem' }}>{item.eventType}</td>
                                                <td style={{ padding: '0.75rem' }}>{item.templateName}</td>
                                                <td style={{ padding: '0.75rem' }}>
                                                    {item.previewUrl ? (
                                                        <img src={item.previewUrl} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }} />
                                                    ) : (
                                                        <span style={{ color: '#999', fontSize: '0.75rem' }}>No file</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                    <button type="button" onClick={() => removeBundleItem(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                                                        <X size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
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
