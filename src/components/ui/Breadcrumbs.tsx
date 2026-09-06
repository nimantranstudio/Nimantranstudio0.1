'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={`${styles.nav} ${className || ''}`}>
            <ol className={styles.list}>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const isActive = item.active || isLast;

                    return (
                        <li key={index} className={styles.item}>
                            {item.href && !isActive ? (
                                <Link href={item.href} className={styles.link}>
                                    <span className={styles.linkText}>{item.label}</span>
                                </Link>
                            ) : (
                                <span className={styles.current} aria-current="page" title={item.label}>
                                    {item.label}
                                </span>
                            )}

                            {!isLast && (
                                <span className={styles.separator} aria-hidden="true">
                                    <ChevronRight size={11} strokeWidth={2.2} />
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
