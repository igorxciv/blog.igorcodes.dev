# Post components

Every MDX component a post can use, with syntax and budgets. Components live in
`components/mdx/` and are registered in `mdx-components.tsx`.

## Rules for every component

- Content goes in **children**, as Markdown inside the tag. The RSS and JSON
  feeds unwrap tags and keep only children, plus a `title` prop, which they
  print as a bold line. Any other prop is invisible in feeds.
- Leave a blank line after every opening tag and before every closing tag, or
  the Markdown inside is not parsed.
- Props are straight double-quoted strings. Boolean props are bare (`muted`).
  No `{...}` expressions.
- In prose, write "less than" or "under" instead of a raw `<`.

## Budgets per post

| Component | Budget |
|---|---|
| `KeyPoints` | exactly one, right after the opening |
| `PullQuote` | one, two at most |
| `<mark>` | three to five, never two in one paragraph |
| Diagrams (`Compare`, `Steps`, `Hub`) | where the content has that shape; never two in a row |
| `Checklist` + `Takeaway` | once each, in the closing section |

## Reading aids

### KeyPoints

The post in three or four one-sentence claims. `title` defaults to "The short
version".

```mdx
<KeyPoints>

- Finishing a task and learning from it are different outcomes.
- ...

</KeyPoints>
```

### PullQuote

The one line a reader would screenshot, set large; it fills in as it scrolls
into view. One or two sentences that sharpen, rather than repeat, the paragraph
before it.

```mdx
<PullQuote>

AI can help you produce an answer without helping you build the mental model behind it.

</PullQuote>
```

### Highlighted sentence

Wrap a key sentence inside a normal paragraph in `<mark>`. A marker stroke draws
under it as it enters the screen.

```mdx
Most of it is fine. <mark>The damage happens when you skip the hypothesis.</mark> Here is why.
```

### Takeaway

A short boxed conclusion, one paragraph. `title` defaults to "Takeaway".

```mdx
<Takeaway>

Give away the typing. Keep the guessing and the debugging until you can do them without help.

</Takeaway>
```

### Checklist

An actionable list drawn with check marks.

```mdx
<Checklist title="Before you send the proposal">

- Explain the problem in one sentence.
- ...

</Checklist>
```

### Brief

Labelled fields: each list item opens with a bold label ending in a period. Use
for structured examples such as Problem, Impact and Proposal.

```mdx
<Brief title="Decision-ready version">

- **Problem.** Payment provider logic is spread across billing, onboarding and plans.
- **Impact.** The last two plan changes took about three extra weeks.
- **Proposal.** Spend one sprint isolating the provider behind one interface.

</Brief>
```

### Callout

Context, caveats and source framing. `type` is `note`, `warning` or `success`.

```mdx
<Callout title="Context" type="note">

This post builds on [Anthropic's research on AI and coding skills](https://...).

</Callout>
```

## Diagrams

Diagrams replace ASCII art; the linter rejects ```` ```figure ```` fences in
new posts.

### Compare

Two paths side by side. Each column holds an ordered list drawn as a timeline;
the **last item is drawn as the outcome**. Mark the weaker or "before" column
`muted`; its outcome is struck through.

```mdx
<Compare title="Two ways through the same task">

<CompareColumn title="Doing it yourself">

1. A problem you can't solve yet
2. Make a guess
3. Your mental model updates

</CompareColumn>

<CompareColumn title="Asking AI first" muted>

1. A problem you can't solve yet
2. Paste the answer
3. Mental model unchanged

</CompareColumn>

</Compare>
```

### Steps

One numbered sequence drawn as a timeline. Add `muted` for a weaker path.

```mdx
<Steps title="A decision-ready technical debt proposal">

1. Problem. Name the technical issue in one sentence.
2. Impact. Connect it to users, delivery or team health.
3. Proposal. Ask for a specific investment with a way to check it.

</Steps>
```

### Hub

One cause in the middle with its effects branching off. The first paragraph is
the centre; the list holds three to six branch labels of two to four words.
On a phone the branches stack on one spine.

```mdx
<Hub title="Technical debt as a risk map">

Payment provider code spread across billing, onboarding and plans

- Delivery risk
- Team knowledge
- Release confidence
- Roadmap predictability

</Hub>
```

### VisualGrid and VisualCard

Comparison cards in a grid of two or three columns. `tone` is `default`,
`accent` for the good option or `warning` for the bad one; it colours the
card's top edge and eyebrow. Keep eyebrows in sentence case and bodies to one
or two sentences.

```mdx
<VisualGrid columns="2">
  <VisualCard eyebrow="Too much" title="The architecture review" tone="warning">
    One sentence on why this framing loses the room.
  </VisualCard>
  <VisualCard eyebrow="Better" title="The planning version" tone="accent">
    One sentence on why this one works.
  </VisualCard>
</VisualGrid>
```

### TableBlock

A real nested `<table>`; raw Markdown tables do not render. Syntax is in
`content/posts/AGENTS.md`. Keep cells short; tables scroll sideways on phones.
Skip the `footer` prop unless it adds information the table lacks.

## Fenced blocks

- ```` ```text ```` renders as a prompt card. Add a label in the fence meta:
  ```` ```text label="Prompt" ````.
- A ```` ```text ```` fence whose body contains `->` renders as a row of chips
  joined by arrows: `run code -> see error -> ask AI -> paste fix`.
- Real code fences (```` ```ts ````, ```` ```bash ````) are syntax-highlighted.
