import { Button, ToggleGroup, Toolbar } from "@almach/ui";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";
import { ComponentDoc } from "../../component-doc";

export function ToolbarPage() {
  return (
    <ComponentDoc
      name="Toolbar"
      description="Container for grouped controls with arrow-key navigation, built on React Aria Toolbar. Compose it with Toggle, ToggleGroup and Button."
      examples={[
        {
          title: "Default",
          description:
            "Groups and separators. Arrow keys move between controls, Tab enters and leaves the toolbar.",
          preview: (
            <Toolbar variant="bordered" aria-label="Text formatting">
              <ToggleGroup selectionMode="multiple" aria-label="Style">
                <ToggleGroup.Item id="bold" size="icon-sm" aria-label="Bold">
                  <Bold />
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  id="italic"
                  size="icon-sm"
                  aria-label="Italic"
                >
                  <Italic />
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  id="underline"
                  size="icon-sm"
                  aria-label="Underline"
                >
                  <Underline />
                </ToggleGroup.Item>
              </ToggleGroup>

              <Toolbar.Separator />

              <ToggleGroup
                selectionMode="single"
                defaultSelectedKeys={["left"]}
                disallowEmptySelection
                aria-label="Alignment"
              >
                <ToggleGroup.Item
                  id="left"
                  size="icon-sm"
                  aria-label="Align left"
                >
                  <AlignLeft />
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  id="center"
                  size="icon-sm"
                  aria-label="Align center"
                >
                  <AlignCenter />
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  id="right"
                  size="icon-sm"
                  aria-label="Align right"
                >
                  <AlignRight />
                </ToggleGroup.Item>
              </ToggleGroup>
            </Toolbar>
          ),
          code: `<Toolbar variant="bordered" aria-label="Text formatting">
  <ToggleGroup selectionMode="multiple" aria-label="Style">
    <ToggleGroup.Item id="bold" size="icon-sm" aria-label="Bold"><Bold /></ToggleGroup.Item>
  </ToggleGroup>
  <Toolbar.Separator />
  <ToggleGroup selectionMode="single" defaultSelectedKeys={["left"]} aria-label="Alignment">
    <ToggleGroup.Item id="left" size="icon-sm" aria-label="Align left"><AlignLeft /></ToggleGroup.Item>
  </ToggleGroup>
</Toolbar>`,
        },
        {
          title: "Floating",
          description: "A pill toolbar, for hovering over content.",
          preview: (
            <Toolbar variant="floating" aria-label="History">
              <Toolbar.Group aria-label="History actions">
                <Button variant="ghost" size="icon-sm" aria-label="Undo">
                  <Undo2 />
                </Button>
                <Button variant="ghost" size="icon-sm" aria-label="Redo">
                  <Redo2 />
                </Button>
              </Toolbar.Group>
            </Toolbar>
          ),
          code: `<Toolbar variant="floating" aria-label="History">
  <Toolbar.Group aria-label="History actions">
    <Button variant="ghost" size="icon-sm" aria-label="Undo"><Undo2 /></Button>
    <Button variant="ghost" size="icon-sm" aria-label="Redo"><Redo2 /></Button>
  </Toolbar.Group>
</Toolbar>`,
        },
        {
          title: "Vertical",
          preview: (
            <Toolbar
              variant="bordered"
              orientation="vertical"
              aria-label="Vertical tools"
            >
              <ToggleGroup
                orientation="vertical"
                selectionMode="multiple"
                aria-label="Style"
              >
                <ToggleGroup.Item id="bold" size="icon-sm" aria-label="Bold">
                  <Bold />
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  id="italic"
                  size="icon-sm"
                  aria-label="Italic"
                >
                  <Italic />
                </ToggleGroup.Item>
              </ToggleGroup>
            </Toolbar>
          ),
          code: `<Toolbar orientation="vertical" variant="bordered">…</Toolbar>`,
        },
      ]}
      props={[
        {
          name: "variant",
          type: '"plain" | "bordered" | "floating"',
          default: '"plain"',
          description: "Container chrome.",
        },
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description:
            "Layout direction, and which arrow keys move between controls.",
        },
        {
          name: "Toolbar.Group",
          type: "React.ReactNode",
          description: 'Groups related controls under one role="group".',
        },
        {
          name: "Toolbar.Separator",
          type: "orientation",
          default: '"vertical"',
          description: "Visual divider between groups.",
        },
      ]}
    />
  );
}
