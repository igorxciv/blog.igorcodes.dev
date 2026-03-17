import { redirect } from "next/navigation";
import { getAllPosts } from "@/lib/server/posts";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await getAllPosts();

  if (posts.length === 0) {
    redirect("/blog");
  }

  const randomPost = posts[Math.floor(Math.random() * posts.length)];
  redirect(`/blog/${randomPost.slug}`);
}
