import Link from "next/link";
import { PostLog } from "@/components/blog/post-log";
import { getAllPosts } from "@/lib/server/posts";

/** Nothing at this address: say so plainly and list the essays that exist. */
export async function NotFoundPage() {
  const posts = await getAllPosts();

  return (
    <div className="page">
      <header className="page-intro">
        <h1>Nothing at this address.</h1>
        <p>
          The link may be mistyped, or the essay moved. Essay addresses look
          like <code>/blog/2026/05/12/title</code>. Here is everything that
          exists, or start from <Link href="/blog">all writing</Link>.
        </p>
      </header>
      {posts.length > 0 ? (
        <PostLog posts={posts} label="All essays, newest first" />
      ) : null}
    </div>
  );
}
