import Link from "next/link";
import { Ledger } from "@/components/daybook/ledger";
import { getFolioNumbers } from "@/lib/daybook";
import { getAllPosts } from "@/lib/server/posts";

/** No entry at this address: say so plainly and lay out the entries that exist. */
export async function NotFoundPage() {
  const posts = await getAllPosts();

  return (
    <div className="sheet ledger-sheet ledger-sheet-single">
      <section className="ledger-main" aria-labelledby="missing-heading">
        <h1 id="missing-heading" className="ledger-heading">
          No entry on this page
        </h1>
        <p className="ledger-intro">
          The link may be mistyped, or the entry was never made. Entry addresses
          look like <code>/blog/2026/05/12/title</code>. These are the entries
          in the book; or start from <Link href="/blog">all entries</Link>.
        </p>
        <Ledger
          posts={posts}
          folios={getFolioNumbers(posts)}
          caption="Entries in the book, newest first"
          blankRows={1}
        />
      </section>
    </div>
  );
}
