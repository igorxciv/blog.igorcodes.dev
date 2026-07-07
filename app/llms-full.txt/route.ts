import { buildLlmsFull } from "@/lib/llms";
import { getAllPostContent } from "@/lib/server/posts";

// The whole published corpus as one Markdown file, prerendered at build time.
export const dynamic = "force-static";

export async function GET() {
  const body = buildLlmsFull(await getAllPostContent());
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
