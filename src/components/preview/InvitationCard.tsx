'use client';

import { WeddingEvent } from '@/lib/schemas/wedding-form';
import { Theme } from '@/lib/constants/themes';
import styles from './Preview.module.css';
import { Play } from 'lucide-react';
import Image from 'next/image';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import { clsx } from 'clsx';

export interface InvitationCardRef {
    saveEdits: () => Record<string, string>;
    downloadImage: () => void;
    sendMessage: (payload: any) => void;
    getSerializedHtml?: () => string;
}

interface InvitationCardProps {
    event: WeddingEvent;
    theme: Theme;
    groomName: string;
    brideName: string;
    groomParents?: string;
    brideParents?: string;
    welcomeMessage?: string;
    isPlaceholder?: boolean;
    type?: 'image' | 'video';
    customImage?: string;
    srcDoc?: string;
    onClick?: () => void;
    variant?: 'default' | 'contract' | 'save-the-date';
    className?: string; // Added className to props
    isSecured?: boolean; // Added isSecured to props
    showSizingBoxes?: boolean; // Added showSizingBoxes
    isRawPreview?: boolean; // Added to just show the HTML as is
    onLayoutMeasure?: (layout: { width: number; height: number; aspectRatio: number }) => void;
}

export const InvitationCard = forwardRef<InvitationCardRef, InvitationCardProps>(({
    event,
    theme,
    groomName,
    brideName,
    groomParents,
    brideParents,
    welcomeMessage,
    isPlaceholder,
    type,
    customImage,
    srcDoc,
    onClick,
    variant = 'default',
    className,
    isSecured = false,
    showSizingBoxes = false,
    isRawPreview = false,
    onLayoutMeasure
}, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [containerScale, setContainerScale] = useState(1);
    const [iframeHeight, setIframeHeight] = useState(889);
    const isHTMLDesign = !!srcDoc || customImage?.toLowerCase().endsWith('.html') || (customImage?.includes('item-Wedding_Invitation') && customImage.toLowerCase().includes('.html')); // Robust check
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({ width: 600, height: 800 });
    const [imageRatio, setImageRatio] = useState<number>(3/4);

    useEffect(() => {
        if (customImage && !isHTMLDesign) {
            const img = new window.Image();
            img.src = customImage;
            img.onload = () => {
                if (img.width > 0 && img.height > 0) {
                    const ratio = img.width / img.height;
                    setImageDimensions({ width: img.width, height: img.height });
                    setImageRatio(ratio);
                    
                    if (isRawPreview) {
                        onLayoutMeasure?.({
                            width: img.width,
                            height: img.height,
                            aspectRatio: ratio
                        });
                    } else {
                        onLayoutMeasure?.({
                            width: 600,
                            height: 800,
                            aspectRatio: 600 / 800
                        });
                    }
                }
            };
        } else if (!isHTMLDesign && !customImage) {
            if (!isRawPreview) {
                onLayoutMeasure?.({
                    width: 600,
                    height: 800,
                    aspectRatio: 600 / 800
                });
            }
        }
    }, [customImage, isHTMLDesign, isRawPreview, onLayoutMeasure]);

    const cacheBuster = useMemo(() => Date.now(), []);
    const iframeSrc = useMemo(() => {
        if (!customImage) return '';
        const separator = customImage.includes('?') ? '&' : '?';
        return `${customImage}${separator}cb=${cacheBuster}`;
    }, [customImage, cacheBuster]);

    const [isReady, setIsReady] = useState(false);
    const [staticQrCode, setStaticQrCode] = useState<{link: string, title: string} | null>(null);

    const hasLoadedSavedLayout = useRef(false);

    useEffect(() => {
        setIsReady(false);
        hasLoadedSavedLayout.current = false;
        
        if (!isHTMLDesign && event?.id && theme?.id) {
            const qrStorageKey = `wedding-card-qr-${event.id}-${theme.id}`;
            const savedQr = typeof window !== 'undefined' ? localStorage.getItem(qrStorageKey) : null;
            if (savedQr) {
                try {
                    setStaticQrCode(JSON.parse(savedQr));
                } catch(e) {}
            } else {
                setStaticQrCode(null);
            }
        }
    }, [iframeSrc, event?.id, isHTMLDesign, theme?.id]);

    useImperativeHandle(ref, () => ({
        saveEdits: () => {
            if (!iframeRef.current) return {};
            const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
            if (!doc) return {};
            const values: Record<string, string> = {};
            const ids = [
                'event-name', 'groom-name', 'bride-name', 
                'groom-parents', 'groom-parent-name', 'bride-parents', 'bride-parent-name',
                'event-date', 'event-time', 'event-venue', 'venue'
            ];
            ids.forEach(id => {
                const el = doc.getElementById(id);
                if (el) {
                    let val = el.innerText || '';
                    // Some browsers add trailing newlines for contenteditable
                    val = val.replace(/[\r\n]+$/, '').trim();
                    // Treat placeholder texts as empty string
                    if (id === 'groom-name' && val === 'Groom Name') val = '';
                    else if (id === 'bride-name' && val === 'Bride Name') val = '';
                    else if (id === 'event-date' && val === 'Event Date') val = '';
                    else if (id === 'event-time' && val === 'Event Time') val = '';
                    else if ((id === 'event-venue' || id === 'venue') && val === 'Event Venue') val = '';
                    values[id] = val;
                }
            });
            console.log("InvitationCard extracted edits:", values);
            return values;
        },
        downloadImage: () => {
            const executeDownload = () => {
                if (isHTMLDesign) {
                    if (!iframeRef.current) return;
                    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
                    if (!doc) return;

                    const win = iframeRef.current?.contentWindow as any;
                    if (!win || !win.html2canvas) return;

                    const wrapper = doc.querySelector('.invitation-wrapper') || 
                                  doc.querySelector('.invite-wrapper') || 
                                  doc.body.firstElementChild;
                    
                    if (!wrapper) return;

                    // Save original wrapper style to restore later
                    const originalWrapperStyle = (wrapper as HTMLElement).getAttribute('style') || '';

                    // Inject combined style: hide resize handles + override height constraints
                    const style = doc.createElement('style');
                    style.id = 'html2canvas-capture-style';
                    style.innerHTML = `
                        .sizing-box { outline: none !important; cursor: default !important; }
                        body { overflow: visible !important; width: 500px !important; min-height: 100% !important; }
                        .invitation-wrapper, .invite-wrapper { 
                            max-height: none !important; 
                            height: auto !important; 
                            aspect-ratio: auto !important;
                            overflow: visible !important;
                            background-size: 100% 100% !important; 
                            transform: none !important;
                            margin: 0 !important;
                            width: 100% !important;
                        }
                    `;
                    doc.head.appendChild(style);

                    // Temporarily remove constraints on the wrapper and set it to auto height at 500px width
                    (wrapper as HTMLElement).style.setProperty('max-width', 'none', 'important');
                    (wrapper as HTMLElement).style.setProperty('max-height', 'none', 'important');
                    (wrapper as HTMLElement).style.setProperty('width', '500px', 'important');
                    (wrapper as HTMLElement).style.setProperty('height', 'auto', 'important');

                    // Measure natural height of the template when rendering unconstrained at 500px width
                    const targetHeight = Math.max((wrapper as HTMLElement).scrollHeight, (wrapper as HTMLElement).offsetHeight, Math.round(500 * 16 / 9));

                    // Lock the wrapper styles to exactly 500px width and the measured targetHeight
                    (wrapper as HTMLElement).style.setProperty('height', `${targetHeight}px`, 'important');

                    // Temporary body styling adjustments to prevent flex layout shifts in html2canvas
                    const originalBodyStyle = doc.body.getAttribute('style') || '';
                    doc.body.style.setProperty('display', 'block', 'important');
                    doc.body.style.setProperty('margin', '0', 'important');
                    doc.body.style.setProperty('padding', '0', 'important');
                    doc.body.style.setProperty('width', '500px', 'important');
                    doc.body.style.setProperty('height', `${targetHeight}px`, 'important');

                    const elementToCapture = wrapper;

                    win.html2canvas(elementToCapture, { 
                        useCORS: true, 
                        scale: 2, 
                        width: 500,
                        height: targetHeight,
                        backgroundColor: null 
                    }).then((canvas: HTMLCanvasElement) => {
                        const link = document.createElement('a');
                        link.download = `Wedding-Invitation-Design.png`;
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                        
                        doc.body.setAttribute('style', originalBodyStyle);
                        (wrapper as HTMLElement).setAttribute('style', originalWrapperStyle);
                        if (style.parentNode) style.parentNode.removeChild(style);
                        const boxStyle = doc.head.querySelector('style:last-child');
                        if (boxStyle && boxStyle.textContent?.includes('.sizing-box')) boxStyle.parentNode?.removeChild(boxStyle);
                    }).catch((e: any) => {
                        console.error("Error capturing canvas:", e);
                        doc.body.setAttribute('style', originalBodyStyle);
                        (wrapper as HTMLElement).setAttribute('style', originalWrapperStyle);
                        if (style.parentNode) style.parentNode.removeChild(style);
                        const boxStyle = doc.head.querySelector('style:last-child');
                        if (boxStyle && boxStyle.textContent?.includes('.sizing-box')) boxStyle.parentNode?.removeChild(boxStyle);
                    });
                } else {
                    // Fallback for non-HTML designs (using html2canvas on the container div)
                    if (!containerRef.current) return;
                    
                    // We need html2canvas to be loaded in the main window
                    const mainWin = window as any;
                    const captureMainElement = () => {
                        if (!mainWin.html2canvas) return;
                        
                        mainWin.html2canvas(containerRef.current, {
                            useCORS: true,
                            scale: 2,
                            backgroundColor: null
                        }).then((canvas: HTMLCanvasElement) => {
                            const link = document.createElement('a');
                            link.download = `Wedding-Invitation-Design.png`;
                            link.href = canvas.toDataURL('image/png');
                            link.click();
                        }).catch((e: any) => {
                            console.error("Error capturing non-HTML design canvas:", e);
                        });
                    };

                    if (!mainWin.html2canvas) {
                        const script = document.createElement('script');
                        script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
                        script.onload = captureMainElement;
                        document.head.appendChild(script);
                    } else {
                        captureMainElement();
                    }
                }
            };

            if (isHTMLDesign) {
                if (!iframeRef.current) return;
                const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
                if (!doc) return;

                if (!doc.getElementById('html2canvas-script')) {
                    const script = doc.createElement('script');
                    script.id = 'html2canvas-script';
                    script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
                    script.onload = executeDownload;
                    doc.head.appendChild(script);
                } else {
                    executeDownload();
                }
            } else {
                executeDownload();
            }
        },
        sendMessage: (payload: any) => {
            if (isHTMLDesign) {
                if (iframeRef.current && iframeRef.current.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(payload, '*');
                }
            } else {
                if (payload.type === 'ADD_QR' && event?.id && theme?.id) {
                    const qrData = { link: payload.payload.link, title: payload.payload.title };
                    setStaticQrCode(qrData);
                    localStorage.setItem(`wedding-card-qr-${event.id}-${theme.id}`, JSON.stringify(qrData));
                }
            }
        },
        saveLayout: () => {
            if (!iframeRef.current) return;
            const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
            if (!doc) return;

            const storageKey = `wedding-card-edits-${event.id}-${theme.id}`;
            
            // Clone the body and strip ALL editor artifacts before saving
            const bodyClone = doc.body.cloneNode(true) as HTMLElement;
            // Remove all handle elements
            bodyClone.querySelectorAll('.resize-handle, .delete-handle, .drag-handle, .snap-guide').forEach(el => el.remove());
            // Remove editor state classes
            bodyClone.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
            bodyClone.querySelectorAll('.editing').forEach(el => {
                el.classList.remove('editing');
                el.removeAttribute('contenteditable');
            });
            // Remove the sizing-box class so handles don't re-appear until edit mode re-enables them
            bodyClone.querySelectorAll('.sizing-box').forEach(el => el.classList.remove('sizing-box'));

            localStorage.setItem(storageKey, bodyClone.innerHTML);
            console.log("Saved layout clone to localStorage under key:", storageKey);
        },
        getSerializedHtml: () => {
            if (!iframeRef.current) return '';
            const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
            if (!doc) return '';
            const clone = doc.documentElement.cloneNode(true) as HTMLElement;
            clone.querySelectorAll('.resize-handle, .delete-handle, .drag-handle, .snap-guide').forEach(el => el.remove());
            clone.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
            clone.querySelector('#runtime-preview-fix')?.remove();
            clone.querySelector('#drag-script')?.remove();
            clone.querySelector('#html2canvas-script')?.remove();
            clone.querySelector('#html2canvas-capture-style')?.remove();
            return "<!DOCTYPE html>\n" + clone.outerHTML;
        }
    }));

    const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return dateStr;
        // If it already looks formatted (contains month name), return as is
        if (/[a-zA-Z]/.test(dateStr)) return dateStr;
        
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            
            const day = getOrdinal(date.getDate());
            const month = date.toLocaleString('en-US', { month: 'long' });
            const year = date.getFullYear();
            
            return `${day} ${month} ${year}`;
        } catch (e) {
            return dateStr;
        }
    };

    const formatTime = (timeStr?: string) => {
        if (!timeStr) return timeStr;
        if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) return timeStr;
        
        try {
            const [h, m] = timeStr.split(':');
            if (h === undefined || m === undefined) return timeStr;
            
            let hours = parseInt(h);
            const minutes = m.substring(0, 2); // Handle case like "10:30:00"
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            return `${hours}:${minutes} ${ampm}`;
        } catch (e) {
            return timeStr;
        }
    };

    // Handle scaling based on container width
    useEffect(() => {
        if (!isHTMLDesign || !containerRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                if (width > 0) {
                    setContainerScale(width / 500);
                }
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        // Initial measurement
        const initialWidth = containerRef.current.getBoundingClientRect().width;
        if (initialWidth > 0) {
            setContainerScale(initialWidth / 500);
        }

        return () => observer.disconnect();
    }, [isHTMLDesign]);

    // Map user fields to HTML template IDs
    useEffect(() => {
        if (!isHTMLDesign || !iframeRef.current || isRawPreview || !event || !theme) return;

        const measureLayout = () => {
            if (!iframeRef.current) return;
            const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
            if (!doc) return;
            const wrapper = doc.getElementById('invitation-wrapper') ||
                            doc.querySelector('.invitation-wrapper') ||
                            doc.querySelector('.invite-wrapper') ||
                            doc.body?.firstElementChild;
            if (wrapper) {
                const h = (wrapper as HTMLElement).offsetHeight;
                if (h > 0 && h !== iframeHeight) {
                    setIframeHeight(h);
                    onLayoutMeasure?.({
                        width: 500,
                        height: h,
                        aspectRatio: 500 / h
                    });
                }
            }
        };

        const updateContent = () => {
            const doc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
            if (!doc || !doc.body || !doc.head) return;

            // Load saved layout from localStorage if it exists and hasn't been loaded in this render session
            const storageKey = `wedding-card-edits-${event.id}-${theme.id}`;
            const savedLayout = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
            if (savedLayout && !hasLoadedSavedLayout.current) {
                if (savedLayout.trim().length < 50) {
                    // Layout is suspiciously empty — discard it
                    console.warn("Saved layout appears empty. Discarding.");
                    localStorage.removeItem(storageKey);
                    hasLoadedSavedLayout.current = true;
                } else {
                    doc.body.innerHTML = savedLayout;
                    hasLoadedSavedLayout.current = true;
                    // Re-initialize event listeners in the editor iframe
                    const win = iframeRef.current?.contentWindow as any;
                    if (win && typeof win.initEditor === 'function') {
                        try {
                            win.initEditor();
                        } catch (e) {
                            console.error("Error re-initializing editor:", e);
                        }
                    }
                    // The saved layout already has finalized content — skip the mapping
                    // loop below so user's visual edits (positions, styles, text) are preserved.
                    return;
                }
            }

            // If a saved layout was already applied in a previous call within this session,
            // skip re-running the content mapping so user edits aren't overwritten.
            if (hasLoadedSavedLayout.current && typeof window !== 'undefined' && localStorage.getItem(storageKey)) {
                return;
            }

            const getDefaultHeading = (eName: string) => {
                const n = (eName || '').toLowerCase();
                if (n.includes('save the date') || n.includes('savethedate')) return "Save the Date";
                if (n.includes('haldi')) return "Haldi";
                if (n.includes('mehendi') || n.includes('mehndi') || n.includes('mehendhi')) return "Mehendi";
                if (n.includes('sangeet')) return "Sangeet";
                if (n.includes('wedding')) return "Wedding";
                if (n.includes('reception')) return "Reception";
                return eName || 'Wedding';
            };

            const isWedding = event.name?.toLowerCase().includes('wedding') || event.name?.toLowerCase().includes('invitation');
            const isSpecialEvent = !isWedding; // Protect all non-wedding events from tagline override fallback
            const displayEventName = event.heading || (event.name ? getDefaultHeading(event.name) : undefined);

            const fullMapping: Record<string, string | undefined> = {
                'event-name': displayEventName,
                'heading': (isSpecialEvent && !event.tagline) ? undefined : (event.tagline || 'We are pleased to invite you to the wedding of'),
                'subheading': (isSpecialEvent && !event.tagline) ? undefined : event.tagline,
                'event-subheading': (isSpecialEvent && !event.tagline) ? undefined : event.tagline,
                'groom-name': groomName || 'Groom Name',
                'bride-name': brideName || 'Bride Name',
                'groom-parents': groomParents || 'Groom Parents',
                'groom-parent-name': groomParents || 'Groom Parents',
                'bride-parents': brideParents || 'Bride Parents',
                'bride-parent-name': brideParents || 'Bride Parents',
                'event-date': formatDate(event.date) || 'Event Date',
                'event-time': formatTime(event.time) || 'Event Time',
                'event-venue': event.venue || 'Event Venue',
                'venue': event.venue || 'Event Venue',
                'ampersand': '&',
                'date_label': 'On',
                'time_label': 'At',
                'venue_label': 'Venue:'
            };

            // 1. Replace all mustache tags in text nodes globally
            const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);
            let node;
            const textNodes: Text[] = [];
            while ((node = walker.nextNode())) {
                textNodes.push(node as Text);
            }
            
            textNodes.forEach(textNode => {
                let text = textNode.nodeValue || '';
                let changed = false;
                
                Object.entries(fullMapping).forEach(([key, value]) => {
                    if (value === undefined || value === null) return;
                    const valStr = value.toString();
                    
                    const flexibleKey = key.split('-').join('[-_]+');
                    const regexFlexible = new RegExp(`\\\\{\\\\s*\\\\{\\\\s*${flexibleKey}\\\\s*\\\\}\\\\s*\\\\}`, 'gi');
                    
                    if (regexFlexible.test(text)) {
                        text = text.replace(regexFlexible, valStr);
                        changed = true;
                    }
                });

                // Clear any remaining unmapped mustache tags to clean up the UI
                const unknownRegex = /\{\s*\{\s*[a-zA-Z0-9_-]+\s*\}\s*\}/g;
                if (unknownRegex.test(text)) {
                    text = text.replace(unknownRegex, '');
                    changed = true;
                }
                
                if (changed) {
                    textNode.nodeValue = text;
                }
            });

            // 2. ID and text fallback replacements
            Object.entries(fullMapping).forEach(([id, value]) => {
                if (value === undefined || value === null) return;
                let el = doc.getElementById(id);
                
                // Fallback for uploaded templates that are missing IDs
                if (!el) {
                    const customClassMap: Record<string, string> = {
                        'event-date': 'style-date',
                        'event-time': 'style-time',
                        'event-venue': 'style-venue',
                        'event-name': 'style-eventName',
                        'bride-parents': 'style-brideParents',
                        'groom-parents': 'style-groomParents'
                    };
                    const customClass = customClassMap[id];
                    if (customClass) {
                        const matchedEl = doc.querySelector(`.${customClass}`);
                        if (matchedEl) {
                            el = matchedEl as HTMLElement;
                            el.id = id;
                        }
                    }
                    
                    if (!el) {
                        const normalizedId = id.replace(/-/g, '').toLowerCase();
                        const classesToTry = [
                            `style-${id}`, 
                            `style-${id.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}`, 
                            `style-${normalizedId}`, 
                            id,
                            normalizedId
                        ];
                        for (const cls of classesToTry) {
                            const matchedEl = doc.querySelector(`.${cls}`);
                            if (matchedEl) {
                                el = matchedEl as HTMLElement;
                                el.id = id;
                                break;
                            }
                        }
                    }

                    if (!el) {
                        const knownPlaceholders: Record<string, string[]> = {
                            'event-date': ['14th February 2026', '16th February', '15th February 2026', '14th February'],
                            'event-time': ['6:30 pm', '4:30 pm', '10:30 am', '11:30 am', '7:30 pm'],
                            'event-venue': ['The Rajputana palace, Adarsh Nagar, Rajasthan', 'The Rajputana palace, Adarsh Nagar', 'The Rajputana palace'],
                            'bride-name': ['Anjali ke haldi', 'Anjali'],
                            'groom-name': ['Rahul'],
                            'subheading': ['We are pleased to invite you to the wedding of', 'We invite you to share our joy', 'formal invite to follow'],
                            'date_label': ['On', 'on', 'ON'],
                            'time_label': ['At', 'at', 'AT'],
                            'venue_label': ['Venue:', 'venue:', 'VENUE:', 'Venue'],
                            'ampersand': ['&', 'and', 'And']
                        };
                        const textsToLookFor = knownPlaceholders[id] || [];
                        if (textsToLookFor.length > 0) {
                            const elements = Array.from(doc.querySelectorAll('div, span, p, h1, h2, h3, h4, h5, h6'));
                            for (const element of elements) {
                                const text = element.textContent?.trim();
                                if (text && textsToLookFor.includes(text)) {
                                    el = element as HTMLElement;
                                    // Assign the ID so it works next time
                                    el.id = id;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (el) {
                    let displayValue = value.toString();
                    if (!displayValue && showSizingBoxes) {
                        if (id === 'groom-name') displayValue = 'Groom Name';
                        else if (id === 'bride-name') displayValue = 'Bride Name';
                        else if (id === 'event-date') displayValue = 'Event Date';
                        else if (id === 'event-time') displayValue = 'Event Time';
                        else if (id === 'event-venue' || id === 'venue') displayValue = 'Event Venue';
                        else displayValue = `[${id.replace('-', ' ')}]`;
                    }
                    let formattedValue = displayValue.replace(/\n/g, '<br/>');
                    if (id === 'bride-name' && el.textContent?.trim() === 'Anjali ke haldi') {
                        formattedValue = formattedValue + ' ke haldi';
                        displayValue = displayValue + ' ke haldi';
                    }
                    
                    // We compare textContent to avoid false positives with HTML tags
                    const currentText = el.textContent?.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim() || '';
                    const newText = displayValue.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
                    
                    if (currentText !== newText || (!el.querySelector('.name-animate') && (id === 'groom-name' || id === 'bride-name'))) {
                        // Preserve handles if they exist inside the element
                        const handles = Array.from(el.querySelectorAll('.resize-handle, .drag-handle, .delete-handle'));
                        
                        if (id === 'groom-name' || id === 'bride-name') {
                            formattedValue = `<span class="name-animate" style="display:inline-block; position:relative; animation: fadeUpIn 220ms cubic-bezier(0.23, 1, 0.32, 1) forwards;">${formattedValue}<span class="gold-underline" style="position:absolute; bottom:0; left:0; height:1px; background:#D4AF37; width:0; opacity:0; animation: drawUnderline 350ms cubic-bezier(0.77, 0, 0.175, 1) 150ms forwards;"></span></span>`;
                        }
                        
                        el.innerHTML = formattedValue;
                        handles.forEach(h => el.appendChild(h));
                    }
                }
            });

            // 3. Global default name replacement fallback
            const finalWalker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);
            let finalNode;
            const finalNodes: Text[] = [];
            while ((finalNode = finalWalker.nextNode())) {
                finalNodes.push(finalNode as Text);
            }
            finalNodes.forEach(textNode => {
                let text = textNode.nodeValue || '';
                let changed = false;
                
                if (text.includes('Anjali')) {
                    text = text.replace(/Anjali/g, brideName || 'Bride');
                    changed = true;
                }
                if (text.includes('Rahul')) {
                    text = text.replace(/Rahul/g, groomName || 'Groom');
                    changed = true;
                }
                if (changed) {
                    textNode.nodeValue = text;
                }
            });

            // OVERRIDE: Force user input to take priority for main text elements
            const eventNameEl = doc.getElementById('event-name');
            if (eventNameEl && displayEventName !== undefined) {
                const formattedVal = displayEventName.toString().replace(/\n/g, '<br/>');
                if (eventNameEl.innerHTML !== formattedVal) {
                    const handles = Array.from(eventNameEl.querySelectorAll('.resize-handle, .drag-handle, .delete-handle'));
                    eventNameEl.innerHTML = formattedVal;
                    handles.forEach(h => eventNameEl.appendChild(h));
                }
            }


            // INJECT RUNTIME FIXES (Doesn't touch original file)
            let styleEl = doc.getElementById('runtime-preview-fix');
            if (!styleEl) {
                styleEl = doc.createElement('style');
                styleEl.id = 'runtime-preview-fix';
                doc.head.appendChild(styleEl);
            }
            
            // Fix viewport units: The templates were designed on desktop screens where 'vw' was huge.
            // Inside our 500px iframe, 'vw' causes fonts to shrink massively. Replacing 'vw' with 'vmax' 
            // forces the fonts back up, letting their 'clamp()' max values take over naturally.
            if (!doc.body.dataset.vwFixed) {
                const styleTags = doc.querySelectorAll('style:not(#runtime-preview-fix)');
                styleTags.forEach(tag => {
                    if (tag.innerHTML.includes('vw')) {
                        // Use lookahead to ensure we only replace CSS values and not base64 strings
                        tag.innerHTML = tag.innerHTML.replace(/([\d.]+)vw(?=[\s;},!)])/g, '$1vmax');
                    }
                });
                doc.body.dataset.vwFixed = "true";
            }

            styleEl.textContent = `
                html, body { 
                    margin: 0 !important; 
                    padding: 0 !important;
                }
                body {
                    background-size: cover !important;
                    background-position: center !important;
                    background-repeat: no-repeat !important;
                }
                .invitation-wrapper, .invite-wrapper {
                    max-height: none !important;
                }
                * { hyphens: none !important; -webkit-hyphens: none !important; }
                .text-overlay { padding-top: 15vh !important; }
                
                @keyframes fadeUpIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes drawUnderline {
                    from { width: 0; opacity: 0; }
                    to { width: 100%; opacity: 1; }
                }
                
                ${showSizingBoxes ? `
                 .sizing-box {
                    position: relative;
                    outline: 2px solid transparent;
                    outline-offset: 4px;
                    border-radius: 2px;
                    transition: outline 0.2s, background 0.2s;
                    cursor: pointer;
                    flex: none !important;
                    min-width: 20px;
                    min-height: 20px;
                    z-index: 10;
                    user-select: none;
                    -webkit-user-select: none;
                }
                .sizing-box.selected {
                    outline: 2px dotted #3B82F6 !important;
                    outline-offset: 4px;
                    background: rgba(59, 130, 246, 0.05);
                    cursor: move;
                    z-index: 20;
                }
                .sizing-box.editing {
                    cursor: text;
                    background: rgba(255, 255, 255, 0.9);
                    user-select: text;
                    -webkit-user-select: text;
                }

                /* Drag Handle (big, clear move affordance) */
                .drag-handle {
                    position: absolute;
                    top: -44px; left: 50%;
                    transform: translateX(-50%);
                    width: 36px; height: 36px;
                    background: #F59E0B;
                    border: 3px solid white;
                    border-radius: 50%;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    cursor: move;
                    z-index: 30;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.35);
                    touch-action: none;
                }
                .sizing-box.selected .drag-handle { display: flex; }
                .drag-handle:hover { background: #D97706; transform: translateX(-50%) scale(1.1); }
                
                /* Custom Handles */
                .resize-handle {
                    position: absolute;
                    width: 12px; height: 12px;
                    background: #3B82F6;
                    border: 2px solid white;
                    border-radius: 50%;
                    z-index: 10;
                    display: none;
                }
                .sizing-box.selected .resize-handle { display: block; }
                .resize-handle.tl { top: -6px; left: -6px; cursor: nwse-resize; }
                .resize-handle.tr { top: -6px; right: -6px; cursor: nesw-resize; }
                .resize-handle.bl { bottom: -6px; left: -6px; cursor: nesw-resize; }
                .resize-handle.br { bottom: -6px; right: -6px; cursor: nwse-resize; }

                /* Delete Handle */
                .delete-handle {
                    position: absolute;
                    top: -10px; right: -10px;
                    width: 20px; height: 20px;
                    background: #EF4444;
                    border-radius: 50%;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 11;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .sizing-box.selected .delete-handle { display: flex; }
                .delete-handle:hover {
                    background: #DC2626;
                    transform: scale(1.1);
                }

                /* Snap Guides */
                .snap-guide {
                    position: absolute;
                    background: #EF4444;
                    z-index: 5;
                    display: none;
                }
                .snap-guide.x { top: 0; bottom: 0; width: 1px; left: 50%; }
                .snap-guide.y { left: 0; right: 0; height: 1px; top: 50%; }
                .snap-guide.visible { display: block; }
                ` : ''}
            `;

            // Auto-adjust height based on content
            const wrapper = doc.querySelector('.invitation-wrapper') || 
                           doc.querySelector('.invite-wrapper') || 
                           doc.body.firstElementChild;
            if (wrapper) {
                // Wait a split second to measure height to prevent layout glitching before CSS is applied
                setTimeout(() => {
                    const h = (wrapper as HTMLElement).offsetHeight;
                    if (h > 0) {
                        if (h !== iframeHeight) {
                            setIframeHeight(h);
                            onLayoutMeasure?.({
                                width: 500,
                                height: h,
                                aspectRatio: 500 / h
                            });
                        }
                    }
                }, 100);
            } else {
                if (iframeHeight !== 889) {
                    setIframeHeight(889);
                    onLayoutMeasure?.({
                        width: 500,
                        height: 889,
                        aspectRatio: 500 / 889
                    });
                }
            }

            if (showSizingBoxes) {
                Object.keys(fullMapping).forEach(id => {
                    const el = doc.getElementById(id);
                    if (el && !el.classList.contains('sizing-box')) {
                        el.classList.add('sizing-box');
                        // Remove contenteditable initialization so single click doesn't edit
                        if ((doc.defaultView as any)?.textScaler) (doc.defaultView as any).textScaler.observe(el);
                    }
                });
                ['groom-parents', 'groom-parent-name', 'bride-parents', 'bride-parent-name'].forEach(id => {
                    const el = doc.getElementById(id);
                    if (el && !el.classList.contains('sizing-box')) {
                        el.classList.add('sizing-box');
                        if ((doc.defaultView as any)?.textScaler) (doc.defaultView as any).textScaler.observe(el);
                    }
                });

                // INJECT DRAG AND DROP SCRIPT (Force recreate to ensure evaluation if loaded from innerHTML)
                let oldScript = doc.getElementById('drag-script');
                if (oldScript) oldScript.remove();
                
                let scriptEl = doc.createElement('script');
                scriptEl.id = 'drag-script';
                scriptEl.textContent = `
                        let draggingEl = null;
                        let resizingHandle = null;
                        let startX, startY, initialTx, initialTy, initialW;
                        let selectedBox = null;
                        let guideX = null;
                        let guideY = null;
                        
                        function addQrCode(link, title) {
                            deselect();
                            const container = document.querySelector('.invitation-wrapper') || 
                                              document.querySelector('.invite-wrapper') || 
                                              document.body;
                            if (!container) return;
                            
                            const qrBox = document.createElement('div');
                            qrBox.id = 'qr-code-' + Date.now();
                            qrBox.className = 'sizing-box';
                            qrBox.dataset.custom = 'true';
                            qrBox.style.position = 'absolute';
                            qrBox.style.width = '120px';
                            qrBox.style.height = '135px';
                            qrBox.style.left = '50%';
                            qrBox.style.top = '45%';
                            qrBox.style.transform = 'translate(-50%, -50%)';
                            qrBox.dataset.tx = '0';
                            qrBox.dataset.ty = '0';
                            
                            const img = document.createElement('img');
                            // Golden/brownish QR color (b38b40) matching mockup
                            img.src = 'https://quickchart.io/qr?text=' + encodeURIComponent(link) + '&light=0000&dark=b38b40&size=200';
                            img.style.width = '100%';
                            img.style.height = '82%';
                            img.style.objectFit = 'contain';
                            img.style.pointerEvents = 'none';
                            img.style.display = 'block';
                            
                            const titleEl = document.createElement('div');
                            titleEl.innerText = title || 'SCAN FOR LOCATION';
                            titleEl.style.fontSize = '8px';
                            titleEl.style.color = '#b38b40';
                            titleEl.style.textAlign = 'center';
                            titleEl.style.height = '15%';
                            titleEl.style.marginTop = '4px';
                            titleEl.style.fontWeight = 'bold';
                            titleEl.style.width = '100%';
                            titleEl.style.textTransform = 'uppercase';
                            titleEl.style.overflow = 'hidden';
                            titleEl.style.whiteSpace = 'nowrap';
                            titleEl.style.textOverflow = 'ellipsis';
                            
                            qrBox.appendChild(img);
                            qrBox.appendChild(titleEl);
                            container.appendChild(qrBox);
                            selectBox(qrBox);
                        }

                        function getContainer() {
                            return document.querySelector('.invitation-wrapper') ||
                                   document.querySelector('.invite-wrapper') ||
                                   document.body;
                        }

                        function addCustomText(text) {
                            deselect();
                            const container = getContainer();
                            if (!container) return;
                            const box = document.createElement('div');
                            box.id = 'custom-text-' + Date.now();
                            box.className = 'sizing-box';
                            box.dataset.custom = 'true';
                            box.dataset.tx = '0';
                            box.dataset.ty = '0';
                            box.style.position = 'absolute';
                            box.style.left = '50%';
                            box.style.top = '40%';
                            box.style.transform = 'translate(-50%, -50%)';
                            box.style.color = '#ffffff';
                            box.style.fontSize = '24px';
                            box.style.textAlign = 'center';
                            box.style.minWidth = '80px';
                            box.innerText = text || 'Your text';
                            container.appendChild(box);
                            if (window.textScaler) window.textScaler.observe(box);
                            selectBox(box);
                        }

                        function addCustomSticker(emoji) {
                            deselect();
                            const container = getContainer();
                            if (!container) return;
                            const box = document.createElement('div');
                            box.id = 'custom-sticker-' + Date.now();
                            box.className = 'sizing-box';
                            box.dataset.custom = 'true';
                            box.dataset.tx = '0';
                            box.dataset.ty = '0';
                            box.style.position = 'absolute';
                            box.style.left = '50%';
                            box.style.top = '40%';
                            box.style.transform = 'translate(-50%, -50%)';
                            box.style.fontSize = '48px';
                            box.style.lineHeight = '1';
                            box.innerText = emoji || '❤️';
                            container.appendChild(box);
                            if (window.textScaler) window.textScaler.observe(box);
                            selectBox(box);
                        }

                        // Initialization
                        function initEditor() {
                            // Inject Guides
                            guideX = document.createElement('div'); guideX.className = 'snap-guide x'; document.body.appendChild(guideX);
                            guideY = document.createElement('div'); guideY.className = 'snap-guide y'; document.body.appendChild(guideY);

                            window.addEventListener('message', (e) => {
                                const { type, payload } = e.data;
                                if (type === 'ADD_QR') {
                                    addQrCode(payload.link, payload.title);
                                    return;
                                }
                                if (type === 'ADD_TEXT') {
                                    addCustomText(payload && payload.text);
                                    return;
                                }
                                if (type === 'ADD_STICKER') {
                                    addCustomSticker(payload && payload.emoji);
                                    return;
                                }

                                if (!selectedBox) return;
                                if (type === 'FORMAT_TEXT') {
                                    if (payload.color) selectedBox.style.color = payload.color;
                                    if (payload.align) selectedBox.style.textAlign = payload.align;
                                    if (payload.fontWeight) selectedBox.style.fontWeight = payload.fontWeight;
                                    if (payload.textTransform) selectedBox.style.textTransform = payload.textTransform;
                                    if (payload.fontSize) selectedBox.style.fontSize = payload.fontSize;
                                    if (payload.fontFamily) selectedBox.style.fontFamily = payload.fontFamily;

                                    // Box Resize — set the bounding box width relative to the card
                                    if (payload.boxWidth) {
                                        if (payload.boxWidth === 'fit') {
                                            selectedBox.style.width = 'auto';
                                        } else {
                                            selectedBox.style.width = payload.boxWidth;
                                        }
                                        window.parent.postMessage({ type: 'LAYOUT_CHANGED' }, '*');
                                    }

                                    // Border styling
                                    if (payload.border !== undefined) {
                                        selectedBox.style.border = payload.border;
                                    }
                                    if (payload.borderRadius !== undefined) {
                                        selectedBox.style.borderRadius = payload.borderRadius;
                                    }

                                    if (payload.edit) {
                                        selectedBox.setAttribute('contenteditable', 'true');
                                        selectedBox.focus();
                                    }
                                    if (payload.delete) {
                                        // Only user-created elements may be deleted; original text is protected
                                        if (selectedBox.dataset.custom === 'true') {
                                            selectedBox.remove();
                                            deselect();
                                        }
                                    }
                                }
                            });
                        }
                        
                        function ensureHandles(box) {
                            box.querySelectorAll('.resize-handle, .drag-handle, .delete-handle').forEach(el => el.remove());
                            ['tl', 'tr', 'bl', 'br'].forEach(pos => {
                                const handle = document.createElement('div');
                                handle.className = \`resize-handle \${pos}\`;
                                box.appendChild(handle);
                            });

                            // Big, clear drag handle (move icon)
                            const dragBtn = document.createElement('div');
                            dragBtn.className = 'drag-handle';
                            dragBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>';
                            box.appendChild(dragBtn);

                            // Delete handle ONLY for user-created elements (never original template text)
                            if (box.dataset.custom === 'true') {
                                const delBtn = document.createElement('div');
                                delBtn.className = 'delete-handle';
                                delBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                                delBtn.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    box.remove();
                                    deselect();
                                });
                                box.appendChild(delBtn);
                            }
                        }

                        function updateToolbarPosition() {
                            // Position updates removed as toolbar is now native React parent
                        }

                        function selectBox(box) {
                            if (selectedBox === box) return;
                            deselect();
                            selectedBox = box;
                            ensureHandles(box);
                            box.classList.add('selected');
                            
                            const style = window.getComputedStyle(box);
                            let hex = '#000000';
                            const rgb = style.color.match(/\\d+/g);
                            if(rgb && rgb.length >= 3) {
                                hex = '#' + rgb.slice(0,3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
                            }
                            
                            window.parent.postMessage({
                                type: 'SELECTION_CHANGED',
                                payload: {
                                    id: box.id,
                                    color: hex,
                                    align: style.textAlign,
                                    fontWeight: style.fontWeight,
                                    textTransform: style.textTransform,
                                    text: box.innerText,
                                    isCustom: box.dataset.custom === 'true'
                                }
                            }, '*');
                        }
                        
                        function deselect() {
                            if (selectedBox) {
                                selectedBox.classList.remove('selected');
                                selectedBox.classList.remove('editing');
                                selectedBox.removeAttribute('contenteditable');
                            }
                            selectedBox = null;
                            window.parent.postMessage({ type: 'SELECTION_CLEARED' }, '*');
                        }

                        let hasMoved = false;

                        const handleStart = (e) => {
                            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                            
                            hasMoved = false; // Reset hasMoved

                            if (e.target.closest('.editor-toolbar')) return;
                            
                            const resizeHandle = e.target.closest('.resize-handle');
                            if (resizeHandle) {
                                e.preventDefault();
                                resizingHandle = resizeHandle;
                                selectedBox = resizeHandle.parentElement;
                                startX = clientX; startY = clientY;
                                initialW = selectedBox.offsetWidth;
                                const st = window.getComputedStyle(selectedBox);
                                selectedBox.dataset.dragStartFs = parseFloat(st.fontSize) || 16;
                                return;
                            }
                            
                            const sizingBox = e.target.closest('.sizing-box');
                            if (sizingBox) {
                                if (sizingBox.classList.contains('editing')) return;
                                // e.preventDefault(); removed to fix single click selection blocking
                                selectBox(sizingBox);
                                draggingEl = sizingBox;
                                startX = clientX; startY = clientY;
                                initialTx = parseFloat(draggingEl.dataset.tx) || 0;
                                initialTy = parseFloat(draggingEl.dataset.ty) || 0;
                            } else {
                                deselect();
                            }
                        };
                        
                        const handleMove = (e) => {
                            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                            
                            if (resizingHandle && selectedBox) {
                                e.preventDefault();
                                hasMoved = true;
                                const dx = clientX - startX;
                                let newW = initialW;
                                
                                if (resizingHandle.classList.contains('tr') || resizingHandle.classList.contains('br')) {
                                    newW = initialW + dx;
                                } else {
                                    newW = initialW - dx;
                                }
                                
                                if (newW > 20) {
                                    selectedBox.style.width = newW + 'px';
                                    const startFs = parseFloat(selectedBox.dataset.dragStartFs) || 16;
                                    const ratio = newW / initialW;
                                    selectedBox.style.fontSize = (startFs * ratio) + 'px';
                                    selectedBox.style.lineHeight = '1.2';
                                    
                                    if (selectedBox.id && selectedBox.id.startsWith('qr-code')) {
                                        selectedBox.style.height = Math.round(newW * 1.125) + 'px';
                                    }
                                }
                                updateToolbarPosition();
                            } else if (draggingEl) {
                                e.preventDefault();
                                let dx = clientX - startX;
                                let dy = clientY - startY;
                                
                                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                                    hasMoved = true;
                                }
                                
                                if (hasMoved) {
                                    let newTx = initialTx + dx;
                                    let newTy = initialTy + dy;
                                    
                                    const rect = draggingEl.getBoundingClientRect();
                                    const centerX = rect.left + rect.width / 2;
                                    const centerY = rect.top + rect.height / 2;
                                    const bodyW = document.body.clientWidth;
                                    const bodyH = document.body.clientHeight;
                                    
                                    guideX.classList.remove('visible');
                                    guideY.classList.remove('visible');
                                    
                                    if (Math.abs(centerX - bodyW/2) < 10) {
                                        newTx -= (centerX - bodyW/2);
                                        guideX.classList.add('visible');
                                    }
                                    if (Math.abs(centerY - bodyH/2) < 10) {
                                        newTy -= (centerY - bodyH/2);
                                        guideY.classList.add('visible');
                                    }
                                    
                                    draggingEl.dataset.tx = newTx;
                                    draggingEl.dataset.ty = newTy;
                                    draggingEl.style.transform = \`translate(\${newTx}px, \${newTy}px)\`;
                                    updateToolbarPosition();
                                }
                            }
                        };
                        
                        const handleEnd = () => {
                            let didChange = hasMoved && (draggingEl !== null || resizingHandle !== null);
                            draggingEl = null;
                            resizingHandle = null;
                            hasMoved = false;
                            if (selectedBox) {
                                delete selectedBox.dataset.dragStartFs;
                            }
                            if (guideX) guideX.classList.remove('visible');
                            if (guideY) guideY.classList.remove('visible');
                            if (didChange) {
                                window.parent.postMessage({ type: 'LAYOUT_CHANGED' }, '*');
                            }
                        };

                        // Events
                        document.addEventListener('mousedown', handleStart);
                        document.addEventListener('mousemove', handleMove);
                        document.addEventListener('mouseup', handleEnd);
                        
                        document.addEventListener('touchstart', handleStart, {passive: false});
                        document.addEventListener('touchmove', handleMove, {passive: false});
                        document.addEventListener('touchend', handleEnd);

                        // Double click to edit text
                        document.addEventListener('dblclick', (e) => {
                            const sizingBox = e.target.closest('.sizing-box');
                            if (sizingBox) {
                                sizingBox.classList.add('editing');
                                sizingBox.setAttribute('contenteditable', 'true');
                                sizingBox.focus();
                            }
                        });
                        
                        // Show handles again when blur
                        document.addEventListener('focusout', (e) => {
                            const sizingBox = e.target.closest('.sizing-box');
                            if (sizingBox && sizingBox.classList.contains('editing')) {
                                window.parent.postMessage({ type: 'LAYOUT_CHANGED' }, '*');
                                sizingBox.classList.remove('editing');
                                sizingBox.removeAttribute('contenteditable');
                            }
                        });

                        // Prevent deleting the element itself when backspacing in contenteditable
                        document.addEventListener('keydown', (e) => {
                            const target = e.target.closest('[contenteditable="true"]');
                            if (target) {
                                if (e.key === 'Backspace' || e.key === 'Delete') {
                                    const text = target.innerText.trim();
                                    if (text.length <= 1) {
                                        if (text.length === 0 || (text.length === 1 && window.getSelection().toString() === text)) {
                                            target.innerHTML = '&nbsp;';
                                            e.preventDefault();
                                        }
                                    }
                                }
                            }
                        });

                        // DUMMY FONT SCALER OBJECT
                        window.textScaler = {
                            observe: () => {},
                            unobserve: () => {},
                            disconnect: () => {}
                        };
                        
                        initEditor();
                     `;
                    doc.body.appendChild(scriptEl);
            } else {
                Object.keys(fullMapping).forEach(id => {
                    const el = doc.getElementById(id);
                    if (el && el.classList.contains('sizing-box')) {
                        el.classList.remove('sizing-box');
                        el.removeAttribute('contenteditable');
                    }
                });
                ['groom-parents', 'groom-parent-name', 'bride-parents', 'bride-parent-name'].forEach(id => {
                    const el = doc.getElementById(id);
                    if (el && el.classList.contains('sizing-box')) {
                        el.classList.remove('sizing-box');
                        el.removeAttribute('contenteditable');
                    }
                });
            }
        };

        const currentIframe = iframeRef.current;
        if (!currentIframe) return;
        
        let debounceTimer: NodeJS.Timeout;

        const handleInitialLoad = () => {
            updateContent();
            measureLayout();
            
            setTimeout(() => {
                updateContent();
                measureLayout();
            }, 100);
            
            setTimeout(() => {
                updateContent();
                measureLayout();
                setIsReady(true);
            }, 400);
        };

        const handleUpdate = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                updateContent();
                measureLayout();
            }, 120);
        };

        if (currentIframe.contentDocument?.readyState === 'complete') {
            if (!isReady) {
                handleInitialLoad();
            } else {
                handleUpdate();
            }
        } else {
            currentIframe.addEventListener('load', handleInitialLoad);
        }

        (currentIframe as any)._onLoadCallback = handleInitialLoad;

        return () => {
            currentIframe.removeEventListener('load', handleInitialLoad);
            clearTimeout(debounceTimer);
            (currentIframe as any)._onLoadCallback = null;
        };
    }, [isHTMLDesign, event, welcomeMessage, groomName, brideName, groomParents, brideParents, customImage, isRawPreview, onLayoutMeasure, isReady]);

    // Separate effect to apply/remove sizing-box class when edit mode toggles.
    // This does NOT re-run the full content mapping, so saved edits are never overwritten.
    useEffect(() => {
        if (!isHTMLDesign || !iframeRef.current) return;
        const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (!doc || !doc.body) return;

        const allIds = [
            'event-name', 'heading', 'subheading', 'event-subheading',
            'groom-name', 'bride-name', 'groom-parents', 'groom-parent-name',
            'bride-parents', 'bride-parent-name', 'event-date', 'event-time',
            'event-venue', 'venue'
        ];

        if (showSizingBoxes) {
            allIds.forEach(id => {
                const el = doc.getElementById(id);
                if (el && !el.classList.contains('sizing-box')) {
                    el.classList.add('sizing-box');
                }
            });
            // Re-inject the drag script if not present
            if (!doc.getElementById('drag-script')) {
                const win = iframeRef.current.contentWindow as any;
                if (win && typeof win.initEditor === 'function') {
                    try { win.initEditor(); } catch(e) {}
                }
            }
        } else {
            // Remove sizing-box class and handles when exiting edit mode
            doc.querySelectorAll('.sizing-box').forEach(el => {
                el.classList.remove('sizing-box', 'selected', 'editing');
                el.removeAttribute('contenteditable');
            });
            doc.querySelectorAll('.resize-handle, .delete-handle, .drag-handle, .snap-guide').forEach(el => el.remove());
        }
    }, [showSizingBoxes, isHTMLDesign]);

    const isHaldi = event.name?.toLowerCase().includes('haldi');
    const isContract = variant === 'contract';
    const isSaveTheDate = variant === 'save-the-date';

    if (isHTMLDesign) {
        return (
            <div
                ref={containerRef}
                className={clsx(styles.invitationCard, className)}
                onClick={onClick}
                style={{
                    cursor: onClick ? 'pointer' : 'default',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'transparent',
                    aspectRatio: 'auto',
                    height: `${iframeHeight * containerScale}px`
                }}
            >
                {/* Loading shimmer - visible until iframe is ready */}
                {!isReady && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 5,
                        borderRadius: 'inherit',
                        background: 'linear-gradient(110deg, #f0ede8 8%, #f7f4ef 18%, #f0ede8 33%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite linear',
                    }} />
                )}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '500px',
                    height: `${iframeHeight}px`,
                    opacity: isReady ? 1 : 0,
                    filter: isReady ? 'blur(0px)' : 'blur(4px)',
                    transform: `scale(${containerScale}) translateY(${isReady ? '0px' : '8px'})`,
                    transformOrigin: 'top left',
                    pointerEvents: (onClick && !showSizingBoxes) ? 'none' : 'auto',
                    transition: 'opacity 500ms cubic-bezier(0.23, 1, 0.32, 1), filter 500ms cubic-bezier(0.23, 1, 0.32, 1), transform 500ms cubic-bezier(0.23, 1, 0.32, 1)'
                }}>
                    <iframe
                        key={srcDoc ? 'srcdoc-preview' : iframeSrc}
                        ref={iframeRef}
                        src={srcDoc ? undefined : encodeURI(iframeSrc || '')}
                        srcDoc={srcDoc}
                        onLoad={(e) => {
                            const target = e.target as any;
                            if (target._onLoadCallback) {
                                target._onLoadCallback();
                            } else {
                                setIsReady(true);
                            }
                        }}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                        }}
                        scrolling="no"
                        title="Invitation Template"
                    />
                </div>
                {isSecured && isReady && (
                    <div className={styles.watermark} style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}>
                        <span>nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in</span>
                        <span>nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in</span>
                        <span>nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in</span>
                    </div>
                )}
            </div>
        );
    }

    const vw = isRawPreview ? imageDimensions.width : 600;
    const vh = isRawPreview ? imageDimensions.height : 800;
    const cx = vw / 2;
    const scaleX = (x: number) => (x / 600) * vw;
    const scaleY = (y: number) => (y / 800) * vh;
    const scaleFont = (size: number) => Math.round(size * (vw / 600));

    return (
        <div
            ref={containerRef}
            className={styles.invitationCard}
            style={{
                '--theme-primary': '#D4AF37',
                cursor: onClick ? 'pointer' : 'default',
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                aspectRatio: `${vw} / ${vh}`,
                width: '100%',
                height: 'auto'
            } as any}
            onClick={onClick}
        >
            <svg viewBox={`0 0 ${vw} ${vh}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                {/* Background Image */}
                {customImage && (
                    <image
                        href={customImage}
                        x="0"
                        y="0"
                        width={vw}
                        height={vh}
                        preserveAspectRatio="xMidYMid meet"
                    />
                )}

                {/* Content Group */}
                <g textAnchor="middle" fontFamily="serif">
                    {isSaveTheDate ? (
                        /* Save The Date Layout (Design 8) */
                        <g>
                            {/* Masking Rect to hide original text - Color picked to match dark maroon background */}
                            <rect x={scaleX(40)} y={scaleY(220)} width={scaleX(520)} height={scaleY(500)} fill="#3E0E18" rx={scaleFont(10)} />

                            {/* Header */}
                            <text x={cx} y={scaleY(280)} fill="#FFF" fontSize={scaleFont(42)} fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Save The Date
                            </text>
                            <text x={cx} y={scaleY(320)} fill="#E5E7EB" fontSize={scaleFont(18)} fontFamily="var(--font-serif)" fontStyle="italic">
                                to celebrate the wedding of
                            </text>

                            {/* Names */}
                            <text x={cx} y={scaleY(420)} fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize={scaleFont(72)} filter="url(#shadow)">
                                {groomName || 'Groom'}   &   {brideName || 'Bride'}
                            </text>

                            {/* Date */}
                            <text x={cx} y={scaleY(550)} fill="#FFF" fontSize={scaleFont(28)} fontWeight="600" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.05em' }}>
                                {formatDate(event.date) || '1st February 2026'}
                            </text>
                            <text x={cx} y={scaleY(590)} fill="#D1D5DB" fontSize={scaleFont(20)} fontFamily="var(--font-serif)">
                                {event.venue || 'Venue details to follow'}
                            </text>

                            {/* Footer */}
                            <text x={cx} y={scaleY(660)} fill="#9CA3AF" fontSize={scaleFont(14)} style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                Formal Invitation to follow
                            </text>
                        </g>

                    ) : isContract ? (
                        /* Contract Card Layout */
                        <g>
                            {/* Names for "Between" section */}
                            <text x={cx} y={scaleY(295)} fill="#4a3b2b" fontFamily="'Great Vibes', cursive" fontSize={scaleFont(52)} filter="url(#shadow-sm)">
                                {groomName || 'Groom'}   &   {brideName || 'Bride'}
                            </text>
                            {/* Signatures at bottom */}
                            <text x={scaleX(150)} y={scaleY(660)} fill="#4a3b2b" fontFamily="'Great Vibes', cursive" fontSize={scaleFont(32)} transform={`rotate(-5, ${scaleX(150)}, ${scaleY(660)})`}>
                                {groomName || 'Groom'}
                            </text>
                            <text x={scaleX(450)} y={scaleY(660)} fill="#4a3b2b" fontFamily="'Great Vibes', cursive" fontSize={scaleFont(32)} transform={`rotate(-5, ${scaleX(450)}, ${scaleY(660)})`}>
                                {brideName || 'Bride'}
                            </text>
                            {/* Date for "On" section - approximate placement */}
                            <text x={cx} y={scaleY(740)} fill="#FFF" fontSize={scaleFont(24)} fontWeight="600" fontFamily="var(--font-serif)">
                                {formatDate(event.date) || '1st February 2026'}
                            </text>
                        </g>
                    ) : isHaldi ? (
                        <>
                            <text x={cx} y={scaleY(240)} fill="#FFF" fontSize={scaleFont(36)} fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} filter="url(#shadow)">
                                {event.name}
                            </text>
                            <text x={cx} y={scaleY(380)} fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize={scaleFont(72)} filter="url(#shadow)">
                                {brideName || 'Bride'}
                                <tspan dx={scaleX(10)} fontSize={scaleFont(36)} fontFamily="var(--font-serif)" fontStyle="italic" dy={scaleY(-10)}>ke haldi</tspan>
                            </text>
                            <text x={cx} y={scaleY(440)} fill="#FFE4B5" fontSize={scaleFont(20)} fontStyle="italic" style={{ letterSpacing: '0.05em' }}>
                                <tspan x={cx} dy="0">bless the couple with showers of yellow</tspan>
                                <tspan x={cx} dy={scaleY(25)}>health and happiness</tspan>
                            </text>
                        </>
                    ) : (
                        <>
                            <text x={cx} y={scaleY(240)} fill="#FFF" fontSize={scaleFont(36)} fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} filter="url(#shadow)">
                                {event.name}
                            </text>
                            <text x={cx} y={scaleY(380)} fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize={scaleFont(64)} filter="url(#shadow)">
                                {groomName || 'Groom'}
                                <tspan dx={scaleX(10)} fontSize={scaleFont(32)} opacity="0.8">&</tspan>
                                <tspan dx={scaleX(10)}>{brideName || 'Bride'}</tspan>
                            </text>
                            <text x={cx} y={scaleY(440)} fill="#FFE4B5" fontSize={scaleFont(18)} fontStyle="italic" style={{ letterSpacing: '0.05em' }}>
                                <tspan x={cx} dy="0">Request the honor of your presence to bless the couple</tspan>
                                <tspan x={cx} dy={scaleY(25)}>with showers of love, health, and happiness.</tspan>
                            </text>
                        </>
                    )}

                    {/* Bottom Details (Only for non-contract cards) */}
                    {!isContract && (event.date || event.time || event.venue || !isPlaceholder) && (
                        <g transform={`translate(0, ${scaleY(600)})`} fill="#FFF" fontSize={scaleFont(22)} fontWeight="600">
                            {event.date && (
                                <text x={cx} y="0">
                                    <tspan fill="#FFE4B5" fontSize={scaleFont(16)} style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} dy={scaleY(-25)}>On</tspan>
                                    <tspan x={cx} dy={scaleY(25)}>{formatDate(event.date)}</tspan>
                                </text>
                            )}

                            {event.time && (
                                <text x={cx} y={scaleY(80)}>
                                    <tspan fill="#FFE4B5" fontSize={scaleFont(16)} style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} dy={scaleY(-25)}>At</tspan>
                                    <tspan x={cx} dy={scaleY(25)}>{formatTime(event.time)}</tspan>
                                </text>
                            )}

                            {event.venue && (
                                <text x={cx} y={scaleY(160)}>
                                    <tspan fill="#FFE4B5" fontSize={scaleFont(16)} style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} dy={scaleY(-25)}>Venue</tspan>
                                    <tspan x={cx} dy={scaleY(25)} fontSize={scaleFont(20)} >{event.venue}</tspan>
                                </text>
                            )}
                        </g>
                    )}
                </g>

                {/* QR Code for Image Designs */}
                {staticQrCode && (
                    <g transform={`translate(${scaleX(420)}, ${scaleY(620)})`}>
                        <rect width={scaleX(160)} height={scaleX(160)} fill="#FFF" rx={scaleFont(12)} filter="url(#shadow)" />
                        <image 
                            href={`https://quickchart.io/qr?text=${encodeURIComponent(staticQrCode.link)}&light=0000&dark=b38b40&size=150`}
                            x={scaleX(15)} y={scaleY(15)} width={scaleX(130)} height={scaleX(130)}
                        />
                        {staticQrCode.title && (
                            <text x={scaleX(80)} y={scaleY(175)} fill="#FFF" fontSize={scaleFont(14)} textAnchor="middle" fontFamily="var(--font-serif)" filter="url(#shadow-sm)">
                                {staticQrCode.title}
                            </text>
                        )}
                    </g>
                )}

                {/* Filters */}
                <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
                    </filter>
                    <filter id="shadow-sm" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.3)" />
                    </filter>
                </defs>
            </svg>
            {isSecured && (
                <div className={styles.watermark}>
                    <span>nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in</span>
                    <span>nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in</span>
                    <span>nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in</span>
                </div>
            )}
        </div>
    );
});
