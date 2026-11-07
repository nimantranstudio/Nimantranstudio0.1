/** URLs of the website journey, kept in one place so every page links the same way. */

/** Step 1: choose a design. */
export const websiteDesignsUrl = '/websites';

/** Step 2: the existing details page, in website mode. */
export const websiteDetailsUrl = (templateId: string, chapter?: number) =>
    `/details?flow=website&template=${encodeURIComponent(templateId)}${chapter ? `&chapter=${chapter}` : ''}`;

/**
 * The complete design with sample details, full screen and on its own. Opened
 * in a new tab from the design list; not a step in the journey.
 */
export const websiteFullPreviewUrl = (templateId: string) =>
    `/website-frame/${encodeURIComponent(templateId)}?source=sample`;

/** The customer's own website, full screen, from what they've entered so far. */
export const websiteDraftPreviewUrl = (templateId: string) =>
    `/website-frame/${encodeURIComponent(templateId)}?source=draft`;
