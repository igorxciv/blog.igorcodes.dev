// Feed-only remark transform: unwrap MDX JSX elements to their children (so the
// prose inside <Callout>…</Callout> etc. survives) and drop MDX expressions and
// ESM import/export nodes. Interactive components can't render in a feed reader,
// so they degrade to their textual content. AST nodes are loosely typed — see
// the biome override for lib/mdx/**.

function stripChildren(node: any): void {
  if (!Array.isArray(node.children)) {
    return;
  }
  const next: any[] = [];
  for (const child of node.children) {
    if (
      child.type === "mdxJsxFlowElement" ||
      child.type === "mdxJsxTextElement"
    ) {
      stripChildren(child);
      next.push(...(child.children ?? []));
      continue;
    }
    if (
      child.type === "mdxFlowExpression" ||
      child.type === "mdxTextExpression" ||
      child.type === "mdxjsEsm"
    ) {
      continue;
    }
    stripChildren(child);
    next.push(child);
  }
  node.children = next;
}

export function remarkStripMdx() {
  return (tree: any): void => stripChildren(tree);
}
