'use client';

import React from 'react';

const WEBSITE_GOOGLE_FONTS_HREF =
    'https://fonts.googleapis.com/css2?' +
    [
        'family=Cinzel:wght@400;500;600;700',
        'family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700',
        'family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500',
        'family=Great+Vibes',
        'family=Fraunces:ital,opsz,wght@0,9..144,500..700;1,9..144,500..700',
        'family=Sora:wght@400;500;600;700',
        'family=Tiro+Devanagari+Sanskrit:ital@0;1',
        'family=Tiro+Devanagari+Hindi:ital@0;1',
        'family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;1,6..96,400;1,6..96,500',
        'family=Marcellus',
        'family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500',
        'family=Jost:wght@300;400;500;600',
        'family=Manrope:wght@400;500;600;700',
        'family=Rozha+One',
        'family=Poppins:ital,wght@0,400;0,500;0,600;1,400',
        'family=Amita:wght@400;700',
    ].join('&') +
    '&display=swap';

/**
 * Loads the curated typography families for the wedding website templates.
 * Uses preconnect + swap so text renders immediately with fallback serifs/sans
 * and upgrades seamlessly without blocking initial paint.
 */
export function WebsiteTemplateFonts() {
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link rel="stylesheet" href={WEBSITE_GOOGLE_FONTS_HREF} />
        </>
    );
}

