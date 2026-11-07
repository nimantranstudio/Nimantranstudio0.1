import type { Metadata } from 'next';
import { TemplateFrame, type FrameSource } from '@/website/components/TemplateFrame';

export const metadata: Metadata = {
    title: 'Website preview | Nimantran Studio',
    robots: { index: false, follow: false },
};

const SOURCES: FrameSource[] = ['sample', 'draft', 'draft-with-samples'];

/** Loaded only inside the preview iframe on the website selection, details and review pages. */
export default async function WebsiteFramePage({
    params,
    searchParams,
}: {
    params: Promise<{ templateId: string }>;
    searchParams: Promise<{ source?: string }>;
}) {
    const { templateId } = await params;
    const { source } = await searchParams;
    const resolved = SOURCES.includes(source as FrameSource) ? (source as FrameSource) : 'sample';
    return <TemplateFrame templateId={templateId} source={resolved} />;
}
