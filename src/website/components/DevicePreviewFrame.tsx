'use client';

import { useEffect, useRef, useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import clsx from 'clsx';
import type { FrameSource } from './TemplateFrame';
import styles from './DevicePreviewFrame.module.css';

export type Device = 'phone' | 'desktop';

/** The viewport each device previews at; the frame is scaled down to fit. */
const VIEWPORTS: Record<Device, { width: number; height: number }> = {
    phone: { width: 390, height: 844 },
    desktop: { width: 1280, height: 800 },
};

interface DevicePreviewFrameProps {
    templateId: string;
    source: FrameSource;
    defaultDevice?: Device;
    /** Hide the phone/desktop switch (e.g. in a narrow side panel). */
    showDeviceToggle?: boolean;
    /**
     * false shows the website as a picture: no taps, scrolling or keyboard
     * focus inside it (used on the design list, where the card itself is the
     * thing to click).
     */
    interactive?: boolean;
    className?: string;
}

/**
 * Shows a website design at a real phone or desktop width inside an iframe,
 * scaled to fit the space available. Same scaling approach as the dashboard's
 * RsvpWebsiteCard, which stays untouched.
 */
export function DevicePreviewFrame({
    templateId,
    source,
    defaultDevice = 'phone',
    showDeviceToggle = true,
    interactive = true,
    className,
}: DevicePreviewFrameProps) {
    const [device, setDevice] = useState<Device>(defaultDevice);
    const [isLoading, setIsLoading] = useState(true);
    const stageRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0);
    const viewport = VIEWPORTS[device];

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const update = () => {
            const { width, height } = stage.getBoundingClientRect();
            // Leave room for the device bezel and browser bar drawn around the screen.
            const BEZEL = 40;
            if (width > BEZEL && height > BEZEL) {
                setScale(Math.min((width - BEZEL) / viewport.width, (height - BEZEL) / viewport.height, 1));
            }
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(stage);
        return () => ro.disconnect();
    }, [viewport.width, viewport.height]);

    useEffect(() => setIsLoading(true), [templateId, source]);

    const src = `/website-frame/${encodeURIComponent(templateId)}?source=${source}`;

    return (
        <div className={clsx(styles.root, className)}>
            {showDeviceToggle && (
                <div className={styles.toggle} role="group" aria-label="Preview size">
                    <button
                        type="button"
                        className={clsx(styles.toggleBtn, device === 'phone' && styles.toggleActive)}
                        aria-pressed={device === 'phone'}
                        onClick={() => setDevice('phone')}
                    >
                        <Smartphone size={15} aria-hidden /> Phone
                    </button>
                    <button
                        type="button"
                        className={clsx(styles.toggleBtn, device === 'desktop' && styles.toggleActive)}
                        aria-pressed={device === 'desktop'}
                        onClick={() => setDevice('desktop')}
                    >
                        <Monitor size={15} aria-hidden /> Desktop
                    </button>
                </div>
            )}

            <div ref={stageRef} className={styles.stage}>
                {scale > 0 && (
                    <div
                        className={clsx(styles.device, device === 'phone' ? styles.phone : styles.desktop)}
                        style={{ width: viewport.width * scale, height: viewport.height * scale }}
                    >
                        {device === 'desktop' && (
                            <div className={styles.browserBar} aria-hidden>
                                <span /><span /><span />
                            </div>
                        )}
                        <div className={styles.screen}>
                            {isLoading && (
                                <div className={styles.loading}>
                                    <span className={styles.spinner} aria-hidden />
                                    Loading preview
                                </div>
                            )}
                            <iframe
                                key={`${templateId}-${source}`}
                                src={src}
                                title="Wedding website preview"
                                loading="lazy"
                                onLoad={() => setIsLoading(false)}
                                className={styles.iframe}
                                tabIndex={interactive ? undefined : -1}
                                aria-hidden={interactive ? undefined : true}
                                style={{
                                    width: viewport.width,
                                    height: viewport.height,
                                    transform: `scale(${scale})`,
                                    pointerEvents: interactive ? undefined : 'none',
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
