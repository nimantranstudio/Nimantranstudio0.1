'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';
import { clsx } from 'clsx';

const NAV_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'Themes', href: '/themes' },
    { name: 'Blog', href: '/blogs' },
];

export const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false); // Mobile Menu
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile Dropdown
    const [isScrolled, setIsScrolled] = useState(false);

    const { isAuthenticated, isAdmin, userPhone, logout } = useWeddingStore();
    const [hasMounted, setHasMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHasMounted(true);

        // Click outside listener for dropdown
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        router.push('/');
    };

    // User Display Name Logic
    const getDisplayName = () => {
        if (isAdmin) return 'NSAdmin';
        if (userPhone && userPhone.length >= 10) return userPhone;
        return 'Guest User';
    };

    return (
        <nav className={clsx(styles.navbar, isScrolled && styles.scrolled)}>
            <div className={clsx("container", styles.navContainer)}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo.png"
                        alt="Nimantran Studio - Digital Wedding Invitations India"
                        width={180}
                        height={50}
                        className={styles.logoImage}
                        priority
                    />
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
                            <div className={styles.profileDropdown} ref={dropdownRef}>
                                <button
                                    className={clsx(styles.profileBtn, isProfileOpen && styles.active)}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    <span>Login</span>
                                    <ChevronDown size={14} className={clsx(styles.chevron, isProfileOpen && styles.rotated)} />
                                </button>

                                {isProfileOpen && (
                                    <div className={styles.dropdownMenu}>
                                        <div className={styles.dropdownHeader}>
                                            <span className={styles.userName}>Hi, {getDisplayName()}</span>
                                            <span className={styles.userRole}>User Account</span>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            className={styles.dropdownItem}
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <LayoutDashboard size={16} />
                                            Dashboard
                                        </Link>
                                        <button onClick={handleLogout} className={clsx(styles.dropdownItem, styles.logout)}>
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className={styles.profileBtn}>
                                <span>Login</span>
                                <ChevronDown size={14} className={styles.chevron} />
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
                        <>
                            <div style={{ padding: '1rem', borderTop: '1px solid #eee', marginTop: '0.5rem' }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Hi, {getDisplayName()}</div>
                                <Link
                                    href="/dashboard"
                                    className={clsx("btn btn-secondary", styles.mobileBtn)}
                                    onClick={() => setIsOpen(false)}
                                    style={{ marginBottom: '0.5rem' }}
                                >
                                    <LayoutDashboard size={18} style={{ marginRight: '0.5rem' }} />
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className={clsx("btn btn-secondary", styles.mobileBtn)}
                                    style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2' }}
                                >
                                    <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Logout
                                </button>
                            </div>
                        </>
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
