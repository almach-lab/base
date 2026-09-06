import { Avatar, Button, HoverCard } from "@almach/ui";
import { CalendarDays } from "lucide-react";
import { ComponentDoc } from "../../component-doc";

export function HoverCardPage() {
  return (
    <ComponentDoc
      name="Hover Card"
      description="Rich preview shown on pointer hover and on keyboard focus. For supplementary detail only — never put the sole copy of important content in one."
      examples={[
        {
          title: "Default",
          description:
            "Opens after a short delay, and stays open while the pointer crosses to the card.",
          preview: (
            <HoverCard>
              <HoverCard.Trigger>
                <Button variant="link">@almach</Button>
              </HoverCard.Trigger>
              <HoverCard.Content>
                <div className="flex gap-3">
                  <Avatar>
                    <Avatar.Fallback>AL</Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">Almach</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Accessible, themeable React components built on React Aria
                      and Tailwind CSS v4.
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      Joined April 2026
                    </p>
                  </div>
                </div>
              </HoverCard.Content>
            </HoverCard>
          ),
          code: `<HoverCard>
  <HoverCard.Trigger>
    <Button variant="link">@almach</Button>
  </HoverCard.Trigger>
  <HoverCard.Content>
    <div className="flex gap-3">
      <Avatar><Avatar.Fallback>AL</Avatar.Fallback></Avatar>
      <p>Accessible, themeable React components.</p>
    </div>
  </HoverCard.Content>
</HoverCard>`,
        },
        {
          title: "Placement and timing",
          description: "Control the side, alignment and both delays.",
          preview: (
            <HoverCard openDelay={80} closeDelay={220}>
              <HoverCard.Trigger>
                <Button variant="outline" size="sm">
                  Hover me
                </Button>
              </HoverCard.Trigger>
              <HoverCard.Content side="right" align="start" className="w-56">
                <p className="text-sm">
                  Opens to the right, aligned to the top of the trigger.
                </p>
              </HoverCard.Content>
            </HoverCard>
          ),
          code: `<HoverCard openDelay={80} closeDelay={220}>
  <HoverCard.Trigger>
    <Button variant="outline" size="sm">Hover me</Button>
  </HoverCard.Trigger>
  <HoverCard.Content side="right" align="start" className="w-56">
    …
  </HoverCard.Content>
</HoverCard>`,
        },
      ]}
      props={[
        {
          name: "open / defaultOpen",
          type: "boolean",
          description: "Controlled and uncontrolled open state.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          description: "Fired when the card opens or closes.",
        },
        {
          name: "openDelay",
          type: "number",
          default: "300",
          description: "Milliseconds before opening.",
        },
        {
          name: "closeDelay",
          type: "number",
          default: "150",
          description:
            "Milliseconds before closing — long enough to reach the card.",
        },
        {
          name: "Content side",
          type: '"top" | "right" | "bottom" | "left"',
          default: '"bottom"',
          description: "Preferred side.",
        },
        {
          name: "Content align",
          type: '"start" | "center" | "end"',
          default: '"center"',
          description: "Cross-axis alignment.",
        },
        {
          name: "Content sideOffset",
          type: "number",
          default: "8",
          description: "Gap between trigger and card.",
        },
      ]}
    />
  );
}
