import path from "node:path";

export const POSTS_DIRECTORY = path.join(process.cwd(), "content", "posts");

export const POST_EXTENSIONS = new Set([".md", ".mdx"]);
