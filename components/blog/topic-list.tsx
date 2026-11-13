import Link from "next/link";
import { type PostSummary } from "@/lib/types/posts";
import { formatTopic } from "@/lib/writing";

type TopicListProps = {
  posts: PostSummary[];
  topics: string[];
  /** The topic being shown, or null on the full log. */
  current: string | null;
};

/** Every topic with how many essays it holds. */
export function TopicList({ posts, topics, current }: TopicListProps) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const topic of post.topics) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }

  return (
    <section id="topics" className="topics" aria-labelledby="topics-heading">
      <h2 id="topics-heading" className="section-label">
        Topics
      </h2>
      <ul>
        {topics.map((topic) => {
          const count = counts.get(topic) ?? 0;
          return (
            <li key={topic}>
              <Link
                href={`/blog/topics/${encodeURIComponent(topic)}`}
                aria-current={current === topic ? "page" : undefined}
              >
                {formatTopic(topic)}
              </Link>
              <span className="topics-count">
                <span className="sr-only">, </span>
                {count}
                <span className="sr-only">
                  {count === 1 ? " essay" : " essays"}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
