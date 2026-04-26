import type { PostSummary } from "@/lib/types/posts";
import { PostCard } from "./post-card";

type PostListSectionProps = {
  featured?: boolean;
  posts: PostSummary[];
  title: string;
};

export function PostListSection({
  featured = false,
  posts,
  title,
}: PostListSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className={featured ? "mb-10 sm:mb-12 lg:mb-14" : undefined}>
      <h2 className="mb-6 text-sm uppercase tracking-wide text-(--muted) lg:mb-7 lg:text-[0.82rem]">
        {title}
      </h2>
      <div className="[&>article:last-child]:border-b-0">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} featured={featured} />
        ))}
      </div>
    </section>
  );
}
