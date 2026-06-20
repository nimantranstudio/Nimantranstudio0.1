'use client';

import { Settings, Bell, Shield, Globe, Type } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [bannerMessages, setBannerMessages] = useState<Array<{icon: string, text: string, badge: string}>>([]);
    const [bannerActive, setBannerActive] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.success) {
                    if (data.settings?.banner_messages) {
                        setBannerMessages(data.settings.banner_messages);
                    }
                    if (data.settings?.banner_active !== undefined) {
                        setBannerActive(data.settings.banner_active);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        }
        fetchSettings();
    }, []);

    const handleAddMessage = () => {
        setBannerMessages(prev => [...prev, { icon: '✦', text: '', badge: '' }]);
    };

    const handleRemoveMessage = (index: number) => {
        setBannerMessages(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleUpdateMessage = (index: number, field: 'icon' | 'text' | 'badge', val: string) => {
        setBannerMessages(prev => prev.map((item, idx) => idx === index ? { ...item, [field]: val } : item));
    };

    const handleSaveBanner = async () => {
        setIsSaving(true);
        try {
            await auth.authStateReady();
            const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';

            const res1 = await fetch('/api/settings', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key: 'banner_messages', value: bannerMessages })
            });

            const res2 = await fetch('/api/settings', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key: 'banner_active', value: bannerActive })
            });

            if (res1.ok && res2.ok) {
                alert("Banner settings updated successfully!");
            } else {
                alert("Failed to update some settings.");
            }
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                    <input 
                                        type="checkbox" 
                                        id="bannerActive" 
                                        checked={bannerActive} 
                                        onChange={(e) => setBannerActive(e.target.checked)}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="bannerActive" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111827', cursor: 'pointer' }}>
                                        Enable Top Announcement Banner
                                    </label>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Announcement Messages (Rotating)</label>
                                        <button 
                                            type="button" 
                                            onClick={handleAddMessage}
                                            style={{ background: '#f5f3ff', color: '#6366f1', border: '1px solid #c7d2fe', padding: '0.375rem 0.75rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>
                                            + Add Message
                                        </button>
                                    </div>

                                    {bannerMessages.length === 0 ? (
                                        <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed #d1d5db', borderRadius: '8px', color: '#6b7280', fontSize: '0.875rem' }}>
                                            No announcement messages configured. Click "+ Add Message" to create one.
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            {bannerMessages.map((msg, index) => (
                                                <div key={index} style={{ padding: '1.25rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fcfcfc', position: 'relative' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase' }}>Message #{index + 1}</span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleRemoveMessage(index)}
                                                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.875rem', cursor: 'pointer', fontWeight: '600' }}>
                                                            Remove
                                                        </button>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                        <div>
                                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.25rem' }}>Message Text</label>
                                                            <textarea 
                                                                value={msg.text}
                                                                onChange={(e) => handleUpdateMessage(index, 'text', e.target.value)}
                                                                placeholder="e.g. Your wedding communication ready in <strong>5 mins</strong>."
                                                                rows={2} 
                                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.875rem', fontFamily: 'inherit' }} 
                                                            />
                                                        </div>

                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                            <div>
                                                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.25rem' }}>Badge Text</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={msg.badge} 
                                                                    onChange={(e) => handleUpdateMessage(index, 'badge', e.target.value)} 
                                                                    placeholder="e.g. New 🎉"
                                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.25rem' }}>Icon</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={msg.icon} 
                                                                    onChange={(e) => handleUpdateMessage(index, 'icon', e.target.value)} 
                                                                    placeholder="e.g. ✦"
                                                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
