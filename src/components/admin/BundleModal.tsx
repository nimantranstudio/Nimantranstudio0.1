'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Package, CheckCircle, Info, Upload, Image as ImageIcon, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
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

interface EventModel {
    id: string;
    eventName: string;
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
    const [allEvents, setAllEvents] = useState<EventModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    type InvoiceData = {
        invitationDesignSuite: string;
        rsvpManagementTracking: string;
        guestDashboard: string;
        totalWeddingSuiteValue: string;
        discount: string;
        discountedPrice: string;
        finalSellingPrice: string;
    };

    const defaultInvoiceData: InvoiceData = {
        invitationDesignSuite: '0',
        rsvpManagementTracking: '0',
        guestDashboard: '0',
        totalWeddingSuiteValue: '0',
        discount: '0',
        discountedPrice: '0',
        finalSellingPrice: '0',
        isDisplay: true, // Support for isDisplay from screenshot
    } as any;

    const [bundleInvoices, setBundleInvoices] = useState<{ [packageId: string]: InvoiceData }>({});
    const [expandedInvoices, setExpandedInvoices] = useState<{ [packageId: string]: boolean }>({});

    const toggleInvoiceExpand = (packageId: string) => {
        setExpandedInvoices(prev => ({ ...prev, [packageId]: !prev[packageId] }));
    };

    // New Event Type Bundle Items
    const [activeEventType, setActiveEventType] = useState('');
    const [activeTemplateName, setActiveTemplateName] = useState('');
    const [activeTemplateFile, setActiveTemplateFile] = useState<File | null>(null);
    const [bundleItemsList, setBundleItemsList] = useState<Array<{ id: string, eventType: string, eventId: string, templateName: string, file: File | null, previewUrl: string | null }>>([]);
    const templateFileRef = useRef<HTMLInputElement>(null);

    const [packageDisplayConfig, setPackageDisplayConfig] = useState<{ [key: string]: boolean }>({});

    // Collect all unique event types (allowed items) across all packages
    const availableEventTypes = Array.from(new Set(packages.flatMap(pkg => {
        try {
            return JSON.parse(pkg.allowedItems) || [];
        } catch {
            return [];
        }
    }))).sort() as string[];

    // Fallback if no packages are loaded yet
    const displayEventTypes = availableEventTypes.length > 0 ? availableEventTypes : [
        "Save the date", "Wedding Invitation", "Haldi Invitation", "Mehendi Invitation", 
        "Sangeet Invitation", "Reception", "RSVP", "Thank You Card", "Video"
    ];

    // Ensure activeEventType is valid when the list changes
    useEffect(() => {
        if (allEvents.length > 0 && !activeEventType) {
            setActiveEventType(allEvents[0].id);
        }
    }, [allEvents, activeEventType]);

    useEffect(() => {
        const fetchData = async () => {
            if (!isOpen) return;
            setIsLoading(true);
            setError(null);
            try {
                const [themesRes, packagesRes, eventsRes] = await Promise.all([
                    fetch('/api/admin/themes'),
                    fetch('/api/admin/packages'),
                    fetch('/api/admin/events')
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

                if (eventsRes.ok) {
                    const data = await eventsRes.json();
                    setAllEvents(data.events || []);
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
            setName(initialData.BundleName || '');
            setPrice(initialData.price || '');
            setDescription(initialData.bundleDescription || '');
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

            if (initialData.bundleInvoices && Array.isArray(initialData.bundleInvoices)) {
                const invoiceMap: { [key: string]: InvoiceData } = {};
                const displayMap: { [key: string]: boolean } = {};
                initialData.bundleInvoices.forEach((inv: any) => {
                    invoiceMap[inv.packageId] = {
                        invitationDesignSuite: String(inv.invitationDesignSuite || 0),
                        rsvpManagementTracking: String(inv.rsvpManagementTracking || 0),
                        guestDashboard: String(inv.guestDashboard || 0),
                        totalWeddingSuiteValue: String(inv.totalWeddingSuiteValue || 0),
                        discount: String(inv.discount || 0),
                        discountedPrice: String(inv.discountedPrice || 0),
                        finalSellingPrice: String(inv.finalSellingPrice || 0),
                        isDisplay: inv.isDisplay ?? true
                    } as any;
                    displayMap[inv.packageId] = inv.isDisplay ?? true;
                });
                setBundleInvoices(invoiceMap);
                setPackageDisplayConfig(displayMap);
            } else {
                setBundleInvoices({});
                setPackageDisplayConfig({});
            }

            if (initialData.bundleItems && Array.isArray(initialData.bundleItems)) {
                setBundleItemsList(initialData.bundleItems.map((item: any) => ({
                    id: item.id || Math.random().toString(),
                    eventType: item.event?.eventName || 'Unknown',
                    eventId: item.eventId,
                    templateName: item.templateName,
                    file: null,
                    previewUrl: item.templatePath
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
            setPackageDisplayConfig({});
            setBundleInvoices({});
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleTierPriceChange = (packageId: string, value: string, skipInvoiceSync: boolean = false) => {
        setTierPrices(prev => ({ ...prev, [packageId]: value }));
        
        if (!skipInvoiceSync) {
            // Give event loop a beat to prevent state queue freezing from loop
            setTimeout(() => {
                handleInvoiceChange(packageId, 'discountedPrice', value, true);
            }, 0);
        }
    };

    const handlePackageDisplayChange = (packageName: string, value: boolean) => {
        setPackageDisplayConfig(prev => ({ ...prev, [packageName]: value }));
    };

    const handleInvoiceChange = (packageId: string, field: keyof InvoiceData | 'discountedPrice', value: string, skipTierSync: boolean = false) => {
        setBundleInvoices(prev => {
            const oldInvoice = prev[packageId] || { ...defaultInvoiceData };
            const newInvoice = { ...oldInvoice, [field]: value };
            
            const design = parseFloat(newInvoice.invitationDesignSuite) || 0;
            const rsvp = parseFloat(newInvoice.rsvpManagementTracking) || 0;
            const guest = parseFloat(newInvoice.guestDashboard) || 0;
            
            const totalSuiteValue = design + rsvp + guest;
            newInvoice.totalWeddingSuiteValue = totalSuiteValue.toString();
            
            let finalAmountFormatted = '0';

            if (field === 'discountedPrice') {
                const requestedFinalPrice = parseFloat(value) || 0;
                let reverseDiscountPercent = 0;
                if (totalSuiteValue > 0) {
                     reverseDiscountPercent = ((totalSuiteValue - requestedFinalPrice) / totalSuiteValue) * 100;
                }
                newInvoice.discount = parseFloat(reverseDiscountPercent.toFixed(2)).toString();
                finalAmountFormatted = parseFloat(requestedFinalPrice.toFixed(2)).toString();
                newInvoice.discountedPrice = value; // Preserve exact text while typing
            } else {
                const discountPercent = parseFloat(newInvoice.discount) || 0;
                const finalAmount = totalSuiteValue - (totalSuiteValue * (discountPercent / 100));
                finalAmountFormatted = parseFloat(finalAmount.toFixed(2)).toString();
                newInvoice.discountedPrice = finalAmountFormatted;
            }

            newInvoice.finalSellingPrice = finalAmountFormatted;

            if (!skipTierSync) {
                setTimeout(() => {
                    handleTierPriceChange(packageId, finalAmountFormatted, true);
                }, 0);
            }

            return {
                ...prev,
                [packageId]: newInvoice
            };
        });
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
        const previewUrl = activeTemplateFile ? URL.createObjectURL(activeTemplateFile) : null;
        const selectedEvent = allEvents.find(e => e.id === activeEventType);
        const eventName = selectedEvent ? selectedEvent.eventName : 'Unknown';

        setBundleItemsList(prev => [...prev, {
            id: Math.random().toString(),
            eventType: eventName,
            eventId: activeEventType,
            templateName: eventName,
            file: activeTemplateFile,
            previewUrl
        }]);

        setActiveTemplateFile(null);
        if (templateFileRef.current) {
            templateFileRef.current.value = '';
        }
    };

    const removeBundleItem = (id: string) => {
        setBundleItemsList(prev => prev.filter(item => item.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('BundleName', name); // Renamed
            formData.append('price', price || "0");
            formData.append('bundleDescription', description); // Renamed
            formData.append('isActive', String(isActive));
            formData.append('isPopular', String(isPopular));
            formData.append('themeId', themeId);
            formData.append('tierPrices', JSON.stringify(tierPrices));
            formData.append('packageDisplayOptions', JSON.stringify(packageDisplayConfig));
            formData.append('bundleInvoices', JSON.stringify(bundleInvoices));
            
            // Temporary placeholder for logged in user name. Replace with actual auth context.
            const currentUserName = typeof window !== 'undefined' ? (localStorage.getItem('adminUserName') || 'Admin User') : 'Admin User';
            formData.append('userName', currentUserName);

            Object.entries(itemFiles).forEach(([name, file]) => {
                formData.append(`itemFile_${name}`, file);
            });

            formData.append('existingItemImages', JSON.stringify(itemPreviews));

            // Append specific structured bundle items
            const structuredItems = bundleItemsList.map((item: any) => ({
                id: item.id,
                eventId: item.eventId, // New
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
                                <label className={styles.label}>Pricing & Invoices by Package</label>
                                <div className={styles.pricingContainer}>
                                    {packages.length > 0 ? (
                                        packages.map(p => {
                                            const isActive = packageDisplayConfig[p.id] === true;
                                            const isExpanded = expandedInvoices[p.id] === true;
                                            const currentInvoice = bundleInvoices[p.id] || defaultInvoiceData;

                                            return (
                                                <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                                                    <div className={styles.packagePricingRow} style={{ display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', padding: 0, margin: 0 }}>
                                                        <label className={styles.toggle} style={{ marginBottom: 0 }}>
                                                            <input
                                                                type="checkbox"
                                                                className={styles.toggleInput}
                                                                checked={isActive}
                                                                onChange={e => handlePackageDisplayChange(p.id, e.target.checked)}
                                                            />
                                                            <span className={styles.toggleSwitch} style={{ transform: 'scale(0.8)' }}></span>
                                                        </label>
                                                        <span className={styles.packageName} style={{ flex: 1, cursor: 'pointer' }} onClick={() => isActive && toggleInvoiceExpand(p.id)}>
                                                            {p.name}
                                                        </span>
                                                        <div className={styles.priceInputWrapper}>
                                                            <span className={styles.currencyPrefix}>₹</span>
                                                            <input
                                                                type="text"
                                                                className={styles.input}
                                                                style={{ paddingLeft: '1.8rem' }}
                                                                placeholder={String(p.price)}
                                                                value={tierPrices[p.id] || tierPrices[p.name] || ''}
                                                                onChange={e => handleTierPriceChange(p.id, e.target.value)}
                                                            />
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            style={{ background: 'transparent', border: 'none', cursor: isActive ? 'pointer' : 'not-allowed', color: isActive ? '#6366f1' : '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}
                                                            onClick={() => isActive && toggleInvoiceExpand(p.id)}
                                                            disabled={!isActive}
                                                            title="Toggle Invoice Details"
                                                        >
                                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                        </button>
                                                    </div>

                                                    {isActive && isExpanded && (
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', marginLeft: '3rem' }}>
                                                            <div style={{ gridColumn: 'span 2', fontWeight: 600, color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                                                                Invoice Breakdown for {p.name}
                                                            </div>
                                                            {[
                                                                { key: 'invitationDesignSuite', label: 'Invitation Design Suite', prefix: '₹' },
                                                                { key: 'rsvpManagementTracking', label: 'RSVP Management Tracking', prefix: '₹' },
                                                                { key: 'guestDashboard', label: 'Guest Dashboard + hosting', prefix: '₹' },
                                                                { key: 'totalWeddingSuiteValue', label: 'Total Wedding Suite Value', prefix: '₹', readOnly: true },
                                                                { key: 'discount', label: 'Offer / Discount (%)', prefix: '%' },
                                                                { key: 'discountedPrice', label: 'Discounted Price', prefix: '₹' }
                                                            ].map(({ key, label, prefix, readOnly }) => (
                                                                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>{label}</label>
                                                                    <div className={styles.priceInputWrapper}>
                                                                        <span className={styles.currencyPrefix}>{prefix}</span>
                                                                        <input
                                                                            type={readOnly ? "text" : "number"}
                                                                            step="any"
                                                                            className={styles.input}
                                                                            style={{ paddingLeft: '1.8rem', backgroundColor: readOnly ? '#f1f5f9' : '#fff', cursor: readOnly ? 'not-allowed' : 'text' }}
                                                                            placeholder="0"
                                                                            value={currentInvoice[key as keyof InvoiceData] || ''}
                                                                            onChange={e => handleInvoiceChange(p.id, key as keyof InvoiceData, e.target.value)}
                                                                            readOnly={readOnly}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
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
                                                    <button type="button" className={styles.retryBtn} onClick={() => window.location.reload()}>Retry Connection</button>
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.75rem', alignItems: 'end', marginBottom: '1.5rem', background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Event Type</label>
                                    <select
                                        className={styles.select}
                                        value={activeEventType}
                                        onChange={(e) => setActiveEventType(e.target.value)}
                                    >
                                        {allEvents.map(e => (
                                            <option key={e.id} value={e.id}>{e.eventName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Template File</label>
                                    <input
                                        ref={templateFileRef}
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => setActiveTemplateFile(e.target.files?.[0] || null)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => templateFileRef.current?.click()}
                                        title={activeTemplateFile ? activeTemplateFile.name : 'Upload template file'}
                                        style={{
                                            height: '42px',
                                            width: '42px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: activeTemplateFile ? '2px solid #6366f1' : '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            background: activeTemplateFile ? '#eef2ff' : '#fff',
                                            cursor: 'pointer',
                                            color: activeTemplateFile ? '#6366f1' : '#6b7280',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Upload size={18} />
                                    </button>
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
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Preview</th>
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee', width: '50px' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bundleItemsList.map(item => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '0.75rem' }}>{item.eventType}</td>
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
