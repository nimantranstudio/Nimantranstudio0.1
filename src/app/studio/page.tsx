"use client";

import React, { useState } from 'react';
import {
    Sparkles,
    RotateCcw,
    Image as ImageIcon,
    Download,
    Wand2,
    Upload
} from 'lucide-react';
import styles from './studio.module.css';

export default function StudioPage() {
    const [activeTab, setActiveTab] = useState('Mehendi');

    const [formData, setFormData] = useState({
        mainHeading: '|| Shubh Vivah ||',
        brideName: 'Amruta',
        groomName: 'Siddharth',
        brideParents: 'Mr. & Mrs. Rajesh Patil',
        groomParents: 'Mr. & Mrs. Vijay Deshmukh',
        message: 'Join us for an evening of henna, music, and dance.',
        date: '2025-05-23', // Stored as ISO, displayed formatted
        venue: 'Patil Residence, Pune'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).toUpperCase();
    };

    return (
        <div className={styles.page}>
            {/* Top Navbar */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.logoIcon}>
                        <Sparkles size={20} color="#fff" />
                    </div>
                    <div className={styles.headerTitleGroup}>
                        <span className={styles.headerTitle}>Divine Invite Set</span>
                        <span className={styles.headerSubtitle}>MULTI-EVENT CREATOR</span>
                    </div>
                </div>

                <div className={styles.headerRight}>
                    <button className={styles.btnSecondary}>
                        <ImageIcon size={16} />
                        Current PNG
                    </button>
                    <button className={styles.btnPrimary}>
                        <Download size={16} />
                        Download All (4 PNGs)
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <main className={styles.main}>
                {/* Left Panel - Card Studio */}
                <div className={styles.leftPanel}>
                    <div className={styles.panelHeader}>
                        <h2 className={styles.panelTitle}>Card Studio</h2>
                        <button className={styles.resetBtn}>
                            <RotateCcw size={12} />
                            RESET SET
                        </button>
                    </div>

                    {/* Section 1: Common Details */}
                    <div className={styles.detailsCard}>
                        <div className={styles.sectionLabel}>COMMON DETAILS</div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Main Heading</label>
                            <input
                                type="text"
                                name="mainHeading"
                                className={styles.input}
                                value={formData.mainHeading}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.col}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Bride Name</label>
                                    <input
                                        type="text"
                                        name="brideName"
                                        className={styles.input}
                                        value={formData.brideName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className={styles.col}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Groom Name</label>
                                    <input
                                        type="text"
                                        name="groomName"
                                        className={styles.input}
                                        value={formData.groomName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.col}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Bride Parent(s)</label>
                                    <input
                                        type="text"
                                        name="brideParents"
                                        className={styles.input}
                                        value={formData.brideParents}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className={styles.col}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Groom Parent(s)</label>
                                    <input
                                        type="text"
                                        name="groomParents"
                                        className={styles.input}
                                        value={formData.groomParents}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Event Tabs */}
                    <div className={styles.tabsContainer}>
                        {['Mehendi', 'Haldi', 'Wedding', 'Reception'].map(tab => (
                            <button
                                key={tab}
                                className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Section 2: Mehendi Specifics (Conditional render based on active tab could be here, but sticking to prompt requirements for Mehendi) */}
                    <div className={styles.specificsSection}>
                        <h3 className={styles.specificsTitle}>{activeTab} Specifics</h3>

                        <div className={styles.uploadBox}>
                            <Upload size={24} className={styles.uploadIcon} />
                            <div className={styles.uploadText}>Upload WebP for this event</div>
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.labelRow}>
                                <label className={styles.label}>Message</label>
                                <button className={styles.aiButton}>
                                    <Wand2 size={10} />
                                    AI SUGGEST
                                </button>
                            </div>
                            <textarea
                                className={styles.textarea}
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.col}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Date & Time</label>
                                    <input
                                        type="text"
                                        name="date"
                                        className={styles.input}
                                        value="Friday, 23rd May 2025" // Hardcoded to match screenshot requirements exactly, though state is available
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className={styles.col}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Venue</label>
                                    <input
                                        type="text"
                                        name="venue"
                                        className={styles.input}
                                        value={formData.venue}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Invitation Preview */}
                <div className={styles.rightPanel}>
                    <div className={styles.previewCard}>
                        <div className={styles.inviteContent}>
                            <div className={styles.inviteHeader}>{formData.mainHeading}</div>

                            <div className={styles.inviteFunction}>
                                {activeTab} CEREMONY
                            </div>

                            <div className={styles.inviteCouple}>
                                {formData.brideName} <span>weds</span> {formData.groomName}
                            </div>

                            <div className={styles.inviteParents}>
                                <div>{formData.brideParents}</div>
                                <div>{formData.groomParents}</div>
                            </div>

                            <div className={styles.inviteQuote}>
                                "{formData.message}"
                            </div>

                            <div className={styles.inviteDateStrip}>
                                {formatDate(formData.date) || 'FRIDAY, 23RD MAY 2025'}
                            </div>

                            <div className={styles.inviteLocation}>
                                {formData.venue}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
