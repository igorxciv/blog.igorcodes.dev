---
name: Igor writes
description: A hand-kept writing log on near-black, in the igorcodes.dev family.
colors:
  bg: "#0a0a0a"
  surface: "#131313"
  surface-raised: "#1a1a1a"
  text: "#e5e5e5"
  text-strong: "#fafafa"
  text-soft: "#c9c9c9"
  muted: "#9d9d9d"
  faint: "#7d7d7d"
  line: "#1f1f1f"
  line-strong: "#333333"
  accent: "#00d9ff"
  accent-line: "rgb(0 217 255 / 0.55)"
  accent-soft: "rgb(0 217 255 / 0.12)"
  selection: "rgb(0 217 255 / 0.26)"
  focus: "#8aefff"
  light-bg: "#f6f1e8"
  light-surface: "#eee5d8"
  light-surface-raised: "#fffaf2"
  light-text: "#16130f"
  light-text-strong: "#0b0907"
  light-text-soft: "#423b32"
  light-muted: "#645b4f"
  light-faint: "#6f6457"
  light-line: "#e2d8ca"
  light-line-strong: "#cbbfae"
  light-accent: "#006a80"
  light-accent-line: "rgb(0 106 128 / 0.5)"
  light-accent-soft: "rgb(0 106 128 / 0.1)"
  light-selection: "rgb(0 106 128 / 0.18)"
  light-focus: "#005f75"
typography:
  display:
    fontFamily: "Wotfard, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 1.3rem + 3.2vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.026em"
  headline:
    fontFamily: "Wotfard, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.35rem + 2.6vw, 2.875rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.022em"
  section:
    fontFamily: "Wotfard, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "1.5625rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.016em"
  title:
    fontFamily: "Wotfard, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.28
    letterSpacing: "-0.012em"
  subsection:
    fontFamily: "Wotfard, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Wotfard, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.05rem + 0.4vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Wotfard, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.75
  body-ui:
    fontFamily: "Wotfard, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  body-small:
    fontFamily: "Wotfard, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  meta:
    fontFamily: "Dank Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
  count:
    fontFamily: "Dank Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    fontFeature: "tnum"
  date:
    fontFamily: "Dank Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    fontFeature: "tnum"
  label:
    fontFamily: "Dank Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  code:
    fontFamily: "Dank Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
    fontFeature: "tnum"
rounded:
  inline: "0.3rem"
  focus: "4px"
  block: "0.625rem"
  pill: "999px"
spacing:
  edge: "clamp(1.25rem, 5vw, 3rem)"
  measure: "42rem"
  column: "48rem"
  row: "1.5rem"
  gutter: "1.75rem"
  block-gap: "2.25rem"
  section: "5rem"
components:
  button-pill:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1.125rem"
  button-pill-hover:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-strong}"
  theme-toggle:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    size: "2.25rem"
  theme-toggle-hover:
    textColor: "{colors.text-strong}"
  nav-link:
    textColor: "{colors.muted}"
    typography: "{typography.body-ui}"
  nav-link-current:
    textColor: "{colors.text-strong}"
  log-row:
    textColor: "{colors.text-strong}"
    typography: "{typography.title}"
    padding: "1.5rem 0"
  log-date-newest:
    textColor: "{colors.accent}"
    typography: "{typography.date}"
  topic-link:
    textColor: "{colors.text-soft}"
  topic-link-current:
    textColor: "{colors.accent}"
  note:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.block}"
    padding: "1.125rem 1.375rem 1.25rem"
  code-block:
    backgroundColor: "{colors.surface}"
    typography: "{typography.code}"
    rounded: "{rounded.block}"
    padding: "1.125rem 1.25rem"
  code-inline:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-strong}"
    rounded: "{rounded.inline}"
    padding: "0.12em 0.36em"
---

# Design System: Igor writes

## Overview

**Creative North Star: "The Working Log"**

The blog is a narrow, hand-kept writing log: one row per essay, dated in mono, titled in Wotfard, on a near-black ground. It is a sibling of igorcodes.dev, sharing its ground, its type, its cyan, and its cream-and-teal light theme, so a reader moving between the two never feels they changed houses. Everything a person reads is set in Wotfard; everything that is apparatus (dates, column names, counts, figure numbers, code) is set in Dank Mono, in lowercase, the way a log names its columns.

Density is low and the column is narrow (48rem, prose at 42rem). Structure comes from hairline rules and the alignment of a three-column log, never from cards, banners, chips, or glow. Color is almost entirely neutral; one accent appears only where it carries meaning. Motion is short, exponential ease-out on color and on one underline sweep, and it disappears entirely under reduced motion.

The confirmed rejections: the dev-blog default of hero banner, card grid, tag chips, and neon glow, and the costume directions that preceded this build. The blog draws no seasonal scenes; those belong to the portfolio.

**Key Characteristics:**
- Dark by default; light is an explicit choice, never inferred from system preference.
- One accent, cyan in dark and teal in light, used only for meaning.
- Wotfard for reading text and headings; lowercase Dank Mono for apparatus.
- A 48rem column, a 42rem reading measure, hairline rules, flat surfaces.
- 10px corners on content blocks, full pills on buttons, nothing else rounded.
- 160–320ms ease-out on color and underline only; 280ms theme fade.

## Colors

A near-neutral ground with a single cold accent; the light theme swaps the gray family for warm cream and the cyan for a deep teal.

### Primary
- **Signal Cyan** (`accent`, dark): the only accent. It marks the newest essay's date, a log row's date and title underline on hover, the date on a post's meta line, link underline color on hover, the current section in the contents, the current topic, callout labels, process-step numbers, sequence arrows, and the caret and form accent color.
- **Deep Teal** (`light-accent`, light): the same role in the light theme, dark enough to pass as text color on cream.
- **Accent Line** (`accent-line` / `light-accent-line`): the translucent accent used as a resting underline under prose links, as the left rule of quoted literal lines, and as the hover border of pill buttons and the theme toggle.
- **Focus Cyan** (`focus` / `light-focus`): the 2px focus outline. Lighter than the accent in dark and darker in light so it reads against both grounds.

### Neutral
- **Near-Black Ground** (`bg`): page background in dark; also the panel fill inside comparison grids.
- **Recessed Panel** (`surface`): code blocks, callouts, process flows, sequences, ASCII figures.
- **Raised Chip** (`surface-raised`): pill buttons, the theme toggle, inline code.
- **Reading Gray** (`text`): body copy.
- **Title White** (`text-strong`): headings, log titles, strong text, link text in prose, hover state of quieter links.
- **Soft Gray** (`text-soft`): ledes, blockquotes, table cells, topic links, the footer name.
- **Secondary Gray** (`muted`): intro and claim text, navigation, column labels, captions, dates at rest.
- **Faint Gray** (`faint`): minutes and topics metadata, list markers, the domain, "fig. n" and "table n" labels, separator dots.
- **Hairline** (`line`) and **Strong Hairline** (`line-strong`): row dividers and block borders; the strong hairline sits under column heads, around buttons, and as the resting link underline.
- **Portfolio Cream** (`light-bg`) and its warm family (`light-surface`, `light-surface-raised`, `light-text` through `light-line-strong`): the same roles, one for one, in the light theme.

### Named Rules
**The Meaning-Only Accent Rule.** The accent appears only where it says something: newest, current, here, hovered, focused. It is never a fill, a background wash, a decorative border, or a heading color.

**The Explicit Theme Rule.** Dark is the default. The light theme exists only when the reader chooses it with the toggle, the choice is stored, and an inline script applies it before first paint. There is no `prefers-color-scheme` following.

**The Paired Token Rule.** Every color has a dark value and a light value under the same role name. A new color needs both before it ships.

## Typography

**Display Font:** Wotfard (with Avenir Next, Segoe UI, system-ui)
**Body Font:** Wotfard, with Wotfard Italic as a separate family for `em`, `i`, and `cite`
**Label/Mono Font:** Dank Mono (with ui-monospace, SFMono-Regular, Menlo)

**Character:** A friendly geometric sans with a warm italic carries every word people read; a calligraphic-leaning mono, always lowercase, keeps the log's apparatus quiet and exact.

### Hierarchy
- **Display** (600, fluid 34–52px, 1.08, tight tracking): the post title only.
- **Headline** (600, fluid 32–46px, 1.12): the index and topic page h1.
- **Section** (600, 25px, 1.25): prose h2.
- **Title** (600, 22px, 1.28; 20px below 40rem): essay titles in the log.
- **Subsection** (600, 20px, 1.3): prose h3.
- **Lede** (400, fluid 18–21px, 1.55): the post lede and intro paragraphs, in soft or secondary gray.
- **Body** (400, 18px, 1.75): prose, held to the 42rem measure. Interface text runs at 17px with 1.65 line height.
- **Body small** (400, 16px, 1.55): log claims, table cells, panel text, flow steps.
- **Date** (Dank Mono 400, 15px, tabular figures; 13px below 40rem): log dates in ISO form.
- **Meta** (Dank Mono 400, 14px): the post meta line and post-contents links at wide sizes.
- **Count** (Dank Mono 400, 12px, tabular figures): topic counts.
- **Label** (Dank Mono 400, 13px, lowercase, no tracking): column heads, table heads, callout and flow labels, footer, minutes, figure and table numbers, the post meta line (14px).
- **Code** (Dank Mono 400, 15px in blocks, 0.875em inline): code, with Shiki dual themes.

Weights in use are 400 and 600; headings and strong text never go heavier than 600.

### Named Rules
**The Two Voices Rule.** Wotfard is for what people read; Dank Mono is for what a log records. A heading is never mono, and a date is never sans.

**The Lowercase Apparatus Rule.** Mono labels are lowercase with zero letter-spacing. No uppercase, no tracked-out small caps.

## Layout

A single centered column of 48rem, inset by a fluid edge of 20–48px. Prose and post headers hold a 42rem measure inside it. The header puts the wordmark left and navigation plus the theme toggle right, wrapping on narrow screens.

The writing log is a three-column grid: date (7.25rem), essay title and one-line claim (flexible), topics and minutes (8.5rem, right-aligned, stacked), with a 1.75rem gutter and 1.5rem row padding. Below 40rem the column heads disappear, a strong hairline caps the list, and each row becomes a stack of date, title, claim, and a wrapping meta line.

Posts become a three-track grid from 80rem: the contents hang in a sticky left margin (up to 15rem, right-aligned against the column with a 3.5rem gap) while the article keeps the center 48rem. Below 80rem the contents become a disclosure under the title, bounded by hairlines.

Vertical rhythm is generous and stepped: about 2.25–2.5rem around blocks inside prose, 3.5rem above prose h2, 4–6rem between page-level regions (topics, post end, footer).

## Elevation & Depth

The system is flat. There are no shadows, glows, or gradients as surfaces. Depth comes from three tonal steps (ground, recessed panel, raised chip) and from 1px hairlines. The only gradient in the stylesheet is a single-color background image used as the mechanism of the title underline sweep; it renders as a solid 1px line, not as a gradient.

### Named Rules
**The Hairline Rule.** Separation is a 1px line in `line` or `line-strong`. If a region needs to stand apart, change its tone one step or draw a hairline; never lift it with a shadow.

## Shapes

Content blocks (code blocks, callouts, figures, images, process flows, sequences, comparison grids) share one 10px corner (`block`). Buttons and the theme toggle are full pills. Inline code takes a small 0.3rem corner and focus outlines a 4px one. Everything else, including log rows, rules, and the contents, is square. Comparison panels are joined by 1px gaps over a hairline-colored background, so their dividers read as hairlines inside one rounded container.

## Components

### Buttons
Quiet and round, never filled with the accent.
- **Shape:** full pill (999px).
- **Primary (pill button):** raised-chip fill, reading-gray text, strong-hairline border, 0.5rem by 1.125rem padding.
- **Hover / Focus:** the border shifts to the accent line and text brightens to title white over 160ms; focus is the shared 2px focus outline at a 3px offset.
- **Theme toggle:** a 36px round button of the same material carrying an 18px stroked sun or moon (1.6 stroke, round caps); CSS shows the icon for the theme you would switch to, so nothing flashes. It is the only icon in the interface.

### Links
- **Resting:** inherit color with a 1px underline at a 0.22em offset in the strong hairline; in prose the text is title white and the underline is the accent line.
- **Hover:** text brightens and the underline turns accent, transitioning color over 160ms. Navigation, footer, and topic links rest with a transparent underline that appears on hover.

### Navigation
Wordmark "Igor writes" with the name in title white at 600 and the verb in secondary gray; the verb turns accent on hover. Writing, Topics, and RSS sit right in 15px secondary gray; the current page is title white with an accent underline.

### Writing Log (signature)
The index's spine. Column heads ("date / essay / topics") in lowercase mono over a strong hairline, then one row per essay divided by hairlines. The newest row's date is accent; others rest in secondary gray. The whole row is the link: hovering it lights the date accent (220ms) and sweeps a 1px accent underline under the title from left to right (320ms). Topic links sit above the row link in faint mono and turn accent on hover. Keyboard focus outlines the whole row. Drafts show a lowercase accent "draft".

### Post Contents
A list of h2 and h3 anchors (h3 indented 1rem) in 15px secondary gray. The current section turns title white and gains a 12px accent tick in the margin as the reader scrolls. From 80rem it hangs sticky in the left margin with its summary label fixed open; below that it is a details disclosure with a rotating chevron drawn from two hairline borders.

### Topics
A wrapping row of soft-gray topic links, each followed by a faint mono count; the current topic is accent with an accent-line underline. No chips, no fills.

### Prose Blocks
- **Code block:** recessed panel, hairline border, 10px corners, 15px Dank Mono, Shiki dual theme swapped by the theme attribute.
- **Callout (note):** recessed panel with a lowercase mono label in accent above the content.
- **Comparison panels:** two or three columns joined by hairline gaps inside one 10px container, collapsing to one column below 34rem.
- **Process flow:** numbered steps with accent mono numbers joined by a vertical strong hairline.
- **Sequence:** inline steps separated by accent arrows on a recessed panel.
- **Literal line:** a quoted prompt set off by a left accent-line rule, no panel.
- **Figures, images, tables:** captions in 15px secondary gray, preceded by a faint mono "fig. n" or "table n" counter; table heads are lowercase mono over a strong hairline.
- **Blockquote:** soft-gray text behind a 1px strong hairline on the left.

### Post End
A hairline, the signature line in secondary gray, previous and next essays as 18px title-white links with faint mono dates, then the feeds line.

### Share Card and Icon
The 1200x630 share card is the site in miniature on the near-black ground: the wordmark, the title large and bold, the claim in secondary gray, and a mono foot line with the date in cyan, separated by faint dots over a hairline. Because Satori cannot read woff2, it stands in Figtree for Wotfard and JetBrains Mono for Dank Mono. The icon is a sibling of the igorcodes.dev mark: a near-black rounded tile in a cyan ring, holding a cyan text caret and two rounded lines of writing.

### Motion
Color and underline only: 160ms on link and button color, 220ms on log dates and the contents chevron, 320ms on the title underline sweep, all on an exponential ease-out (`cubic-bezier(0.22, 1, 0.36, 1)`). Switching theme fades background and text color over 280ms. Under `prefers-reduced-motion: reduce` every transition and animation is removed and smooth scrolling is off.

## Do's and Don'ts

### Do:
- **Do** keep every page in the 48rem column and every run of prose at the 42rem measure.
- **Do** set dates, column heads, counts, minutes, figure numbers, and code in lowercase Dank Mono, and everything read in Wotfard at 400 or 600.
- **Do** spend the accent only on newest, current, hovered, and focused states, in both themes.
- **Do** separate with 1px hairlines and one-step tonal changes; give content blocks the 10px corner and buttons the full pill.
- **Do** keep motion to color and the underline sweep at 160–320ms ease-out, and let reduced motion remove it.
- **Do** define every new color for both themes, keeping dark as the default and light as the reader's stored choice.

### Don't:
- **Don't** add hero banners, card grids, tag chips, or neon glow.
- **Don't** use shadows, glows, or gradient surfaces.
- **Don't** add icons beyond the theme toggle.
- **Don't** follow the system color-scheme preference.
- **Don't** set mono labels in uppercase or with letter-spacing.
- **Don't** use the accent as a fill, background, or heading color.
- **Don't** draw seasonal scenes on the blog.
