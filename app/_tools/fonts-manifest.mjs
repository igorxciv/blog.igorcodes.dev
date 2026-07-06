// Single source of truth for the licensed font files.
//
// Wotfard (Atipo Foundry) and Dank Mono are commercial, non-redistributable
// fonts, so their `.woff2` binaries are NOT committed to this (public) repo.
// They live in a private Vercel Blob store and are fetched into `app/fonts/`
// at build time (see fetch-fonts.mjs), because `app/fonts.ts` loads them with
// `next/font/local` and Next.js needs the files on disk when it builds.
//
// Paths below are relative to the `app/` directory and double as the blob
// pathnames in the store.
export const FONT_FILES = [
  "fonts/wotfard/wotfard-regular-webfont.woff2",
  "fonts/wotfard/wotfard-regularitalic-webfont.woff2",
  "fonts/wotfard/wotfard-medium-webfont.woff2",
  "fonts/wotfard/wotfard-mediumitalic-webfont.woff2",
  "fonts/wotfard/wotfard-semibold-webfont.woff2",
  "fonts/wotfard/wotfard-semibolditalic-webfont.woff2",
  "fonts/wotfard/wotfard-bold-webfont.woff2",
  "fonts/wotfard/wotfard-bolditalic-webfont.woff2",
  "fonts/dank-mono/DankMono-Regular.woff2",
  "fonts/dank-mono/DankMono-Italic.woff2",
  "fonts/dank-mono/DankMono-Bold.woff2",
];
