// Converts ```text fenced code blocks into the blog's visual components before
// any syntax-highlighting rehype plugin runs. A `text` fence whose body contains
// "->" becomes a <WorkflowStepsBlock>, otherwise a <PromptBlock>. Real code
// fences (```ts, ```bash, ...) are left untouched for rehype-pretty-code.
//
// This preserves the original `pre`-component interception behaviour while
// keeping those fences out of the Shiki pipeline (which would tokenize them and
// break the prompt/workflow rendering).

import { type Code } from "mdast";
import { type MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { type Node, type Parent } from "unist";

// A plain-string mdxJsxAttribute is the same shape MDX's own parser produces for
// `<Foo content="..." />`; the compiler emits a correctly-escaped string literal,
// so arbitrary prompt text (quotes, newlines) is handled for us.
function toBlockElement(node: Code): MdxJsxFlowElement {
  const content = String(node.value ?? "").trim();
  const name = content.includes("->") ? "WorkflowStepsBlock" : "PromptBlock";
  return {
    type: "mdxJsxFlowElement",
    name,
    attributes: [{ type: "mdxJsxAttribute", name: "content", value: content }],
    children: [],
  };
}

function isParent(node: Node): node is Parent {
  return Array.isArray((node as Parent).children);
}

function transform(node: Node): void {
  if (!isParent(node)) {
    return;
  }
  node.children.forEach((child, index) => {
    if (child.type === "code" && (child as Code).lang === "text") {
      node.children[index] = toBlockElement(child as Code);
      return;
    }
    transform(child);
  });
}

export function remarkTextFences() {
  return (tree: Node): void => {
    transform(tree);
  };
}
