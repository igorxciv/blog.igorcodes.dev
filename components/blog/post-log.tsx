import Link from "next/link";
import { type PostSummary } from "@/lib/types/posts";
import { formatIsoDate, formatTopic } from "@/lib/writing";

type PostLogProps = {
  posts: PostSummary[];
  /** Accessible name for the list, e.g. "All essays, newest first". */
  label: string;
};

function topicHref(topic: string) {
  return `/blog/topics/${encodeURIComponent(topic)}`;
}

/**
 * The writing log: one row per essay, newest first. Date, then the title and
 * its one-line claim, then topics and minutes. The column heads are visual
 * only; each row carries its own labels for assistive tech.
 */
export function PostLog({ posts, label }: PostLogProps) {
  return (
    <div className="log">
      <div className="log-head" aria-hidden="true">
        <span>date</span>
        <span>essay</span>
        <span>topics</span>
      </div>
      <ol className="log-list" aria-label={label}>
        {posts.map((post) => (
          <li key={post.slug} className="log-row">
            <time className="log-date" dateTime={post.date}>
              {formatIsoDate(post.date)}
            </time>
            <div className="log-main">
              <h2 className="log-title">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.description ? (
                <p className="log-claim">{post.description}</p>
              ) : null}
            </div>
            <p className="log-meta">
              {post.topics.length > 0 ? (
                <span className="log-topics">
                  <span className="sr-only">Topics: </span>
                  {post.topics.map((topic) => (
                    <Link key={topic} href={topicHref(topic)}>
                      {formatTopic(topic).toLowerCase()}
                    </Link>
                  ))}
                </span>
              ) : null}
              {post.readingTime ? (
                <span className="log-minutes">{post.readingTime} min</span>
              ) : null}
              {post.published ? null : <span className="log-draft">draft</span>}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
