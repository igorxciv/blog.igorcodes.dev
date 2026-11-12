import { clsx } from "clsx";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

// MDX visuals set as ledger apparatus: numbered figures and tables, hairline
// rules, no cards or shadows. Figure and table numbers come from CSS counters
// on .entry-body so they stay in document order.

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type VisualGridProps = {
  children: ReactNode;
  columns?: 2 | 3 | "2" | "3";
};

type VisualCardProps = {
  children: ReactNode;
  title: string;
  /** Short label set before the title on the same line (never above it). */
  eyebrow?: string;
  tone?: "default" | "accent" | "warning";
  headingLevel?: HeadingLevel;
};

type ProcessFlowProps = {
  title?: string;
  steps?: string[] | string;
  mutedSteps?: string[] | string;
  mutedTitle?: string;
  headingLevel?: HeadingLevel;
};

type FigureProps = {
  /** Preformatted diagram text (from a ```figure fence). */
  art: string;
  caption: string;
  /** Text alternative describing what the diagram shows. */
  description: string;
  wide?: boolean;
};

type ImagePlaceholderProps = {
  title: string;
  description: string;
  orientation?: "landscape" | "portrait" | "square";
  headingLevel?: HeadingLevel;
};

type TableBlockProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  footer?: string;
  headingLevel?: HeadingLevel;
};

type PromptBlockProps = {
  content: string;
};

type WorkflowStepsBlockProps = {
  content: string;
};

/** Side-by-side comparison panels separated by hairlines. */
export function VisualGrid({ children, columns = 2 }: VisualGridProps) {
  return (
    <div className="entry-panels" data-columns={String(columns)}>
      {children}
    </div>
  );
}

function sentenceCase(label: string): string {
  const lower = label.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function VisualCard({
  children,
  title,
  eyebrow,
  headingLevel = 3,
}: VisualCardProps) {
  // Panel titles sit inside figures and asides, so they are not part of the
  // numbered section outline; render them as styled paragraphs unless the
  // author asked for a specific level other than the default.
  const Heading = headingLevel === 3 ? "p" : (`h${headingLevel}` as const);

  return (
    <section className="entry-panel" aria-label={title}>
      <Heading className="entry-panel-title">
        {eyebrow ? (
          <span className="panel-label">{sentenceCase(eyebrow)}: </span>
        ) : null}
        {title}
      </Heading>
      <div>{children}</div>
    </section>
  );
}

function normalizeFlowItems(items?: string[] | string) {
  if (Array.isArray(items)) {
    return items;
  }
  if (!items) {
    return [];
  }
  return items
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function Steps({ items, muted }: { items: string[]; muted?: boolean }) {
  return (
    <ol className={clsx("entry-steps", muted && "entry-steps-muted")}>
      {items.map((item, index) => (
        <li key={item}>
          <span className="step-no ledger-face" aria-hidden="true">
            {index + 1}.
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

/** A numbered sequence drawn as a figure; optional second column for the skipped path. */
export function ProcessFlow({
  title = "How the loop changes",
  steps = [],
  mutedSteps,
  mutedTitle = "The delegated shortcut",
}: ProcessFlowProps) {
  const primary = normalizeFlowItems(steps);
  const muted = normalizeFlowItems(mutedSteps);

  return (
    <figure className="entry-figure">
      <div
        className={clsx("entry-flow", muted.length > 0 && "entry-flow-columns")}
      >
        <div>
          {muted.length > 0 ? (
            <p className="entry-flow-label">The full loop</p>
          ) : null}
          <Steps items={primary} />
        </div>
        {muted.length > 0 ? (
          <div>
            <p className="entry-flow-label">{mutedTitle}</p>
            <Steps items={muted} muted />
          </div>
        ) : null}
      </div>
      <figcaption>{title}</figcaption>
    </figure>
  );
}

/** A preformatted diagram with a numbered caption, in the manner of an RFC figure. */
export function Figure({ art, caption, description, wide }: FigureProps) {
  return (
    <figure className={clsx("entry-figure", wide && "entry-figure-wide")}>
      <pre
        className="entry-art"
        role="img"
        aria-label={description}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: wide diagrams scroll horizontally and must be keyboard-reachable (WCAG 2.1.1)
        tabIndex={0}
      >
        <span>{art.replace(/^\n+|\s+$/g, "")}</span>
      </pre>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/**
 * Reserved space for a figure that is not drawn yet. Visible in development
 * only, so an unfinished figure can never ship as a box of placeholder copy.
 */
export function ImagePlaceholder({
  title,
  description,
}: ImagePlaceholderProps) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  return (
    <aside className="figure-pending ledger-face" aria-label="Figure pending">
      Figure pending (hidden in production): {title}. {description}
    </aside>
  );
}

export function TableBlock({
  children,
  title,
  description,
  footer,
  headingLevel = 3,
}: TableBlockProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <figure className="entry-table">
      {title ? <Heading className="entry-panel-title">{title}</Heading> : null}
      {description ? <p>{description}</p> : null}
      {/* biome-ignore lint/a11y/useSemanticElements: overflow scroll wrapper; role="region" names the table for AT */}
      <div
        role="region"
        aria-label={title ?? footer ?? "Table"}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: horizontally-scrollable region must be keyboard-focusable (WCAG 2.1.1)
        tabIndex={0}
        className="entry-table-scroll"
      >
        {children}
      </div>
      {footer ? <figcaption>{footer}</figcaption> : null}
    </figure>
  );
}

/** Literal lines (prompts, quoted states) set indented in the apparatus face. */
export function PromptBlock({ content }: PromptBlockProps) {
  return (
    <div className="entry-literal">
      <pre>{content.trim()}</pre>
    </div>
  );
}

/** "a -> b -> c" text fences become an inline numbered sequence. */
export function WorkflowStepsBlock({ content }: WorkflowStepsBlockProps) {
  const steps = content
    .trim()
    .split("->")
    .map((step) => step.trim())
    .filter(Boolean);

  return (
    <div className="entry-sequence">
      <ol aria-label="Sequence">
        {steps.map((step, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: steps are parsed from static author content and never reordered
          <li key={`${index}-${step}`}>{step}</li>
        ))}
      </ol>
    </div>
  );
}

export function InlineKicker({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return <span className={clsx("ledger-face", className)} {...props} />;
}
