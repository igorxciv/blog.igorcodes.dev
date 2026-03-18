import type { Metadata } from "next";
import { PostListSection } from "@/components/blog/post-list-section";
import { RandomPostButton } from "@/components/blog/random-post-button";
import { TopicFilter } from "@/components/blog/topic-filter";
import { getAllPosts, getAllTopics } from "@/lib/server/posts";
import { buildBlogJsonLd, buildCollectionPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type BlogPageProps = {
  searchParams: Promise<{
    topic?: string;
  }>;
};

const BLOG_DESCRIPTION =
  "Writing on software architecture, frontend engineering, AI systems, and technical thinking.";

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const { topic } = await searchParams;
  const topics = await getAllTopics();
  const activeTopic = topic && topics.includes(topic) ? topic : null;

  return {
    title: "Blog",
    description: BLOG_DESCRIPTION,
    alternates: {
      canonical: "/blog",
    },
    keywords: ["engineering blog", "software architecture", "frontend engineering", "AI systems"],
    openGraph: {
      type: "website",
      url: "/blog",
      siteName: siteConfig.name,
      title: activeTopic ? `${activeTopic} articles` : "Blog",
      description: activeTopic
        ? `Browse articles about ${activeTopic} on ${siteConfig.name}.`
        : BLOG_DESCRIPTION,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: activeTopic ? `${activeTopic} articles` : "Blog",
      description: activeTopic
        ? `Browse articles about ${activeTopic} on ${siteConfig.name}.`
        : BLOG_DESCRIPTION,
    },
    robots: activeTopic
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { topic } = await searchParams;
  const [posts, topics] = await Promise.all([getAllPosts(), getAllTopics()]);

  if (posts.length === 0) {
    return (
      <section className="py-12 sm:py-16 lg:py-20">
        <h1 className="text-3xl font-semibold text-(--foreground) sm:text-4xl lg:text-5xl">Blog</h1>
        <p className="mt-4 max-w-2xl text-base text-(--foreground-soft) sm:text-lg lg:max-w-3xl lg:text-[1.2rem]">
          No posts are available yet. Add `.md` or `.mdx` files in `content/posts`.
        </p>
      </section>
    );
  }

  const activeTopic = topic && topics.includes(topic) ? topic : null;
  const filteredPosts = activeTopic ? posts.filter((post) => post.topics.includes(activeTopic)) : posts;
  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const recentPosts = filteredPosts.filter((post) => !post.featured || activeTopic);
  const blogJsonLd = buildBlogJsonLd(posts);
  const collectionPageJsonLd = buildCollectionPageJsonLd(filteredPosts);

  return (
    <section className="fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />
      <header className="mb-12 sm:mb-16 lg:mb-20">
        <h1 className="mb-4 text-3xl text-(--foreground) sm:text-4xl lg:mb-5 lg:text-[3.4rem]" style={{ fontWeight: 600 }}>
          Engineering Notes
        </h1>
        <p className="mb-6 max-w-2xl text-base leading-relaxed text-(--foreground-soft) sm:text-lg lg:mb-8 lg:max-w-3xl lg:text-[1.22rem] lg:leading-9">
          A collection of thoughts on software architecture, frontend engineering, AI systems, and
          technical thinking. Written for developers who care about craft.
        </p>
        <RandomPostButton />
      </header>

      <TopicFilter activeTopic={activeTopic} topics={topics} />

      {!activeTopic ? <PostListSection featured posts={featuredPosts} title="Featured" /> : null}
      <PostListSection posts={recentPosts} title={activeTopic ?? "Recent Articles"} />
    </section>
  );
}
