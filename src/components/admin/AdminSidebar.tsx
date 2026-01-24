'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { LayoutDashboard, Palette, Package, ShoppingCart, Settings, User, ChevronLeft, Menu } from 'lucide-react';
import styles from './AdminSidebar.module.css';

const MENU_ITEMS = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Themes', href: '/admin/themes', icon: Palette },
    { name: 'Bundles', href: '/admin/bundles', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside className={clsx(styles.sidebar, isCollapsed && styles.collapsed)}>
            <div className={styles.header}>
                {!isCollapsed && (
                    <div className={styles.logoArea}>
                        <div className={styles.logoIcon}>N</div>
                        <span className={styles.logoText}>Nimantran</span>
                    </div>
                )}
                <button
                    className={styles.toggleBtn}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expand" : "Collapse"}
                >
                    {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className={styles.nav}>
                {MENU_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(styles.navItem, pathname === item.href && styles.active)}
                        title={isCollapsed ? item.name : ""}
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </Link>
                ))}

                <div className={styles.sectionTitle}>System</div>
                <Link
                    href="/admin/settings"
                    className={clsx(styles.navItem, pathname === '/admin/settings' && styles.active)}
                    title={isCollapsed ? "Settings" : ""}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </Link>
            </nav>

            <div className={styles.userProfile}>
                <div className={styles.avatar}>
                    <User size={20} />
                </div>
                {!isCollapsed && (
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>Admin User</span>
                        <span className={styles.userRole}>Super Admin</span>
                    </div>
                )}
            </div>
        </aside>
    );
}
