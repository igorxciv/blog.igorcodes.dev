---
version: 1
slug: "app-blog"
primary_target: "app/blog"
related_targets: ["app/blog/[...slug]/page.tsx","app/blog/topics/[topic]/page.tsx"]
---

# Surface brief: blog (index, posts, topic pages, 404/error)

Scope: `/blog`, `/blog/[...slug]`, `/blog/topics/[topic]`, not-found and error states, OG card. Visitor mode: Read.

Audience/job: working engineers and tech leads reading one argument closely, deciding whether Igor is worth following. Success: they finish an essay, remember whose it was, subscribe by feed.

Constraints: blog-only scope; dated URLs and topic URLs stable; feeds, llms, md routes untouched; strict CSP (self-hosted fonts only); existing MDX components must keep rendering. User asks (2026-11-12): minimal and fresh, original, with the vibe of the portfolio at igorcodes.dev; best practices; theme toggle with dark as the default; no seasonal scenes (the portfolio's seasons stay on the portfolio).

Chosen direction: Writing log, the lead of the second surface hand; the user asked to see the strongest option built rather than pick from sketches (sketch: `.impeccable/mocks/decision/log.html`). Memorable moment: the index reads as a clean, hand-kept log of essays with the newest date lit in cyan; on posts the contents hang in the left margin and a cyan tick follows the section being read.

Unresolved: site name ("Igor writes" in `lib/site.ts`); whether to link the portfolio (igorcodes.dev) from the blog; external profile links (none).

## Direction contract

THESIS: The blog is a narrow, hand-kept writing log in the portfolio's world: one row per essay, dated in mono, titled in Wotfard, on near-black. It refuses the dev-blog default of hero banner, card grid, tag chips, and neon glow, and it refuses the previous costume directions (ledger, memo).

OWN-WORLD: Near-black ground #0a0a0a, text #e5e5e5 with bright #fafafa titles, gray #9d9d9d secondary, hairlines #1f1f1f/#333, one cyan #00d9ff used only for meaning (newest date, links, current section, focus). Light theme is the portfolio's cream #f6f1e8 with teal #006a80. Wotfard for every word read; Dank Mono, lowercase, for dates, column labels, counts, and code. Hairline rules, 10px radius on blocks, pill buttons; no shadows, glows, gradients, or icons beyond the theme toggle.

STORY: The reader lands on one plain sentence about who writes here, scans the log (date, essay and claim, topics and minutes), opens an essay, reads a calm 42rem column with contents kept in the margin, and finishes on the signature line, previous/next essays, and the feeds.

FIRST VIEWPORT: Index at 1440: 48rem centered column; "Igor writes" left and Writing/Topics/RSS plus a round theme toggle right; h1 "Writing from a working engineer." at ~46px with a gray intro; the log head (date / essay / topics) over hairline rows, newest date cyan, titles 22px, claims gray, topics stacked right in mono. Post: mono date line (date cyan), title ~52px, gray lede, mono topic links, then prose; contents hung in the left margin from 80rem. Primary action is the first essay title.

FORM: Writing log (changelog written by a person), dealt lead of the surface re-roll; ranked fifth of my seven grounded structures. seed:4db1be5dad65a809. Signature interaction: hovering a log row lights its date cyan and sweeps a cyan underline under the title; on posts the margin contents marks the current section with a cyan tick as the reader scrolls (a disclosure under the title below 80rem). Motion grammar: short exponential ease-out (160–320ms) on color and underline only; theme switch fades colors over 280ms; reduced motion removes all of it.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
