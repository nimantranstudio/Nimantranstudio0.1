import { templateFontsHref } from '@/lib/templates/fonts';

/**
 * Loads the template web fonts into the main document. Include once on any page
 * that renders CardRenderer (card surfaces, the editor).
 */
export function TemplateFonts() {
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link rel="stylesheet" href={templateFontsHref()} />
        </>
    );
}
