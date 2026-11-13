import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { lintPost } from "../../lib/prose-lint.ts";

// Checks post prose for the mechanical AI-writing tells listed in
// docs/writing-style.md. Pass file paths to check only those posts.

const POSTS_DIR = path.join("content", "posts");
const IGNORED_FILENAMES = new Set(["AGENTS.md", "README.md"]);

async function collectPosts(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectPosts(fullPath)));
    } else if (
      /\.mdx?$/.test(entry.name) &&
      !IGNORED_FILENAMES.has(entry.name)
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  const args = process.argv.slice(2);
  const files = args.length > 0 ? args : (await collectPosts(POSTS_DIR)).sort();
  let total = 0;

  for (const file of files) {
    const findings = lintPost(await readFile(file, "utf8"));
    total += findings.length;
    for (const finding of findings) {
      console.log(
        `${file}:${finding.line}  ${finding.rule}  ${finding.message}`,
      );
    }
    if (findings.length === 0) {
      console.log(`PASS  ${file}`);
    }
  }

  console.log(`\n${files.length} file(s) checked, ${total} finding(s).`);
  if (total > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
