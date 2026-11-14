import Link from "next/link";
import { formatTopic } from "@/lib/writing";

type TopicListProps = {
  topics: string[];
  /** The topic being shown, or null on the full log. */
  current: string | null;
};

/** Every topic, as a plain row of links. */
export function TopicList({ topics, current }: TopicListProps) {
  return (
    <section id="topics" className="topics" aria-labelledby="topics-heading">
      <h2 id="topics-heading" className="section-label">
        Topics
      </h2>
      <ul>
        {topics.map((topic) => (
          <li key={topic}>
            <Link
              href={`/blog/topics/${encodeURIComponent(topic)}`}
              aria-current={current === topic ? "page" : undefined}
            >
              {formatTopic(topic)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
