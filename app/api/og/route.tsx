import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard, type OgCardProps, ogCardText } from "@/lib/og-card";
import { loadOgFonts } from "@/lib/og-fonts";
import { getPostBySlug } from "@/lib/server/posts";
import { siteConfig } from "@/lib/site";
import { formatIsoDate, formatTopic } from "@/lib/writing";

export const runtime = "nodejs";

// OG cards change only when a post's title/date changes, but are fetched by many
// social crawlers — cache aggressively so they are not re-rendered per request.
const OG_CACHE_CONTROL =
  "public, immutable, no-transform, s-maxage=31536000, max-age=31536000";

async function renderCard(props: OgCardProps) {
  const text = ogCardText(props);
  return new ImageResponse(<OgCard {...props} />, {
    ...OG_SIZE,
    fonts: await loadOgFonts(text.sans, text.mono),
    headers: { "Cache-Control": OG_CACHE_CONTROL },
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug || slug.length > 200 || !/^[a-z0-9/-]+$/.test(slug)) {
    return new Response("Bad Request", { status: 400 });
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    return new Response("Not Found", { status: 404 });
  }

  return renderCard({
    meta: [
      formatIsoDate(post.date),
      ...(post.readingTime ? [`${post.readingTime} min read`] : []),
    ],
    title: post.title,
    description:
      post.description ?? `Read the full essay on ${siteConfig.domain}.`,
    foot: post.topics.map((topic) => formatTopic(topic).toLowerCase()),
  });
}
