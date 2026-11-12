import Link from "next/link";
import { formatTopic } from "@/lib/daybook";
import { type PostSummary } from "@/lib/types/posts";
import { Tick } from "./tick";

type AccountsProps = {
  posts: PostSummary[];
  topics: string[];
  /** The account being shown, or null for all entries. */
  current: string | null;
};

/** The accounts column: every topic with its entry count, plus the tick key and feeds. */
export function Accounts({ posts, topics, current }: AccountsProps) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const topic of post.topics) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }

  return (
    <aside
      id="accounts"
      className="accounts"
      aria-labelledby="accounts-heading"
    >
      <h2 id="accounts-heading" className="col-head accounts-head">
        Accounts
      </h2>
      <ul>
        <li>
          <Link
            href="/blog"
            aria-current={current === null ? "page" : undefined}
          >
            All entries
          </Link>
          <span className="accounts-count">{posts.length}</span>
        </li>
        {topics.map((topic) => (
          <li key={topic}>
            <Link
              href={`/blog/topics/${encodeURIComponent(topic)}`}
              aria-current={current === topic ? "page" : undefined}
            >
              {formatTopic(topic)}
            </Link>
            <span className="accounts-count">{counts.get(topic) ?? 0}</span>
          </li>
        ))}
      </ul>
      <p className="accounts-note">
        A <Tick /> marks entries you have read to the end on this device.
      </p>

      <h2 className="col-head accounts-head">Feeds</h2>
      <ul>
        <li>
          <a href="/rss.xml">RSS</a>
          <span className="accounts-count">XML</span>
        </li>
        <li>
          <a href="/feed.json">JSON Feed</a>
          <span className="accounts-count">JSON</span>
        </li>
      </ul>
    </aside>
  );
}
