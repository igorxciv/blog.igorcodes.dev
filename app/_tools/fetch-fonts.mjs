// Populate `app/fonts/` before `next build` runs.
//
// The licensed `.woff2` files are not in git (see fonts-manifest.mjs). This
// script is idempotent: if the files already exist on disk (local dev, where
// you keep your own licensed copies) it does nothing and needs no credentials.
// On Vercel — where `app/fonts/` starts empty and `BLOB_READ_WRITE_TOKEN` is
// injected by the connected Blob store — it downloads the missing files so that
// `next/font/local` (in app/fonts.ts) can resolve them during the build.
//
// Token-less machines (contributors, CI without the secret) can still build by
// running with `FONTS_FALLBACK=1`: bundled open-licensed woff2 files (see
// fallback-fonts/) are copied in place of the missing licensed fonts, so
// `next/font/local` resolves every path. Typography is temporarily generic.
import { access, copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { get } from "@vercel/blob";

import { FONT_FILES } from "./fonts-manifest.mjs";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(toolsDir, "..");
const projectRoot = path.resolve(appDir, "..");
const fallbackDir = path.join(toolsDir, "fallback-fonts");
const cacheDir = path.join(projectRoot, ".next", "cache", "fonts");

const exists = (filePath) =>
  access(filePath).then(
    () => true,
    () => false,
  );

// Copy bundled open-licensed fonts in place of the missing licensed files so
// `next/font/local` can resolve every path without the Blob token.
async function populateFallback(missing) {
  console.warn(
    `fonts: ${missing.length} licensed font file(s) missing and no token; ` +
      "using bundled generic OFL fallback fonts (typography is temporarily generic).",
  );
  for (const rel of missing) {
    const source = rel.includes("wotfard")
      ? path.join(fallbackDir, "sans.woff2")
      : path.join(fallbackDir, "mono.woff2");
    const dest = path.join(appDir, rel);
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(source, dest);
  }
}

// Fetch a single blob's bytes, retrying once on failure.
async function fetchBlobBytes(rel, token) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await get(rel, { access: "private", token });
      if (!result) {
        throw new Error(
          `fonts: no blob found for "${rel}". Upload the fonts once with \`pnpm fonts:upload\`.`,
        );
      }
      return Buffer.from(await new Response(result.stream).arrayBuffer());
    } catch (error) {
      if (attempt === 2) {
        throw error;
      }
      console.warn(
        `fonts: fetch failed for ${rel} (attempt ${attempt}), retrying`,
      );
    }
  }
}

// Populate one missing file: prefer the cross-build cache, else fetch from Blob
// and write BOTH `app/fonts/` and `.next/cache/fonts/`.
async function populateFromBlob(rel, token) {
  const dest = path.join(appDir, rel);
  const cachePath = path.join(cacheDir, rel);

  if (await exists(cachePath)) {
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(cachePath, dest);
    console.log(`fonts: restored ${rel} from cache`);
    return;
  }

  const bytes = await fetchBlobBytes(rel, token);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, bytes);
  await mkdir(path.dirname(cachePath), { recursive: true });
  await writeFile(cachePath, bytes);
  console.log(`fonts: fetched ${rel} (${bytes.length} bytes)`);
}

async function main() {
  const missing = [];
  for (const rel of FONT_FILES) {
    if (!(await exists(path.join(appDir, rel)))) {
      missing.push(rel);
    }
  }

  if (missing.length === 0) {
    console.log(`fonts: all ${FONT_FILES.length} present, skipping blob fetch`);
    return;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    const useFallback =
      process.env.FONTS_FALLBACK === "1" || !process.env.VERCEL;
    if (useFallback) {
      await populateFallback(missing);
      return;
    }
    throw new Error(
      `fonts: ${missing.length} font file(s) missing and BLOB_READ_WRITE_TOKEN is unset.\n` +
        "  On Vercel: connect the Blob store to the project so the token is injected at build.\n" +
        "  Locally: place the .woff2 files under app/fonts/, run with FONTS_FALLBACK=1 to use\n" +
        "  bundled generic fallbacks, or run `vercel env pull` to obtain the token and then\n" +
        "  `pnpm fonts:fetch`.\n" +
        `  Missing:\n    ${missing.join("\n    ")}`,
    );
  }

  await Promise.all(missing.map((rel) => populateFromBlob(rel, token)));
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exitCode = 1;
});
