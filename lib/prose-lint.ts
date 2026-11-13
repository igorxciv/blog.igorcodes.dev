// Mechanical checks for blog post prose: the AI-writing tells and layout
// limits from docs/writing-style.md that a script can see. Judgement calls
// (voice, argument, rhythm) stay with the writer; this catches what slips.

export type ProseFinding = {
  line: number;
  rule: string;
  message: string;
};

/** Words and phrases that read as machine-written in this blog's voice. */
const SLOP_TERMS = [
  "additionally",
  "crucial",
  "delve",
  "delves",
  "fostering",
  "furthermore",
  "garner",
  "in order to",
  "in today's",
  "it is important to note",
  "it's important to note",
  "leverage",
  "leveraging",
  "moreover",
  "not just",
  "not only",
  "pivotal",
  "seamless",
  "seamlessly",
  "showcase",
  "showcasing",
  "tapestry",
  "testament",
  "underscore",
  "underscores",
  "unlock",
  "utilize",
];

const SMALL_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "the",
  "to",
  "vs",
  "with",
]);

const MAX_PULL_QUOTES = 2;
const MAX_MARKS = 6;
/** Consecutive one-sentence paragraphs that start reading as a chain. */
const CHAIN_LENGTH = 3;
const SHORT_PARAGRAPH_WORDS = 14;

/** Strips inline code, Markdown links and images down to their visible text. */
function visibleText(line: string): string {
  return line
    .replace(/`[^`]*`/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "");
}

/**
 * Title Case reads as a heading written by a template. A heading is flagged
 * when most of its longer words after the first are capitalised.
 */
export function isTitleCase(text: string): boolean {
  const words = text
    .replace(/[`*_"]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(1)
    .filter((word) => !SMALL_WORDS.has(word.toLowerCase()))
    .filter((word) => /^[A-Za-z]/.test(word))
    // Acronyms (AI, API, SSO) are capitalised in any case.
    .filter((word) => !/^[A-Z0-9]{2,}[a-z]?$/.test(word.replace(/\W+$/, "")));
  if (words.length < 2) {
    return false;
  }
  const capitalised = words.filter((word) => /^[A-Z]/.test(word)).length;
  return capitalised / words.length > 0.5;
}

function isSentenceParagraph(lines: string[]): boolean {
  const text = visibleText(lines.join(" ")).trim();
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.match(/[.!?](\s|$)/g)?.length ?? 0;
  return words.length < SHORT_PARAGRAPH_WORDS && sentences <= 1;
}

/** A JSX component tag line (`<Steps ...>`, `</Steps>`), not inline HTML like <mark>. */
function isTagLine(line: string): boolean {
  return /^\s*<\/?[A-Z]/.test(line);
}

function isProseStart(line: string): boolean {
  return !isTagLine(line) && !/^\s*([#>|-]|\*\s|\d+\.\s|```|~~~)/.test(line);
}

export function lintPost(source: string): ProseFinding[] {
  const findings: ProseFinding[] = [];
  const lines = source.split("\n");
  const add = (line: number, rule: string, message: string) =>
    findings.push({ line, rule, message });

  let inFrontmatter = lines[0]?.trim() === "---";
  let inFence = false;
  let pullQuotes = 0;
  let marks = 0;
  let hasKeyPoints = false;
  let paragraph: { start: number; lines: string[] } | null = null;
  let chain: number[] = [];

  const closeParagraph = () => {
    if (!paragraph) {
      return;
    }
    if (isSentenceParagraph(paragraph.lines)) {
      chain.push(paragraph.start);
      if (chain.length === CHAIN_LENGTH) {
        add(
          chain[0] ?? paragraph.start,
          "one-line-chain",
          `${CHAIN_LENGTH} one-sentence paragraphs in a row; merge them into a real paragraph`,
        );
      }
    } else {
      chain = [];
    }
    if ((paragraph.lines.join(" ").match(/<mark>/g)?.length ?? 0) > 1) {
      add(
        paragraph.start,
        "mark-density",
        "two <mark> sentences in one paragraph",
      );
    }
    paragraph = null;
  };

  lines.forEach((raw, index) => {
    const lineNo = index + 1;
    const line = raw.trimEnd();

    if (inFrontmatter) {
      if (index > 0 && line.trim() === "---") {
        inFrontmatter = false;
        return;
      }
      const field = /^(title|description):\s*"?(.*?)"?$/.exec(line);
      if (field?.[1] && field[2] !== undefined) {
        checkText(field[2], lineNo, add);
        if (field[1] === "title" && isTitleCase(field[2])) {
          add(lineNo, "title-case", "write the title in sentence case");
        }
      }
      return;
    }

    if (/^\s*(```|~~~)/.test(line)) {
      closeParagraph();
      chain = [];
      if (!inFence && /^\s*```figure/.test(line)) {
        add(
          lineNo,
          "ascii-figure",
          "draw diagrams with Compare, Steps or Hub, not ASCII art",
        );
      }
      inFence = !inFence;
      return;
    }
    if (inFence) {
      return;
    }

    if (line.trim() === "") {
      closeParagraph();
      return;
    }

    if (/<PullQuote\b/.test(line)) {
      pullQuotes += 1;
    }
    if (/<KeyPoints\b/.test(line)) {
      hasKeyPoints = true;
    }
    marks += line.match(/<mark>/g)?.length ?? 0;

    checkText(line, lineNo, add);

    const heading = /^(#{2,3})\s+(.*)$/.exec(line);
    if (heading?.[2] !== undefined) {
      closeParagraph();
      chain = [];
      if (/^\d+[.)]\s/.test(heading[2])) {
        add(
          lineNo,
          "numbered-heading",
          "headings are numbered by CSS; drop the number",
        );
      }
      if (isTitleCase(heading[2])) {
        add(lineNo, "title-case", "write headings in sentence case");
      }
      return;
    }

    if (!isTagLine(line)) {
      checkParens(line, lineNo, add);
    }
    if (paragraph) {
      paragraph.lines.push(line);
    } else if (isProseStart(line)) {
      paragraph = { start: lineNo, lines: [line] };
    } else {
      // Lists, quotes and tags break a run of one-line paragraphs.
      chain = [];
    }
  });
  closeParagraph();

  if (pullQuotes > MAX_PULL_QUOTES) {
    add(
      1,
      "pullquote-count",
      `${pullQuotes} PullQuotes; keep ${MAX_PULL_QUOTES} at most`,
    );
  }
  if (marks > MAX_MARKS) {
    add(
      1,
      "mark-count",
      `${marks} <mark> sentences; keep ${MAX_MARKS} at most`,
    );
  }
  if (!hasKeyPoints) {
    add(1, "keypoints-missing", "open the post with a <KeyPoints> summary");
  }

  return findings;
}

function checkText(
  line: string,
  lineNo: number,
  add: (line: number, rule: string, message: string) => void,
) {
  const text = line.replace(/`[^`]*`/g, "").replace(/\]\([^)]*\)/g, "]");
  if (/[—–]/.test(text)) {
    add(lineNo, "dash", "replace the em or en dash with a period or a comma");
  }
  if (/[‘’“”]/.test(text)) {
    add(lineNo, "curly-quote", "use straight quotes");
  }
  const lower = visibleText(text).toLowerCase();
  for (const term of SLOP_TERMS) {
    const pattern = new RegExp(
      `(^|[^a-z'])${term.replace(/'/g, "'")}($|[^a-z])`,
    );
    if (pattern.test(lower)) {
      add(lineNo, "slop-term", `"${term}" reads as filler; say it plainly`);
    }
  }
}

function checkParens(
  line: string,
  lineNo: number,
  add: (line: number, rule: string, message: string) => void,
) {
  if (/\([^)]*\)/.test(visibleText(line))) {
    add(
      lineNo,
      "parenthesis",
      "work the aside into the sentence or give it its own sentence",
    );
  }
}
