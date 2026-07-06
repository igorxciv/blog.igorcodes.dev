import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { PostListSection } from "@/components/blog/post-list-section";
import { RandomPostButton } from "@/components/blog/random-post-button";
import { TopicFilter } from "@/components/blog/topic-filter";
import { buildCollectionPageJsonLd, jsonLdString } from "@/lib/seo";
import { getAllPosts, getAllTopics } from "@/lib/server/posts";
import { siteConfig } from "@/lib/site";

type TopicPageProps = {
  params: Promise<{ topic: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllTopics()).map((topic) => ({ topic }));
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { topic } = await params;
  const decodedTopic = decodeURIComponent(topic);
  const topicPath = `/blog/topics/${encodeURIComponent(decodedTopic)}`;
  const title = `${decodedTopic} articles`;
  const description = `Browse articles about ${decodedTopic} on ${siteConfig.name}.`;

  return {
    title,
    description,
    alternates: {
      canonical: topicPath,
    },
    openGraph: {
      type: "website",
      url: topicPath,
      siteName: siteConfig.name,
      title,
      description,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic } = await params;
  const decodedTopic = decodeURIComponent(topic);
  const [posts, topics] = await Promise.all([getAllPosts(), getAllTopics()]);

  if (!topics.includes(decodedTopic)) {
    notFound();
  }

  const filtered = posts.filter((post) => post.topics.includes(decodedTopic));
  const collectionPageJsonLd = buildCollectionPageJsonLd(filtered);

  return (
    <section className="fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(collectionPageJsonLd),
        }}
      />
      <header className="mb-12 sm:mb-16 lg:mb-20">
        <h1
          className="mb-4 text-3xl text-(--foreground) sm:text-4xl lg:mb-5 lg:text-[3.4rem]"
          style={{ fontWeight: 600 }}
        >
          Engineering Notes
        </h1>
        <p className="mb-6 max-w-2xl text-base leading-relaxed text-(--foreground-soft) sm:text-lg lg:mb-8 lg:max-w-3xl lg:text-[1.22rem] lg:leading-9">
          A collection of thoughts on software architecture, frontend
          engineering, AI systems, and technical thinking. Written for
          developers who care about craft.
        </p>
        <RandomPostButton />
      </header>

      <TopicFilter activeTopic={decodedTopic} topics={topics} />

      <PostListSection posts={filtered} title={decodedTopic} />
    </section>
  );
}
