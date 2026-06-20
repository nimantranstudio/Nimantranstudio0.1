import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock as ClockIcon } from 'lucide-react';
import { clsx } from 'clsx';
import formStyles from './Form.module.css';
import styles from './DateTimePicker.module.css';

interface TimePickerProps {
    value?: string; // HH:MM
    onChange: (value: string) => void;
    id?: string;
    className?: string;
    error?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, id, className, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    let parsedHour = 12;
    let parsedMin = 0;
    if (value) {
        const parts = value.split(':');
        if (parts.length === 2) {
            parsedHour = parseInt(parts[0], 10);
            parsedMin = parseInt(parts[1], 10);
        }
    }

    const isPM = parsedHour >= 12;
    const hour12 = parsedHour % 12 || 12;

    const handleSelect = (h: number, m: number, pm: boolean) => {
        let hour24 = h;
        if (pm && h < 12) hour24 += 12;
        if (!pm && h === 12) hour24 = 0;
        
        const sh = String(hour24).padStart(2, '0');
        const sm = String(m).padStart(2, '0');
        onChange(`${sh}:${sm}`);
    };

    const formatDisplay = (val?: string) => {
        if (!val) return 'Select time...';
        const parts = val.split(':');
        if (parts.length !== 2) return val;
        let h = parseInt(parts[0], 10);
        const m = parts[1];
        const pm = h >= 12;
        h = h % 12 || 12;
        return `${String(h).padStart(2, '0')}:${m} ${pm ? 'PM' : 'AM'}`;
    };

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = ['00', '15', '30', '45'];

    return (
        <div className={styles.container} ref={containerRef}>
            <div 
                className={clsx(formStyles.input, styles.inputWrapper, error && formStyles.inputError, className)}
                onClick={() => setIsOpen(!isOpen)}
                id={id}
            >
                <span className={clsx(styles.value, !value && styles.placeholder)}>
                    {formatDisplay(value)}
                </span>
                <ClockIcon size={18} className={styles.icon} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={styles.popoverTime}
                    >
                        <div className={styles.timeColumns}>
                            <div className={styles.timeColumn}>
                                <div className={styles.timeLabel}>Hour</div>
                                <div className={styles.scrollList}>
                                    {hours.map(h => (
                                        <button
                                            key={h}
                                            type="button"
                                            onClick={() => handleSelect(h, parsedMin, isPM)}
                                            className={clsx(styles.timeBtn, hour12 === h && styles.timeSelected)}
                                        >
                                            {String(h).padStart(2, '0')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.timeColumn}>
                                <div className={styles.timeLabel}>Minute</div>
                                <div className={styles.scrollList}>
                                    {minutes.map(m => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => handleSelect(hour12, parseInt(m, 10), isPM)}
                                            className={clsx(styles.timeBtn, parsedMin === parseInt(m, 10) && styles.timeSelected)}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.timeColumn}>
                                <div className={styles.timeLabel}>AM/PM</div>
                                <div className={styles.ampmList}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(hour12, parsedMin, false)}
                                        className={clsx(styles.timeBtn, !isPM && styles.timeSelected)}
                                    >
                                        AM
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(hour12, parsedMin, true)}
                                        className={clsx(styles.timeBtn, isPM && styles.timeSelected)}
                                    >
                                        PM
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
