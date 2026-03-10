import type { ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import { Callout } from "@/components/mdx/mdx-callout";
import { cn } from "@/lib/styles/cn";

export const mdxComponents: MDXComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => <h1 className="mt-8 text-4xl font-semibold tracking-tight" {...props} />,
  h2: (props: ComponentPropsWithoutRef<"h2">) => <h2 className="mt-10 text-3xl font-semibold tracking-tight" {...props} />,
  h3: (props: ComponentPropsWithoutRef<"h3">) => <h3 className="mt-8 text-2xl font-semibold tracking-tight" {...props} />,
  p: (props: ComponentPropsWithoutRef<"p">) => <p className="my-4 leading-8 text-[var(--foreground)]" {...props} />,
  ul: (props: ComponentPropsWithoutRef<"ul">) => <ul className="my-4 list-disc space-y-2 pl-6" {...props} />,
  ol: (props: ComponentPropsWithoutRef<"ol">) => <ol className="my-4 list-decimal space-y-2 pl-6" {...props} />,
  li: (props: ComponentPropsWithoutRef<"li">) => <li className="pl-1" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="my-6 border-l-4 border-[var(--border)] pl-4 italic text-[var(--muted)]" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[0.09]" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre className="my-6 overflow-x-auto rounded-xl border border-[var(--border)] bg-black/[0.03] p-4 dark:bg-white/[0.03]" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => <th className="border border-[var(--border)] px-3 py-2 font-semibold" {...props} />,
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
    const isExternal = typeof href === "string" && /^https?:\/\//.test(href);

    return (
      <a
        href={href}
        className="underline decoration-[var(--accent)] underline-offset-2 hover:opacity-80"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
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
