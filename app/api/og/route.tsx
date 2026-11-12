import { ImageResponse } from "next/og";
import {
  formatLedgerDate,
  formatTopic,
  getFolioNumbers,
  getVolumeLabel,
} from "@/lib/daybook";
import { OG_SIZE, OgCard, type OgCardProps, ogCardText } from "@/lib/og-card";
import { loadOgFonts } from "@/lib/og-fonts";
import { getAllPosts, getPostBySlug } from "@/lib/server/posts";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";

// OG cards change only when a post's title/date changes, but are fetched by many
// social crawlers — cache aggressively so they are not re-rendered per request.
const OG_CACHE_CONTROL =
  "public, immutable, no-transform, s-maxage=31536000, max-age=31536000";

async function renderCard(props: OgCardProps) {
  const text = ogCardText(props);
  return new ImageResponse(<OgCard {...props} />, {
    ...OG_SIZE,
    fonts: await loadOgFonts(text.serif, text.ledger),
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

  const posts = await getAllPosts();
  const folio = getFolioNumbers(posts).get(post.slug);
  const date = formatLedgerDate(post.date);

  return renderCard({
    bookName: siteConfig.name,
    volume: getVolumeLabel(posts) ?? "Vol. I",
    dateLines: [date.day, date.year],
    title: post.title,
    description:
      post.description ?? `Read the full entry on ${siteConfig.domain}.`,
    foot: [
      { label: "Account", value: post.topics.map(formatTopic).join(", ") },
      { label: "Fo.", value: folio ? String(folio) : "–" },
      ...(post.readingTime
        ? [{ label: "Min.", value: String(post.readingTime) }]
        : []),
    ],
  });
}
