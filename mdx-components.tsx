import type { ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import { Callout } from "@/components/mdx/mdx-callout";
import { cn } from "@/lib/styles/cn";

export const mdxComponents: MDXComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => <h1 className="mt-8 text-4xl text-[var(--foreground)] md:text-5xl" style={{ fontWeight: 600 }} {...props} />,
  h2: (props: ComponentPropsWithoutRef<"h2">) => <h2 className="mb-5 mt-10 text-2xl text-[var(--foreground)]" style={{ fontWeight: 600 }} {...props} />,
  h3: (props: ComponentPropsWithoutRef<"h3">) => <h3 className="mb-4 mt-8 text-xl text-[var(--foreground)]" style={{ fontWeight: 600 }} {...props} />,
  p: (props: ComponentPropsWithoutRef<"p">) => <p className="mb-6 leading-relaxed text-[var(--foreground-soft)]" {...props} />,
  ul: (props: ComponentPropsWithoutRef<"ul">) => <ul className="mb-6 list-disc space-y-2 pl-6 text-[var(--foreground-soft)]" {...props} />,
  ol: (props: ComponentPropsWithoutRef<"ol">) => <ol className="mb-6 list-decimal space-y-2 pl-6 text-[var(--foreground-soft)]" {...props} />,
  li: (props: ComponentPropsWithoutRef<"li">) => <li className="pl-1" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="mb-6 border-l-2 border-[var(--accent)] pl-4 italic text-[var(--foreground-soft)]" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--accent)]" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre className="mb-6 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[#a8a8a8]" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-[var(--foreground-soft)]" {...props} />
    </div>
  ),
  th: ({ scope, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th scope={scope ?? "col"} className="border border-[var(--border)] px-3 py-2 font-semibold text-[var(--foreground)]" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => <td className="border border-[var(--border)] px-3 py-2" {...props} />,
  img: ({ className, alt, src, width, height }: ComponentPropsWithoutRef<"img">) => {
    if (typeof src !== "string") {
      return null;
    }

    const resolvedWidth = typeof width === "number" ? width : Number(width);
    const resolvedHeight = typeof height === "number" ? height : Number(height);

    return (
      <Image
        src={src}
        alt={alt ?? ""}
        width={Number.isFinite(resolvedWidth) && resolvedWidth > 0 ? resolvedWidth : 1200}
        height={Number.isFinite(resolvedHeight) && resolvedHeight > 0 ? resolvedHeight : 675}
        sizes="100vw"
        className={cn("my-6 h-auto w-full rounded-lg border border-[var(--border)]", className)}
      />
    );
  },
  a: ({ href, ...props }: ComponentPropsWithoutRef<"a">) => {
    return (
      <a
        href={href}
        className="focus-ring rounded-[2px] text-[var(--accent)] underline decoration-[rgb(0_217_255_/_0.55)] underline-offset-3 transition hover:text-[var(--accent-strong)] hover:decoration-[var(--accent-strong)]"
        {...props}
      />
    );
  },
  Callout,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
