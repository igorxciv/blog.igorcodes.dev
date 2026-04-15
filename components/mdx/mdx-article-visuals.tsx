import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { clsx } from "clsx";
import { ArrowRight, Image as ImageIcon } from "lucide-react";

type VisualGridProps = {
  children: ReactNode;
  columns?: 2 | 3;
};

type VisualCardProps = {
  children: ReactNode;
  title: string;
  eyebrow?: string;
  tone?: "default" | "accent" | "warning";
};

type ProcessFlowProps = {
  title?: string;
  steps: string[];
  mutedSteps?: string[];
};

type ImagePlaceholderProps = {
  title: string;
  description: string;
  orientation?: "landscape" | "portrait" | "square";
};

export function VisualGrid({ children, columns = 2 }: VisualGridProps) {
  return (
    <div
      className={clsx(
        "my-8 grid gap-4 lg:my-10",
        columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2",
      )}
    >
      {children}
    </div>
  );
}

const cardToneStyles: Record<NonNullable<VisualCardProps["tone"]>, string> = {
  default: "border-(--border) bg-(--surface-raised)",
  accent: "border-(--accent-line) bg-(--accent-soft)",
  warning: "border-amber-500/35 bg-amber-500/10",
};

export function VisualCard({
  children,
  title,
  eyebrow,
  tone = "default",
}: VisualCardProps) {
  return (
    <section
      className={clsx(
        "rounded-3xl border px-5 py-5 shadow-[var(--fm-shadow-elevated)]",
        cardToneStyles[tone],
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-(--foreground-soft)">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="mb-3 text-lg text-(--foreground) sm:text-xl" style={{ fontWeight: 600 }}>
        {title}
      </h3>
      <div className="text-sm leading-7 text-(--foreground-soft) sm:text-[0.98rem]">
        {children}
      </div>
    </section>
  );
}

function FlowTrack({
  items,
  variant,
}: {
  items?: string[];
  variant: "primary" | "muted";
}) {
  const safeItems = items ?? [];

  return (
    <div className="grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
      {safeItems.map((item, index) => (
        <div key={`${variant}-${item}`} className="flex items-center gap-3">
          <div
            className={clsx(
              "min-w-0 flex-1 rounded-2xl border px-4 py-3 text-sm leading-6 sm:text-[0.95rem]",
              variant === "primary"
                ? "border-(--accent-line) bg-(--accent-soft) text-(--foreground)"
                : "border-(--border) bg-(--surface) text-(--foreground-soft)",
            )}
          >
            <span className="mr-2 font-mono text-xs uppercase tracking-[0.18em] text-(--foreground-soft)">
              {String(index + 1).padStart(2, "0")}
            </span>
            {item}
          </div>
          {index < safeItems.length - 1 ? (
            <ArrowRight
              aria-hidden="true"
              className={clsx(
                "hidden size-4 shrink-0 md:block",
                variant === "primary" ? "text-(--accent)" : "text-(--foreground-soft)",
              )}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function ProcessFlow({
  title = "How the loop changes",
  steps = [],
  mutedSteps,
}: ProcessFlowProps) {
  return (
    <section className="my-8 rounded-[2rem] border border-(--border) bg-(--surface-raised) p-5 lg:my-10 lg:p-6">
      <h3 className="mb-4 text-lg text-(--foreground) sm:text-xl" style={{ fontWeight: 600 }}>
        {title}
      </h3>
      <FlowTrack items={steps} variant="primary" />
      {mutedSteps && mutedSteps.length > 0 ? (
        <>
          <p className="mb-3 mt-5 text-xs uppercase tracking-[0.22em] text-(--foreground-soft)">
            What gets skipped in delegation mode
          </p>
          <FlowTrack items={mutedSteps} variant="muted" />
        </>
      ) : null}
    </section>
  );
}

const aspectStyles: Record<NonNullable<ImagePlaceholderProps["orientation"]>, string> = {
  landscape: "aspect-[16/9]",
  portrait: "aspect-[4/5]",
  square: "aspect-square",
};

export function ImagePlaceholder({
  title,
  description,
  orientation = "landscape",
}: ImagePlaceholderProps) {
  return (
    <figure className="my-8 lg:my-10">
      <div
        className={clsx(
          "flex items-center justify-center rounded-[2rem] border border-dashed border-(--accent-line) bg-linear-to-br from-(--accent-soft) to-(--surface-raised) p-6",
          aspectStyles[orientation],
        )}
      >
        <div className="max-w-lg text-center">
          <ImageIcon aria-hidden="true" className="mx-auto mb-4 size-8 text-(--accent)" />
          <p className="text-xs uppercase tracking-[0.22em] text-(--foreground-soft)">
            Image Placeholder
          </p>
          <h3 className="mt-3 text-xl text-(--foreground)" style={{ fontWeight: 600 }}>
            {title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-(--foreground-soft) sm:text-[0.98rem]">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
}

export function InlineKicker({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={clsx(
        "rounded-full border border-(--accent-line) bg-(--accent-soft) px-2.5 py-1 text-[0.72rem] uppercase tracking-[0.18em] text-(--foreground)",
        className,
      )}
      {...props}
    />
  );
}
