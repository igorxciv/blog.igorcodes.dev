import matter from "gray-matter";
import { readPostSource } from "@/lib/server/posts/filesystem";
import { parseFrontmatter } from "@/lib/server/posts/schema";
import { toSlug } from "@/lib/server/posts/slug";
import { type PostContent } from "@/lib/types/posts";

// ~225 wpm; word count over raw MDX includes component tags, so the ±1 min
// imprecision is acceptable for a "min read" badge.
function estimateReadingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

export async function parsePostFile(filePath: string): Promise<PostContent> {
  const raw = await readPostSource(filePath);
  const { data, content } = matter(raw);
  const slug = toSlug(filePath);
  const frontmatter = parseFrontmatter(data, slug);

  return {
    ...frontmatter,
    readingTime: frontmatter.readingTime ?? estimateReadingTime(content),
    slug,
    body: content,
  };
}
