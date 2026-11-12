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
// Design: the day-book's cover. Dark green book cloth, the gilt-bordered
// label with two lines of lettering, and the red rule along the foot of the
// board. Pure vector, so it needs no fonts.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const CLOTH = "#203a2f";
const GILT = "#c9b98a";
const CLOTH_INK = "#efe6c8";
const RED = "#b3311f";

const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="${CLOTH}"/>
  <rect x="104" y="120" width="304" height="196" fill="none" stroke="${GILT}" stroke-width="14"/>
  <rect x="148" y="170" width="216" height="42" fill="${CLOTH_INK}"/>
  <rect x="148" y="240" width="128" height="22" fill="${GILT}"/>
  <rect x="0" y="392" width="512" height="18" fill="${RED}"/>
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
