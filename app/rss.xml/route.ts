import { buildRssFeed } from "@/lib/server/feed";

export const dynamic = "force-static";

export async function GET() {
  const xml = await buildRssFeed();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
