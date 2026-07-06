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

function stripChildren(node: Node): void {
  if (!isParent(node)) {
    return;
  }
  const next: Node[] = [];
  for (const child of node.children) {
    if (UNWRAP_TYPES.has(child.type)) {
      stripChildren(child);
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
