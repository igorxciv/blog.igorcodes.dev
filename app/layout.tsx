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
import { archivo, jetbrainsMono, sourceSerif } from "./fonts";

// Configurable per-environment; the script only loads when an ID is provided
// (so local dev stays analytics-free). See .env.example.
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const UMAMI_SCRIPT_URL =
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ??
  "https://cloud.umami.is/script.js";

// Applies a stored theme override before first paint. No stored value means
// "follow the system": CSS handles that on its own, so this only pins.
const themeInitScript = `
  (() => {
    try {
      const stored = window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
      if (stored !== "light" && stored !== "dark") return;
      const root = document.documentElement;
      root.dataset.theme = stored;
      const color = stored === "light" ? ${JSON.stringify(LIGHT_THEME_COLOR)} : ${JSON.stringify(DARK_THEME_COLOR)};
      for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
        meta.setAttribute("content", color);
      }
    } catch {}
  })();
`;

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: LIGHT_THEME_COLOR },
    { media: "(prefers-color-scheme: dark)", color: DARK_THEME_COLOR },
  ],
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
    "engineering day-book",
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
      className={`${sourceSerif.variable} ${archivo.variable} ${jetbrainsMono.variable}`}
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
