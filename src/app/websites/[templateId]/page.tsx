import { redirect } from 'next/navigation';
import { websiteDesignsUrl } from '@/website/journey';

/**
 * The separate preview step was removed from the journey: designs are now
 * previewed on /websites (phone mockup, plus a full-screen preview in a new
 * tab). Kept as a redirect so any old link to /websites/[templateId] still
 * lands on the design list. /websites/[templateId]/review is unaffected.
 */
export default function WebsitePreviewRedirect() {
    redirect(websiteDesignsUrl);
}
