---
version: 1
slug: "app-blog"
primary_target: "app/blog"
related_targets: ["app/blog/[...slug]/page.tsx","app/blog/topics/[topic]/page.tsx"]
---

# Surface brief: blog (index, entry pages, account pages, 404/error)

Scope: `/blog`, `/blog/[...slug]`, `/blog/topics/[topic]`, not-found and error states, OG card. Visitor mode: Read.

Audience/job: working engineers and tech leads reading one argument closely, deciding whether Igor is worth following. Success: they finish an entry, remember whose book it was, subscribe by feed.

Constraints: blog-only scope; dated URLs and topic URLs stable; feeds, llms, md routes untouched; strict CSP (self-hosted fonts only); open-licensed fonts; existing MDX components must keep rendering.

Chosen direction: The Day-Book (ledger), user re-chose the rolled assigned card after the Memo build shipped (sketch: `.impeccable/mocks/decision/assigned.html`). Memorable moment: the red double margin rule running down every entry, with the reader's place ticked in the margin contents and finished entries ticked in the ledger.

Unresolved: site name (sketch reads "Day-Book of Igor"; `lib/site.ts` holds it); external profile links (none).

## Direction contract

THESIS: The blog is one engineer's bound day-book: every post is an entry posted to accounts (topics), dated in a ruled margin, numbered by folio. It refuses the dev-blog default of hero banner, card grid, topic chips, and neon dark chrome.

OWN-WORLD: Ledger paper (#e6ecdc) ruled in green (#8fae95), blue-black ink (#1a2230), red margin rules and ticks (#b3311f), dark green book cloth (#203a2f) with a gilt-bordered label (#c9b98a) as masthead and footer boards. Night theme is the cloth itself: green-black ground, cream ink, gilt and lighter red. Source Serif 4 for titles and prose; Archivo (condensed widths) for column heads, dates, accounts, folios and numbers; JetBrains Mono only for code. Structure by ruled lines and the red double margin rule; no shadows, rounded cards, or decorative icons.

STORY: The reader opens a book with a label, scans a ruled ledger of entries (date, particulars, accounts, folio, minutes), opens one, reads a calm column beside the margin rule with the place kept in the contents column, and closes on brought-forward / carried-forward entries and the feeds.

FIRST VIEWPORT: Index: full-width cloth band with the gilt label "Day-Book of Igor" left and nav right (Entries, Accounts, Feed, Night); intro aligned to the particulars column; ledger table with caps column heads, date column ending in a red double rule, serif entry titles (~30px) with abstracts, account list, folio and minutes; three blank ruled rows; Accounts column at right with counts and the tick key. Entry page: same band and column heads, date in the margin, large serif title and lede in particulars, accounts/folio/minutes at right, then body. Primary action is the first entry title.

FORM: Accounting day-book / ledger; the rolled assigned direction from the decision round, adopted by user choice over the shipped Memo pick. seed:6eabc550ee6542b6. Signature interaction: on entry pages the right column holds a sticky contents list that ticks each section in red as the reader passes it and sets the current one in bold (a sticky cloth bar with a contents disclosure below 68rem); reaching the end ticks the entry as read in the ledger (localStorage). Motion grammar: instant swaps, no transitions.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
