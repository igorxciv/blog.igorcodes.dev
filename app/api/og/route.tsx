import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/lib/og-card";
import { getPostBySlug } from "@/lib/server/posts";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";

// OG cards change only when a post's title/date changes, but are fetched by many
// social crawlers — cache aggressively so they are not re-rendered per request.
const OG_CACHE_CONTROL =
  "public, immutable, no-transform, s-maxage=31536000, max-age=31536000";

function renderCard({
  eyebrow,
  title,
  description,
  footerLeft,
  footerRight,
}: {
  eyebrow: string;
  title: string;
  description: string;
  footerLeft: string;
  footerRight: string;
}) {
  return new ImageResponse(
    <OgCard
      eyebrowLeft={eyebrow}
      eyebrowRight={siteConfig.domain}
      title={title}
      description={description}
      glowOpacity={0.18}
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#00d9ff",
          }}
        >
          <span>{footerLeft}</span>
          <span>{footerRight}</span>
        </div>
      }
    />,
    {
      ...OG_SIZE,
      headers: { "Cache-Control": OG_CACHE_CONTROL },
    },
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return renderCard({
      eyebrow: "Blog",
      title: siteConfig.name,
      description: siteConfig.description,
      footerLeft: "Software architecture",
      footerRight: "Frontend engineering",
    });
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    return renderCard({
      eyebrow: "Blog",
      title: siteConfig.name,
      description: siteConfig.description,
      footerLeft: "Article not found",
      footerRight: siteConfig.domain,
    });
  }

  return renderCard({
    eyebrow: post.topics[0] ?? "Engineering note",
    title: post.title,
    description:
      post.description ?? `Read the full article on ${siteConfig.domain}.`,
    footerLeft: post.readingTime ? `${post.readingTime} min read` : "Article",
    footerRight: post.updated ?? post.date,
  });
}
