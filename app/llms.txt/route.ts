import { buildLlmsIndex } from "@/lib/llms";
import { getAllPosts } from "@/lib/server/posts";

// Prerendered at build time and served as a static file, matching the static
// rendering of /blog. See lib/llms.ts for the format (https://llmstxt.org/).
export const dynamic = "force-static";

export async function GET() {
  const body = buildLlmsIndex(await getAllPosts());
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
