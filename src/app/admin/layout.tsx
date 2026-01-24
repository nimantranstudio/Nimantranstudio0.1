import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: '#f9fafb' }}>
            <AdminSidebar />
            <main style={{
                flex: 1,
                overflowY: 'auto',
                padding: '2rem',
                position: 'relative'
            }}>
                {children}
            </main>
        </div>
    );
}
