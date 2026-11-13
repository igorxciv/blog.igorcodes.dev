// Regenerates the PWA / touch icons from a single inline SVG so the brand mark
// lives in one place. Run with: pnpm icons:generate
//
// Outputs:
//   public/icon-192.png   — manifest icon (see app/manifest.ts)
//   public/icon-512.png   — manifest icon
//   app/apple-icon.png    — Next serves this as the apple-touch-icon
//
// app/favicon.ico is built from the same mark (16/32/48 px), e.g. with
// ImageMagick: magick public/icon-192.png -define icon:auto-resize=48,32,16 app/favicon.ico
//
// Design: a sibling of the igorcodes.dev mark. The same near-black rounded
// tile inside a cyan ring, holding a text caret and two lines of writing in
// place of the initials. Pure vector, so it needs no fonts.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const BG = "#0a0a0a";
const RING = "#00bfe0";
const CARET = "#00d9ff";
const TEXT = "#e5e5e5";
const MUTED = "#6e6e6e";

const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="${BG}"/>
  <rect x="22" y="22" width="468" height="468" rx="92" fill="none" stroke="${RING}" stroke-width="20"/>
  <rect x="128" y="150" width="30" height="212" rx="6" fill="${CARET}"/>
  <rect x="196" y="196" width="188" height="36" rx="18" fill="${TEXT}"/>
  <rect x="196" y="280" width="128" height="36" rx="18" fill="${MUTED}"/>
</svg>`;

const targets = [
  { file: "public/icon-192.png", size: 192 },
  { file: "public/icon-512.png", size: 512 },
  { file: "app/apple-icon.png", size: 180 },
];

async function main() {
  const buffer = Buffer.from(svg);
  for (const { file, size } of targets) {
    const dest = path.join(rootDir, file);
    await mkdir(path.dirname(dest), { recursive: true });
    const png = await sharp(buffer).resize(size, size).png().toBuffer();
    await writeFile(dest, png);
    console.log(`icons: wrote ${file} (${size}x${size}, ${png.length} bytes)`);
  }
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exitCode = 1;
});
