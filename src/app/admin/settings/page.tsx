'use client';

import { useState } from 'react';
import { Settings, Bell, Shield, Globe, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function SettingsPage() {
    const [corsStatus, setCorsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [corsMessage, setCorsMessage] = useState('');

    const handleSetupCors = async () => {
        setCorsStatus('loading');
        try {
            const res = await fetch('/api/admin/setup-storage-cors', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setCorsStatus('success');
                setCorsMessage(data.message || 'Done');
            } else {
                setCorsStatus('error');
                setCorsMessage(data.error || 'Failed');
            }
        } catch (err: any) {
            setCorsStatus('error');
            setCorsMessage(err.message);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Settings</h1>
                <p style={{ color: '#6b7280' }}>Configure global system parameters and preferences.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 280px) 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: '#f5f3ff', color: '#6366f1', border: 'none', textAlign: 'left', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Globe size={18} /> General
                    </button>
                    <button style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'transparent', color: '#4b5563', border: 'none', textAlign: 'left', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Bell size={18} /> Notifications
                    </button>
                    <button style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'transparent', color: '#4b5563', border: 'none', textAlign: 'left', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Shield size={18} /> Security
                    </button>
                </div>

                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
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

                        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Firebase Storage CORS
                            </label>
                            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                                Run this once to allow the admin panel to upload HTML templates directly to Firebase Storage.
                                Required to fix the "CORS" error when uploading templates.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <button
                                    onClick={handleSetupCors}
                                    disabled={corsStatus === 'loading' || corsStatus === 'success'}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
                                        background: corsStatus === 'success' ? '#10b981' : '#6366f1',
                                        color: 'white', fontWeight: '600', cursor: corsStatus === 'loading' ? 'wait' : 'pointer',
                                        opacity: corsStatus === 'loading' ? 0.7 : 1,
                                    }}
                                >
                                    {corsStatus === 'loading' && <Loader2 size={16} className="animate-spin" />}
                                    {corsStatus === 'success' && <CheckCircle size={16} />}
                                    {corsStatus === 'idle' || corsStatus === 'error' ? 'Configure Storage CORS' : corsStatus === 'loading' ? 'Configuring…' : 'CORS Configured'}
                                </button>
                                {corsMessage && (
                                    <span style={{ fontSize: '0.8rem', color: corsStatus === 'error' ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {corsStatus === 'error' && <AlertCircle size={14} />}
                                        {corsMessage}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary" style={{ backgroundColor: '#6366f1', borderColor: '#6366f1' }}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
