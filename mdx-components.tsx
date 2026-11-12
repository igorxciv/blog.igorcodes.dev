import { type MDXComponents } from "mdx/types";
import dynamic from "next/dynamic";
import {
  Children,
  type ComponentPropsWithoutRef,
  isValidElement,
  type ReactNode,
} from "react";
import {
  Figure,
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
import { createPostImageComponent } from "@/components/mdx/post-image";
import { slugifyHeading, stripHeadingNumber } from "@/lib/daybook";

const StateMachinePlayground = dynamic(() =>
  import("@/components/mdx/state-machine-playground").then(
    (m) => m.StateMachinePlayground,
  ),
);

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(textOf).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textOf(node.props.children);
  }
  return "";
}

/** Drops an authored "1. " prefix from the first text child; the entry numbers sections itself. */
function withoutAuthoredNumber(children: ReactNode): ReactNode {
  let stripped = false;
  return Children.map(children, (child) => {
    if (!stripped && typeof child === "string") {
      stripped = true;
      return stripHeadingNumber(child);
    }
    stripped = true;
    return child;
  });
}

function SectionHeading({
  as: Tag,
  children,
  ...props
}: ComponentPropsWithoutRef<"h2"> & { as: "h2" | "h3" }) {
  const title = stripHeadingNumber(textOf(children));
  const id = slugifyHeading(title);
  return (
    <Tag id={id} {...props}>
      {/* The number is drawn by a CSS counter, so it stays in step with the contents list. The contents list carries the links. */}
      <span className="sec-no" aria-hidden="true" />
      {withoutAuthoredNumber(children)}
    </Tag>
  );
}

export const mdxComponents: MDXComponents = {
  // The page renders the entry title as the sole <h1>, so a content-level
  // `# heading` becomes a numbered <h2>.
  h1: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <SectionHeading as="h2" {...props}>
      {children}
    </SectionHeading>
  ),
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <SectionHeading as="h2" {...props}>
      {children}
    </SectionHeading>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <SectionHeading as="h3" {...props}>
      {children}
    </SectionHeading>
  ),
  // Real code fences arrive highlighted by rehype-pretty-code; `text` fences
  // were converted to PromptBlock / WorkflowStepsBlock upstream.
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    // biome-ignore lint/a11y/useSemanticElements: a <pre> scroll container cannot be a <section>; role="region" names it for AT
    <pre
      role="region"
      aria-label="Code sample"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: horizontally-scrollable region must be keyboard-focusable (WCAG 2.1.1)
      tabIndex={0}
      {...props}
    />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="entry-table">
      {/* biome-ignore lint/a11y/useSemanticElements: overflow scroll wrapper; role="region" keeps the nested table's own semantics intact */}
      <div
        role="region"
        aria-label="Table"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: horizontally-scrollable region must be keyboard-focusable (WCAG 2.1.1)
        tabIndex={0}
        className="entry-table-scroll"
      >
        <table {...props} />
      </div>
    </div>
  ),
  th: ({ scope, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th scope={scope ?? "col"} {...props} />
  ),
  img: ({ alt, src, title }: ComponentPropsWithoutRef<"img">) => {
    if (typeof src !== "string") {
      return null;
    }

    if (src.startsWith("http://") || src.startsWith("https://")) {
      throw new Error(
        `Remote image src not allowed: "${src}". Use local images under public/images/posts/…`,
      );
    }

    if (alt == null) {
      throw new Error(
        `Markdown image without alt text: "${src}". Add descriptive alt text, or if the image is purely decorative, mark it as such with an explicit empty alt (e.g. an <img alt="" /> element).`,
      );
    }

    const caption =
      typeof title === "string" && title.trim().length > 0 ? title : null;

    return (
      <figure className="entry-image">
        {/* biome-ignore lint/performance/noImgElement: markdown images have
            unknown intrinsic dimensions; a plain <img> avoids next/image's
            required width/height. */}
        <img src={src} alt={alt} loading="lazy" decoding="async" />
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    );
  },
  Callout,
  Figure,
  ImagePlaceholder,
  InlineKicker,
  ProcessFlow,
  PromptBlock,
  VisualCard,
  VisualGrid,
  TableBlock,
  WorkflowStepsBlock,
  StateMachinePlayground,
};

export function createPostMdxComponents(postSlug: string): MDXComponents {
  return {
    ...mdxComponents,
    PostImage: createPostImageComponent(postSlug),
  };
}
