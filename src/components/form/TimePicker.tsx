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
    const selectedMinuteRef = useRef<HTMLButtonElement>(null);
    const selectedHourRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-scroll selected minute and hour into view when opened
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                selectedMinuteRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
                selectedHourRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }, 60);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

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
    // All 60 minutes from 00 to 59
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

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
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                        className={styles.popoverTime}
                    >
                        <div className={styles.timeColumns}>
                            <div className={styles.timeColumn}>
                                <div className={styles.timeLabel}>Hour</div>
                                <div className={styles.scrollList}>
                                    {hours.map(h => {
                                        const isSelected = hour12 === h;
                                        return (
                                            <button
                                                key={h}
                                                ref={isSelected ? selectedHourRef : null}
                                                type="button"
                                                onClick={() => handleSelect(h, parsedMin, isPM)}
                                                className={clsx(styles.timeBtn, isSelected && styles.timeSelected)}
                                            >
                                                {String(h).padStart(2, '0')}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={styles.timeColumn}>
                                <div className={styles.timeLabel}>Minute</div>
                                <div className={styles.scrollList}>
                                    {minutes.map(m => {
                                        const mInt = parseInt(m, 10);
                                        const isSelected = parsedMin === mInt;
                                        return (
                                            <button
                                                key={m}
                                                ref={isSelected ? selectedMinuteRef : null}
                                                type="button"
                                                onClick={() => handleSelect(hour12, mInt, isPM)}
                                                className={clsx(styles.timeBtn, isSelected && styles.timeSelected)}
                                            >
                                                {m}
                                            </button>
                                        );
                                    })}
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
