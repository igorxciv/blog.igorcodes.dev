import { type Metadata } from "next";
import { Accounts } from "@/components/daybook/accounts";
import { Ledger } from "@/components/daybook/ledger";
import { getFolioNumbers } from "@/lib/daybook";
import {
  buildBlogJsonLd,
  buildCollectionPageJsonLd,
  jsonLdString,
} from "@/lib/seo";
import { getAllPosts, getAllTopics } from "@/lib/server/posts";
import { siteConfig } from "@/lib/site";

const BLOG_DESCRIPTION = siteConfig.description;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: siteConfig.name },
    description: BLOG_DESCRIPTION,
    alternates: {
      canonical: "/blog",
    },
    openGraph: {
      type: "website",
      url: "/blog",
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: BLOG_DESCRIPTION,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: BLOG_DESCRIPTION,
    },
  };
}

const NUMBER_WORDS = [
  "No",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];

function entriesSoFar(count: number) {
  const amount = NUMBER_WORDS[count] ?? String(count);
  return `${amount} ${count === 1 ? "entry" : "entries"} so far.`;
}

export default async function BlogPage() {
  const [posts, topics] = await Promise.all([getAllPosts(), getAllTopics()]);
  const folios = getFolioNumbers(posts);
  const blogJsonLd = buildBlogJsonLd(posts);
  const collectionPageJsonLd = buildCollectionPageJsonLd(posts);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(collectionPageJsonLd),
        }}
      />

      <div className="sheet ledger-sheet">
        <section className="ledger-main" aria-labelledby="entries-heading">
          <h1 id="entries-heading" className="sr-only">
            Entries
          </h1>
          <p className="ledger-intro">
            {siteConfig.tagline} <em>{entriesSoFar(posts.length)}</em>
          </p>
          <Ledger
            posts={posts}
            folios={folios}
            caption="All entries, newest first"
          />
        </section>
        <Accounts posts={posts} topics={topics} current={null} />
      </div>
    </>
  );
}
