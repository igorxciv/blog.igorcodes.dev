// Converts ```text fenced code blocks into the blog's visual components before
// any syntax-highlighting rehype plugin runs. A `text` fence whose body contains
// "->" becomes a <WorkflowStepsBlock>, otherwise a <PromptBlock>. Real code
// fences (```ts, ```bash, ...) are left untouched for rehype-pretty-code.
//
// This preserves the original `pre`-component interception behaviour while
// keeping those fences out of the Shiki pipeline (which would tokenize them and
// break the prompt/workflow rendering). AST nodes are loosely typed on purpose —
// the mdast + mdast-util-mdx-jsx unions are noisy; see the biome override for
// lib/mdx/**.

// A plain-string mdxJsxAttribute is the same shape MDX's own parser produces for
// `<Foo content="..." />`; the compiler emits a correctly-escaped string literal,
// so arbitrary prompt text (quotes, newlines) is handled for us.
function toBlockElement(node: any): any {
  const content = String(node.value ?? "").trim();
  const name = content.includes("->") ? "WorkflowStepsBlock" : "PromptBlock";
  return {
    type: "mdxJsxFlowElement",
    name,
    attributes: [{ type: "mdxJsxAttribute", name: "content", value: content }],
    children: [],
  };
}

function transform(node: any): void {
  if (!node || !Array.isArray(node.children)) {
    return;
  }
  node.children.forEach((child: any, index: number) => {
    if (child?.type === "code" && child.lang === "text") {
      node.children[index] = toBlockElement(child);
      return;
    }
    transform(child);
  });
}

export function remarkTextFences() {
  return (tree: any): void => {
    transform(tree);
  };
}
