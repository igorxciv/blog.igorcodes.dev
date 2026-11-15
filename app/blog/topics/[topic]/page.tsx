import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/blog/page-transition";
import { PostLog } from "@/components/blog/post-log";
import { TopicList } from "@/components/blog/topic-list";
import { buildCollectionPageJsonLd, jsonLdString } from "@/lib/seo";
import { getAllPosts, getAllTopics } from "@/lib/server/posts";
import { siteConfig } from "@/lib/site";
import { formatTopic } from "@/lib/writing";

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
  const label = formatTopic(decodedTopic);
  const topicPath = `/blog/topics/${encodeURIComponent(decodedTopic)}`;
  const title = `Essays on ${label}`;
  const description = `Essays on ${label} by ${siteConfig.author.name}, a working engineer.`;

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

  const label = formatTopic(decodedTopic);
  const filtered = posts.filter((post) => post.topics.includes(decodedTopic));
  const collectionPageJsonLd = buildCollectionPageJsonLd(filtered);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(collectionPageJsonLd),
        }}
      />

      <PageTransition>
        <div className="page">
          <header className="page-intro">
            <h1>{label}</h1>
          </header>
          <PostLog
            posts={filtered}
            label={`Essays on ${label}, newest first`}
          />
          <TopicList topics={topics} current={decodedTopic} />
        </div>
      </PageTransition>
    </>
  );
}
