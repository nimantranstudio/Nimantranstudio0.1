'use client';

import { Settings, Bell, Shield, Globe, Type } from 'lucide-react';
import { useState, useEffect } from 'react';
export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [bannerText, setBannerText] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.success && data.settings?.banner_messages) {
                    // Extract just the text from the first message for simplicity in the UI
                    const msgs = data.settings.banner_messages;
                    if (msgs.length > 0) {
                        setBannerText(msgs[0].text);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        }
        fetchSettings();
    }, []);

    const handleSaveBanner = async () => {
        setIsSaving(true);
        try {
            const newBannerMessages = [
                {
                    icon: '✦',
                    text: bannerText,
                    badge: 'Update 🎉',
                }
            ];
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'banner_messages', value: newBannerMessages })
            });
            alert("Banner updated successfully!");
        } catch (e) {
            console.error(e);
            alert("Failed to update banner.");
        }
        setIsSaving(false);
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Settings</h1>
                <p style={{ color: '#6b7280' }}>Configure global system parameters and preferences.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 280px) 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button 
                        onClick={() => setActiveTab('general')}
                        style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: activeTab === 'general' ? '#f5f3ff' : 'transparent', color: activeTab === 'general' ? '#6366f1' : '#4b5563', border: 'none', textAlign: 'left', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <Globe size={18} /> General
                    </button>
                    <button 
                        onClick={() => setActiveTab('ui')}
                        style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: activeTab === 'ui' ? '#f5f3ff' : 'transparent', color: activeTab === 'ui' ? '#6366f1' : '#4b5563', border: 'none', textAlign: 'left', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <Type size={18} /> UI & Messaging
                    </button>
                    <button style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'transparent', color: '#4b5563', border: 'none', textAlign: 'left', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <Bell size={18} /> Notifications
                    </button>
                    <button style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'transparent', color: '#4b5563', border: 'none', textAlign: 'left', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <Shield size={18} /> Security
                    </button>
                </div>

                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    {activeTab === 'general' && (
                        <>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>General Settings</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Site Name</label>
                                    <input type="text" defaultValue="Nimantran Studio" style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Support Email</label>
                                    <input type="email" defaultValue="support@nimantran.com" style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Default Currency</label>
                                    <select style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white' }}>
                                        <option>INR (₹)</option>
                                        <option>USD ($)</option>
                                    </select>
                                </div>

                                <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-primary" style={{ backgroundColor: '#6366f1', borderColor: '#6366f1' }}>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'ui' && (
                        <>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>UI & Messaging</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Top Banner Announcement</label>
                                    <textarea 
                                        value={bannerText}
                                        onChange={(e) => setBannerText(e.target.value)}
                                        placeholder="e.g. Your wedding communication ready in <strong>5 mins</strong>."
                                        rows={3} 
                                        style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db', fontFamily: 'inherit' }} 
                                    />
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>You can use basic HTML tags like &lt;strong&gt; for bold text.</p>
                                </div>

                                <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={handleSaveBanner}
                                        disabled={isSaving}
                                        style={{ backgroundColor: '#6366f1', borderColor: '#6366f1', opacity: isSaving ? 0.7 : 1 }}>
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
