import { promises as fs } from "node:fs";
import path from "node:path";
import { POST_EXTENSIONS, POSTS_DIRECTORY } from "@/lib/server/posts/constants";
import { normalizeSlug } from "@/lib/server/posts/slug";

export async function discoverPostFiles(directory: string = POSTS_DIRECTORY): Promise<string[]> {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          return discoverPostFiles(fullPath);
        }

        if (entry.isFile() && POST_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
          return [fullPath];
        }

        return [];
      }),
    );

    return files.flat();
  } catch {
    return [];
  }
}

export async function resolvePostFilePath(slug: string): Promise<string | null> {
  const normalizedSlug = normalizeSlug(slug);

  for (const extension of POST_EXTENSIONS) {
    const candidate = path.join(POSTS_DIRECTORY, `${normalizedSlug}${extension}`);

    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Keep checking alternate extensions.
    }
  }

  return null;
}

export async function readPostSource(filePath: string) {
  return fs.readFile(filePath, "utf8");
}
