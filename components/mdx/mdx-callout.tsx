import type { ReactNode } from "react";
import { CircleCheck, Info, TriangleAlert } from "lucide-react";
import { clsx } from "clsx";

type CalloutProps = {
  children: ReactNode;
  title?: string;
  type?: "note" | "warning" | "success";
};

const stylesByType: Record<NonNullable<CalloutProps["type"]>, string> = {
  note: "border-(--accent-line) bg-(--accent-soft) text-(--foreground)",
  warning: "border-amber-500/35 bg-amber-500/10 text-(--foreground)",
  success: "border-emerald-500/30 bg-emerald-500/10 text-(--foreground)",
};

const iconByType = {
  note: Info,
  warning: TriangleAlert,
  success: CircleCheck,
} as const;

export function Callout({ children, title, type = "note" }: CalloutProps) {
  const Icon = iconByType[type];

  return (
    <aside
      className={clsx(
        "my-8 rounded-[2rem] border px-5 py-5 shadow-[var(--fm-shadow-elevated)] lg:my-10 lg:px-6 lg:py-6",
        stylesByType[type],
      )}
    >
      {title ? (
        <p className="m-0 inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-(--foreground-soft)">
          <Icon aria-hidden="true" className="size-4 text-current" />
          {title}
        </p>
      ) : null}
      <div
        className={clsx(
          "text-sm leading-7 text-(--foreground-soft) sm:text-[0.98rem]",
          "[&_a]:text-(--accent) [&_a]:underline [&_a]:decoration-(--accent-line) [&_p:last-child]:mb-0",
          { "mt-3": title },
        )}
      >
        {children}
      </div>
    </aside>
  );
}
