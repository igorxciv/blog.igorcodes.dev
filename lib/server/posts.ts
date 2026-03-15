import "server-only";

export { getAllPosts, getAllTopics, getPostBySlug } from "@/lib/server/posts/service";
export type { PostQueryOptions } from "@/lib/server/posts/types";
