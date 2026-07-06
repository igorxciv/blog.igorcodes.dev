import { clsx } from "clsx";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

type VisualGridProps = {
  children: ReactNode;
  columns?: 2 | 3 | "2" | "3";
};

type VisualCardProps = {
  children: ReactNode;
  title: string;
  eyebrow?: string;
  tone?: "default" | "accent" | "warning";
};

type ProcessFlowProps = {
  title?: string;
  steps?: string[] | string;
  mutedSteps?: string[] | string;
};

type ImagePlaceholderProps = {
  title: string;
  description: string;
  orientation?: "landscape" | "portrait" | "square";
};

type TableBlockProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  footer?: string;
};

type PromptBlockProps = {
  content: string;
};

type WorkflowStepsBlockProps = {
  content: string;
};

const panelBaseClassName =
  "rounded-[2rem] border px-5 py-5 shadow-[var(--fm-shadow-elevated)] lg:px-6 lg:py-6";

const eyebrowClassName =
  "mb-3 text-[0.72rem] uppercase tracking-[0.22em] text-(--foreground-soft)";

const titleClassName = "mb-3 text-lg text-(--foreground) sm:text-xl";

const bodyClassName =
  "text-sm leading-7 text-(--foreground-soft) sm:text-[0.98rem]";

export function VisualGrid({ children, columns = 2 }: VisualGridProps) {
  const columnCount = Number(columns);

  return (
    <div
      className={clsx(
        "my-8 grid gap-4 lg:my-10",
        columnCount === 3 ? "md:grid-cols-3" : "md:grid-cols-2",
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
    <section className={clsx(panelBaseClassName, cardToneStyles[tone])}>
      {eyebrow ? <p className={eyebrowClassName}>{eyebrow}</p> : null}
      <h3 className={titleClassName} style={{ fontWeight: 600 }}>
        {title}
      </h3>
      <div className={clsx(bodyClassName, "[&_p:last-child]:mb-0")}>
        {children}
      </div>
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

function FlowTrack({
  items,
  variant,
}: {
  items?: string[] | string;
  variant: "primary" | "muted";
}) {
  const safeItems = normalizeFlowItems(items);
  const useTimeline = safeItems.length > 4;
  const isPrimary = variant === "primary";

  if (useTimeline) {
    return (
      <ol className="grid gap-5 pl-12 sm:pl-16">
        {safeItems.map((item, index) => (
          <li
            key={`${variant}-${item}`}
            className={clsx(
              "relative",
              index < safeItems.length - 1
                ? "after:absolute after:-bottom-[calc(50%-0.5rem)] after:left-[-2rem] after:top-[calc(50%+1.5rem)] after:w-px sm:after:left-[-2.75rem] sm:after:top-[calc(50%+1.75rem)]"
                : null,
              index < safeItems.length - 1 && isPrimary
                ? "after:bg-(--accent-line)"
                : "after:bg-(--border-strong)",
            )}
          >
            <span
              className={clsx(
                "absolute -left-12 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border font-mono text-[0.68rem] tracking-[0.12em] sm:-left-16 sm:size-10",
                isPrimary
                  ? "border-(--accent-line) bg-(--surface-raised) text-(--accent)"
                  : "border-(--border-strong) bg-(--surface-raised) text-(--foreground-soft)",
              )}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div
              className={clsx(
                "flex min-h-20 items-center rounded-[1.35rem] border px-4 py-3 text-sm leading-6 sm:min-h-24 sm:px-5 sm:py-4 sm:text-[0.98rem] sm:leading-7",
                isPrimary
                  ? "border-(--accent-line) bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent-soft)_84%,transparent),color-mix(in_srgb,var(--surface-raised)_92%,transparent))] text-(--foreground)"
                  : "border-(--border) bg-(--surface) text-(--foreground-soft)",
              )}
            >
              {item}
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]">
      {safeItems.map((item, index) => (
        <div
          key={`${variant}-${item}`}
          className="flex min-w-0 items-stretch gap-3"
        >
          <div
            className={clsx(
              "min-w-0 flex-1 rounded-[1.35rem] border px-4 py-3 text-sm leading-6 sm:text-[0.95rem]",
              isPrimary
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
                "hidden size-4 shrink-0 self-center md:block",
                isPrimary ? "text-(--accent)" : "text-(--foreground-soft)",
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
    <section
      className={clsx(
        "my-8 bg-(--surface-raised) lg:my-10",
        panelBaseClassName,
        "border-(--border)",
      )}
    >
      <h3 className={clsx(titleClassName, "mb-4")} style={{ fontWeight: 600 }}>
        {title}
      </h3>
      <FlowTrack items={steps} variant="primary" />
      {normalizeFlowItems(mutedSteps).length > 0 ? (
        <>
          <p className={clsx(eyebrowClassName, "mb-3 mt-5")}>
            What gets skipped in delegation mode
          </p>
          <FlowTrack items={mutedSteps} variant="muted" />
        </>
      ) : null}
    </section>
  );
}

const aspectStyles: Record<
  NonNullable<ImagePlaceholderProps["orientation"]>,
  string
> = {
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
          "flex items-center justify-center rounded-[2rem] border border-dashed border-(--accent-line) bg-linear-to-br from-(--accent-soft) to-(--surface-raised) px-6 py-6 shadow-[var(--fm-shadow-elevated)] lg:px-8 lg:py-8",
          aspectStyles[orientation],
        )}
      >
        <div className="max-w-lg text-center">
          <ImageIcon
            aria-hidden="true"
            className="mx-auto mb-4 size-8 text-(--accent)"
          />
          <p className={eyebrowClassName}>Image Placeholder</p>
          <h3
            className={clsx(titleClassName, "mt-3")}
            style={{ fontWeight: 600 }}
          >
            {title}
          </h3>
          <p className={clsx(bodyClassName, "mx-auto mt-3 max-w-xl")}>
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
}

export function TableBlock({
  children,
  title,
  description,
  footer,
}: TableBlockProps) {
  return (
    <figure className="my-8 lg:my-10">
      {title ? (
        <h3
          className="m-0 max-w-5xl text-[1.85rem] leading-tight text-(--foreground) sm:text-3xl lg:text-[2.35rem]"
          style={{ fontWeight: 600 }}
        >
          {title}
        </h3>
      ) : null}
      {description ? (
        <p className="mb-6 mt-4 max-w-4xl text-[0.98rem] leading-8 text-(--foreground-soft) sm:text-base lg:mb-7 lg:text-[1.12rem] lg:leading-9">
          {description}
        </p>
      ) : null}

      <div
        className={clsx(
          "overflow-hidden rounded-[1.8rem] border border-(--border-strong)",
          "bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-raised)_96%,transparent),color-mix(in_srgb,var(--surface)_100%,transparent))]",
          "shadow-[0_10px_24px_rgb(0_0_0_/_0.18)]",
          "[&_table]:m-0 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left",
          "[&_thead_th]:border-b [&_thead_th]:border-(--border-strong) [&_thead_th]:px-5 [&_thead_th]:py-4 [&_thead_th]:align-top [&_thead_th]:text-[0.76rem] [&_thead_th]:uppercase [&_thead_th]:tracking-[0.2em] [&_thead_th]:text-(--foreground-soft) lg:[&_thead_th]:px-6",
          "[&_thead_th]:font-semibold",
          "[&_thead_th:nth-child(2)]:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent-soft)_14%,transparent),transparent)]",
          "[&_thead_th:nth-child(3)]:bg-[linear-gradient(180deg,color-mix(in_srgb,rgba(245,158,11,0.08)_72%,transparent),transparent)]",
          "[&_tbody_td]:border-t [&_tbody_td]:border-(--border) [&_tbody_td]:px-5 [&_tbody_td]:py-4 [&_tbody_td]:align-top [&_tbody_td]:text-[0.98rem] [&_tbody_td]:leading-8 lg:[&_tbody_td]:px-6 lg:[&_tbody_td]:py-5 lg:[&_tbody_td]:text-[1.08rem] lg:[&_tbody_td]:leading-9",
          "[&_tbody_td:first-child]:text-(--foreground) [&_tbody_td:first-child]:font-semibold",
          "[&_tbody_td:not(:first-child)]:text-(--foreground-soft)",
          "[&_thead_th:not(:last-child)]:border-r [&_thead_th:not(:last-child)]:border-(--border)",
          "[&_tbody_td:not(:last-child)]:border-r [&_tbody_td:not(:last-child)]:border-(--border)",
          "[&_tbody_td:first-child]:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-inset)_68%,transparent),transparent)]",
          "[&_tbody_td:nth-child(2)]:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent-soft)_10%,transparent),transparent)]",
          "[&_tbody_td:nth-child(3)]:bg-[linear-gradient(180deg,color-mix(in_srgb,rgba(245,158,11,0.05)_68%,transparent),transparent)]",
        )}
      >
        <div className="overflow-x-auto">{children}</div>
      </div>

      {footer ? (
        <figcaption className="mt-5 max-w-5xl text-[0.98rem] leading-8 text-(--foreground-soft) sm:text-base lg:mt-6 lg:text-[1.12rem] lg:leading-9">
          {footer}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function PromptBlock({ content }: PromptBlockProps) {
  const normalizedContent = content.trim();
  const lines = normalizedContent.split("\n").filter(Boolean);
  const eyebrow = lines.length > 1 ? "Prompt Set" : "Prompt";

  return (
    <figure className="my-8 lg:my-10">
      <div className="overflow-hidden rounded-[1.8rem] border border-(--accent-line) bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent-soft)_32%,transparent),color-mix(in_srgb,var(--surface-raised)_98%,transparent))] shadow-[var(--fm-shadow-elevated)]">
        <div className="border-b border-(--border) px-5 py-3 sm:px-6">
          <p className="m-0 text-[0.72rem] uppercase tracking-[0.24em] text-(--foreground-soft)">
            {eyebrow}
          </p>
        </div>
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[0.98rem] leading-8 text-(--foreground) sm:text-[1.02rem] sm:leading-9">
            {normalizedContent}
          </pre>
        </div>
      </div>
    </figure>
  );
}

export function WorkflowStepsBlock({ content }: WorkflowStepsBlockProps) {
  const normalizedContent = content.trim();
  const steps = normalizedContent
    .split("->")
    .map((step) => step.trim())
    .filter(Boolean);

  return (
    <figure className="my-8 lg:my-10">
      <div className="overflow-hidden rounded-[1.8rem] border border-(--border-strong) bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-raised)_96%,transparent),color-mix(in_srgb,var(--surface-inset)_100%,transparent))] shadow-[var(--fm-shadow-elevated)]">
        <div className="border-b border-(--border) bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent-soft)_42%,transparent),transparent)] px-4 py-3 sm:px-5">
          <p className="m-0 text-[0.7rem] uppercase tracking-[0.24em] text-(--foreground-soft)">
            Workflow
          </p>
          <p
            className="mt-1 text-sm text-(--foreground) sm:text-[0.96rem]"
            style={{ fontWeight: 600 }}
          >
            Compressed loop
          </p>
        </div>
        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <div className="grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
            {steps.map((step, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: steps are parsed from static author content and never reordered
              <div key={`${index}-${step}`} className="flex items-center gap-3">
                <div className="min-w-0 flex-1 rounded-[1.25rem] border border-(--accent-line) bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent-soft)_74%,transparent),color-mix(in_srgb,var(--surface-raised)_96%,transparent))] px-4 py-3 shadow-[0_8px_22px_color-mix(in_srgb,var(--fm-shadow-glow)_16%,transparent)]">
                  <p className="m-0 text-[0.68rem] uppercase tracking-[0.2em] text-(--foreground-soft)">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p
                    className="mt-1 text-sm leading-6 text-(--foreground) sm:text-[0.96rem]"
                    style={{ fontWeight: 600 }}
                  >
                    {step}
                  </p>
                </div>
                {index < steps.length - 1 ? (
                  <ArrowRight
                    aria-hidden="true"
                    className="hidden size-4 shrink-0 text-(--accent) md:block"
                  />
                ) : null}
              </div>
            ))}
          </div>
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
