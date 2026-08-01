'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Code, Save, ChevronLeft, Image as ImageIcon, CheckCircle, Upload, Plus, ChevronUp, ChevronDown, X, AlertCircle, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './BundleEditor.module.css';
import { InvitationCard, InvitationCardRef } from '@/components/preview/InvitationCard';
import previewStyles from '@/components/preview/Preview.module.css';
import { Bold, AlignLeft, AlignCenter, AlignRight, AlignJustify, Trash2, Palette, Square, Type, Sticker, MapPin, Maximize, Edit } from 'lucide-react';
import { TemplateDesigner, SavedTemplate } from '@/components/admin/TemplateDesigner';

/** Bundle items whose templatePath uses this marker are structured (CardDocument) templates, not HTML files. */
const STRUCTURED_PREFIX = 'structured:';
const isStructuredPath = (p?: string | null): boolean => typeof p === 'string' && p.startsWith(STRUCTURED_PREFIX);
const structuredIdOf = (p?: string | null): string => (p || '').slice(STRUCTURED_PREFIX.length);

interface StructuredTemplate { id: string; name: string; eventType?: string; status: string; }

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

    // Structured (image + zones) templates that can be attached to a bundle item.
    const [structuredTemplates, setStructuredTemplates] = useState<StructuredTemplate[]>([]);
    const [designerOpen, setDesignerOpen] = useState(false);
    const [designerTemplateId, setDesignerTemplateId] = useState<string | null>(null); // template being edited (null = brand new)
    const [designerItemId, setDesignerItemId] = useState<string | null>(null); // bundle-item row being edited (null = will attach a new row)
    const [designerEventId, setDesignerEventId] = useState<string>(''); // event to attach a freshly-designed template to

    const loadStructuredTemplates = async () => {
        try {
            const r = await fetch('/api/admin/templates');
            const d = await r.json();
            setStructuredTemplates(d.templates || []);
        } catch { /* non-fatal: attach dropdown just stays empty */ }
    };
    useEffect(() => { loadStructuredTemplates(); }, []);

    const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
    const [htmlContent, setHtmlContent] = useState('');
    const [paddingTop, setPaddingTop] = useState(0);
    const [paddingBottom, setPaddingBottom] = useState(0);
    const [paddingSide, setPaddingSide] = useState(0);
    const [gap, setGap] = useState(0);
    const [bgImage, setBgImage] = useState('');
    const [textStyles, setTextStyles] = useState<Record<string, { fontSize: string, color: string, fontFamily: string }>>({});
    const [activeSelection, setActiveSelection] = useState<any | null>(null);
    const [srcDoc, setSrcDoc] = useState('');
    const cardRef = useRef<InvitationCardRef>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isQrPopoverOpen, setIsQrPopoverOpen] = useState(false);
    const [qrLink, setQrLink] = useState('');
    const [qrTitle, setQrTitle] = useState('SCAN FOR LOCATION');

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
        } else if (bundleId && bundleId.startsWith('new-')) {
            const extractedThemeId = bundleId.replace('new-', '');
            setThemeId(extractedThemeId);
            const matchingTheme = themes.find(t => t.id === extractedThemeId);
            if (matchingTheme) {
                setName(matchingTheme.name);
            }
        }
        if (allEvents.length > 0) setActiveEventType(allEvents[0].id);
    }, [initialData, allEvents, bundleId, themes]);
    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data?.type === 'SELECTION_CHANGED') {
                setActiveSelection(e.data.payload);
            } else if (e.data?.type === 'SELECTION_CLEARED') {
                setActiveSelection(null);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);
    useEffect(() => {
        if (activeTab === 'template' && bundleItemsList[activeTemplateIndex]) {
            const templateUrl = bundleItemsList[activeTemplateIndex]?.templatePath;
            if (templateUrl && !isStructuredPath(templateUrl)) {
                fetch(templateUrl + '?t=' + Date.now())
                    .then(res => res.text())
                    .then(html => {
                        setHtmlContent(html);
                        setSrcDoc(html);
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

    // ---- structured template attach / design ----
    const eventNameOf = (eventId: string) => allEvents.find(ev => ev.id === eventId)?.eventName || 'Unknown';

    // Attach an already-built structured template to the currently selected event type.
    const attachStructuredTemplate = (templateId: string) => {
        const tpl = structuredTemplates.find(t => t.id === templateId);
        if (!tpl) return;
        const marker = STRUCTURED_PREFIX + tpl.id;
        setBundleItemsList(prev => [...prev, {
            id: Math.random().toString(),
            eventType: eventNameOf(activeEventType),
            eventId: activeEventType,
            templateName: tpl.name,
            file: null,
            previewUrl: marker,
            templatePath: marker,
        }]);
    };

    // Open the designer to build a brand-new template, then attach it to the selected event type on save.
    const openDesignerForNew = () => {
        setDesignerTemplateId(null);
        setDesignerItemId(null);
        setDesignerEventId(activeEventType);
        setDesignerOpen(true);
    };

    // Open the designer to edit the structured template behind an existing bundle-item row.
    const openDesignerForItem = (item: any) => {
        setDesignerTemplateId(structuredIdOf(item.templatePath || item.previewUrl));
        setDesignerItemId(item.id);
        setDesignerEventId(item.eventId);
        setDesignerOpen(true);
    };

    const closeDesigner = () => setDesignerOpen(false);

    const handleDesignerSaved = (tpl: SavedTemplate) => {
        loadStructuredTemplates();
        const marker = STRUCTURED_PREFIX + tpl.id;
        setBundleItemsList(prev => {
            if (designerItemId) {
                // Editing an existing row: refresh its name/marker in place.
                return prev.map(it => it.id === designerItemId
                    ? { ...it, templateName: tpl.name, previewUrl: marker, templatePath: marker }
                    : it);
            }
            // Brand-new template: attach it as a new row for the captured event type.
            return [...prev, {
                id: Math.random().toString(),
                eventType: eventNameOf(designerEventId),
                eventId: designerEventId,
                templateName: tpl.name,
                file: null,
                previewUrl: marker,
                templatePath: marker,
            }];
        });
        setDesignerOpen(false);
    };

    // HTML-only items, paired with their real index in bundleItemsList (for the HTML Template Editor tab).
    const htmlItemsIndexed = bundleItemsList
        .map((it, idx) => ({ it, idx }))
        .filter(({ it }) => !isStructuredPath(it.templatePath || it.previewUrl));

    const saveTemplate = async () => {
        setIsSaving(true);
        try {
            let finalHtml = htmlContent;
            if (cardRef.current && (cardRef.current as any).getSerializedHtml) {
                const serialized = (cardRef.current as any).getSerializedHtml();
                if (serialized) {
                    finalHtml = serialized;
                    setHtmlContent(finalHtml);
                }
            }
            const templateUrl = bundleItemsList[activeTemplateIndex]?.templatePath;
            const res = await fetch('/api/admin/bundles/template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ templateUrl: templateUrl, htmlContent: finalHtml })
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

    const handleFormat = (payload: any) => {
        if (cardRef.current && cardRef.current.sendMessage) {
            cardRef.current.sendMessage({ type: 'FORMAT_TEXT', payload });
            
            // Optimistically update local selection state
            if (activeSelection) {
                setActiveSelection((prev: any) => prev ? { ...prev, ...payload } : null);
            }
        }
    };

    const syncVisualToCode = () => {
        if (cardRef.current && (cardRef.current as any).getSerializedHtml) {
            const serialized = (cardRef.current as any).getSerializedHtml();
            if (serialized) {
                setHtmlContent(serialized);
                alert('Synced visual edits back into the HTML code editor!');
            }
        }
    };

    const syncCodeToVisual = () => {
        setSrcDoc(htmlContent);
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

            const isNew = bundleId === 'new' || bundleId.startsWith('new-');
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

                                {/* Structured (image + zones) template: attach an existing one, or design a fresh one inline. */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end', marginBottom: '1.5rem', background: '#fbf7ec', border: '1px solid #f0e6c8', padding: '1rem', borderRadius: '8px' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                                            Or attach a designed template <span style={{ color: '#9a8033', fontWeight: 500 }}>(image + text zones)</span>
                                        </label>
                                        <select
                                            className={styles.select}
                                            value=""
                                            onChange={e => { if (e.target.value) attachStructuredTemplate(e.target.value); }}
                                        >
                                            <option value="">
                                                {structuredTemplates.length ? 'Select a designed template…' : 'No designed templates yet — use Design new →'}
                                            </option>
                                            {structuredTemplates.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}{t.eventType ? ` · ${t.eventType}` : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={openDesignerForNew}
                                        style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--primary,#c8a951)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, padding: '0 1.25rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                    >
                                        <Sparkles size={18} /> Design new
                                    </button>
                                </div>

                                {bundleItemsList.length > 0 && (
                                    <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse', border: '1px solid #eee' }}>
                                        <thead style={{ background: '#f9fafb', textAlign: 'left' }}>
                                            <tr>
                                                <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Event Type</th>
                                                <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee', width: '90px' }}>Type</th>
                                                <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Template</th>
                                                <th style={{ padding: '0.75rem', borderBottom: '1px solid #eee', width: '90px' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bundleItemsList.map(item => {
                                                const structured = isStructuredPath(item.templatePath || item.previewUrl);
                                                return (
                                                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                                        <td style={{ padding: '0.75rem' }}>{item.eventType}</td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <span style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.02em', padding: '2px 8px', borderRadius: '999px', background: structured ? '#f3eeda' : '#eef2ff', color: structured ? '#8a6d1f' : '#4338ca' }}>
                                                                {structured ? 'Designed' : 'HTML'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '0.75rem', color: '#4b5563', fontStyle: structured ? 'normal' : 'italic', fontSize: '0.8rem' }}>
                                                            {structured
                                                                ? (item.templateName || 'Designed template')
                                                                : (item.file ? item.file.name : (item.previewUrl ? item.previewUrl.split('/').pop() : 'Uploaded'))}
                                                        </td>
                                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                                {structured && (
                                                                    <button type="button" onClick={() => openDesignerForItem(item)} title="Edit designed template" style={{ color: '#8a6d1f', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Edit size={16} /></button>
                                                                )}
                                                                <button type="button" onClick={() => removeBundleItem(item.id)} title="Remove from bundle" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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
                                    {htmlItemsIndexed.length === 0 && <option value={-1}>No HTML templates uploaded</option>}
                                    {htmlItemsIndexed.map(({ it, idx }) => (
                                        <option key={it.id || idx} value={idx}>
                                            {it.event?.eventName || it.eventType} - {it.templateName}
                                        </option>
                                    ))}
                                </select>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem', marginBottom: 0 }}>
                                    Designed (image + zones) templates are edited from the <strong>Bundle Details</strong> tab.
                                </p>
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Raw HTML / CSS</h3>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button 
                                                    type="button" 
                                                    onClick={syncCodeToVisual} 
                                                    style={{ background: '#4F46E5', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                                                >
                                                    Sync Code to Preview
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={syncVisualToCode} 
                                                    style={{ background: '#10B981', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                                                >
                                                    Sync Visual Edits to Code
                                                </button>
                                            </div>
                                        </div>
                                        <textarea className={styles.htmlTextarea} value={htmlContent} onChange={e => handleHtmlChange(e.target.value)} />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
                
                {activeTab === 'template' && (
                    <div className={styles.rightPane} style={{ width: '500px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', alignItems: 'center', justifyContent: 'flex-start', overflowY: 'auto' }}>
                        {isQrPopoverOpen && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '1rem' }}>
                                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)' }}>Configure Location QR</h3>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Google Maps Link</label>
                                    <input type="text" className={styles.input} value={qrLink} onChange={e => setQrLink(e.target.value)} placeholder="https://maps.google.com/..." />
                                </div>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Label Text</label>
                                    <input type="text" className={styles.input} value={qrTitle} onChange={e => setQrTitle(e.target.value)} placeholder="SCAN FOR LOCATION" />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
                                    <button type="button" className={styles.btnBlack} style={{ flex: 1, height: '40px' }} onClick={() => {
                                        cardRef.current?.sendMessage({ type: 'ADD_QR', payload: { link: qrLink, title: qrTitle } });
                                        setIsQrPopoverOpen(false);
                                    }}>Add QR Code</button>
                                    <button type="button" style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: '6px', height: '40px', background: 'transparent', cursor: 'pointer' }} onClick={() => setIsQrPopoverOpen(false)}>Cancel</button>
                                </div>
                            </div>
                        )}

                        {/* Top Toolbar (Edit Mode) */}
                        {activeSelection && (
                            <div className={previewStyles.topToolbar} style={{ position: 'relative', left: '0', transform: 'none', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', boxShadow: 'none', zIndex: 10 }}>
                                <button type="button" className={previewStyles.toolbarBtn} onClick={() => handleFormat({ edit: true })}>
                                    <Edit size={20} />
                                    <span>Edit</span>
                                </button>
                                
                                <div style={{ position: 'relative' }}>
                                    <button type="button" className={previewStyles.toolbarBtn} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <span style={{ fontSize: '16px', fontFamily: 'serif', fontStyle: 'italic', lineHeight: 1 }}>Style</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <span>Font</span>
                                            <ChevronDown size={14} />
                                        </div>
                                    </button>
                                    <select 
                                        value={activeSelection?.fontFamily || 'inherit'}
                                        onChange={(e) => handleFormat({ fontFamily: e.target.value })}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    >
                                        <option value="inherit">Default</option>
                                        <option value="Arial, sans-serif">Arial</option>
                                        <option value="'Times New Roman', serif">Times New Roman</option>
                                        <option value="'Courier New', monospace">Courier</option>
                                        <option value="Georgia, serif">Georgia</option>
                                        <option value="'Trebuchet MS', sans-serif">Trebuchet</option>
                                        <option value="Verdana, sans-serif">Verdana</option>
                                    </select>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <button type="button" className={previewStyles.toolbarBtn} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontSize: '16px', fontWeight: 600, lineHeight: 1 }}>A+</span>
                                        <span>Resize</span>
                                    </button>
                                    <select
                                        value={activeSelection?.fontSize || ''}
                                        onChange={(e) => handleFormat({ fontSize: e.target.value })}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    >
                                        <option value="">Default</option>
                                        <option value="12px">12px</option>
                                        <option value="14px">14px</option>
                                        <option value="16px">16px</option>
                                        <option value="18px">18px</option>
                                        <option value="20px">20px</option>
                                        <option value="24px">24px</option>
                                        <option value="28px">28px</option>
                                        <option value="32px">32px</option>
                                        <option value="36px">36px</option>
                                        <option value="48px">48px</option>
                                        <option value="64px">64px</option>
                                    </select>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <button type="button" className={previewStyles.toolbarBtn} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Maximize size={20} />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <span>Box Resize</span>
                                            <ChevronDown size={14} />
                                        </div>
                                    </button>
                                    <select
                                        defaultValue=""
                                        onChange={(e) => { if (e.target.value) handleFormat({ boxWidth: e.target.value }); }}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    >
                                        <option value="">Width…</option>
                                        <option value="fit">Fit content</option>
                                        <option value="40%">Narrow (40%)</option>
                                        <option value="60%">Medium (60%)</option>
                                        <option value="80%">Wide (80%)</option>
                                        <option value="100%">Full (100%)</option>
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    className={previewStyles.toolbarBtn}
                                    onClick={() => handleFormat({ delete: true })}
                                    title={activeSelection?.isCustom ? 'Delete this element' : 'Only elements you added can be deleted'}
                                    style={{ opacity: activeSelection?.isCustom ? 1 : 0.4, pointerEvents: activeSelection?.isCustom ? 'auto' : 'none' }}
                                >
                                    <Trash2 size={20} />
                                    <span>Delete</span>
                                </button>

                                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} className={previewStyles.toolbarBtn}>
                                    <Palette size={20} />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        <span>Color</span>
                                        <ChevronDown size={14} />
                                    </div>
                                    <input 
                                        type="color" 
                                        value={activeSelection?.color || '#000000'}
                                        onChange={(e) => handleFormat({ color: e.target.value })}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    />
                                </div>

                                <button 
                                    type="button"
                                    className={previewStyles.toolbarBtn} 
                                    onClick={() => handleFormat({ fontWeight: activeSelection?.fontWeight === 'bold' ? 'normal' : 'bold' })} 
                                    style={{ 
                                        background: activeSelection?.fontWeight === 'bold' ? '#FEF3C7' : 'transparent',
                                        color: activeSelection?.fontWeight === 'bold' ? '#D97706' : '#6B7280',
                                    }}
                                >
                                    <Bold size={20} />
                                    <span>Bold</span>
                                </button>

                                <div style={{ position: 'relative' }}>
                                    <button type="button" className={previewStyles.toolbarBtn} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <AlignJustify size={20} />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <span>Format</span>
                                            <ChevronDown size={14} />
                                        </div>
                                    </button>
                                    <select
                                        value={activeSelection?.align || 'center'}
                                        onChange={(e) => handleFormat({ align: e.target.value })}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    >
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                        <option value="justify">Justify</option>
                                    </select>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <button type="button" className={previewStyles.toolbarBtn} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Square size={20} />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <span>Border</span>
                                            <ChevronDown size={14} />
                                        </div>
                                    </button>
                                    <select
                                        defaultValue=""
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (v === 'none') handleFormat({ border: 'none', borderRadius: '0px' });
                                            else if (v === 'thin') handleFormat({ border: '1px solid currentColor' });
                                            else if (v === 'medium') handleFormat({ border: '2px solid currentColor' });
                                            else if (v === 'thick') handleFormat({ border: '4px solid currentColor' });
                                            else if (v === 'rounded') handleFormat({ border: '2px solid currentColor', borderRadius: '12px' });
                                        }}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    >
                                        <option value="">Border…</option>
                                        <option value="none">None</option>
                                        <option value="thin">Thin</option>
                                        <option value="medium">Medium</option>
                                        <option value="thick">Thick</option>
                                        <option value="rounded">Rounded</option>
                                    </select>
                                </div>

                                <button 
                                    type="button"
                                    className={previewStyles.toolbarBtn} 
                                    onClick={() => handleFormat({ textTransform: activeSelection?.textTransform === 'uppercase' ? 'none' : 'uppercase' })} 
                                    style={{ 
                                        background: activeSelection?.textTransform === 'uppercase' ? '#F3F4F6' : 'transparent',
                                    }}
                                >
                                    <span style={{ fontSize: '16px', fontWeight: 600, lineHeight: 1 }}>Aa</span>
                                    <span>CAPITAL</span>
                                </button>
                            </div>
                        )}

                        <div className={styles.previewFrame} style={{ height: '580px', width: '320px', flexShrink: 0 }}>
                            {htmlContent ? (
                                <InvitationCard
                                    ref={cardRef}
                                    event={{
                                        id: activeTemplateIndex.toString(),
                                        name: bundleItemsList[activeTemplateIndex]?.eventType || 'Invitation',
                                        date: previewData.event_date,
                                        time: previewData.event_time,
                                        venue: previewData.event_venue,
                                        heading: previewData.heading,
                                        tagline: previewData.subheading
                                    } as any}
                                    theme={{ id: themeId } as any}
                                    groomName={previewData.groom_name}
                                    brideName={previewData.bride_name}
                                    groomParents={previewData.groom_parents}
                                    brideParents={previewData.bride_parents}
                                    welcomeMessage={previewData.heading}
                                    isPlaceholder={true}
                                    type="image"
                                    customImage={bundleItemsList[activeTemplateIndex]?.templatePath}
                                    srcDoc={srcDoc}
                                    showSizingBoxes={true}
                                />
                            ) : (
                                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Select a template to preview</div>
                            )}
                        </div>

                        {/* Bottom Actions Toolbar */}
                        {htmlContent && (
                            <div className={previewStyles.bottomToolbar} style={{ position: 'relative', left: '0', transform: 'none', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%', display: 'flex', justifyContent: 'center', gap: '16px', boxShadow: 'none', zIndex: 10, padding: '4px' }}>
                                <button type="button" className={previewStyles.toolbarBtn} onClick={() => cardRef.current?.sendMessage({ type: 'ADD_TEXT' })}>
                                    <Type size={20} />
                                    <span>Add Text</span>
                                </button>
                                <button type="button" className={previewStyles.toolbarBtn} onClick={() => cardRef.current?.sendMessage({ type: 'ADD_STICKER', payload: { emoji: '❤️' } })}>
                                    <Sticker size={20} />
                                    <span>Sticker</span>
                                </button>
                                <button type="button" className={previewStyles.toolbarBtn} onClick={() => setIsQrPopoverOpen(true)}>
                                    <MapPin size={20} />
                                    <span>QR Map</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {designerOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(20,18,14,0.55)', display: 'flex' }}>
                    <div style={{ margin: 'auto', width: '96vw', height: '94vh', maxWidth: 1400, background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
                        <TemplateDesigner
                            templateId={designerTemplateId}
                            defaultEventType={eventNameOf(designerEventId)}
                            onSaved={handleDesignerSaved}
                            onClose={closeDesigner}
                            embedded
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
