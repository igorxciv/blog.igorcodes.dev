# AGENTS.md

## Scope
- These instructions apply to blog post content in `content/posts/**`.
- Keep posts focused on engineering, software architecture, frontend work, AI systems, technical learning, and related craft topics.
- Do not add unrelated site pages, route code, or product content from this folder.

## File Placement
- Create posts as `.mdx` files under date-based folders: `content/posts/YYYY/MM/DD/post-slug.mdx`.
- Use kebab-case slugs and keep the file name aligned with the final URL slug.
- Put reusable rendering code in `components/mdx/**` and shared content helpers in `lib/**`; do not place source code beside posts unless it is actual article content.

## Frontmatter
- Every post must include valid frontmatter matching the post schema:
  - `title`
  - `description`
  - `date`
  - `topics`
  - `tags`
  - `published`
- Use `featured` only when the post should appear in the featured section.
- Use `readingTime` only when it is intentionally set; keep it realistic.
- Use ISO-like dates such as `"2026-04-14"`.
- Keep `topics` broad and navigational; keep `tags` more specific.

## Article Structure
- Start with the core claim or tension, not a generic introduction.
- Use a short contextual `Callout` near the top when the article depends on external research, a prior article, or an important caveat.
- Prefer clear sections with concrete headings. Each section should advance the argument, not merely label content.
- Put the source link close to the first section that depends on it, even if the source is also mentioned in the opening callout.
- End with a concise synthesis that restates the practical takeaway, not a decorative conclusion.

## Sourcing And Links
- Use Markdown links for inline article links: `[label](https://example.com)`.
- Do not use raw HTML anchors in prose unless a task explicitly requires custom attributes; raw anchors can bypass MDX link styling.
- Make source labels descriptive. Avoid vague labels such as `here` or `this`.
- When summarizing external research, distinguish what the source shows from your own interpretation.
- Do not overquote. Prefer paraphrase, short excerpts, and clear attribution.

## MDX Components
- Use existing MDX components before adding new ones.
- Use `Callout` for contextual notes, caveats, warnings, and source framing.
- Use `VisualGrid` and `VisualCard` for compact comparison cards or conceptual groupings.
- Use `ProcessFlow` for step-by-step loops or causal sequences.
- Use `TableBlock` with a real nested `<table>` for designed comparison tables.
- Use fenced `text` blocks for prompt examples and compact workflows; the MDX renderer turns these into article-specific prompt/workflow blocks.
- Avoid passing complex nested arrays or object literals into custom MDX components unless verified in the rendered page. This MDX pipeline can be sensitive to complex prop serialization.

## Tables
- Do not rely on raw GitHub-flavored Markdown tables. They may render as plain text in this setup.
- For important comparisons, use `TableBlock` with explicit table markup:

```mdx
<TableBlock footer="Optional note below the table.">
  <table>
    <thead>
      <tr>
        <th>Column one</th>
        <th>Column two</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Row value</td>
        <td>Row value</td>
      </tr>
    </tbody>
  </table>
</TableBlock>
```

- Keep table copy short. If a cell needs a paragraph, the content probably wants cards or a prose section instead.

## Images
- Use `PostImage` for article images that should be part of the final post.
- Each `PostImage` must include meaningful `alt` text.
- Add `caption` when the image needs editorial context or is still a placeholder.
- Use `priority` only for the first important image near the top of the article.
- Register image assets in `lib/post-images.ts` and follow the path convention documented there.
- Image prompts and visual direction should follow `content/image-style-guide.md` unless the article needs a different explicit style.
- Do not leave vague image placeholders. If an image is missing, the caption or surrounding text should say exactly what should be created or replaced.

## Visual Design Consistency
- Components that serve the same purpose should share the same visual language: spacing, radius, border weight, typography scale, and color treatment.
- Avoid decorative UI chrome that does not add meaning, such as fake window controls, ornamental status dots, or redundant labels.
- Inline links must be visibly different from body text in the normal reading state through color and underline.
- Keep visual blocks editorial and purposeful. A component should clarify the argument, compress a comparison, or make a concept easier to scan.

## Writing Style
- Write in direct, opinionated engineering prose.
- Prefer concrete mechanisms over broad claims.
- Avoid inflated phrasing, generic AI commentary, and unsupported certainty.
- Use short paragraphs around important claims to improve readability.
- Use bullets when the content is genuinely list-shaped; otherwise prefer prose.
- Explain practical implications after conceptual sections so the reader can apply the idea.

## Verification
- Run `npm run lint` and `npm run build` after changing MDX structure, shared MDX components, images, or post metadata.
- Use Playwright to verify visual changes in a real browser whenever possible, especially for tables, image blocks, links, and custom MDX components.
- If Playwright is unavailable because the browser runtime is missing or blocked, say so explicitly and verify with the next best available method.
- After adding a new published post, confirm it appears in the blog list and at its `/blog/...` route.
