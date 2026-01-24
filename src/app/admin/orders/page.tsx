'use client';

import { ShoppingCart } from 'lucide-react';

export default function OrdersPage() {
    return (
        <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ width: '80px', height: '80px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#2563eb' }}>
                <ShoppingCart size={40} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Orders Management</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: '400px', textAlign: 'center' }}>
                This section will display recent customer orders, payment status, and delivery tracking once the payment gateway is integrated.
            </p>
            <button className="btn btn-primary" style={{ backgroundColor: '#6366f1', borderColor: '#6366f1' }}>
                Refresh Orders
            </button>
        </div>
    );
}
