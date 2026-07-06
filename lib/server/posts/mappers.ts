import { type PostContent, type PostSummary } from "@/lib/types/posts";

export function toPostSummary(post: PostContent): PostSummary {
  const { body, ...summary } = post;
  return summary;
}
