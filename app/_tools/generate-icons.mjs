// Regenerates the PWA / touch icons from a single inline SVG so the brand mark
// lives in one place. Run with: pnpm icons:generate
//
// Outputs:
//   public/icon-192.png   — manifest icon (see app/manifest.ts)
//   public/icon-512.png   — manifest icon
//   app/apple-icon.png    — Next serves this as the apple-touch-icon
//
// Design: dark rounded square (matches the site's dark theme color) with three
// accent "note" lines of descending width — an "Engineering Notes" mark, pure
// vector so it needs no fonts.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const BACKGROUND = "#0a0a0a";
const ACCENT = "#00d9ff";

const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="${BACKGROUND}"/>
  <rect x="140" y="168" width="232" height="26" rx="13" fill="${ACCENT}"/>
  <rect x="140" y="243" width="180" height="26" rx="13" fill="${ACCENT}" opacity="0.7"/>
  <rect x="140" y="318" width="140" height="26" rx="13" fill="${ACCENT}" opacity="0.45"/>
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
