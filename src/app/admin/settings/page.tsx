'use client';

import { Settings, Bell, Shield, Globe } from 'lucide-react';

export default function SettingsPage() {
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
