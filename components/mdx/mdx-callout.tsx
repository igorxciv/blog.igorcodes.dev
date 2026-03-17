import type { ReactNode } from "react";
import { CircleCheck, Info, TriangleAlert } from "lucide-react";
import { clsx } from "clsx";

type CalloutProps = {
  children: ReactNode;
  title?: string;
  type?: "note" | "warning" | "success";
};

const stylesByType: Record<NonNullable<CalloutProps["type"]>, string> = {
  note: "border-blue-300/60 bg-blue-500/10 text-blue-950 dark:border-blue-300/40 dark:text-blue-100",
  warning:
    "border-amber-300/70 bg-amber-500/15 text-amber-950 dark:border-amber-300/50 dark:text-amber-100",
  success:
    "border-emerald-300/60 bg-emerald-500/10 text-emerald-950 dark:border-emerald-300/40 dark:text-emerald-100",
};

const iconByType = {
  note: Info,
  warning: TriangleAlert,
  success: CircleCheck,
} as const;

export function Callout({ children, title, type = "note" }: CalloutProps) {
  const Icon = iconByType[type];

  return (
    <aside className={clsx("my-6 rounded-lg border px-4 py-3", stylesByType[type])}>
      {title ? (
        <p className="m-0 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide">
          <Icon aria-hidden="true" className="size-3.5" />
          {title}
        </p>
      ) : null}
      <div className={clsx("text-sm leading-7", { "mt-2": title })}>{children}</div>
    </aside>
  );
}
