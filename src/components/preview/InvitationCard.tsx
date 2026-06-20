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
    onClick?: () => void;
    variant?: 'default' | 'contract' | 'save-the-date';
    className?: string; // Added className to props
    isSecured?: boolean; // Added isSecured to props
    showSizingBoxes?: boolean; // Added showSizingBoxes
    isRawPreview?: boolean; // Added to just show the HTML as is
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
    onClick,
    variant = 'default',
    className,
    isSecured = false,
    showSizingBoxes = false,
    isRawPreview = isPlaceholder // Default to raw preview for placeholders (previews)
}, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [containerScale, setContainerScale] = useState(1);
    const [iframeHeight, setIframeHeight] = useState(889);
    const isHTMLDesign = customImage?.toLowerCase().endsWith('.html') || (customImage?.includes('item-Wedding_Invitation') && customImage.toLowerCase().includes('.html')); // Robust check

    const cacheBuster = useMemo(() => Date.now(), []);
    const iframeSrc = useMemo(() => {
        if (!customImage) return '';
        const separator = customImage.includes('?') ? '&' : '?';
        return `${customImage}${separator}cb=${cacheBuster}`;
    }, [customImage, cacheBuster]);

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(false);
    }, [iframeSrc]);

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
                    values[id] = val;
                }
            });
            console.log("InvitationCard extracted edits:", values);
            return values;
        },
        downloadImage: () => {
            if (!iframeRef.current) return;
            const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
            if (!doc) return;

            const executeDownload = () => {
                const win = iframeRef.current?.contentWindow as any;
                if (!win || !win.html2canvas) return;

                // Hide styling boxes before screenshot
                const style = doc.createElement('style');
                style.textContent = `.sizing-box { outline: none !important; cursor: default !important; }`;
                doc.head.appendChild(style);

                const wrapper = doc.querySelector('.invitation-wrapper') || 
                              doc.querySelector('.invite-wrapper') || 
                              doc.body.firstElementChild;
                const targetHeight = (wrapper as HTMLElement)?.offsetHeight || 889;

                win.html2canvas(doc.body, { 
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
                    doc.head.removeChild(style);
                });
            };

            if (!doc.getElementById('html2canvas-script')) {
                const script = doc.createElement('script');
                script.id = 'html2canvas-script';
                script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
                script.onload = executeDownload;
                doc.head.appendChild(script);
            } else {
                executeDownload();
            }
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
        if (!isHTMLDesign || !iframeRef.current || isRawPreview) return;

        const updateContent = () => {
            const doc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
            if (!doc || !doc.body || !doc.head) return;

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
                'groom-name': groomName,
                'bride-name': brideName,
                'groom-parents': groomParents,
                'groom-parent-name': groomParents,
                'bride-parents': brideParents,
                'bride-parent-name': brideParents,
                'event-date': formatDate(event.date),
                'event-time': formatTime(event.time),
                'event-venue': event.venue,
                'venue': event.venue,
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
                    
                    const regexDash = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                    const regexUnder = new RegExp(`{{\\s*${key.replace('-', '_')}\\s*}}`, 'g');
                    
                    if (regexDash.test(text)) {
                        text = text.replace(regexDash, valStr);
                        changed = true;
                    }
                    if (regexUnder.test(text)) {
                        text = text.replace(regexUnder, valStr);
                        changed = true;
                    }
                });

                // Clear any remaining unmapped mustache tags to clean up the UI
                const unknownRegex = /{{\s*[a-zA-Z0-9_-]+\s*}}/g;
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
                            'subheading': ['We are pleased to invite you to the wedding of', 'We invite you to share our joy', 'formal invite to follow']
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
                    let formattedValue = value.toString().replace(/\n/g, '<br/>');
                    if (id === 'bride-name' && el.textContent?.trim() === 'Anjali ke haldi') {
                        formattedValue = formattedValue + ' ke haldi';
                    }
                    if (el.innerHTML !== formattedValue) {
                        el.innerHTML = formattedValue;
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
                eventNameEl.innerHTML = displayEventName.toString().replace(/\n/g, '<br/>');
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
                    height: auto !important;
                }
                * { hyphens: none !important; -webkit-hyphens: none !important; }
                .text-overlay { padding-top: 15vh !important; }
                ${showSizingBoxes ? `
                .sizing-box {
                    position: relative;
                    outline: 1px dashed rgba(0,0,0,0.4);
                    outline-offset: 4px;
                    border-radius: 2px;
                    transition: outline 0.2s, background 0.2s;
                    cursor: move;
                    resize: both !important;
                    overflow: hidden !important;
                    flex: none !important;
                    min-width: 50px;
                    min-height: 20px;
                    z-index: 10;
                }
                .sizing-box:hover {
                    outline: 2px solid #10B981;
                    outline-offset: 4px;
                    background: rgba(16, 185, 129, 0.05);
                }
                .sizing-box:focus {
                    cursor: text;
                    outline: 2px solid #3B82F6 !important;
                    background: rgba(59, 130, 246, 0.05);
                }
                .sizing-box:hover::after {
                    content: '';
                    position: absolute;
                    bottom: -8px;
                    right: -8px;
                    width: 8px;
                    height: 8px;
                    background: white;
                    border: 2px solid #10B981;
                    border-radius: 50%;
                }
                .sizing-box:hover::before {
                    content: '';
                    position: absolute;
                    top: -8px;
                    left: -8px;
                    width: 8px;
                    height: 8px;
                    background: white;
                    border: 2px solid #10B981;
                    border-radius: 50%;
                }
                ` : ''}
            `;

            // Auto-adjust height based on content
            const wrapper = doc.querySelector('.invitation-wrapper') || 
                          doc.querySelector('.invite-wrapper') || 
                          doc.body.firstElementChild;
            if (wrapper) {
                const h = (wrapper as HTMLElement).offsetHeight;
                if (h > 0 && h !== iframeHeight) {
                    setIframeHeight(h);
                }
            } else if (iframeHeight !== 889) {
                // Default to 889 (9:16 ratio for 500px width) if no wrapper detected yet
                setIframeHeight(889);
            }

            if (showSizingBoxes) {
                Object.keys(fullMapping).forEach(id => {
                    const el = doc.getElementById(id);
                    if (el && !el.classList.contains('sizing-box')) {
                        el.classList.add('sizing-box');
                        el.setAttribute('contenteditable', 'true');
                        if ((doc.defaultView as any)?.textScaler) (doc.defaultView as any).textScaler.observe(el);
                    }
                });
                ['groom-parents', 'groom-parent-name', 'bride-parents', 'bride-parent-name'].forEach(id => {
                    const el = doc.getElementById(id);
                    if (el && !el.classList.contains('sizing-box')) {
                        el.classList.add('sizing-box');
                        el.setAttribute('contenteditable', 'true');
                        if ((doc.defaultView as any)?.textScaler) (doc.defaultView as any).textScaler.observe(el);
                    }
                });

                // INJECT DRAG AND DROP SCRIPT
                let scriptEl = doc.getElementById('drag-script');
                if (!scriptEl) {
                    scriptEl = doc.createElement('script');
                    scriptEl.id = 'drag-script';
                    scriptEl.textContent = `
                        let draggingEl = null;
                        let startX, startY, initialTx, initialTy;
                        
                        document.addEventListener('mousedown', (e) => {
                            const sizingBox = e.target.closest('.sizing-box');
                            if (sizingBox) {
                                const rect = sizingBox.getBoundingClientRect();
                                const offsetX = e.clientX - rect.left;
                                const offsetY = e.clientY - rect.top;
                                
                                // Ignore drag if clicking on the bottom-right resize handle (approx 20x20 px)
                                const isResizeHandle = (rect.width - offsetX < 20) && (rect.height - offsetY < 20);
                                if(isResizeHandle) return; // Allow native resize to work

                                // Ignore drag if the element is currently being text-edited (focused)
                                if (document.activeElement === sizingBox) return;

                                draggingEl = sizingBox;
                                startX = e.clientX;
                                startY = e.clientY;
                                
                                initialTx = parseFloat(draggingEl.dataset.tx) || 0;
                                initialTy = parseFloat(draggingEl.dataset.ty) || 0;
                            }
                        });
                        
                        document.addEventListener('mousemove', (e) => {
                            if (draggingEl) {
                                const dx = e.clientX - startX;
                                const dy = e.clientY - startY;
                                
                                const newTx = initialTx + dx;
                                const newTy = initialTy + dy;
                                
                                draggingEl.dataset.tx = newTx;
                                draggingEl.dataset.ty = newTy;
                                
                                draggingEl.style.transform = \`translate(\${newTx}px, \${newTy}px)\`;
                            }
                        });
                        
                        document.addEventListener('mouseup', () => {
                            draggingEl = null;
                        });

                        // RESIZE OBSERVER FOR FONT SCALING
                        window.textScaler = new ResizeObserver(entries => {
                            for (const entry of entries) {
                                const el = entry.target;
                                if (!el.dataset.initW) {
                                    const st = window.getComputedStyle(el);
                                    el.dataset.initW = el.offsetWidth;
                                    el.dataset.initFs = parseFloat(st.fontSize) || 16;
                                } else {
                                    const currentW = el.offsetWidth;
                                    const initW = parseFloat(el.dataset.initW);
                                    if (initW > 0) {
                                        const ratio = currentW / initW;
                                        el.style.fontSize = (parseFloat(el.dataset.initFs) * ratio) + 'px';
                                        el.style.lineHeight = '1.2';
                                    }
                                }
                            }
                        });
                        
                        document.querySelectorAll('.sizing-box').forEach(el => window.textScaler.observe(el));
                    `;
                    doc.body.appendChild(scriptEl);
                }
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
        const handleLoad = () => {
            // Try immediately
            updateContent();
            setIsReady(true);
            // And retry once after a short delay to ensure assets/fonts are settled
            setTimeout(() => {
                updateContent();
                setIsReady(true);
            }, 100);
            setTimeout(() => {
                updateContent();
                setIsReady(true);
            }, 500);
        };

        if (currentIframe.contentDocument?.readyState === 'complete') {
            handleLoad();
        } else {
            currentIframe.addEventListener('load', handleLoad);
            return () => currentIframe.removeEventListener('load', handleLoad);
        }
    }, [isHTMLDesign, event, welcomeMessage, groomName, brideName, groomParents, brideParents, customImage, showSizingBoxes, isRawPreview]);

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
                    background: 'white', // Ensure background is filled
                    aspectRatio: 'auto',
                    height: `${iframeHeight * containerScale}px`
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '500px',
                    height: `${iframeHeight}px`,
                    transform: `scale(${containerScale})`,
                    transformOrigin: 'top left',
                    pointerEvents: (onClick && !showSizingBoxes) ? 'none' : 'auto'
                }}>
                    <iframe
                        key={iframeSrc}
                        ref={iframeRef}
                        src={iframeSrc}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            opacity: isReady ? 1 : 0,
                            transition: 'opacity 0.15s ease-in-out'
                        }}
                        scrolling="no"
                        title="Invitation Template"
                    />
                </div>
                {isSecured && (
                    <div className={styles.watermark}>
                        <span>nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in</span>
                        <span>nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in</span>
                        <span>nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in &nbsp; nimantranstudio.in</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={styles.invitationCard}
            style={{
                '--theme-primary': '#D4AF37',
                cursor: onClick ? 'pointer' : 'default',
                background: 'transparent',
                border: 'none',
                boxShadow: 'none'
            } as any}
            onClick={onClick}
        >
            <svg viewBox="0 0 600 800" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                {/* Background Image */}
                {customImage && (
                    <image
                        href={customImage}
                        x="0"
                        y="0"
                        width="600"
                        height="800"
                        preserveAspectRatio="xMidYMid slice"
                    />
                )}

                {/* Content Group */}
                <g textAnchor="middle" fontFamily="serif">
                    {isSaveTheDate ? (
                        /* Save The Date Layout (Design 8) */
                        <g>
                            {/* Masking Rect to hide original text - Color picked to match dark maroon background */}
                            <rect x="40" y="220" width="520" height="500" fill="#3E0E18" rx="10" />

                            {/* Header */}
                            <text x="300" y="280" fill="#FFF" fontSize="42" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Save The Date
                            </text>
                            <text x="300" y="320" fill="#E5E7EB" fontSize="18" fontFamily="var(--font-serif)" fontStyle="italic">
                                to celebrate the wedding of
                            </text>

                            {/* Names */}
                            <text x="300" y="420" fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize="72" filter="url(#shadow)">
                                {groomName || 'Groom'}   &   {brideName || 'Bride'}
                            </text>

                            {/* Date */}
                            <text x="300" y="550" fill="#FFF" fontSize="28" fontWeight="600" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.05em' }}>
                                {formatDate(event.date) || '1st February 2026'}
                            </text>
                            <text x="300" y="590" fill="#D1D5DB" fontSize="20" fontFamily="var(--font-serif)">
                                {event.venue || 'Venue details to follow'}
                            </text>

                            {/* Footer */}
                            <text x="300" y="660" fill="#9CA3AF" fontSize="14" style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                Formal Invitation to follow
                            </text>
                        </g>

                    ) : isContract ? (
                        /* Contract Card Layout */
                        <g>
                            {/* Names for "Between" section */}
                            <text x="300" y="295" fill="#4a3b2b" fontFamily="'Great Vibes', cursive" fontSize="52" filter="url(#shadow-sm)">
                                {groomName || 'Groom'}   &   {brideName || 'Bride'}
                            </text>
                            {/* Signatures at bottom */}
                            <text x="150" y="660" fill="#4a3b2b" fontFamily="'Great Vibes', cursive" fontSize="32" transform="rotate(-5, 150, 660)">
                                {groomName || 'Groom'}
                            </text>
                            <text x="450" y="660" fill="#4a3b2b" fontFamily="'Great Vibes', cursive" fontSize="32" transform="rotate(-5, 450, 660)">
                                {brideName || 'Bride'}
                            </text>
                            {/* Date for "On" section - approximate placement */}
                            <text x="300" y="740" fill="#FFF" fontSize="24" fontWeight="600" fontFamily="var(--font-serif)">
                                {formatDate(event.date) || '1st February 2026'}
                            </text>
                        </g>
                    ) : isHaldi ? (
                        <>
                            <text x="300" y="240" fill="#FFF" fontSize="36" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} filter="url(#shadow)">
                                {event.name}
                            </text>
                            <text x="300" y="380" fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize="72" filter="url(#shadow)">
                                {brideName || 'Bride'}
                                <tspan dx="10" fontSize="36" fontFamily="var(--font-serif)" fontStyle="italic" dy="-10">ke haldi</tspan>
                            </text>
                            <text x="300" y="440" fill="#FFE4B5" fontSize="20" fontStyle="italic" style={{ letterSpacing: '0.05em' }}>
                                <tspan x="300" dy="0">bless the couple with showers of yellow</tspan>
                                <tspan x="300" dy="25">health and happiness</tspan>
                            </text>
                        </>
                    ) : (
                        <>
                            <text x="300" y="240" fill="#FFF" fontSize="36" fontFamily="var(--font-serif)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} filter="url(#shadow)">
                                {event.name}
                            </text>
                            <text x="300" y="380" fill="#FFF" fontFamily="'Great Vibes', cursive" fontSize="64" filter="url(#shadow)">
                                {groomName || 'Groom'}
                                <tspan dx="10" fontSize="32" opacity="0.8">&</tspan>
                                <tspan dx="10">{brideName || 'Bride'}</tspan>
                            </text>
                            <text x="300" y="440" fill="#FFE4B5" fontSize="18" fontStyle="italic" style={{ letterSpacing: '0.05em' }}>
                                <tspan x="300" dy="0">Request the honor of your presence to bless the couple</tspan>
                                <tspan x="300" dy="25">with showers of love, health, and happiness.</tspan>
                            </text>
                        </>
                    )}

                    {/* Bottom Details (Only for non-contract cards) */}
                    {!isContract && (event.date || event.time || event.venue || !isPlaceholder) && (
                        <g transform="translate(0, 600)" fill="#FFF" fontSize="22" fontWeight="600">
                            {event.date && (
                                <text x="300" y="0">
                                    <tspan fill="#FFE4B5" fontSize="16" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} dy="-25">On</tspan>
                                    <tspan x="300" dy="25">{formatDate(event.date)}</tspan>
                                </text>
                            )}

                            {event.time && (
                                <text x="300" y="80">
                                    <tspan fill="#FFE4B5" fontSize="16" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} dy="-25">At</tspan>
                                    <tspan x="300" dy="25">{formatTime(event.time)}</tspan>
                                </text>
                            )}

                            {event.venue && (
                                <text x="300" y="160">
                                    <tspan fill="#FFE4B5" fontSize="16" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }} dy="-25">Venue</tspan>
                                    <tspan x="300" dy="25" fontSize="20" >{event.venue}</tspan>
                                </text>
                            )}
                        </g>
                    )}
                </g>

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
