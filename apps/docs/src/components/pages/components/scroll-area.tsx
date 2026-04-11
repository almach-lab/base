import { ScrollArea } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function ScrollAreaPage() {
  return (
    <ComponentDoc
      name="ScrollArea"
      description="A custom scrollable container that replaces the browser's native scrollbar with a thin, themed one that appears on hover. Composed of Root, Viewport, Scrollbar, Thumb, and Corner sub-components."
      examples={[
        {
          title: "Vertical scroll",
          description: "Fixed-height container with overflow content.",
          preview: <VerticalDemo />,
          code: `import { ScrollArea } from "@almach/ui";

<ScrollArea className="group h-48 w-64 rounded-md">
  <ScrollArea.Viewport>
    <ScrollArea.Content className="p-3">
      {Array.from({ length: 20 }, (_, i) => (
        <p key={i} className="py-1 text-sm text-muted-foreground">
          Item {i + 1}
        </p>
      ))}
    </ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</ScrollArea>`,
        },
        {
          title: "Horizontal scroll",
          description: "Wide content that scrolls horizontally.",
          preview: <HorizontalDemo />,
          code: `import { ScrollArea } from "@almach/ui";

<ScrollArea className="group w-64 rounded-md">
  <ScrollArea.Viewport>
    <ScrollArea.Content className="flex gap-3 p-3" style={{ width: "max-content" }}>
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="flex h-20 w-20 flex-shrink-0 items-center justify-center
                     rounded-md bg-muted text-sm font-medium text-muted-foreground"
        >
          {i + 1}
        </div>
      ))}
    </ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="horizontal">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</ScrollArea>`,
        },
        {
          title: "Both axes",
          description: "Scrollbars on both vertical and horizontal axes.",
          preview: <BothAxesDemo />,
          code: `import { ScrollArea } from "@almach/ui";

<ScrollArea className="group h-48 w-64 rounded-md">
  <ScrollArea.Viewport>
    <ScrollArea.Content
      className="p-3"
      style={{ width: "480px" }}
    >
      {Array.from({ length: 20 }, (_, i) => (
        <p key={i} className="py-1 text-sm text-muted-foreground whitespace-nowrap">
          Row {i + 1} — with extra content that forces horizontal overflow
        </p>
      ))}
    </ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
  <ScrollArea.Scrollbar orientation="horizontal">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea>`,
        },
      ]}
      props={[
        {
          name: "ScrollArea (root)",
          type: "div props",
          description:
            'Outer wrapper with overflow:hidden. Add className="group" to enable hover-show on the scrollbar.',
        },
        {
          name: "ScrollArea.Viewport",
          type: "div props",
          description:
            "The overflow:auto inner container. Scrolls the content.",
        },
        {
          name: "ScrollArea.Content",
          type: "div props",
          description: "Wraps the actual scrollable content.",
        },
        {
          name: "ScrollArea.Scrollbar",
          type: "div props",
          default: "vertical",
          description:
            'Track element. Set orientation="vertical" or "horizontal".',
        },
        {
          name: "ScrollArea.Thumb",
          type: "div props",
          description: "Draggable thumb inside the scrollbar track.",
        },
        {
          name: "ScrollArea.Corner",
          type: "div props",
          description:
            "Fills the corner gap when both scrollbars are visible.",
        },
      ]}
    />
  );
}

function VerticalDemo() {
  return (
    <ScrollArea className="group h-48 w-64 rounded-md">
      <ScrollArea.Viewport>
        <ScrollArea.Content className="p-3">
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} className="py-1 text-sm text-muted-foreground">
              Item {i + 1}
            </p>
          ))}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea>
  );
}

function HorizontalDemo() {
  return (
    <ScrollArea className="group w-64 rounded-md">
      <ScrollArea.Viewport>
        <ScrollArea.Content
          className="flex gap-3 p-3"
          style={{ width: "max-content" }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground"
            >
              {i + 1}
            </div>
          ))}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea>
  );
}

function BothAxesDemo() {
  return (
    <ScrollArea className="group h-48 w-64 rounded-md">
      <ScrollArea.Viewport>
        <ScrollArea.Content className="p-3" style={{ width: "480px" }}>
          {Array.from({ length: 20 }, (_, i) => (
            <p
              key={i}
              className="whitespace-nowrap py-1 text-sm text-muted-foreground"
            >
              Row {i + 1} — with extra content that forces horizontal overflow
            </p>
          ))}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea>
  );
}
