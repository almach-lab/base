import { Resizable } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

function PanelBody({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center p-6 text-sm font-medium text-muted-foreground">
      {label}
    </div>
  );
}

export function ResizablePage() {
  return (
    <ComponentDoc
      name="Resizable"
      description="Draggable panel splits. Handles are focusable separators, so panels can also be resized with the arrow keys."
      examples={[
        {
          title: "Two panels",
          description: "Drag the divider, or focus it and use the arrow keys.",
          preview: (
            <Resizable className="h-48 w-full" defaultSizes={[35, 65]}>
              <Resizable.Panel minSize={20}>
                <PanelBody label="Sidebar" />
              </Resizable.Panel>
              <Resizable.Handle withGrip />
              <Resizable.Panel minSize={30}>
                <PanelBody label="Content" />
              </Resizable.Panel>
            </Resizable>
          ),
          code: `<Resizable className="h-48" defaultSizes={[35, 65]}>
  <Resizable.Panel minSize={20}>Sidebar</Resizable.Panel>
  <Resizable.Handle withGrip />
  <Resizable.Panel minSize={30}>Content</Resizable.Panel>
</Resizable>`,
          centered: false,
        },
        {
          title: "Three panels",
          description:
            "Each handle redistributes space between the two panels it sits between.",
          preview: (
            <Resizable className="h-48 w-full">
              <Resizable.Panel>
                <PanelBody label="One" />
              </Resizable.Panel>
              <Resizable.Handle />
              <Resizable.Panel>
                <PanelBody label="Two" />
              </Resizable.Panel>
              <Resizable.Handle />
              <Resizable.Panel>
                <PanelBody label="Three" />
              </Resizable.Panel>
            </Resizable>
          ),
          code: `<Resizable className="h-48">
  <Resizable.Panel>One</Resizable.Panel>
  <Resizable.Handle />
  <Resizable.Panel>Two</Resizable.Panel>
  <Resizable.Handle />
  <Resizable.Panel>Three</Resizable.Panel>
</Resizable>`,
          centered: false,
        },
        {
          title: "Vertical",
          preview: (
            <Resizable
              className="h-56 w-full"
              direction="vertical"
              defaultSizes={[60, 40]}
            >
              <Resizable.Panel minSize={20}>
                <PanelBody label="Editor" />
              </Resizable.Panel>
              <Resizable.Handle withGrip />
              <Resizable.Panel minSize={20}>
                <PanelBody label="Terminal" />
              </Resizable.Panel>
            </Resizable>
          ),
          code: `<Resizable direction="vertical" defaultSizes={[60, 40]}>
  <Resizable.Panel minSize={20}>Editor</Resizable.Panel>
  <Resizable.Handle withGrip />
  <Resizable.Panel minSize={20}>Terminal</Resizable.Panel>
</Resizable>`,
          centered: false,
        },
      ]}
      props={[
        {
          name: "direction",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: "Split axis.",
        },
        {
          name: "defaultSizes",
          type: "number[]",
          description:
            "Starting sizes as percentages, one per panel. Defaults to an even split.",
        },
        {
          name: "onSizesChange",
          type: "(sizes: number[]) => void",
          description: "Fired with the new percentages during a resize.",
        },
        {
          name: "Resizable.Panel minSize",
          type: "number",
          default: "10",
          description: "Minimum size as a percentage of the container.",
        },
        {
          name: "Resizable.Handle withGrip",
          type: "boolean",
          default: "false",
          description: "Show the grip affordance on the divider.",
        },
        {
          name: "Resizable.Handle keyboardStep",
          type: "number",
          default: "4",
          description: "Percent moved per arrow-key press.",
        },
      ]}
    />
  );
}
