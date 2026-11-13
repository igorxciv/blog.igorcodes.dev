import { type Metadata, type Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteShell } from "@/components/blog/site-shell";
import { buildPersonJsonLd, buildWebsiteJsonLd, jsonLdString } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import {
  DARK_THEME_COLOR,
  LIGHT_THEME_COLOR,
  THEME_STORAGE_KEY,
} from "@/lib/theme";
import { dankMono, wotfard, wotfardItalic } from "./fonts";

// Configurable per-environment; the script only loads when an ID is provided
// (so local dev stays analytics-free). See .env.example.
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const UMAMI_SCRIPT_URL =
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ??
  "https://cloud.umami.is/script.js";

// Dark is the default. A reader who switched to light keeps it: this runs
// before first paint so the page never flashes dark first.
const themeInitScript = `
  (() => {
    try {
      if (window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}) !== "light") return;
      document.documentElement.dataset.theme = "light";
      for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
        meta.setAttribute("content", ${JSON.stringify(LIGHT_THEME_COLOR)});
      }
    } catch {}
  })();
`;

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: DARK_THEME_COLOR,
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    // No site-wide canonical: each page sets its own so new top-level routes
    // are never mislabeled as /blog. Only the genuinely site-wide feed
    // alternates live here.
    types: {
      "application/rss+xml": "/rss.xml",
      "application/feed+json": "/feed.json",
    },
  },
  applicationName: siteConfig.name,
  category: "technology",
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  keywords: [
    "engineering essays",
    "software architecture",
    "technical debt",
    "AI and learning",
    "engineering leadership",
  ],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = buildWebsiteJsonLd();
  const personJsonLd = buildPersonJsonLd();

  return (
    <html
      lang="en"
      className={`${wotfard.variable} ${wotfardItalic.variable} ${dankMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {UMAMI_WEBSITE_ID ? (
          <Script
            src={UMAMI_SCRIPT_URL}
            data-website-id={UMAMI_WEBSITE_ID}
            data-domains={siteConfig.domain}
            data-do-not-track="true"
            strategy="afterInteractive"
          />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(personJsonLd) }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
