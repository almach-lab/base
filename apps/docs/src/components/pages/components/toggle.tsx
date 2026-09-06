import { Toggle, ToggleGroup } from "@almach/ui";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import { ComponentDoc } from "../../component-doc";
import { DemoRow } from "../../docs/demo";

export function TogglePage() {
  return (
    <ComponentDoc
      name="Toggle"
      description="Two-state button, plus ToggleGroup for single- or multi-select sets. Built on React Aria ToggleButton."
      examples={[
        {
          title: "Variants",
          description: "Selection is shown with a filled or tinted state.",
          preview: (
            <DemoRow>
              <Toggle defaultSelected aria-label="Bold">
                <Bold />
              </Toggle>
              <Toggle variant="outline" defaultSelected>
                Outline
              </Toggle>
              <Toggle variant="solid" defaultSelected>
                Solid
              </Toggle>
            </DemoRow>
          ),
          code: `<Toggle defaultSelected aria-label="Bold"><Bold /></Toggle>
<Toggle variant="outline" defaultSelected>Outline</Toggle>
<Toggle variant="solid" defaultSelected>Solid</Toggle>`,
        },
        {
          title: "Segmented group",
          description:
            "Single selection inside a shared shell — the usual choice for view switchers.",
          preview: (
            <ToggleGroup
              variant="segmented"
              selectionMode="single"
              defaultSelectedKeys={["center"]}
              disallowEmptySelection
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
          ),
          code: `<ToggleGroup
  variant="segmented"
  selectionMode="single"
  defaultSelectedKeys={["center"]}
  disallowEmptySelection
>
  <ToggleGroup.Item id="left" size="icon-sm" aria-label="Align left">
    <AlignLeft />
  </ToggleGroup.Item>
</ToggleGroup>`,
        },
        {
          title: "Multiple selection",
          description: "Text-formatting toolbars allow several at once.",
          preview: (
            <ToggleGroup
              variant="outline"
              selectionMode="multiple"
              defaultSelectedKeys={["bold"]}
            >
              <ToggleGroup.Item id="bold" size="icon" aria-label="Bold">
                <Bold />
              </ToggleGroup.Item>
              <ToggleGroup.Item id="italic" size="icon" aria-label="Italic">
                <Italic />
              </ToggleGroup.Item>
              <ToggleGroup.Item
                id="underline"
                size="icon"
                aria-label="Underline"
              >
                <Underline />
              </ToggleGroup.Item>
            </ToggleGroup>
          ),
          code: `<ToggleGroup
  variant="outline"
  selectionMode="multiple"
  defaultSelectedKeys={["bold"]}
>
  <ToggleGroup.Item id="bold" size="icon" aria-label="Bold">
    <Bold />
  </ToggleGroup.Item>
</ToggleGroup>`,
        },
      ]}
      props={[
        {
          name: "variant",
          type: '"default" | "outline" | "solid"',
          default: '"default"',
          description:
            "Toggle chrome. Inside a group it defaults to match the group variant.",
        },
        {
          name: "size",
          type: '"sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg"',
          default: '"default"',
          description: "Control dimensions.",
        },
        {
          name: "isSelected / defaultSelected",
          type: "boolean",
          description: "Controlled and uncontrolled selection.",
        },
        {
          name: "onChange",
          type: "(isSelected: boolean) => void",
          description: "Fired when the toggle flips.",
        },
        {
          name: "ToggleGroup variant",
          type: '"default" | "outline" | "segmented"',
          default: '"default"',
          description: "Group layout. Segmented renders one shared shell.",
        },
        {
          name: "ToggleGroup selectionMode",
          type: '"single" | "multiple"',
          default: '"single"',
          description: "How many items can be selected.",
        },
      ]}
    />
  );
}
