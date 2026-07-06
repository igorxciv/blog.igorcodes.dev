import matter from "gray-matter";
import { renderPostHtml } from "@/lib/server/mdx-to-html";
import { readPostSource } from "@/lib/server/posts/filesystem";
import { toSlug } from "@/lib/server/posts/helpers";
import { parseFrontmatter } from "@/lib/server/posts/schema";
import { type PostContent } from "@/lib/types/posts";

// ~225 wpm over the post's plain text. Callers strip MDX component markup before
// counting, so tags like <Callout> no longer inflate the estimate; a 1-minute
// floor keeps very short posts from reading as "0 min".
export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

export async function parsePostFile(filePath: string): Promise<PostContent> {
  const raw = await readPostSource(filePath);
  const { data, content } = matter(raw);
  const slug = toSlug(filePath);
  const frontmatter = parseFrontmatter(data, slug);

  // Reuse the feed's remarkStripMdx pipeline to unwrap components, then drop the
  // resulting HTML tags so the word count reflects readable prose only.
  const readingTime =
    frontmatter.readingTime ??
    estimateReadingTime(
      (await renderPostHtml(content)).replace(/<[^>]+>/g, " "),
    );

  return {
    ...frontmatter,
    readingTime,
    slug,
    body: content,
  };
}
