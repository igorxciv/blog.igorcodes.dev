import { type MetadataRoute } from "next";
import { getAllPosts } from "@/lib/server/posts";
import { toAbsoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  return [
    {
      url: toAbsoluteUrl("/blog"),
      lastModified:
        posts.length > 0
          ? new Date(
              Math.max(
                ...posts.map((post) => +new Date(post.updated ?? post.date)),
              ),
            )
          : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...posts.map((post) => ({
      url: toAbsoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "monthly" as const,
      priority: post.featured ? 0.85 : 0.7,
    })),
  ];
}
