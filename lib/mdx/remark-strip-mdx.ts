// Feed-only remark transform: unwrap MDX JSX elements to their children (so the
// prose inside <Callout>…</Callout> etc. survives) and drop MDX expressions and
// ESM import/export nodes. Interactive components can't render in a feed reader,
// so they degrade to their textual content.

import { type Node, type Parent } from "unist";

// Node types unwrapped to their children (the interactive component wrapper is
// discarded, its prose kept).
const UNWRAP_TYPES = new Set(["mdxJsxFlowElement", "mdxJsxTextElement"]);

// Node types dropped entirely (expressions and ESM import/export have no
// textual equivalent in a feed).
const DROP_TYPES = new Set([
  "mdxFlowExpression",
  "mdxTextExpression",
  "mdxjsEsm",
]);

function isParent(node: Node): node is Parent {
  return Array.isArray((node as Parent).children);
}

type FigureFence = Node & {
  lang?: string | null;
  meta?: string | null;
  value?: string;
};

// ```figure fences (see remark-text-fences.ts) keep their diagram as a plain
// text block, followed by the caption from the fence meta.
function figureToMarkdown(node: FigureFence): Node[] | null {
  if (node.type !== "code" || node.lang !== "figure") {
    return null;
  }
  const caption = /caption="([^"]*)"/.exec(node.meta ?? "")?.[1];
  const nodes: Node[] = [
    { type: "code", lang: "text", value: node.value ?? "" } as Node,
  ];
  if (caption) {
    nodes.push({
      type: "paragraph",
      children: [
        {
          type: "emphasis",
          children: [{ type: "text", value: `Figure: ${caption}` }],
        },
      ],
    } as Node);
  }
  return nodes;
}

type JsxElement = Parent & {
  attributes?: Array<{ type: string; name?: string; value?: unknown }>;
};

// A component's `title` prop (Callout, Checklist, Compare, ...) is prose the
// reader needs, so it survives as a bold line before the unwrapped children.
function titleParagraph(node: JsxElement): Node | null {
  if (node.type !== "mdxJsxFlowElement") {
    return null;
  }
  const title = node.attributes?.find(
    (attribute) =>
      attribute.type === "mdxJsxAttribute" && attribute.name === "title",
  )?.value;
  if (typeof title !== "string" || title.trim() === "") {
    return null;
  }
  return {
    type: "paragraph",
    children: [{ type: "strong", children: [{ type: "text", value: title }] }],
  } as Node;
}

function stripChildren(node: Node): void {
  if (!isParent(node)) {
    return;
  }
  const next: Node[] = [];
  for (const child of node.children) {
    const figure = figureToMarkdown(child as FigureFence);
    if (figure) {
      next.push(...figure);
      continue;
    }
    if (UNWRAP_TYPES.has(child.type)) {
      stripChildren(child);
      const title = titleParagraph(child as JsxElement);
      if (title) {
        next.push(title);
      }
      if (isParent(child)) {
        next.push(...child.children);
      }
      continue;
    }
    if (DROP_TYPES.has(child.type)) {
      continue;
    }
    stripChildren(child);
    next.push(child);
  }
  node.children = next;
}

export function remarkStripMdx() {
  return (tree: Node): void => stripChildren(tree);
}
