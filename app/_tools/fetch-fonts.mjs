// Populate `app/fonts/` before `next build` runs.
//
// The licensed `.woff2` files are not in git (see fonts-manifest.mjs). This
// script is idempotent: if the files already exist on disk (local dev, where
// you keep your own licensed copies) it does nothing and needs no credentials.
// On Vercel — where `app/fonts/` starts empty and `BLOB_READ_WRITE_TOKEN` is
// injected by the connected Blob store — it downloads the missing files so that
// `next/font/local` (in app/fonts.ts) can resolve them during the build.
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { get } from "@vercel/blob";

import { FONT_FILES } from "./fonts-manifest.mjs";

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const exists = (filePath) =>
  access(filePath).then(
    () => true,
    () => false,
  );

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
    throw new Error(
      `fonts: ${missing.length} font file(s) missing and BLOB_READ_WRITE_TOKEN is unset.\n` +
        "  On Vercel: connect the Blob store to the project so the token is injected at build.\n" +
        "  Locally: place the .woff2 files under app/fonts/, or run `vercel env pull`\n" +
        "  to obtain the token and then `pnpm fonts:fetch`.\n" +
        `  Missing:\n    ${missing.join("\n    ")}`,
    );
  }

  for (const rel of missing) {
    const result = await get(rel, { access: "private", token });
    if (!result) {
      throw new Error(
        `fonts: no blob found for "${rel}". Upload the fonts once with \`pnpm fonts:upload\`.`,
      );
    }

    const bytes = Buffer.from(await new Response(result.stream).arrayBuffer());
    const dest = path.join(appDir, rel);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, bytes);
    console.log(`fonts: fetched ${rel} (${bytes.length} bytes)`);
  }
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exitCode = 1;
});
