'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import { Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { clsx } from 'clsx';

const NAV_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'Themes', href: '/themes' },
    { name: 'RSVP', href: '/rsvp' },
    { name: 'Products', href: '/products' },
    { name: 'Blogs', href: '/blogs' },
];

export const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useWeddingStore();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    // Don't show header on specific focused RSVP pages (like voting/detail)
    // but keep it for creation/management
    // Don't show header on public RSVP pages (the invitation link)
    // accessible via /rsvp/[id]
    const isHidden = pathname?.startsWith('/rsvp/');


    return (
        <nav className={styles.navbar}>
            <div className={clsx("container", styles.navContainer)}>
                <Link href="/" className={styles.logo}>
                    <span>Nimantran<span>Studio</span></span>
                </Link>

                {/* Desktop Nav */}
                <div className={styles.desktopNav}>
                    <div className={styles.navLinks}>
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx(styles.navLink, pathname === link.href && styles.active)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className={styles.authAction}>
                        {hasMounted && isAuthenticated ? (
                            <Link href="/dashboard" className="btn btn-secondary" style={{ padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} />
                            </Link>
                        ) : (
                            <Link href="/login" className="btn btn-secondary">
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className={styles.mobileNav}>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(styles.mobileNavLink, pathname === link.href && styles.active)}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {hasMounted && isAuthenticated ? (
                        <Link href="/dashboard" className={clsx("btn btn-secondary", styles.mobileBtn)} onClick={() => setIsOpen(false)}>
                            <User size={18} style={{ marginRight: '0.5rem' }} /> Dashboard
                        </Link>
                    ) : (
                        <Link href="/login" className={clsx("btn btn-secondary", styles.mobileBtn)} onClick={() => setIsOpen(false)}>
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};
