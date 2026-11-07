import { redirect } from 'next/navigation';
import { getWebsiteTemplate } from '@/website/templates/registry';
import { websiteDesignsUrl, websiteDetailsUrl } from '@/website/journey';

/**
 * The separate review step was removed from the journey: the details page now
 * goes straight to Publish & Pay. Kept as a redirect so an old or bookmarked
 * review link lands back on the details (nothing entered is lost — it lives in
 * the browser).
 */
export default async function WebsiteReviewRedirect({ params }: { params: Promise<{ templateId: string }> }) {
    const { templateId } = await params;
    redirect(getWebsiteTemplate(templateId) ? websiteDetailsUrl(templateId) : websiteDesignsUrl);
}
