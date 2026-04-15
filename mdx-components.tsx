import type { ComponentPropsWithoutRef, ReactNode, ReactElement } from "react";
import { isValidElement } from "react";
import type { MDXComponents } from "mdx/types";
import { clsx } from "clsx";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import {
  ImagePlaceholder,
  InlineKicker,
  ProcessFlow,
  PromptBlock,
  TableBlock,
  VisualCard,
  VisualGrid,
  WorkflowStepsBlock,
} from "@/components/mdx/mdx-article-visuals";
import { Callout } from "@/components/mdx/mdx-callout";

function getTextFenceContent(children: ReactNode) {
  if (!isValidElement(children)) {
    return null;
  }

  const codeElement = children as ReactElement<{ className?: string; children?: ReactNode }>;
  const language = codeElement.props.className ?? "";

  if (!language.includes("language-text") || typeof codeElement.props.children !== "string") {
    return null;
  }

  return codeElement.props.children;
}

export const mdxComponents: MDXComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => <h1 className="mt-8 text-3xl text-(--foreground) sm:text-4xl md:text-5xl lg:text-[3.9rem]" style={{ fontWeight: 600 }} {...props} />,
  h2: (props: ComponentPropsWithoutRef<"h2">) => <h2 className="mb-5 mt-10 text-[1.65rem] leading-tight text-(--foreground) sm:text-3xl lg:mb-6 lg:mt-14 lg:text-[2.35rem]" style={{ fontWeight: 600 }} {...props} />,
  h3: (props: ComponentPropsWithoutRef<"h3">) => <h3 className="mb-4 mt-8 text-xl text-(--foreground) sm:text-2xl lg:mb-5 lg:mt-12 lg:text-[1.7rem]" style={{ fontWeight: 600 }} {...props} />,
  p: (props: ComponentPropsWithoutRef<"p">) => <p className="mb-6 text-[0.98rem] leading-8 text-(--foreground-soft) sm:text-base lg:mb-7 lg:text-[1.12rem] lg:leading-9" {...props} />,
  ul: (props: ComponentPropsWithoutRef<"ul">) => <ul className="mb-6 list-disc space-y-2 pl-5 text-[0.98rem] text-(--foreground-soft) sm:pl-6 sm:text-base lg:mb-7 lg:space-y-3 lg:pl-7 lg:text-[1.12rem]" {...props} />,
  ol: (props: ComponentPropsWithoutRef<"ol">) => <ol className="mb-6 list-decimal space-y-2 pl-5 text-[0.98rem] text-(--foreground-soft) sm:pl-6 sm:text-base lg:mb-7 lg:space-y-3 lg:pl-7 lg:text-[1.12rem]" {...props} />,
  li: (props: ComponentPropsWithoutRef<"li">) => <li className="pl-1" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="mb-6 border-l-2 border-(--accent) pl-4 italic text-[0.98rem] text-(--foreground-soft) sm:text-base lg:mb-7 lg:pl-5 lg:text-[1.12rem] lg:leading-9" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code className="rounded border border-(--border) bg-(--surface) px-1.5 py-0.5 font-mono text-[0.9em] text-(--accent)" {...props} />
  ),
  pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => {
    const promptContent = getTextFenceContent(children);

    if (promptContent) {
      const normalizedContent = promptContent.trim();

      if (normalizedContent.includes("->")) {
        return <WorkflowStepsBlock content={normalizedContent} />;
      }

      return <PromptBlock content={normalizedContent} />;
    }

    return (
      <pre
        className="mb-6 overflow-x-auto rounded-lg border border-(--border) bg-(--surface) p-3 text-sm text-[#a8a8a8] sm:p-4 lg:mb-7 lg:rounded-xl lg:p-5 lg:text-[0.98rem]"
        {...props}
      >
        {children}
      </pre>
    );
  },
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-8 overflow-x-auto lg:my-10">
      <div className="overflow-hidden rounded-[1.8rem] border border-(--border-strong) bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-raised)_96%,transparent),color-mix(in_srgb,var(--surface)_100%,transparent))] shadow-[0_10px_24px_rgb(0_0_0_/_0.18)]">
        <table className="w-full border-collapse text-left text-(--foreground-soft) lg:text-[1.02rem]" {...props} />
      </div>
    </div>
  ),
  th: ({ scope, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th
      scope={scope ?? "col"}
      className="border-b border-(--border-strong) px-5 py-4 align-top text-[0.76rem] uppercase tracking-[0.2em] text-(--foreground-soft) lg:px-6 lg:py-4"
      style={{ fontWeight: 600 }}
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => <td className="border-t border-(--border) px-5 py-4 align-top text-[0.98rem] leading-8 lg:px-6 lg:py-5 lg:text-[1.08rem] lg:leading-9" {...props} />,
  img: ({ className, alt, src, title }: ComponentPropsWithoutRef<"img">) => {
    if (typeof src !== "string") {
      return null;
    }

    const imageAlt = alt ?? "";
    const caption = typeof title === "string" && title.trim().length > 0 ? title : null;

    return (
      <figure className="my-8 lg:my-10">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-(--border) bg-(--surface) lg:rounded-[1.75rem]">
          <Image
            src={src}
            alt={imageAlt}
            title={caption ?? undefined}
            fill
            sizes="(min-width: 1024px) 768px, 100vw"
            className={twMerge(clsx("object-cover", className))}
          />
        </div>
        {caption ? <figcaption className="mt-3 text-sm leading-relaxed text-(--foreground-soft) lg:mt-4 lg:text-[0.98rem]">{caption}</figcaption> : null}
      </figure>
    );
  },
  a: ({ href, className, style, ...props }: ComponentPropsWithoutRef<"a">) => {
    return (
      <a
        href={href}
        {...props}
        className={twMerge(
          clsx(
            "focus-ring rounded-[2px] font-semibold text-(--accent) underline decoration-2 underline-offset-4 transition hover:text-(--accent-strong)",
            className,
          ),
        )}
        style={{
          color: "var(--accent)",
          textDecorationLine: "underline",
          textDecorationColor: "var(--accent)",
          textDecorationThickness: "2px",
          textUnderlineOffset: "0.18em",
          ...style,
        }}
      />
    );
  },
  Callout,
  ImagePlaceholder,
  InlineKicker,
  ProcessFlow,
  VisualCard,
  VisualGrid,
  TableBlock,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
