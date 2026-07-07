import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createInterface } from "node:readline";

/** @param {string} title */
function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function readTitleFromStdin() {
  const rl = createInterface({ input: process.stdin, terminal: false });
  const lines = [];
  for await (const line of rl) {
    lines.push(line);
  }
  return lines.join(" ").trim();
}

async function main() {
  let title = process.argv[2];
  if (!title) {
    title = await readTitleFromStdin();
  }
  title = (title ?? "").trim();

  if (!title) {
    console.error("Error: a post title is required (argument or stdin).");
    process.exit(1);
  }

  const slug = slugify(title);
  if (!slug) {
    console.error(`Error: could not derive a slug from title "${title}".`);
    process.exit(1);
  }

  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const isoDate = `${year}-${month}-${day}`;

  const dir = path.join("content", "posts", year, month, day);
  const filePath = path.join(dir, `${slug}.mdx`);

  if (existsSync(filePath)) {
    console.error(`Error: file already exists: ${filePath}`);
    process.exit(1);
  }

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: ""
date: "${isoDate}"
topics: []
tags: []
published: false
---

Write your post here.
`;

  await mkdir(dir, { recursive: true });
  await writeFile(filePath, frontmatter, "utf8");

  console.log(`Created ${filePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
