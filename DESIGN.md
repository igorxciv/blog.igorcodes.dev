---
name: Day-Book of Igor
description: One engineer's bound day-book. Entries dated in a ruled margin, posted to accounts, numbered by folio.
colors:
  paper: "#e6ecdc"
  paper-sunk: "#dae3cd"
  ink: "#1a2230"
  ink-soft: "#3b4552"
  pencil: "#535f58"
  rule: "#8fae95"
  rule-soft: "#b9cdb9"
  head: "#203a2f"
  red: "#b3311f"
  cloth: "#203a2f"
  cloth-ink: "#efe6c8"
  cloth-soft: "#d3d9c9"
  gilt: "#c9b98a"
  link: "#1f4a86"
  selection: "#c3d8b5"
  night-paper: "#15241d"
  night-paper-sunk: "#1c2f26"
  night-ink: "#e8e2cc"
  night-ink-soft: "#c9c4af"
  night-pencil: "#a1ad9e"
  night-rule: "#3f604b"
  night-rule-soft: "#2b4336"
  night-head: "#c9b98a"
  night-red: "#e2735f"
  night-cloth: "#0f1a15"
  night-cloth-soft: "#b9c1b1"
  night-link: "#a9c6ee"
  night-selection: "#31513f"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "clamp(2.25rem, 1.5rem + 2.2vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  label-title:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.01em"
  label-title-compact:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "clamp(2rem, 1.6rem + 1.4vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title-compact:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  section:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
  subsection:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "1.1875rem"
    fontWeight: 600
    lineHeight: 1.3
  lede:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "1.3125rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"onum\" 1, \"pnum\" 1"
  col-head:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.12em"
    fontVariation: "\"wdth\" 70"
    fontFeature: "\"tnum\" 1, \"lnum\" 1"
  col-head-small:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.12em"
    fontVariation: "\"wdth\" 70"
    fontFeature: "\"tnum\" 1, \"lnum\" 1"
  ledger:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "\"wdth\" 85"
    fontFeature: "\"tnum\" 1, \"lnum\" 1"
  ledger-date:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.35
    fontVariation: "\"wdth\" 80"
    fontFeature: "\"tnum\" 1, \"lnum\" 1"
  nav:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    fontVariation: "\"wdth\" 80"
  code:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"tnum\" 1, \"lnum\" 1"
rounded:
  none: "0px"
spacing:
  cell-x: "0.875rem"
  col-gap: "2rem"
  date-col: "9.25rem"
  acct-col: "11.875rem"
  measure: "40rem"
  sheet: "84rem"
  edge: "clamp(1rem, 4.5vw, 4.5rem)"
  row: "1.375rem"
  blank-row: "2.75rem"
components:
  band:
    backgroundColor: "{colors.cloth}"
    textColor: "{colors.cloth-ink}"
    padding: "1.25rem 0"
    height: "8.25rem"
  label:
    textColor: "{colors.cloth-ink}"
    typography: "{typography.label-title}"
    rounded: "{rounded.none}"
    padding: "0.875rem 1.75rem 0.75rem"
  band-nav-link:
    textColor: "{colors.cloth-soft}"
    typography: "{typography.nav}"
    height: "2.75rem"
  band-nav-link-current:
    textColor: "{colors.cloth-ink}"
    typography: "{typography.nav}"
    height: "2.75rem"
  ledger-head:
    textColor: "{colors.head}"
    typography: "{typography.col-head}"
    padding: "0.625rem 0.875rem"
  ledger-row:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    padding: "1.375rem 0.875rem"
  accounts-item:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0.6875rem 0"
  contents-bar:
    backgroundColor: "{colors.cloth}"
    textColor: "{colors.cloth-ink}"
    height: "2.75rem"
  text-button:
    textColor: "{colors.link}"
    rounded: "{rounded.none}"
    height: "2.75rem"
    padding: "0"
  note:
    textColor: "{colors.ink}"
    padding: "1rem 0 1.125rem"
  code-block:
    backgroundColor: "{colors.paper-sunk}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.none}"
    padding: "1rem 1.125rem"
  skip-link:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.875rem"
---

# Design System: Day-Book of Igor

## Overview

**Creative North Star: "The Bound Day-Book"**

The site is one engineer's bound account book. Each page is a sheet of green-ruled ledger paper between two boards of dark green book cloth: a band at the top with a gilt-bordered label, and a matching band at the foot. Posts are entries, topics are accounts, an entry's number is its folio, previous and next are brought forward and carried forward, and an entry read to the end gets a red tick. The index is a real ruled table (Date, Particulars, Account, Fo., Min.) that ends in blank lines still waiting to be filled. An entry page is that same row grown to full height: the date sits in the margin, the text runs in the particulars column, and the account column holds the details and then the sticky contents.

Everything structural is a ruled line. A red 4px double rule closes the date margin and runs the full height of every ledger and every entry. Column heads sit between a 2px rule above and a 1px rule below, both in head green. Rows are divided by 1px green rules. There are no shadows, no rounded corners and no cards. The only closed rectangle on paper is an image's 1px frame. On cloth there is one: the gilt label.

The type works like two hands in one book. Source Serif 4 carries everything meant to be read (titles, abstracts, prose, account names). Archivo, set condensed at 70–85% width, carries the printed apparatus: column heads, dates, account cells, folios, minutes, section numbers and navigation. JetBrains Mono appears only for code. Night is not an inverted day. It is the cloth itself: a green-black ground, cream ink, gilt heads and a lighter red, with the same rules in the same places.

**Key Characteristics:**
- Ledger paper ruled in green, blue-black ink, red margin rules and ticks, dark green cloth boards with a gilt label.
- A red 4px double rule closes the date column on every ledger and entry page.
- Ruled lines in place of boxes, shadows or radius: 2px over and 1px under column heads, 1px between rows.
- Serif for reading, condensed Archivo for apparatus, mono for code only.
- Read state and reading position are recorded as red pen ticks, not as progress bars or badges.
- Instant state changes. No transitions anywhere.

## Colors

A three-material palette: green-ruled paper, blue-black ink with a red pen, and dark green cloth with gilt.

### Primary
- **Bookkeeper's Red** (red): the pen. It draws the 4px double margin rule, the 3px rule where each cloth board meets the paper, the 2px foot rule of the narrow contents bar, the tick, the underline under the current band link (2px), the underline on a hovered entry title, account or contents line (1px), and the focus outline on paper. It is also the caret. Native form controls take the head green instead. At night it lightens to Night Red so it stays legible on cloth.

### Secondary
- **Book Cloth Green** (cloth): the boards. The top band, the foot band, the narrow contents bar, and the browser theme-color (`lib/theme.ts`). At night it deepens to Night Cloth, darker than the night paper, so the boards still read as boards.
- **Gilt** (gilt): the 1.5px border of the label, the label's volume line, the folio in the contents bar, the underline on the contents toggle, and the focus outline on cloth. At night it also becomes the head colour (Night Head).

### Tertiary
- **Register Blue** (link): links in running prose and text buttons only, with a 1px underline at 45% strength that goes to full on hover. Apparatus links (accounts, ledger meta, entry details) take their surrounding colour and show an underline only on hover.

### Neutral
- **Ledger Paper** (paper): the page ground, and the dropdown sheet of the narrow contents list.
- **Sunk Paper** (paper-sunk): the ground of inline code and code blocks. Nothing else is filled.
- **Blue-Black Ink** (ink): titles, prose, current contents line.
- **Faded Ink** (ink-soft): abstracts, ledes, blockquotes, figure captions, table body cells, the signature line.
- **Pencil** (pencil): secondary figures and notes: the year under a date, entry counts, contents numbers and minutes, section numbers, list markers, drafts, the italic in account headings.
- **Head Green** (head): column heads, the 2px and 1px head rules, account cells, entry details, caption prefixes ("Figure 1.", "Table 1."), note labels.
- **Green Rule** (rule): 1px row rules, column dividers for Fo. and Min., code block rules, image frames.
- **Faint Rule** (rule-soft): the blank ruled lines after the last entry.
- **Cloth Cream** (cloth-ink) and **Cloth Pale** (cloth-soft): lettering on cloth. Cream for the label title, current links and hovered links; pale for links at rest and the foot band text.
- **Selection Green** (selection): text selection, and the hover ground behind links in entry prose.

### Named Rules
**The Red Pen Rule.** Red is drawn, never filled. It appears as rules, ticks, underlines, focus and caret. It is never a surface, a button, a badge, a heading colour, or a whole line of text.

**The Cloth Boards Rule.** Cloth green is the board, not a component colour. It covers the top band, the foot band and the narrow contents bar, and nothing on the paper sheet between them.

**The Gilt-On-Cloth Rule.** Focus is red on paper and gilt on cloth. Any cloth region resets `outline-color` to gilt.

**The Night Is Cloth Rule.** The night theme swaps materials, not structure. Paper becomes Night Paper, heads turn gilt, red lightens to Night Red, and every rule stays where it was. The theme follows the system unless `data-theme` pins it, and it works without JavaScript.

## Typography

**Display Font:** Source Serif 4, variable with the optical-size axis (fallback Georgia, Times New Roman)
**Body Font:** Source Serif 4 (same family; `font-optical-sizing: auto` gives each size its own cut)
**Label/Mono Font:** Archivo, variable width axis, set with `font-stretch` 70–85% (fallback Arial Narrow). JetBrains Mono 400/600 for code only.

**Character:** A bookish text serif with old-style figures, set against a narrow, hard-working grotesque that reads like the printed rulings and headings of a stationer's account book. All three families are self-hosted through `next/font`.

### Hierarchy
- **Display** (600, clamp 2.25–3.25rem, 1.08, -0.015em, balanced): the entry title.
- **Label title** (600, 2.5rem, falling to 1.75rem under 48rem, line height 1): the book's name inside the gilt label.
- **Headline** (600, clamp 2–2.75rem, 1.1): account and 404 page headings, aligned to the particulars column. A trailing italic word in pencil at 400 ("Engineering *account*") is the one ornament allowed.
- **Title** (600, 1.875rem, 1.15; 1.375rem under 48rem): entry titles in the ledger.
- **Section / Subsection** (600; 1.5rem at 1.25, 1.1875rem at 1.3): entry body h2 and h3. Their numbers ("2", "2.1") come from CSS counters, set in pencil Archivo and hung in the date margin on screens 48rem and wider.
- **Lede** (400, 1.3125rem, 1.5, ink-soft): the entry abstract under the title, and the index intro.
- **Body** (400, 1.125rem, 1.6, old-style proportional figures): prose, in a column no wider than 40rem.
- **Column head** (Archivo 700, 0.8125rem, 70% width, 0.12em tracking, uppercase, head green): Date, Particulars, Account, Fo., Min., Contents, Accounts, Feeds, Brought forward, Carried forward, note labels, table heads. The volume line in the label uses the same face at 0.18em tracking in gilt. A small step at 0.75rem labels the entry details (Account, Folio, Minutes), the volume line under 48rem, and the draft mark.
- **Ledger** (Archivo 400, 0.9375–1.0625rem, 80–85% width, tabular lining figures): dates (80%), account cells and entry details (85%), band nav (80%), footer (85%). Folio and minute figures, and account counts, run at full width.
- **Code** (JetBrains Mono, 0.875rem in blocks, 0.85em inline).

### Named Rules
**The Two Hands Rule.** If it is read, it is serif. If it is looked up (a date, an account, a number, a column head, a nav link), it is condensed Archivo. Nothing in between.

**The Code-Only Mono Rule.** JetBrains Mono is reserved for `code`, `pre`, `kbd` and `samp`. Mono is never used for labels, dates or decoration.

**The Column Head Rule.** Uppercase tracked text exists only as a head printed over a ruled column or ruled block, sitting on its rule. No small caps line ever floats above a heading as a kicker.

## Layout

The page is a centred sheet `min(100% - 2 × edge, 84rem)` between the full-bleed cloth bands. Headings and intros on ledger pages start at `date-col + cell-x`, so they align with the particulars column, not the sheet edge.

**Ledger pages** (index, account, 404): a two-column grid with the ledger (fluid) and the 17.5rem accounts column, a 3.5rem gap, and 2.5rem top padding. The ledger is a fixed-layout table with five columns: Date (9.25rem), Particulars (fluid), Account (11.875rem), Fo. (4.25rem) and Min. (4.25rem). Rows are padded 1.375rem vertically and 0.875rem horizontally, and Fo. and Min. are split by 1px vertical rules. After the last entry come 1–3 blank ruled rows, 2.75rem high, drawn outside the table so screen readers count only real entries. The red double rule is a single absolutely positioned line that runs over both the table and the blank rows.

**Entry page:** a three-track grid: date margin (9.25rem), text (`minmax(0, 40rem)`) and account column (`minmax(12rem, 1fr)`, contents up to 18rem wide and aligned to the end). Tracks are separated by a 2rem column gap, and child rows inherit the tracks through subgrid. The red double rule spans the head, title, contents and close rows. A 1px rule closes the title row. The contents column is sticky 1.5rem from the top.

**Responsive steps:**
- At 86rem and below, the account column narrows to 9rem and the accounts aside to 15rem with a 2.5rem gap.
- At 68rem and below, the entry page drops the account track: details become an inline row under the lede, and contents become the sticky cloth bar.
- At 64rem and below, the ledger hides Account, Fo. and Min. and folds them into a ledger-face meta line under the abstract. The accounts aside moves below the ledger, capped at 30rem.
- At 48rem and below, the date column shrinks to 4.5rem and cell-x to 0.75rem. The entry margin collapses to a 0.375rem track carrying only the red rule, the date joins the entry details, section numbers come inline, and the band tightens.
- At 40rem and below, process-flow figures stack. At 34rem and below, comparison panels stack.

## Elevation & Depth

The system is flat. No element has a `box-shadow`, and nothing overlaps paper except the sticky contents bar and its dropdown list, which separate from the text by colour (cloth and paper) and a 2px foot rule, not by elevation. Depth is the depth of a printed page: heavier rules mark heads, lighter rules mark rows, and the faintest rules mark empty lines.

### Named Rules
**The Ruled, Not Boxed Rule.** Structure comes from horizontal rules. Use 2px head over 1px head for column heads and the tops of notes, panels and the close rows, 1px green between rows, and faint green for blank lines. A block is closed on all four sides only for an image frame (1px rule) or the gilt label on cloth.

## Shapes

Every corner is square (0). The recurring forms are the line and the double line: the red 4px `double` border, paired head rules, and 1px column dividers. The only closed rectangle used as an identity device is the gilt label (1.5px border) on cloth, repeated in the icon and the share card. The app icon tile's 96/512 corner is the platform mask for home-screen icons, not a page shape. The tick is the only drawn glyph: a 16-unit SVG stroke with round caps at width 2.4 in red, which becomes CanvasText in forced-colours mode.

## Components

### Band (top and foot boards)
- **Style:** full-bleed cloth at least 8.25rem tall, with its inner row aligned to the sheet. The top band has a 3px red bottom rule; the foot band has a 3px red top rule and sits 6rem below the content.
- **Contents:** the label at left, the band nav at right. The foot band carries the book name with volume, the "Kept by …" line, and the feeds, in pale Archivo at 85% width. Under 48rem it stacks into a column.

### Label
- **Style:** an inline column inside a 1.5px gilt border, square, padded 0.875rem by 1.75rem. The book name is set in the label-title serif in cloth cream, with the volume line beneath it as a gilt column head ("VOL. I · 2026").
- **Behaviour:** links to `/blog`. Under 48rem it scales to 1.75rem with padding of 0.625rem by 1.125rem.

### Navigation (band nav)
- **Style:** Archivo at 80% width, 1.0625rem, with 2.25rem gaps. Links are pale on cloth with 2.75rem tap targets and no underline at rest.
- **States:** hover goes to cloth cream. The current section (Entries or Accounts) is cream with a 2px red underline at 0.5em offset. Focus is a gilt outline.
- **Theme toggle:** a text button in the same style that names the other theme ("Night" / "Day"). Both labels are server-rendered and CSS shows the right one, so there is no hydration flash.

### Ledger table (signature)
- **Head:** column heads padded 0.625rem by cell-x between a 2px head rule above and a 1px head rule below.
- **Row:** the date in Archivo at 80% (day and month, with the year in pencil below), the serif entry title as the link (no underline at rest, 1px red underline on hover), the abstract in ink-soft below it (max 40rem), accounts listed one per line in head green, then the folio and minutes right-aligned. A read entry gets a red tick after its folio, from localStorage only.
- **Blank rows:** 2.75rem empty lines in the faint rule that keep the column dividers going.
- **Margin rule:** a red 4px double line at the end of the date column, through every row.

### Accounts column
- **Style:** a column head ("Accounts") on a 2px head rule, then a list with 1px rule separators. Each account name is serif ink with the count on the right in pencil Archivo. The current account is set at weight 600 (`aria-current="page"`). Hover gives a 1px red underline.
- **Also holds:** the italic tick key ("A ✓ marks entries you have read…", where the mark is the SVG tick) and a Feeds group in the same pattern.

### Entry contents (signature)
- **Wide (above 68rem):** a sticky list in the account column under a "Contents / Min." head on a 2px rule. Each line is a four-part grid: number in pencil Archivo, serif title, tick slot, start minute. Every section the reader has passed gets a red tick. The current line is ink at weight 600 (`aria-current="location"`). Depth-3 lines indent to 2.75rem at 0.875rem.
- **Narrow (68rem and below):** a full-bleed sticky cloth bar, 2.75rem tall with a 2px red foot rule. It shows the folio in gilt column-head style, the current section number and title once the entry title scrolls away, and a "Contents" / "Close contents" text toggle underlined in gilt. The list drops below on paper with a 2px head foot rule, capped at `min(70dvh, 32rem)`. Escape and outside-pointer close it.

### Tick
- **Style:** an inline 0.95em SVG check stroked in red. It marks read entries in the ledger and entry details, and passed sections in the contents. It is decorative to assistive tech except where it means "read", where it carries a screen-reader label.

### Notes, panels and asides (MDX)
- **Note (Callout):** a 2px head rule on top and a 1px green rule below, with no sides and no fill. Its label is a column head in head green, and the body runs at 1.0625rem.
- **Panels (VisualGrid / VisualCard):** a 2- or 3-column grid between a 2px head rule and a 1px rule, with columns divided by 1px vertical rules and later rows by a top rule. Panel titles are serif 600, and an optional label runs inline in pencil before the title ("Label: Title"), not above it. A lone card reads as a ruled aside.

### Tables, figures and sequences
- **Tables:** column-head-style `th` cells between head rules, 1px row rules, and a first column in ink at weight 600 with the rest in ink-soft. Captions are numbered "Table n." with a head-green Archivo prefix.
- **Figures:** preformatted diagrams between two 1px rules with no fill, and process flows as numbered steps joined by a 1px vertical rule. Captions sit below in ink-soft at 0.9375rem, numbered "Figure n.".
- **Images:** a 1px rule frame at full width.

### Close and forward rows
- **Signed line:** "Entered by …, date." in italic ink-soft.
- **Forward rows:** a list on a 2px head rule, one row per neighbour. Each row has the column head (Brought forward / Carried forward), the linked title in serif 600 ink, and the date in pencil Archivo. Empty rows say so in italic pencil. The feeds sentence follows.

### Buttons
- **Shape:** the system has no filled or bordered buttons. Actions are text buttons: 2.75rem tall, no padding, border or background, in link blue with a 1px underline (on cloth: cream with a gilt underline).
- **Focus:** a 2px outline at 3px offset in red on paper and gilt on cloth.

### Code
- **Blocks:** sunk paper between 1px top and bottom rules, square, padded 1rem by 1.125rem, 0.875rem mono, tab size 2. Syntax colours are Shiki github-light and github-dark, switched with the theme.
- **Inline:** sunk paper, 0.1em by 0.3em padding, 0.85em.

### Share card and marks
- **OG card (1200×630):** a 150px cloth band with a 5px red foot rule and the gilt-bordered label, then a ruled Date/Particulars head with a red double rule, the date in Archivo and the title and abstract in serif. Archivo is loaded at 80 width.
- **Icon:** a cloth tile with the gilt label outline, two bars of lettering (cream and gilt), and a red foot rule. It is pure vector.

## Do's and Don'ts

### Do:
- **Do** close the date column with the red 4px double rule on any new ledger-like page, running the full height of the content it frames.
- **Do** put column heads between a 2px head rule above and a 1px head rule below, set as Archivo 700 at 70% width, 0.8125rem, 0.12em tracking, uppercase.
- **Do** align page headings and intros to the particulars column (`date-col + cell-x`), not the sheet edge.
- **Do** set dates, accounts, folios, minutes and nav in condensed Archivo with tabular lining figures, and everything read in Source Serif 4.
- **Do** use the product's own words: entries, accounts, folio, brought forward, carried forward, the tick.
- **Do** switch the focus outline to gilt inside any cloth region; keep it red on paper.
- **Do** keep text links in prose blue with a 45% underline, and keep apparatus links in their surrounding colour, underlined only on hover.
- **Do** keep state changes instant; smooth scrolling is allowed only when reduced motion is not requested.

### Don't:
- **Don't** add shadows, rounded corners, filled cards or bordered boxes on paper. Use rules.
- **Don't** fill anything with red, or use red for headings or running text.
- **Don't** use cloth green as a component or button fill on the paper sheet.
- **Don't** use JetBrains Mono for anything that is not code.
- **Don't** put an uppercase kicker or eyebrow above a heading; a label belongs inline or as a column head on its rule.
- **Don't** add decorative icons; the tick is the only drawn glyph.
- **Don't** add progress bars, badges or chips for reading state; record it as a tick.
- **Don't** invert the palette for night; switch to the cloth materials and keep every rule in place.
