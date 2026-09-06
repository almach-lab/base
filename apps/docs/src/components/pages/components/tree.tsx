import { Tree } from "@almach/ui";
import { File, Folder } from "lucide-react";
import { ComponentDoc } from "../../component-doc";

export function TreePage() {
  return (
    <ComponentDoc
      name="Tree"
      description="Expandable hierarchy built on React Aria Tree. Full keyboard support: arrows move and expand, typing jumps to a row."
      examples={[
        {
          title: "File tree",
          description: "Nested rows indent automatically by depth.",
          preview: (
            <Tree
              aria-label="Project files"
              className="max-w-sm"
              defaultExpandedKeys={["src", "components"]}
              selectionMode="single"
            >
              <Tree.Item id="src" textValue="src">
                <Tree.ItemContent>
                  <Folder className="size-4 shrink-0 text-muted-foreground" />
                  <span>src</span>
                </Tree.ItemContent>

                <Tree.Item id="components" textValue="components">
                  <Tree.ItemContent>
                    <Folder className="size-4 shrink-0 text-muted-foreground" />
                    <span>components</span>
                  </Tree.ItemContent>

                  <Tree.Item id="button" textValue="button.tsx">
                    <Tree.ItemContent>
                      <File className="size-4 shrink-0 text-muted-foreground" />
                      <span>button.tsx</span>
                    </Tree.ItemContent>
                  </Tree.Item>

                  <Tree.Item id="tree" textValue="tree.tsx">
                    <Tree.ItemContent>
                      <File className="size-4 shrink-0 text-muted-foreground" />
                      <span>tree.tsx</span>
                    </Tree.ItemContent>
                  </Tree.Item>
                </Tree.Item>

                <Tree.Item id="index" textValue="index.ts">
                  <Tree.ItemContent>
                    <File className="size-4 shrink-0 text-muted-foreground" />
                    <span>index.ts</span>
                  </Tree.ItemContent>
                </Tree.Item>
              </Tree.Item>

              <Tree.Item id="readme" textValue="README.md">
                <Tree.ItemContent>
                  <File className="size-4 shrink-0 text-muted-foreground" />
                  <span>README.md</span>
                </Tree.ItemContent>
              </Tree.Item>
            </Tree>
          ),
          code: `<Tree
  aria-label="Project files"
  defaultExpandedKeys={["src", "components"]}
  selectionMode="single"
>
  <Tree.Item id="src" textValue="src">
    <Tree.ItemContent>
      <Folder className="size-4" />
      <span>src</span>
    </Tree.ItemContent>

    <Tree.Item id="index" textValue="index.ts">
      <Tree.ItemContent>
        <File className="size-4" />
        <span>index.ts</span>
      </Tree.ItemContent>
    </Tree.Item>
  </Tree.Item>
</Tree>`,
        },
      ]}
      props={[
        {
          name: "aria-label",
          type: "string",
          required: true,
          description: "Names the tree for assistive technology.",
        },
        {
          name: "selectionMode",
          type: '"none" | "single" | "multiple"',
          default: '"none"',
          description: "Row selection behaviour.",
        },
        {
          name: "expandedKeys / defaultExpandedKeys",
          type: "Iterable<Key>",
          description: "Controlled and uncontrolled expansion.",
        },
        {
          name: "onExpandedChange",
          type: "(keys: Set<Key>) => void",
          description: "Fired when rows expand or collapse.",
        },
        {
          name: "Tree.Item id",
          type: "Key",
          required: true,
          description: "Stable row identity, used for expansion and selection.",
        },
        {
          name: "Tree.Item textValue",
          type: "string",
          description: "Text used for type-ahead and announcements.",
        },
        {
          name: "Tree.ItemContent",
          type: "React.ReactNode",
          description:
            "Row chrome. Renders the expand chevron and indents by depth.",
        },
      ]}
    />
  );
}
