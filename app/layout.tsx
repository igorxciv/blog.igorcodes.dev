import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/blog";
import { dankMono, wotfard } from "./fonts";

export const metadata: Metadata = {
  title: {
    default: "Engineering Notes",
    template: "%s | Engineering Notes",
  },
  description: "A minimal, MDX-powered engineering blog focused on software architecture, frontend engineering, and AI systems.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${wotfard.variable} ${dankMono.variable}`} suppressHydrationWarning>
      <body className={`${wotfard.className} antialiased`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
