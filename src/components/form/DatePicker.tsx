import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import formStyles from './Form.module.css';
import styles from './DateTimePicker.module.css';

interface DatePickerProps {
    value?: string; // YYYY-MM-DD
    onChange: (value: string) => void;
    id?: string;
    className?: string;
    error?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, id, className, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentMonth, setCurrentMonth] = useState(() => {
        if (value) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) return d;
        }
        return new Date();
    });

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const handleSelectDate = (day: number) => {
        const newDate = new Date(year, month, day);
        const y = newDate.getFullYear();
        const m = String(newDate.getMonth() + 1).padStart(2, '0');
        const d = String(newDate.getDate()).padStart(2, '0');
        onChange(`${y}-${m}-${d}`);
        setIsOpen(false);
    };

    const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

    const selectedDate = value ? new Date(value) : null;
    
    const formatDisplay = (val?: string) => {
        if (!val) return 'Select date...';
        const d = new Date(val);
        if (isNaN(d.getTime())) return val;
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

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
                <CalendarIcon size={18} className={styles.icon} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={styles.popover}
                    >
                        <div className={styles.header}>
                            <button type="button" onClick={prevMonth} className={styles.navBtn}>
                                <ChevronLeft size={18} />
                            </button>
                            <div className={styles.monthLabel}>
                                {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                            </div>
                            <button type="button" onClick={nextMonth} className={styles.navBtn}>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                        <div className={styles.grid}>
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                <div key={d} className={styles.dayName}>{d}</div>
                            ))}
                            {days.map((d, i) => {
                                if (d === null) return <div key={`empty-${i}`} />;
                                const isSelected = selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                                const isToday = new Date().getDate() === d && new Date().getMonth() === month && new Date().getFullYear() === year;
                                return (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => handleSelectDate(d)}
                                        className={clsx(
                                            styles.dayBtn, 
                                            isSelected && styles.daySelected,
                                            !isSelected && isToday && styles.dayToday
                                        )}
                                    >
                                        {d}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
