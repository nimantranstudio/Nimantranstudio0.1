'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useWeddingStore } from '@/store/wedding-store';
import { 
    Menu, 
    X, 
    LogOut, 
    LayoutDashboard, 
    ChevronDown, 
    CreditCard, 
    User, 
    Shield, 
    ArrowRight 
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';
import { clsx } from 'clsx';

const NAV_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'Themes', href: '/themes' },
];

export const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false); // Mobile Menu
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile Dropdown
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);

    const { isAuthenticated, isAdmin, userPhone, logout } = useWeddingStore();
    const [hasMounted, setHasMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHasMounted(true);

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
            setIsScrolled(window.scrollY > 15);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
        setIsProfileOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });
        logout();
        setIsProfileOpen(false);
        router.push('/');
    };

    const getDisplayName = () => {
        if (isAdmin) return 'NS Admin';
        if (userPhone && userPhone.length >= 10) return userPhone;
        return 'My Account';
    };

    const getInitial = () => {
        if (isAdmin) return 'A';
        if (userPhone && userPhone.length >= 2) return userPhone.slice(-2);
        return 'N';
    };

    return (
        <header className={clsx(styles.header, isScrolled && styles.scrolled)} suppressHydrationWarning>
            <div className={styles.navContainer}>
                {/* 1. Brand Logo on Left */}
                <Link href="/" className={styles.logo} aria-label="Nimantran Studio Home">
                    <Image
                        src="/logo.png"
                        alt="Nimantran Studio"
                        width={180}
                        height={46}
                        className={styles.logoImage}
                        priority
                    />
                </Link>

                {/* 2. Grouped Nav Links on Right (Clean single row, no outer capsule) */}
                <div className={styles.rightGroup} suppressHydrationWarning>
                    <nav 
                        className={styles.navRow} 
                        onMouseLeave={() => setHoveredNav(null)}
                        aria-label="Main Navigation"
                    >
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            const isHovered = hoveredNav === link.href;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={clsx(
                                        styles.navLink,
                                        isActive && styles.activeLink
                                    )}
                                    onMouseEnter={() => setHoveredNav(link.href)}
                                >
                                    {/* Hover sliding pill with warm ivory/yellow tone */}
                                    {isHovered && (
                                        <motion.div
                                            layoutId="navHoverPill"
                                            className={styles.hoverPill}
                                            transition={{ type: 'spring', bounce: 0.15, duration: 0.28 }}
                                        />
                                    )}

                                    <span className={styles.linkText}>{link.name}</span>

                                    {/* Active Route Indicator Dot */}
                                    {isActive && !isHovered && (
                                        <motion.span 
                                            layoutId="activeDot"
                                            className={styles.activeDot}
                                            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}

                        {/* Account / Profile Action */}
                        {hasMounted && isAuthenticated ? (
                            /* Authenticated Profile Dropdown */
                            <div className={styles.profileWrapper} ref={dropdownRef}>
                                <button
                                    className={clsx(styles.profileChip, isProfileOpen && styles.profileChipActive)}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    aria-expanded={isProfileOpen}
                                    aria-label="User Account Menu"
                                >
                                    <span className={styles.avatar}>
                                        {isAdmin ? <Shield size={13} /> : <User size={13} />}
                                    </span>
                                    <span className={styles.profileLabel}>My Nimantran</span>
                                    <ChevronDown 
                                        size={13} 
                                        className={clsx(styles.chevron, isProfileOpen && styles.chevronRotated)} 
                                    />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            className={styles.dropdownMenu}
                                            initial={{ opacity: 0, scale: 0.95, y: -6 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -6 }}
                                            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
                                        >
                                            <div className={styles.dropdownHeader}>
                                                <div className={styles.headerAvatar}>
                                                    {getInitial()}
                                                </div>
                                                <div className={styles.headerMeta}>
                                                    <span className={styles.userName}>{getDisplayName()}</span>
                                                    <span className={styles.userBadge}>
                                                        {isAdmin ? 'Administrator' : 'Active Member'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={styles.dropdownBody}>
                                                <Link
                                                    href="/dashboard"
                                                    className={styles.dropdownItem}
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <LayoutDashboard size={16} className={styles.itemIcon} />
                                                    <span>RSVP Dashboard</span>
                                                    <ArrowRight size={13} className={styles.itemArrow} />
                                                </Link>

                                                <Link
                                                    href="/dashboard/orders"
                                                    className={styles.dropdownItem}
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <CreditCard size={16} className={styles.itemIcon} />
                                                    <span>Payment & Orders</span>
                                                    <ArrowRight size={13} className={styles.itemArrow} />
                                                </Link>

                                                <button 
                                                    onClick={handleLogout} 
                                                    className={clsx(styles.dropdownItem, styles.logoutItem)}
                                                >
                                                    <LogOut size={16} className={styles.itemIcon} />
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            /* Logged-out State: Clean Login Button */
                            <Link href="/login" className={styles.loginBtn}>
                                Log in
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Toggle Button */}
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close Menu" : "Open Menu"}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Sheet Navigation with Staggered Entrance */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            className={styles.mobileOverlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            className={styles.mobileDrawer}
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
                        >
                            <div className={styles.mobileNavLinks}>
                                {NAV_LINKS.map((link, idx) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05, duration: 0.2 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className={clsx(
                                                styles.mobileNavLink,
                                                pathname === link.href && styles.mobileNavActive
                                            )}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span>{link.name}</span>
                                            {pathname === link.href && (
                                                <span className={styles.mobileActiveDot} />
                                            )}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <div className={styles.mobileActions} suppressHydrationWarning>
                                {hasMounted && isAuthenticated ? (
                                    <div className={styles.mobileAuthCard}>
                                        <div className={styles.mobileUserRow}>
                                            <div className={styles.headerAvatar}>{getInitial()}</div>
                                            <div>
                                                <div className={styles.mobileUserName}>{getDisplayName()}</div>
                                                <div className={styles.userBadge}>
                                                    {isAdmin ? 'Administrator' : 'Active Account'}
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            href="/dashboard"
                                            className={styles.mobileActionBtn}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <LayoutDashboard size={16} />
                                            <span>Dashboard</span>
                                        </Link>

                                        <Link
                                            href="/dashboard/orders"
                                            className={styles.mobileActionBtn}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <CreditCard size={16} />
                                            <span>Payment Details</span>
                                        </Link>

                                        <button
                                            onClick={() => { handleLogout(); setIsOpen(false); }}
                                            className={clsx(styles.mobileActionBtn, styles.mobileLogoutBtn)}
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.mobileGuestActions}>
                                        <Link
                                            href="/themes"
                                            className={styles.mobileCtaBtn}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span>Explore Themes</span>
                                        </Link>
                                        <Link
                                            href="/login"
                                            className={styles.mobileLoginBtn}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Log In
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};
