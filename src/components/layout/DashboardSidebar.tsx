'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import { LogOut, CreditCard, Users, ShoppingBag, LayoutDashboard } from 'lucide-react';
import styles from '@/app/dashboard/dashboard.module.css';

export const DashboardSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useWeddingStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Wedding Assets', href: '/dashboard/assets', icon: CreditCard },
        { name: 'RSVP Manager', href: '/dashboard/rsvp', icon: Users },
        { name: 'Payment Details', href: '/dashboard/orders', icon: ShoppingBag },
    ];

    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    // Check if active: exact match for /dashboard, or starts with for others
                    const isActive = item.href === '/dashboard' 
                        ? pathname === '/dashboard'
                        : pathname?.startsWith(item.href);

                    return (
                        <Link 
                            key={item.href} 
                            href={item.href} 
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            <Icon size={18} className={styles.navIcon} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.sidebarFooter}>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};
