---
name: seo-master
description: Technical SEO engineering skill for Next.js and web applications. Automates dynamic metadata (Open Graph, Twitter cards, canonicals), Google Rich Results JSON-LD schema (Organization, Product, Event, FAQPage, BreadcrumbList), XML sitemaps, robots.txt, Core Web Vitals (LCP/CLS/INP), and on-page semantic hierarchy.
---

# SEO Master: Technical SEO & Structured Data Playbook

This skill defines the technical SEO, structured data, and search engine optimization standards for Next.js applications and modern web platforms.

---

## 1. Dynamic Metadata Standards (Next.js App Router)

Every public page must define either a static `Metadata` object or an async `generateMetadata()` function with:

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Target Keyword Rich Title | Brand Name',
  description: 'Concise 150-160 character description containing primary and secondary keywords.',
  alternates: {
    canonical: 'https://www.nimantranstudio.in/current-path',
  },
  openGraph: {
    title: 'Engaging Social Title',
    description: 'Social sharing description.',
    url: 'https://www.nimantranstudio.in/current-path',
    siteName: 'Nimantran Studio',
    images: [
      {
        url: 'https://www.nimantranstudio.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Descriptive image alt text',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Sharing Title',
    description: 'Twitter sharing description.',
    images: ['https://www.nimantranstudio.in/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

### Private / Authenticated Pages Rule
All private routes (`/admin/*`, `/dashboard/*`, `/auth/*`) MUST have:
```typescript
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
```

---

## 2. Google Search Structured Data (JSON-LD)

Inject Google-valid JSON-LD using `<script type="application/ld+json">` inside server components:

### A. Organization & WebSite (`RootLayout`)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.nimantranstudio.in/#organization",
      "name": "Nimantran Studio",
      "url": "https://www.nimantranstudio.in",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://www.nimantranstudio.in/#logo",
        "url": "https://www.nimantranstudio.in/icon.png",
        "caption": "Nimantran Studio"
      },
      "sameAs": []
    },
    {
      "@type": "WebSite",
      "@id": "https://www.nimantranstudio.in/#website",
      "url": "https://www.nimantranstudio.in",
      "name": "Nimantran Studio",
      "publisher": { "@id": "https://www.nimantranstudio.in/#organization" }
    }
  ]
}
```

### B. FAQPage Schema (`FaqSection`)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text here?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Detailed answer text."
      }
    }
  ]
}
```

### C. Product & AggregateOffer Schema (`ThemeDetailPage` / `Pricing`)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Theme Name",
  "description": "Theme description...",
  "image": "https://www.nimantranstudio.in/theme.jpg",
  "offers": {
    "@type": "Offer",
    "price": "999",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "url": "https://www.nimantranstudio.in/themes/theme-id"
  }
}
```

### D. BreadcrumbList Schema (`Breadcrumbs`)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.nimantranstudio.in"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Themes",
      "item": "https://www.nimantranstudio.in/themes"
    }
  ]
}
```

---

## 3. Sitemaps & Robots Automation

### Dynamic Sitemap (`src/app/sitemap.ts`)
- Query dynamic items with `isActive: true` filter.
- Set accurate `lastModified` timestamp.
- Assign appropriate priority:
  - Homepage: `1.0` (Daily)
  - Themes & Pricing: `0.9` (Weekly)
  - Theme Details: `0.8` (Weekly)
  - Blog Posts: `0.7` (Monthly)
  - Legal & Info: `0.3` (Monthly)

### Dynamic Robots (`src/app/robots.ts`)
- Allow public crawlers (`Googlebot`, `Bingbot`, `*`).
- Explicitly disallow `/admin/`, `/dashboard/`, `/api/`.
- Link to the absolute `sitemap.xml` URL.

---

## 4. On-Page SEO & Core Web Vitals Checklist

1. **Heading Hierarchy**: Exactly one `<h1>` per page. Sub-sections strictly use sequential `<h2>` and `<h3>`. Never skip levels for visual sizing (use CSS classes for size instead).
2. **Image Performance**:
   - Above-the-fold hero image: `priority={true}` and `fetchPriority="high"`.
   - Explicit `sizes` attribute matching viewport breakpoints.
   - Descriptive `alt` attribute describing the content for screen readers & search bots.
3. **Internal Linking**:
   - Use Next.js `<Link>` components with descriptive anchor text (avoid vague "click here" or "read more").
