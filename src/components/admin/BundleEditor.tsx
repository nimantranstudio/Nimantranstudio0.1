'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Code, Save, ChevronLeft, Image as ImageIcon, CheckCircle, Upload, Plus, ChevronUp, ChevronDown, X, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './BundleEditor.module.css';

interface Theme { id: string; name: string; }
interface PackageModel { id: string; name: string; level: number; price: number; allowedItems: string; }
interface EventModel { id: string; eventName: string; }
interface BundleEditorProps { bundleId: string; initialData?: any | null; themes: Theme[]; packages: PackageModel[]; allEvents: EventModel[]; }

type InvoiceData = {
    invitationDesignSuite: string; rsvpManagementTracking: string; guestDashboard: string;
    totalWeddingSuiteValue: string; discount: string; discountedPrice: string;
    finalSellingPrice: string; isDisplay: boolean;
};

const defaultInvoiceData: InvoiceData = {
    invitationDesignSuite: '0', rsvpManagementTracking: '0', guestDashboard: '0',
    totalWeddingSuiteValue: '0', discount: '0', discountedPrice: '0', finalSellingPrice: '0', isDisplay: true
};

export function BundleEditor({ bundleId, initialData, themes, packages, allEvents }: BundleEditorProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'details' | 'template'>('details');
    const [isSaving, setIsSaving] = useState(false);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isPopular, setIsPopular] = useState(false);
    const [themeId, setThemeId] = useState('');

    const [tierPrices, setTierPrices] = useState<{ [key: string]: string }>({});
    const [itemFiles, setItemFiles] = useState<{ [key: string]: File }>({});
    const [itemPreviews, setItemPreviews] = useState<{ [key: string]: string }>({});

    const [bundleInvoices, setBundleInvoices] = useState<{ [packageId: string]: InvoiceData }>({});
    const [expandedInvoices, setExpandedInvoices] = useState<{ [packageId: string]: boolean }>({});
    const [packageDisplayConfig, setPackageDisplayConfig] = useState<{ [key: string]: boolean }>({});

    const [activeEventType, setActiveEventType] = useState('');
    const [activeTemplateFile, setActiveTemplateFile] = useState<File | null>(null);
    const [bundleItemsList, setBundleItemsList] = useState<any[]>([]);
    const templateFileRef = useRef<HTMLInputElement>(null);

    const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
    const [htmlContent, setHtmlContent] = useState('');
    const [paddingTop, setPaddingTop] = useState(0);
    const [paddingBottom, setPaddingBottom] = useState(0);
    const [paddingSide, setPaddingSide] = useState(0);
    const [gap, setGap] = useState(0);
    const [bgImage, setBgImage] = useState('');
    const [textStyles, setTextStyles] = useState<Record<string, { fontSize: string, color: string, fontFamily: string }>>({});

    const [previewData, setPreviewData] = useState({
        event_name: 'Wedding Ceremony',
        heading: 'We are pleased to invite you to the wedding of',
        subheading: '',
        groom_name: 'Rahul',
        ampersand: '&',
        bride_name: 'Anjali',
        groom_parents: 'Son of Mr and Mrs Bajaj',
        bride_parents: 'Daughter of Mr and Mrs Patel',
        date_label: 'On',
        event_date: '16th February 2026',
        time_label: 'At',
        event_time: '6:30 pm',
        venue_label: 'Venue:',
        event_venue: 'The Rajputana palace, Adarsh Nagar, Rajasthan'
    });

    const previewHtml = useMemo(() => {
        let result = htmlContent;
        Object.entries(previewData).forEach(([key, value]) => {
            result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
        });
        return result;
    }, [htmlContent, previewData]);

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
                try { setItemPreviews(JSON.parse(initialData.itemImages)); } catch (e) {}
            }
            if (initialData.bundleInvoices && Array.isArray(initialData.bundleInvoices)) {
                const invoiceMap: any = {};
                const displayMap: any = {};
                const tPrices: any = {};
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
                    };
                    displayMap[inv.packageId] = inv.isDisplay ?? true;
                    if (inv.finalSellingPrice) tPrices[inv.packageId] = String(inv.finalSellingPrice);
                    else if (inv.discountedPrice) tPrices[inv.packageId] = String(inv.discountedPrice);
                });
                setBundleInvoices(invoiceMap);
                setPackageDisplayConfig(displayMap);
                setTierPrices(prev => ({ ...prev, ...tPrices }));
            }
            if (initialData.bundleItems && Array.isArray(initialData.bundleItems)) {
                setBundleItemsList(initialData.bundleItems.map((item: any) => ({
                    id: item.id || Math.random().toString(),
                    eventType: item.event?.eventName || 'Unknown',
                    eventId: item.eventId,
                    templateName: item.templateName,
                    file: null,
                    previewUrl: item.templatePath,
                    templatePath: item.templatePath
                })));
            }
        }
        if (allEvents.length > 0) setActiveEventType(allEvents[0].id);
    }, [initialData, allEvents]);

    useEffect(() => {
        if (activeTab === 'template' && bundleItemsList[activeTemplateIndex]) {
            const templateUrl = bundleItemsList[activeTemplateIndex]?.templatePath;
            if (templateUrl) {
                fetch(templateUrl + '?t=' + Date.now())
                    .then(res => res.text())
                    .then(html => {
                        setHtmlContent(html);
                        const styleBlockMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
                        if (styleBlockMatch) {
                            const styles = styleBlockMatch[1];
                            const ptMatch = styles.match(/\.content-safe-area\s*\{[^}]*padding-top:\s*(\d+(\.\d+)?)%/i);
                            if (ptMatch) setPaddingTop(parseFloat(ptMatch[1]));
                            const pbMatch = styles.match(/\.content-safe-area\s*\{[^}]*padding-bottom:\s*(\d+(\.\d+)?)%/i);
                            if (pbMatch) setPaddingBottom(parseFloat(pbMatch[1]));
                            const psMatch = styles.match(/\.content-safe-area\s*\{[^}]*padding-left:\s*(\d+(\.\d+)?)%/i);
                            if (psMatch) setPaddingSide(parseFloat(psMatch[1]));
                            const gapMatch = styles.match(/\.content-safe-area\s*\{[^}]*gap:\s*(\d+(\.\d+)?)cqi/i);
                            if (gapMatch) setGap(parseFloat(gapMatch[1]));
                            const bgMatch = styles.match(/\.invitation-wrapper\s*\{[^}]*background-image:\s*url\('([^']+)'\)/i);
                            if (bgMatch) {
                                setBgImage(bgMatch[1]);
                            } else {
                                setBgImage('');
                            }

                            const classRegex = /\.style-([a-zA-Z0-9]+)\s*\{([^}]+)\}/g;
                            let match;
                            const extractedStyles: Record<string, { fontSize: string, color: string, fontFamily: string }> = {};
                            while ((match = classRegex.exec(styles)) !== null) {
                                const className = match[1];
                                const cssProps = match[2];
                                const fontSizeMatch = cssProps.match(/font-size:\s*([\d.]+)cqi/i);
                                const colorMatch = cssProps.match(/color:\s*(#[a-fA-F0-9]+)/i);
                                const fontFamilyMatch = cssProps.match(/font-family:\s*"([^"]+)"/i) || cssProps.match(/font-family:\s*'([^']+)'/i) || cssProps.match(/font-family:\s*([^,;}]+)/i);
                                extractedStyles[className] = {
                                    fontSize: fontSizeMatch ? fontSizeMatch[1] : '5',
                                    color: colorMatch ? colorMatch[1] : '#FFFFFF',
                                    fontFamily: fontFamilyMatch ? fontFamilyMatch[1].trim() : 'inherit'
                                };
                            }
                            setTextStyles(extractedStyles);
                        } else {
                            setBgImage('');
                            setTextStyles({});
                        }
                    })
                    .catch(console.error);
            } else {
                setHtmlContent('');
            }
        }
    }, [activeTab, activeTemplateIndex, bundleItemsList]);

    const handleTierPriceChange = (packageId: string, value: string, skipInvoiceSync: boolean = false) => {
        setTierPrices(prev => ({ ...prev, [packageId]: value }));
        if (!skipInvoiceSync) {
            setTimeout(() => {
                setBundleInvoices(prev => {
                    const currentInvoice = prev[packageId] || { ...defaultInvoiceData };
                    return { ...prev, [packageId]: { ...currentInvoice, finalSellingPrice: value, discountedPrice: value } };
                });
            }, 0);
        }
    };

    const handleInvoiceChange = (packageId: string, field: keyof InvoiceData, value: string) => {
        setBundleInvoices(prev => {
            const currentInvoice = { ...(prev[packageId] || defaultInvoiceData) };
            (currentInvoice as any)[field] = value;
            
            if (['invitationDesignSuite', 'rsvpManagementTracking', 'guestDashboard'].includes(field)) {
                const total = (parseFloat(currentInvoice.invitationDesignSuite) || 0) + 
                              (parseFloat(currentInvoice.rsvpManagementTracking) || 0) + 
                              (parseFloat(currentInvoice.guestDashboard) || 0);
                currentInvoice.totalWeddingSuiteValue = String(total);
                
                const discPercent = parseFloat(currentInvoice.discount) || 0;
                if (discPercent > 0) {
                    const discounted = total - (total * (discPercent / 100));
                    currentInvoice.discountedPrice = String(Math.round(discounted));
                    currentInvoice.finalSellingPrice = String(Math.round(discounted));
                    handleTierPriceChange(packageId, currentInvoice.finalSellingPrice, true);
                } else {
                    currentInvoice.discountedPrice = String(total);
                    currentInvoice.finalSellingPrice = String(total);
                    handleTierPriceChange(packageId, String(total), true);
                }
            } else if (field === 'discount') {
                const total = parseFloat(currentInvoice.totalWeddingSuiteValue) || 0;
                const discPercent = parseFloat(value) || 0;
                const discounted = total - (total * (discPercent / 100));
                currentInvoice.discountedPrice = String(Math.round(discounted));
                currentInvoice.finalSellingPrice = String(Math.round(discounted));
                handleTierPriceChange(packageId, currentInvoice.finalSellingPrice, true);
            } else if (field === 'discountedPrice') {
                currentInvoice.finalSellingPrice = value;
                handleTierPriceChange(packageId, value, true);
            }

            return { ...prev, [packageId]: currentInvoice };
        });
    };

    const toggleInvoiceExpand = (packageId: string) => setExpandedInvoices(prev => ({ ...prev, [packageId]: !prev[packageId] }));
    const handlePackageDisplayChange = (packageId: string, isDisplay: boolean) => setPackageDisplayConfig(prev => ({ ...prev, [packageId]: isDisplay }));

    const removeBundleItem = (id: string) => setBundleItemsList(prev => prev.filter(item => item.id !== id));

    const saveTemplate = async () => {
        setIsSaving(true);
        try {
            const templateUrl = bundleItemsList[activeTemplateIndex]?.templatePath;
            const res = await fetch('/api/admin/bundles/template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ templateUrl: templateUrl, htmlContent })
            });
            if (res.ok) alert('Template saved!');
            else alert('Failed to save template');
        } catch (e) {
            console.error(e);
            alert('Error saving template');
        } finally {
            setIsSaving(false);
        }
    };

    const saveBundle = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('BundleName', name);
            formData.append('price', price || "0");
            formData.append('bundleDescription', description);
            formData.append('isActive', String(isActive));
            formData.append('isPopular', String(isPopular));
            formData.append('themeId', themeId);
            formData.append('tierPrices', JSON.stringify(tierPrices));
            formData.append('packageDisplayOptions', JSON.stringify(packageDisplayConfig));
            formData.append('bundleInvoices', JSON.stringify(bundleInvoices));
            
            const currentUserName = typeof window !== 'undefined' ? (localStorage.getItem('adminUserName') || 'Admin User') : 'Admin User';
            formData.append('userName', currentUserName);

            const structuredItems = bundleItemsList.map((item: any) => ({
                id: item.id,
                eventId: item.eventId,
                eventType: item.eventType,
                templateName: item.templateName,
                existingUrl: !item.file ? item.previewUrl : null
            }));
            formData.append('bundleItemsMeta', JSON.stringify(structuredItems));

            bundleItemsList.forEach(item => {
                if (item.file) formData.append(`newBundleItem_${item.id}`, item.file);
            });

            const isNew = bundleId === 'new';
            const url = isNew ? '/api/admin/bundles' : `/api/admin/bundles/${bundleId}`;
            const method = isNew ? 'POST' : 'PUT';

            const response = await fetch(url, { method, body: formData });
            if (response.ok) router.push('/admin/bundles');
            else alert('Failed to save bundle details');
        } catch (error) {
            console.error(error);
            alert('Error saving bundle details');
        } finally {
            setIsSaving(false);
        }
    };

    const handleHtmlChange = (newHtml: string) => setHtmlContent(newHtml);

    const updateVisualStyles = (newPt: number, newPb: number, newPs: number, newGap: number, newBg: string) => {
        let updatedHtml = htmlContent;
        updatedHtml = updatedHtml.replace(/(\.invitation-wrapper\s*\{[^}]*background-image:\s*url\(')[^']+('\))/i, `$1${newBg}$2`);
        updatedHtml = updatedHtml.replace(/(\.content-safe-area\s*\{[^}]*padding-top:\s*)\d+(\.\d+)?%/i, `$1${newPt}%`);
        updatedHtml = updatedHtml.replace(/(\.content-safe-area\s*\{[^}]*padding-bottom:\s*)\d+(\.\d+)?%/i, `$1${newPb}%`);
        updatedHtml = updatedHtml.replace(/(\.content-safe-area\s*\{[^}]*padding-left:\s*)\d+(\.\d+)?%/i, `$1${newPs}%`);
        updatedHtml = updatedHtml.replace(/(\.content-safe-area\s*\{[^}]*padding-right:\s*)\d+(\.\d+)?%/i, `$1${newPs}%`);
        updatedHtml = updatedHtml.replace(/(\.content-safe-area\s*\{[^}]*gap:\s*)\d+(\.\d+)?cqi/i, `$1${newGap}cqi`);
        setHtmlContent(updatedHtml);
    };

    const handlePaddingTopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setPaddingTop(val);
        updateVisualStyles(val, paddingBottom, paddingSide, gap, bgImage);
    };
    const handlePaddingBottomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setPaddingBottom(val);
        updateVisualStyles(paddingTop, val, paddingSide, gap, bgImage);
    };
    const handlePaddingSideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setPaddingSide(val);
        updateVisualStyles(paddingTop, paddingBottom, val, gap, bgImage);
    };
    const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setGap(val);
        updateVisualStyles(paddingTop, paddingBottom, paddingSide, val, bgImage);
    };
    const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setBgImage(val);
        updateVisualStyles(paddingTop, paddingBottom, paddingSide, gap, val);
    };

    const handleTextStyleChange = (className: string, prop: 'fontSize' | 'color' | 'fontFamily', value: string) => {
        setTextStyles(prev => {
            const next = { ...prev, [className]: { ...prev[className], [prop]: value } };
            let updatedHtml = htmlContent;
            const classRegex = new RegExp("(\\.style-" + className + "\\s*\\{)([^}]+)(\\})", "i");
            updatedHtml = updatedHtml.replace(classRegex, (match, p1, p2, p3) => {
                let updatedProps = p2;
                if (prop === 'fontSize') {
                    updatedProps = updatedProps.replace(/font-size:\s*[\d.]+cqi/i, `font-size: ${value}cqi`);
                } else if (prop === 'color') {
                    updatedProps = updatedProps.replace(/color:\s*#[a-fA-F0-9]+/i, `color: ${value}`);
                } else if (prop === 'fontFamily') {
                    if (/font-family:\s*[^;}]+;?/i.test(updatedProps)) {
                        updatedProps = updatedProps.replace(/font-family:\s*[^;}]+;?/i, `font-family: "${value}", sans-serif; `);
                    } else {
                        updatedProps = `font-family: "${value}", sans-serif; ` + updatedProps;
                    }
                }
                return `${p1}${updatedProps}${p3}`;
            });
            setHtmlContent(updatedHtml);
            return next;
        });
    };

    return (
        <div className={styles.editorContainer}>
            <div className={styles.header}>
                <button onClick={() => router.push('/admin/bundles')} className={styles.backButton}>
                    <ChevronLeft size={20} /> Back
                </button>
                <div className={styles.tabs}>
                    <button className={clsx(styles.tab, activeTab === 'details' && styles.activeTab)} onClick={() => setActiveTab('details')}>
                        <Package size={16} /> Bundle Details
                    </button>
                    <button className={clsx(styles.tab, activeTab === 'template' && styles.activeTab)} onClick={() => setActiveTab('template')}>
                        <Code size={16} /> Template Editor
                    </button>
                </div>
                <button className={styles.saveButton} onClick={activeTab === 'template' ? saveTemplate : saveBundle} disabled={isSaving}>
                    {isSaving ? <span className="animate-spin">⏳</span> : <Save size={18} />}
                    {activeTab === 'template' ? 'Save Template' : 'Save Bundle'}
                </button>
            </div>
            
            <div className={styles.mainArea}>
                <div className={styles.leftPane}>
                    {activeTab === 'details' ? (
                        <div className={styles.detailsForm}>
                            <h2 style={{marginTop: 0}}>Bundle Configuration</h2>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Bundle Name</label>
                                <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Royal Wedding" />
                            </div>
                            <div className={styles.formGroup} style={{ display: 'none' }}>
                                <label className={styles.label}>Theme Mapping</label>
                                <select className={styles.select} value={themeId} onChange={e => setThemeId(e.target.value)}>
                                    <option value="">Select a theme</option>
                                    {themes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Pricing & Invoices by Package</label>
                                <div className={styles.pricingContainer}>
                                    {packages.map(p => {
                                        const isChecked = packageDisplayConfig[p.id] === true;
                                        const isExpanded = expandedInvoices[p.id] === true;
                                        const currentInvoice = bundleInvoices[p.id] || defaultInvoiceData;
                                        return (
                                            <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                                                <div className={styles.packagePricingRow} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <label className={styles.toggle} style={{ marginBottom: 0 }}>
                                                        <input type="checkbox" className={styles.toggleInput} checked={isChecked} onChange={e => handlePackageDisplayChange(p.id, e.target.checked)} />
                                                        <span className={styles.toggleSwitch} style={{ transform: 'scale(0.8)' }}></span>
                                                    </label>
                                                    <span className={styles.packageName} style={{ flex: 1, cursor: 'pointer' }} onClick={() => isChecked && toggleInvoiceExpand(p.id)}>{p.name}</span>
                                                    <div className={styles.priceInputWrapper}>
                                                        <span className={styles.currencyPrefix}>₹</span>
                                                        <input type="text" className={styles.input} style={{ paddingLeft: '1.8rem' }} placeholder={String(p.price)} value={tierPrices[p.id] || tierPrices[p.name] || ''} onChange={e => handleTierPriceChange(p.id, e.target.value)} />
                                                    </div>
                                                    <button type="button" style={{ background: 'transparent', border: 'none', cursor: isChecked ? 'pointer' : 'not-allowed', color: isChecked ? '#E1A639' : '#cbd5e1' }} onClick={() => isChecked && toggleInvoiceExpand(p.id)} disabled={!isChecked}>
                                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </button>
                                                </div>
                                                {isChecked && isExpanded && (
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', marginLeft: '3rem' }}>
                                                        <div style={{ gridColumn: 'span 2', fontWeight: 600, color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Invoice Breakdown for {p.name}</div>
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
                                                                    <input type={readOnly ? "text" : "number"} step="any" className={styles.input} style={{ paddingLeft: '1.8rem', backgroundColor: readOnly ? '#f1f5f9' : '#fff' }} value={(currentInvoice as any)[key] || ''} onChange={e => handleInvoiceChange(p.id, key as keyof InvoiceData, e.target.value)} readOnly={readOnly} />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Bundle Description</label>
                                <textarea className={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} rows={4} />
                            </div>

                            <div className={styles.formGroup} style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', marginTop: '1rem' }}>
                                <label style={{ fontSize: '1rem', fontWeight: 600 }}>Bundle Items Configuration</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end', marginBottom: '1.5rem', background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Event Type</label>
                                        <select className={styles.select} value={activeEventType} onChange={e => setActiveEventType(e.target.value)}>
                                            {allEvents.map(e => <option key={e.id} value={e.id}>{e.eventName}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Template File</label>
                                        <input ref={templateFileRef} type="file" style={{ display: 'none' }} onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const previewUrl = URL.createObjectURL(file);
                                                const selectedEvent = allEvents.find(ev => ev.id === activeEventType);
                                                const eventName = selectedEvent ? selectedEvent.eventName : 'Unknown';
                                                setBundleItemsList(prev => [...prev, { id: Math.random().toString(), eventType: eventName, eventId: activeEventType, templateName: eventName, file, previewUrl }]);
                                                if (templateFileRef.current) templateFileRef.current.value = '';
                                            }
                                        }} />
                                        <button type="button" className={styles.btnBlack} onClick={() => templateFileRef.current?.click()} style={{ width: '100%', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <Upload size={18} /> Upload Template
                                        </button>
                                    </div>
                                </div>
                                {bundleItemsList.length > 0 && (
                                    <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse', border: '1px solid #eee' }}>
                                        <thead style={{ background: '#f9fafb', textAlign: 'left' }}>
                                            <tr>
                                                <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Event Type</th>
                                                <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Template File</th>
                                                <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee', width: '50px' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bundleItemsList.map(item => (
                                                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '0.75rem' }}>{item.eventType}</td>
                                                    <td style={{ padding: '0.75rem', color: '#4b5563', fontStyle: 'italic', fontSize: '0.8rem' }}>{item.file ? item.file.name : (item.previewUrl ? item.previewUrl.split('/').pop() : 'Uploaded')}</td>
                                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                        <button type="button" onClick={() => removeBundleItem(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" className={styles.toggleInput} checked={isActive} onChange={e => setIsActive(e.target.checked)} /> Active</label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" className={styles.toggleInput} checked={isPopular} onChange={e => setIsPopular(e.target.checked)} /> Popular</label>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.templateEditor}>
                            <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', flexShrink: 0 }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Select Event Template to Edit</label>
                                <select className={styles.select} value={activeTemplateIndex} onChange={e => setActiveTemplateIndex(Number(e.target.value))}>
                                    {bundleItemsList.length === 0 && <option value={-1}>No templates uploaded</option>}
                                    {bundleItemsList.map((item, idx) => (
                                        <option key={item.id || idx} value={idx}>
                                            {item.event?.eventName || item.eventType} - {item.templateName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {bundleItemsList.length > 0 && htmlContent && (
                                <>
                                    <div className={styles.editorSection}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', marginBottom: '1rem' }}>Template Preview Data</h3>
                                        {Object.entries(previewData).map(([key, value]) => (
                                            <div key={key} className={styles.formGroup}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{key.replace('_', '')}</label>
                                                <input type="text" className={styles.input} value={value} onChange={e => setPreviewData(prev => ({ ...prev, [key]: e.target.value }))} />
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.editorSection}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', marginBottom: '1rem' }}>Layout Adjustments</h3>
                                        <div className={styles.sliderGroup}><label>Top Padding ({paddingTop}%)</label><input type="range" min="0" max="100" value={paddingTop} onChange={handlePaddingTopChange} /></div>
                                        <div className={styles.sliderGroup}><label>Bottom Padding ({paddingBottom}%)</label><input type="range" min="0" max="100" value={paddingBottom} onChange={handlePaddingBottomChange} /></div>
                                        <div className={styles.sliderGroup}><label>Side Padding ({paddingSide}%)</label><input type="range" min="0" max="100" value={paddingSide} onChange={handlePaddingSideChange} /></div>
                                        <div className={styles.sliderGroup}><label>Spacing Size Base ({gap}cqi)</label><input type="range" min="0" max="10" step="0.5" value={gap} onChange={handleGapChange} /></div>
                                        <div className={styles.formGroup}><label>Background Image URL</label><input type="text" className={styles.input} value={bgImage} onChange={handleBgChange} /></div>
                                    </div>

                                    {Object.keys(textStyles).length > 0 && (
                                        <div className={styles.editorSection}>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', marginBottom: '1rem' }}>Text Styles</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                                {Object.entries(textStyles).map(([className, styleObj]) => (
                                                    <div key={className} style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #eee' }}>
                                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', textTransform: 'capitalize', color: '#111827' }}>{className.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                                        <div className={styles.formGroup} style={{ marginBottom: '0.5rem' }}>
                                                            <label style={{ fontSize: '0.75rem' }}>Font Family</label>
                                                            <input type="text" className={styles.input} value={styleObj.fontFamily} onChange={e => handleTextStyleChange(className, 'fontFamily', e.target.value)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', height: '32px' }} />
                                                        </div>
                                                        <div className={styles.sliderGroup} style={{ marginBottom: '0.5rem' }}>
                                                            <label style={{ fontSize: '0.75rem' }}>Font Size ({styleObj.fontSize}cqi)</label>
                                                            <input type="range" min="1" max="30" step="0.1" value={parseFloat(styleObj.fontSize) || 5} onChange={e => handleTextStyleChange(className, 'fontSize', e.target.value)} />
                                                        </div>
                                                        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                                            <label style={{ fontSize: '0.75rem' }}>Color</label>
                                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                                <input type="color" value={styleObj.color} onChange={e => handleTextStyleChange(className, 'color', e.target.value)} style={{ width: '40px', height: '30px', padding: '0', border: 'none', cursor: 'pointer', borderRadius: '4px' }} />
                                                                <input type="text" className={styles.input} value={styleObj.color} onChange={e => handleTextStyleChange(className, 'color', e.target.value)} style={{ flex: 1, fontFamily: 'monospace' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.editorSection}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', marginBottom: '1rem' }}>Token Mapping Reference</h3>
                                        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse', border: '1px solid #eee' }}>
                                            <thead style={{ background: '#f9fafb', textAlign: 'left' }}>
                                                <tr>
                                                    <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Token</th>
                                                    <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Preview Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(previewData).map(([key, value]) => (
                                                    <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
                                                        <td style={{ padding: '0.75rem', color: '#4f46e5', fontFamily: 'monospace' }}>{`{{${key}}}`}</td>
                                                        <td style={{ padding: '0.75rem', color: '#4b5563' }}>{value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className={styles.editorSection}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Raw HTML / CSS</h3>
                                        <textarea className={styles.htmlTextarea} value={htmlContent} onChange={e => handleHtmlChange(e.target.value)} />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
                
                {activeTab === 'template' && (
                    <div className={styles.rightPane}>
                        <div className={styles.previewFrame}>
                            {htmlContent ? <iframe srcDoc={previewHtml} title="Template Preview" style={{ width: '100%', height: '100%', border: 'none' }} /> : <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Select a template to preview</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
