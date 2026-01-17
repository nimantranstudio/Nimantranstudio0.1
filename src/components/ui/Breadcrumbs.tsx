import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <ol className={styles.breadcrumbList}>
                {items.map((item, index) => (
                    <li key={index} className={styles.item}>
                        {item.href && !item.active ? (
                            <Link href={item.href} className={styles.link}>
                                {item.label}
                            </Link>
                        ) : (
                            <span className={item.active ? styles.active : styles.link}>
                                {item.label}
                            </span>
                        )}
                        {index < items.length - 1 && (
                            <span className={styles.separator}>/</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
