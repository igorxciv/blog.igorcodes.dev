import { postToMarkdown } from "@/lib/llms";
import { getAllPosts, getPostBySlug } from "@/lib/server/posts";

// Per-post clean-Markdown mirror for AI agents / answer engines. Statically
// prerendered for every published post, mirroring the static /blog/[...slug]
// pages (dynamicParams=false → unknown slugs 404).
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug.split("/") }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const post = await getPostBySlug(slug.join("/"));

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(postToMarkdown(post), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
