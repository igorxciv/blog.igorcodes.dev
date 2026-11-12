import { type Code, type Root } from "mdast";
import { type MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { describe, expect, it } from "vitest";
import { parseFenceMeta, remarkTextFences } from "@/lib/mdx/remark-text-fences";

function run(node: Code): MdxJsxFlowElement {
  const tree: Root = { type: "root", children: [node] };
  remarkTextFences()(tree);
  return tree.children[0] as unknown as MdxJsxFlowElement;
}

function attr(element: MdxJsxFlowElement, name: string) {
  const found = element.attributes.find(
    (item) => item.type === "mdxJsxAttribute" && item.name === name,
  );
  return found?.value;
}

describe("parseFenceMeta", () => {
  it("reads quoted key/value pairs", () => {
    expect(
      parseFenceMeta('caption="Risk map" description="Boxes, and lines"'),
    ).toEqual({ caption: "Risk map", description: "Boxes, and lines" });
    expect(parseFenceMeta(null)).toEqual({});
  });
});

describe("remarkTextFences", () => {
  it("turns figure fences into Figure elements", () => {
    const element = run({
      type: "code",
      lang: "figure",
      meta: 'caption="Risk map"',
      value: "+--+\n|  |\n+--+",
    });
    expect(element.name).toBe("Figure");
    expect(attr(element, "art")).toBe("+--+\n|  |\n+--+");
    expect(attr(element, "caption")).toBe("Risk map");
    // Falls back to the caption when no description is given.
    expect(attr(element, "description")).toBe("Risk map");
  });

  it("keeps text fences as prompt and workflow blocks", () => {
    expect(run({ type: "code", lang: "text", value: "a -> b" }).name).toBe(
      "WorkflowStepsBlock",
    );
    expect(
      run({ type: "code", lang: "text", value: "The code runs." }).name,
    ).toBe("PromptBlock");
  });
});
