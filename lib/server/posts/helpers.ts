import path from "node:path";
import { type PostContent, type PostSummary } from "@/lib/types/posts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PostQueryOptions = {
  includeDrafts?: boolean;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const POSTS_DIRECTORY = path.join(process.cwd(), "content", "posts");

export const POST_EXTENSIONS = new Set([".md", ".mdx"]);

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

export function resolveIncludeDrafts(includeDrafts?: boolean) {
  if (typeof includeDrafts === "boolean") {
    return includeDrafts;
  }

  return process.env.NODE_ENV !== "production";
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

export function toPostSummary(post: PostContent): PostSummary {
  const { body, ...summary } = post;
  return summary;
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export function sortPostsByDateDescending(posts: PostContent[]) {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function filterPublishedPosts(
  posts: PostContent[],
  includeDrafts: boolean,
) {
  return includeDrafts ? posts : posts.filter((post) => post.published);
}

export function collectTopics(posts: { topics: string[] }[]) {
  return Array.from(new Set(posts.flatMap((post) => post.topics))).sort(
    (a, b) => a.localeCompare(b),
  );
}

// ---------------------------------------------------------------------------
// Slug
// ---------------------------------------------------------------------------

export function normalizeSlug(slug: string) {
  return slug.replace(/^\/+|\/+$/g, "");
}

export function toSlug(filePath: string): string {
  return path
    .relative(POSTS_DIRECTORY, filePath)
    .replace(/\\/g, "/")
    .replace(/\.(md|mdx)$/i, "");
}
