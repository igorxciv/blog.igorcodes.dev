import path from "node:path";
import { POSTS_DIRECTORY } from "@/lib/server/posts/constants";

export function normalizeSlug(slug: string) {
  return slug.replace(/^\/+|\/+$/g, "");
}

export function toSlug(filePath: string): string {
  return path.relative(POSTS_DIRECTORY, filePath).replace(/\\/g, "/").replace(/\.(md|mdx)$/i, "");
}
