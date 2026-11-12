import { type ReactNode } from "react";

type CalloutProps = {
  children: ReactNode;
  title?: string;
  type?: "note" | "warning" | "success";
};

const defaultLabel: Record<NonNullable<CalloutProps["type"]>, string> = {
  note: "Note",
  warning: "Caution",
  success: "Result",
};

/** A boxed note in the memo's voice: one hairline box, the label set in bold. */
export function Callout({ children, title, type = "note" }: CalloutProps) {
  const label = title ?? defaultLabel[type];

  return (
    <aside className="entry-note" aria-label={label}>
      <p className="entry-note-label">{label}</p>
      <div>{children}</div>
    </aside>
  );
}
