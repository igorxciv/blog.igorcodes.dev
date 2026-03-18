import Link from "next/link";

type TopicFilterProps = {
  activeTopic: string | null;
  topics: string[];
};

const topicChipClassName =
  "focus-ring inline-flex min-h-11 items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors sm:px-4 lg:min-h-12 lg:px-5 lg:text-[0.95rem]";

const inactiveTopicChipStyle = {
  backgroundColor: "var(--surface-strong)",
  borderColor: "var(--border)",
  color: "var(--foreground)",
} as const;

const activeTopicChipStyle = {
  backgroundColor: "var(--surface-strong)",
  borderColor: "var(--accent)",
  color: "var(--foreground)",
  boxShadow: "inset 0 0 0 1px var(--accent-line)",
} as const;

function TopicFilterLink({
  href,
  isActive,
  label,
}: {
  href: string;
  isActive: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={topicChipClassName}
      style={isActive ? activeTopicChipStyle : inactiveTopicChipStyle}
    >
      {isActive ? (
        <span aria-hidden="true" className="size-2 rounded-full bg-(--accent)" />
      ) : null}
      {label}
    </Link>
  );
}

export function TopicFilter({ activeTopic, topics }: TopicFilterProps) {
  return (
    <section className="mb-10 sm:mb-12 lg:mb-14" aria-labelledby="topic-filter-heading">
      <h2
        id="topic-filter-heading"
        className="mb-4 text-sm font-medium uppercase tracking-wide text-(--muted) lg:mb-5 lg:text-[0.82rem]"
      >
        Filter by topic
      </h2>
      <ul className="flex flex-wrap gap-2" aria-label="Topics">
        <li>
          <TopicFilterLink href="/blog" isActive={activeTopic === null} label="All articles" />
        </li>
        {topics.map((topic) => (
          <li key={topic}>
            <TopicFilterLink
              href={`/blog?topic=${encodeURIComponent(topic)}`}
              isActive={activeTopic === topic}
              label={topic}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
