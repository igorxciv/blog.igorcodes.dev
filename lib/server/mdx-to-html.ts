import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { remarkStripMdx } from "@/lib/mdx/remark-strip-mdx";

// Compiles a post's MDX body to sanitized, self-contained HTML for feeds.
// remark-mdx parses the JSX so remarkStripMdx can unwrap it; the result is plain
// markdown-derived HTML (headings, prose, lists, code, GFM tables) safe to embed
// in <content:encoded> / content_html.
const processor = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkGfm)
  .use(remarkStripMdx)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeStringify);

export async function renderPostHtml(body: string): Promise<string> {
  const file = await processor.process(body);
  return String(file).trim();
}
