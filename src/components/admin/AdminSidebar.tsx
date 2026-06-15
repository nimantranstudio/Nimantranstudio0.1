'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { LayoutDashboard, Palette, Package, ShoppingCart, Settings, User } from 'lucide-react';
import styles from './AdminSidebar.module.css';

const MENU_ITEMS = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Themes', href: '/admin/themes', icon: Palette },
    { name: 'Bundles', href: '/admin/bundles', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                {MENU_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(styles.navItem, pathname === item.href && styles.active)}
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </Link>
                ))}

                <div className={styles.sectionTitle}>System</div>
                <Link
                    href="/admin/settings"
                    className={clsx(styles.navItem, pathname === '/admin/settings' && styles.active)}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </Link>
            </nav>

        </aside>
    );
}
