# Writing style reference

The single source of truth for blog prose on this site: voice, sentence-level
rules, and how a post is shaped for reading. The `write-post` skill
(`.claude/skills/write-post/`) and the `blog-post-writer` agent both apply it.
`pnpm posts:lint` checks the mechanical rules marked _(linted)_.

The bar is a post that reads like an experienced engineer explaining something
they care about to a colleague, and never like generated content. The leading
word for everything this file fights is **slop**: prose that could have been
written about any topic by anyone.

## Voice

- First person, direct, opinionated. React to facts instead of listing pros and
  cons neutrally. "Impressive, and a little unsettling" beats "impressive".
- Concrete over abstract. Name the mechanism, the number, the file, the error.
  If a sentence could appear unchanged in someone else's post, it says nothing;
  cut it.
- Keep the human bits: a dry joke, a vivid image ("a fog machine dressed up as a
  proposal", "the error message punches you in the face a little"). One or two
  per section is plenty.
- Admit complexity and limits. State assumptions, mark uncertainty, and say
  where an idea stops working.
- Final posts are in English, whatever language the notes came in.

## Sentences

- Plain words: "use", "help", "many", "if", "because", "to". _(linted: utilize,
  leverage, in order to, and similar)_
- Active voice with a named actor: "the compiler rejects the query", not "the
  query is rejected".
- One idea per sentence. Split any sentence the reader has to parse twice.
- Strong verbs over adverbs; a measured delta over "significantly".
- Say "is" and "has" where slop says "serves as", "stands as", "boasts".
- State the point directly. Contrast framings ("not just X but Y", "X is not Y.
  It is Z.", "the question is not... the question is...") read as a template;
  use one per post at most. _(linted: not just, not only)_
- Use the natural number of items. A list of three is fine when there are
  three things, and a tell when the third was invented to fill the slot.
- Pick one name for a thing and repeat it; rotating synonyms reads as a
  thesaurus.
- Name sources. "Anthropic's study found", never "experts believe".
- Skip filler and AI vocabulary: additionally, crucial, delve, moreover,
  furthermore, pivotal, seamless, showcase, tapestry, testament, underscore,
  unlock. _(linted)_
- Skip chatbot phrases, hedging stacks ("could potentially perhaps") and
  decorative endings ("the future looks bright").

## Punctuation and typography

- Periods and commas carry the rhythm. No em or en dashes _(linted)_, and no
  parentheses as a substitute _(linted)_: give an aside its own sentence or work
  it into the current one.
- Colons only before a list, an example or a code block.
- Straight quotes only. _(linted)_
- Sentence case for the title and every heading. _(linted)_
- Bold sparingly: a label in a list ("**Scope.** One sprint.") or one term
  being defined. No emojis.

## Rhythm and paragraphs

- Paragraphs of two to four sentences. Mix short and long sentences inside a
  paragraph; that is where rhythm comes from.
- At most one deliberate one-line paragraph per section, for real emphasis.
  Stacking them ("Nice." / "That is it." / "Same idea here.") is the most
  visible slop tell on this blog. _(linted: three in a row)_
- Bullets only for genuinely list-shaped content: steps, criteria, options.
  An argument stays in prose.

## Shape of a post

1. **Title.** A claim or a tension in sentence case, not a topic label.
2. **Opening.** Two or three short paragraphs that put the core tension on the
   table. No throat-clearing, no "In today's world".
3. **Key points.** A `KeyPoints` box with three or four one-sentence claims.
   _(linted: required)_
4. **Sections.** Five to ten `##` sections with concrete headings that carry a
   noun or a claim ("The hidden cost is skipped practice", not "Why this
   matters"). Headings are numbered by CSS, so never number them. _(linted)_
   Each section advances the argument and ends on its practical consequence.
5. **Visual rhythm.** A reading aid or diagram every screen or two, where it
   compresses a comparison, a sequence or a structure. Never two in a row,
   never one per paragraph. Components and their budgets live in the
   `write-post` skill's component reference.
6. **Close.** One final section that turns the argument into action, usually a
   `Checklist` and a short `Takeaway`. Don't restate the checklist in prose
   afterwards.

Length: 1,500 to 2,000 words of prose for an essay. `readingTime` is words
divided by 230, rounded.

## Facts and sources

- Invent nothing presented as real: no figures, quotes, customers or studies.
  Illustrative scenario numbers are fine when the text frames them as an
  example, and they stay consistent through the post.
- Verify every figure against its source before it goes in, and attribute it
  in the sentence. Separate what the source shows from your reading of it.
- Link sources with descriptive labels close to the first claim that depends
  on them (see `content/posts/AGENTS.md`).

## Self-audit

Before calling a post done, read it top to bottom and answer: _what makes this
obviously AI-generated?_ Fix every answer, then ask again. Then check that the
post:

- has one clear point, stated in the opening;
- reads aloud without stumbling;
- explains each technical idea in plain words the first time it appears;
- sounds like a specific person with opinions;
- leaves the reader with something to do differently.
