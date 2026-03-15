import matter from "gray-matter";
import { readPostSource } from "@/lib/server/posts/filesystem";
import { parseFrontmatter } from "@/lib/server/posts/schema";
import { toSlug } from "@/lib/server/posts/slug";
import type { PostContent } from "@/lib/types/posts";

export async function parsePostFile(filePath: string): Promise<PostContent> {
  const raw = await readPostSource(filePath);
  const { data, content } = matter(raw);
  const slug = toSlug(filePath);
  const frontmatter = parseFrontmatter(data, slug);

  return {
    ...frontmatter,
    slug,
    body: content,
  };
}
