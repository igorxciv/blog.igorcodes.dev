import { clsx } from "clsx";
import {
  Children,
  type CSSProperties,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

// Reading aids and diagrams for long posts. Every component keeps its content
// in children (Markdown inside the tag) so the RSS and Markdown mirrors, which
// unwrap MDX tags, still carry the words. A `title` prop survives there as a
// bold line (see lib/mdx/remark-strip-mdx.ts).

type Titled = {
  children: ReactNode;
  title?: string;
};

function Label({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <p className="aid-label">
      {icon}
      <span>{children}</span>
    </p>
  );
}

function Icon({ path }: { path: string }) {
  return (
    <svg
      className="aid-icon"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = {
  list: "M2.5 4h11M2.5 8h11M2.5 12h7",
  arrow: "M3 8h10M9 4l4 4-4 4",
  check: "M3 8.5l3 3 7-7",
  file: "M4 1.75h5.5L12.5 4.75v9.5h-8.5zM9.25 1.75v3.25h3.25M6 8.5h4.5M6 11h4.5",
};

/** The post in three or four claims, set right after the opening. */
export function KeyPoints({ children, title = "The short version" }: Titled) {
  return (
    <aside className="aid aid-keypoints" aria-label={title}>
      <Label icon={<Icon path={ICONS.list} />}>{title}</Label>
      <div className="aid-body">{children}</div>
    </aside>
  );
}

/** One line set large, the sentence a reader would quote. */
export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <figure className="pullquote">
      <blockquote>{children}</blockquote>
    </figure>
  );
}

/** A short boxed conclusion at the end of a section. */
export function Takeaway({ children, title = "Takeaway" }: Titled) {
  return (
    <aside className="aid aid-takeaway" aria-label={title}>
      <Label icon={<Icon path={ICONS.arrow} />}>{title}</Label>
      <div className="aid-body">{children}</div>
    </aside>
  );
}

/** An actionable list drawn with check marks. */
export function Checklist({ children, title = "Checklist" }: Titled) {
  return (
    <aside className="aid aid-checklist" aria-label={title}>
      <Label icon={<Icon path={ICONS.check} />}>{title}</Label>
      <div className="aid-body">{children}</div>
    </aside>
  );
}

/** Labelled fields: each list item opens with a bold label ending in a period. */
export function Brief({ children, title = "Example" }: Titled) {
  return (
    <aside className="aid aid-brief" aria-label={title}>
      <Label icon={<Icon path={ICONS.file} />}>{title}</Label>
      <div className="aid-body">{children}</div>
    </aside>
  );
}

function DiagramTitle({ children }: { children?: string }) {
  return children ? <p className="diagram-title">{children}</p> : null;
}

/** Two paths through the same problem, side by side. */
export function Compare({ children, title }: Titled) {
  return (
    <figure className="diagram compare" aria-label={title}>
      <DiagramTitle>{title}</DiagramTitle>
      <div className="compare-columns">{children}</div>
    </figure>
  );
}

/** One column of a Compare: an ordered list whose last item is the outcome. */
export function CompareColumn({
  children,
  title,
  muted,
}: Titled & { muted?: boolean }) {
  return (
    <section
      className={clsx("compare-column", muted && "is-muted")}
      aria-label={title}
    >
      {title ? <p className="compare-title">{title}</p> : null}
      <div className="timeline">{children}</div>
    </section>
  );
}

/** A single numbered sequence drawn as a timeline. */
export function Steps({
  children,
  title,
  muted,
}: Titled & { muted?: boolean }) {
  return (
    <figure
      className={clsx("diagram steps", muted && "is-muted")}
      aria-label={title}
    >
      <DiagramTitle>{title}</DiagramTitle>
      <div className="timeline">{children}</div>
    </figure>
  );
}

function isList(
  node: ReactNode,
): node is ReactElement<{ children?: ReactNode }> {
  return isValidElement(node) && (node.type === "ul" || node.type === "ol");
}

/**
 * One thing in the middle with its consequences branching off below. The first
 * paragraph is the centre; the list items are the branches.
 */
export function Hub({ children, title }: Titled) {
  const list = Children.toArray(children).find(isList);
  const branches = list
    ? Children.toArray(list.props.children).filter(isValidElement).length
    : 0;
  const style = { "--branches": Math.max(branches, 1) } as CSSProperties;

  return (
    <figure className="diagram hub" aria-label={title} style={style}>
      <DiagramTitle>{title}</DiagramTitle>
      <div className="hub-body">{children}</div>
    </figure>
  );
}
