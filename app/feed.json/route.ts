import { buildJsonFeed } from "@/lib/server/feed";

export const dynamic = "force-static";

export async function GET() {
  const feed = await buildJsonFeed();

  return Response.json(feed, {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
