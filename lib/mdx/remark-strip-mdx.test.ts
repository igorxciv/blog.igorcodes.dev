import { type Root } from "mdast";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { describe, expect, it } from "vitest";
import { remarkStripMdx } from "@/lib/mdx/remark-strip-mdx";

function strip(source: string): Root {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);
  remarkStripMdx()(tree);
  return tree;
}

describe("remarkStripMdx", () => {
  it("keeps a component title as a bold line before its children", () => {
    const tree = strip(
      '<Checklist title="Before you ship">\n\n- Write tests.\n\n</Checklist>',
    );
    expect(tree.children.map((node) => node.type)).toEqual([
      "paragraph",
      "list",
    ]);
    expect(tree.children[0]).toMatchObject({
      type: "paragraph",
      children: [
        {
          type: "strong",
          children: [{ type: "text", value: "Before you ship" }],
        },
      ],
    });
  });

  it("unwraps components without a title to their children", () => {
    const tree = strip("<KeyPoints>\n\n- One claim.\n\n</KeyPoints>");
    expect(tree.children.map((node) => node.type)).toEqual(["list"]);
  });

  it("drops expressions", () => {
    expect(strip("{1 + 1}").children).toHaveLength(0);
  });
});
