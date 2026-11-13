---
name: write-post
description: Write, rewrite or edit a blog post in content/posts. Use when drafting a new post from notes or an idea, restructuring an existing post for readability, removing AI slop from post prose, or adding visuals, diagrams and reading aids to a post.
---

# Write a post

A post on this blog is an `.mdx` file under `content/posts/YYYY/MM/DD/<slug>.mdx`,
rendered at runtime with the components in `mdx-components.tsx`. The work is
done when the post states one clear argument in plain, human prose, reads
easily on a phone, and passes every check in step 6.

Three references drive the work. Read the first two in full before writing a
word, and keep them open:

- [`docs/writing-style.md`](../../../docs/writing-style.md): voice, sentence
  rules, rhythm and the shape of a post. It is the authority on prose.
- [`components.md`](components.md): every MDX reading aid and diagram, with
  syntax and per-post budgets.
- [`content/posts/AGENTS.md`](../../../content/posts/AGENTS.md): frontmatter,
  sourcing, tables and images.

## Steps

1. **Pin the argument.** Write the post's claim in one sentence and list the
   sections that carry it, each as a sentence-case heading with a noun or a
   claim. For a rewrite, first list what the old post argues and what it
   repeats. Done when every planned section advances the claim and none
   restates another.

2. **Gather the facts.** List every figure, quote and source the post will use.
   Open each source and confirm the exact number and wording; drop what you
   cannot confirm. For a rewrite, check the facts already in the post too.
   Done when every factual claim has a verified source or is framed as an
   illustrative example.

3. **Create the file.** For a new post run `pnpm new:post "<title>"`, which
   writes the dated file and frontmatter. Set `topics`, `tags`, `description`
   and `published` per `content/posts/AGENTS.md`.

4. **Draft the prose.** Write the opening, the `KeyPoints` box, the sections
   and the close in the shape `docs/writing-style.md` describes, in the
   author's first-person voice. Keep any lines from the notes or the old post
   that sound like a person; rewrite the rest.

5. **Place the visuals.** Walk the draft screen by screen. Where a passage
   compares two paths, lays out a sequence, or shows one cause with several
   effects, replace or support it with the matching diagram from
   `components.md`. Add the one `PullQuote`, the `<mark>` sentences, labelled
   prompt fences and the closing `Checklist` and `Takeaway`. Done when there is
   a visual every screen or two, none back to back, and every budget in
   `components.md` holds.

6. **Check.** Run, from the repo root:

   ```bash
   pnpm posts:lint content/posts/YYYY/MM/DD/<slug>.mdx   # slop tells and budgets
   pnpm posts:validate                                   # frontmatter schema
   pnpm build                                            # compiles every MDX post
   ```

   Then do the self-audit at the end of `docs/writing-style.md`: read the post
   top to bottom, asking what makes it obviously AI-generated, and fix every
   answer. Finally open the post with `pnpm dev` at
   `/blog/YYYY/MM/DD/<slug>` at desktop and phone widths and look at every
   component. Done when the linter reports 0 findings, validate and build
   pass, the self-audit turns up nothing new, and every component renders as
   intended at both widths.

7. **Report.** Give the file path, the word count and `readingTime`, the
   components used and where, and every fact added with its source.
