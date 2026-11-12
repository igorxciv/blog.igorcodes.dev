import Link from "next/link";
import { formatLedgerDate, formatTopic } from "@/lib/daybook";
import { type PostSummary } from "@/lib/types/posts";
import { ReadTick } from "./tick";

type LedgerProps = {
  posts: PostSummary[];
  folios: Map<string, number>;
  /** Accessible name for the table, e.g. "All entries, newest first". */
  caption: string;
  /** Empty ruled lines after the last entry: the rest of the page, still to fill. */
  blankRows?: number;
};

// Empty ruled lines drawn outside the table, so screen readers count only real entries.
const BLANK_ROW_KEYS = ["first", "second", "third", "fourth", "fifth"];

function topicHref(topic: string) {
  return `/blog/topics/${encodeURIComponent(topic)}`;
}

/**
 * The day-book's ruled page: date, particulars (title and abstract), accounts
 * (topics), folio, and minutes to read. Narrow screens keep date and
 * particulars as columns and fold the rest into a line under the abstract.
 */
export function Ledger({ posts, folios, caption, blankRows = 3 }: LedgerProps) {
  return (
    <div className="ledger-page">
      <table className="ledger">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="ledger-date col-head">
              Date
            </th>
            <th scope="col" className="col-head">
              Particulars
            </th>
            <th scope="col" className="ledger-acct col-head">
              Account
            </th>
            <th scope="col" className="ledger-num col-head">
              <abbr title="Folio">Fo.</abbr>
            </th>
            <th scope="col" className="ledger-num col-head">
              <abbr title="Minutes to read">Min.</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => {
            const date = formatLedgerDate(post.date);
            const folio = folios.get(post.slug);
            return (
              <tr key={post.slug}>
                <td className="ledger-date">
                  <time dateTime={post.date}>
                    {date.day}
                    <small>{date.year}</small>
                  </time>
                </td>
                <td className="ledger-part">
                  <h2 className="ledger-title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {post.description ? <p>{post.description}</p> : null}
                  <p className="ledger-meta">
                    {folio ? `Fo. ${folio}` : "Fo. –"}
                    <ReadTick slug={post.slug} />
                    {post.readingTime ? ` · ${post.readingTime} min` : null}
                    {post.published ? null : " · Draft"}
                    {post.topics.length > 0 ? " · " : null}
                    {post.topics.map((topic, index) => (
                      <span key={topic}>
                        {index > 0 ? ", " : null}
                        <Link href={topicHref(topic)}>
                          {formatTopic(topic)}
                        </Link>
                      </span>
                    ))}
                  </p>
                </td>
                <td className="ledger-acct">
                  <ul>
                    {post.topics.map((topic) => (
                      <li key={topic}>
                        <Link href={topicHref(topic)}>
                          {formatTopic(topic)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="ledger-num">
                  {folio ?? "–"}
                  <ReadTick slug={post.slug} />
                  {post.published ? null : (
                    <small className="ledger-draft">Draft</small>
                  )}
                </td>
                <td className="ledger-num">{post.readingTime ?? "–"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {blankRows > 0 ? (
        <div className="ledger-blank" aria-hidden="true">
          {BLANK_ROW_KEYS.slice(0, blankRows).map((key) => (
            <div key={key} className="ledger-blank-row">
              <span className="ledger-date" />
              <span />
              <span className="ledger-acct" />
              <span className="ledger-num" />
              <span className="ledger-num" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
