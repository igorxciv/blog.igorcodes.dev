import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";
import { parseFrontmatter } from "../../lib/server/posts/schema.ts";

const POSTS_DIR = path.join("content", "posts");
const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx"]);
const IGNORED_FILENAMES = new Set(["AGENTS.md", "README.md"]);
const EMPTY_ALT_IMAGE = /!\[\s*\]\(/g;

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(fullPath)));
    } else if (
      MARKDOWN_EXTENSIONS.has(path.extname(entry.name)) &&
      !IGNORED_FILENAMES.has(entry.name)
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  const files = (await collectMarkdownFiles(POSTS_DIR)).sort();
  let failures = 0;

  for (const filePath of files) {
    const raw = await readFile(filePath, "utf8");
    const { data, content } = matter(raw);

    try {
      parseFrontmatter(data, filePath);
      console.log(`PASS  ${filePath}`);
    } catch (error) {
      failures += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`FAIL  ${filePath}\n      ${message}`);
    }

    const emptyAltCount = (content.match(EMPTY_ALT_IMAGE) ?? []).length;
    if (emptyAltCount > 0) {
      console.warn(
        `WARN  ${filePath}: ${emptyAltCount} image(s) with empty alt text`,
      );
    }
  }

  console.log(`\n${files.length} file(s) checked, ${failures} failure(s).`);

  if (failures > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
