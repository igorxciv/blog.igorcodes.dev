import { promises as fs } from "node:fs";
import path from "node:path";
import { POST_EXTENSIONS, POSTS_DIRECTORY } from "@/lib/server/posts/constants";

const IGNORED_POST_FILENAMES = new Set(["AGENTS.md"]);

export async function discoverPostFiles(directory: string = POSTS_DIRECTORY): Promise<string[]> {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          return discoverPostFiles(fullPath);
        }

        if (IGNORED_POST_FILENAMES.has(entry.name)) {
          return [];
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

export async function readPostSource(filePath: string) {
  return fs.readFile(filePath, "utf8");
}
