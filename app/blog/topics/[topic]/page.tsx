import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Accounts } from "@/components/daybook/accounts";
import { Ledger } from "@/components/daybook/ledger";
import { formatTopic, getFolioNumbers } from "@/lib/daybook";
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
  const label = formatTopic(decodedTopic);
  const topicPath = `/blog/topics/${encodeURIComponent(decodedTopic)}`;
  const title = `${label} account`;
  const description = `Entries posted to the ${label} account in ${siteConfig.name}.`;

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
  const folios = getFolioNumbers(posts);
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

      <div className="sheet ledger-sheet">
        <section className="ledger-main" aria-labelledby="account-heading">
          <h1 id="account-heading" className="ledger-heading">
            {label} <span>account</span>
          </h1>
          <p className="ledger-intro">
            {filtered.length} of {posts.length}{" "}
            {posts.length === 1 ? "entry" : "entries"} posted to {label}.{" "}
            <Link href="/blog">All entries</Link>
          </p>
          <Ledger
            posts={filtered}
            folios={folios}
            caption={`Entries posted to ${label}, newest first`}
            blankRows={2}
          />
        </section>
        <Accounts posts={posts} topics={topics} current={decodedTopic} />
      </div>
    </>
  );
}
