import { type PostSummary } from "@/lib/types/posts";

// Pure feed helpers, kept free of the Next data-cache import chain so they are
// cheap to unit-test.

export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function toRssLanguage(locale: string) {
  return locale.replace("_", "-").toLowerCase();
}

export function toFeedSummary(post: Pick<PostSummary, "description">) {
  if (post.description?.trim()) {
    return post.description.trim();
  }

  return "Read the full post on the site.";
}

// Wrap HTML in CDATA for RSS <content:encoded>, escaping any literal "]]>".
export function toCdata(html: string) {
  return `<![CDATA[${html.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}
