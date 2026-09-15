'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

export function DeleteWeddingButton({ weddingId, coupleLabel }: { weddingId: string; coupleLabel: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${coupleLabel}"? This permanently removes the wedding, its events, RSVPs and generated cards. This cannot be undone.`)) {
            return;
        }
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/weddings/${weddingId}`, { method: 'DELETE' });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Delete failed');
            }
            router.refresh();
        } catch (err: any) {
            alert(`Could not delete: ${err.message}`);
            setIsDeleting(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label={`Delete ${coupleLabel}`}
            title="Delete this wedding"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                background: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FCA5A5',
                cursor: isDeleting ? 'default' : 'pointer',
                opacity: isDeleting ? 0.6 : 1,
                flexShrink: 0
            }}
        >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </button>
    );
}
