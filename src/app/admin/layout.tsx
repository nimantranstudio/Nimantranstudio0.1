import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
            <AdminSidebar />
            <main style={{ flex: 1, marginLeft: '260px', padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
}
