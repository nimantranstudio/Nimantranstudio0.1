import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FDFBF7' }}>
            <AdminHeader />

            {/* Main Content Area */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
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
        </div>
    );
}
