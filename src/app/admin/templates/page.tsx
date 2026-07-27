'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Row {
    id: string;
    name: string;
    eventType?: string;
    status: string;
    updatedAt: string;
}

export default function TemplatesListPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/templates')
            .then((r) => r.json())
            .then((d) => setRows(d.templates || []))
            .catch(() => setRows([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{ maxWidth: 900, margin: '40px auto', padding: 24, fontFamily: 'var(--font-sans)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28 }}>Templates</h1>
                <Link
                    href="/admin/templates/editor"
                    style={{ background: 'var(--primary,#c8a951)', color: '#fff', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}
                >
                    + New template
                </Link>
            </div>

            {loading ? (
                <p>Loading…</p>
            ) : rows.length === 0 ? (
                <p style={{ color: '#666' }}>No templates yet. Create your first one — upload a background and place the text zones.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #e0ded7' }}>
                            <th style={{ padding: 10 }}>Name</th>
                            <th style={{ padding: 10 }}>Event</th>
                            <th style={{ padding: 10 }}>Status</th>
                            <th style={{ padding: 10 }}>Updated</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((t) => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #efeee9' }}>
                                <td style={{ padding: 10 }}>{t.name}</td>
                                <td style={{ padding: 10 }}>{t.eventType || '—'}</td>
                                <td style={{ padding: 10 }}>{t.status}</td>
                                <td style={{ padding: 10, color: '#666' }}>{new Date(t.updatedAt).toLocaleDateString()}</td>
                                <td style={{ padding: 10 }}>
                                    <Link href={`/admin/templates/editor?id=${t.id}`} style={{ color: 'var(--primary,#c8a951)' }}>
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
