import { getPrisma } from '@/lib/prisma';
import { BundleEditor } from '@/components/admin/BundleEditor';
import { notFound } from 'next/navigation';

export default async function EditBundlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const prisma = getPrisma();
    
    let bundle = null;
    let themes = [];
    let packages = [];
    let events = [];

    const [themesData, packagesData, eventsData] = await Promise.all([
        prisma.theme.findMany({ select: { id: true, name: true } }),
        prisma.package.findMany({ where: { isActive: true } }),
        prisma.event.findMany()
    ]);
    themes = themesData;
    packages = packagesData;
    events = eventsData;

    if (id !== 'new') {
        bundle = await prisma.bundle.findUnique({
            where: { id },
            include: {
                bundleItems: {
                    include: {
                        event: true
                    }
                },
                themeRef: true,
                bundleInvoices: true
            }
        });

        if (!bundle) {
            notFound();
        }
    }

    return <BundleEditor initialData={bundle} themes={themes} packages={packages} allEvents={events} bundleId={id} />;
}
