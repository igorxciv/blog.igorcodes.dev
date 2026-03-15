import localFont from "next/font/local";

export const wotfard = localFont({
  src: [
    {
      path: "./fonts/wotfard/wotfard-regular-webfont.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/wotfard/wotfard-regularitalic-webfont.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/wotfard/wotfard-medium-webfont.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/wotfard/wotfard-mediumitalic-webfont.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/wotfard/wotfard-semibold-webfont.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/wotfard/wotfard-semibolditalic-webfont.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/wotfard/wotfard-bold-webfont.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/wotfard/wotfard-bolditalic-webfont.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-wotfard",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const dankMono = localFont({
  src: [
    {
      path: "./fonts/dank-mono/DankMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/dank-mono/DankMono-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/dank-mono/DankMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-dank-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
  adjustFontFallback: false,
});
