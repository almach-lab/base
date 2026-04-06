import { cn } from "@almach/utils";
import * as React from "react";
import {
  DialogTrigger as AriaDialogTrigger,
  OverlayArrow,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
  composeRenderProps,
} from "react-aria-components";

interface PopoverRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

interface PopoverTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

function PopoverTrigger(_props: PopoverTriggerProps) {
  return null;
}
PopoverTrigger.displayName = "Popover.Trigger";

type PopoverPlacement =
  | "top"
  | "top start"
  | "top end"
  | "right"
  | "right top"
  | "right bottom"
  | "bottom"
  | "bottom start"
  | "bottom end"
  | "left"
  | "left top"
  | "left bottom";

function toPlacement(
  side: "top" | "right" | "bottom" | "left" = "bottom",
  align: "start" | "center" | "end" = "center",
): PopoverPlacement {
  if (align === "center") return side;
  const cross =
    side === "top" || side === "bottom"
      ? align
      : align === "start"
        ? "top"
        : "bottom";
  return `${side} ${cross}` as PopoverPlacement;
}

interface PopoverContentProps
  extends Omit<AriaPopoverProps, "children" | "className" | "offset"> {
  showArrow?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
  children?: React.ReactNode;
}

function PopoverContent(_props: PopoverContentProps) {
  return null;
}
PopoverContent.displayName = "Popover.Content";

interface PopoverCloseProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

function PopoverClose(_props: PopoverCloseProps) {
  return null;
}
PopoverClose.displayName = "Popover.Close";

function getTriggerProps(node: React.ReactNode): PopoverTriggerProps | null {
  if (!React.isValidElement(node)) return null;
  if (node.type !== PopoverTrigger) return null;
  return node.props as PopoverTriggerProps;
}

function getContentProps(node: React.ReactNode): PopoverContentProps | null {
  if (!React.isValidElement(node)) return null;
  if (node.type !== PopoverContent) return null;
  return node.props as PopoverContentProps;
}

function PopoverRoot({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: PopoverRootProps) {
  let triggerProps: PopoverTriggerProps | null = null;
  let contentProps: PopoverContentProps | null = null;

  for (const child of React.Children.toArray(children)) {
    const parsedTrigger = getTriggerProps(child);
    if (parsedTrigger) {
      triggerProps = parsedTrigger;
      continue;
    }

    const parsedContent = getContentProps(child);
    if (parsedContent) {
      contentProps = parsedContent;
    }
  }

  if (!triggerProps || !contentProps) return null;

  const {
    showArrow,
    side,
    align,
    sideOffset,
    className,
    children: contentChildren,
    ...popoverProps
  } = contentProps;

  const placement = toPlacement(side, align);
  const offset = sideOffset ?? (showArrow ? 12 : 8);

  const triggerNode = triggerProps.asChild ? (
    (React.Children.only(triggerProps.children) as React.ReactElement)
  ) : (
    <button type="button">{triggerProps.children}</button>
  );

  return (
    <AriaDialogTrigger
      {...(open !== undefined ? { isOpen: open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      {triggerNode}
      <AriaPopover
        {...popoverProps}
        placement={placement}
        offset={offset}
        className={composeRenderProps(className, (nextClassName, renderProps) =>
          cn(
            "z-50 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-2xl outline-none",
            "backdrop-blur-xl",
            "data-[entering]:fade-in-0 data-[entering]:zoom-in-95",
            "data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
            "data-[entering]:placement-bottom:slide-in-from-top-1",
            "data-[entering]:placement-top:slide-in-from-bottom-1",
            "data-[entering]:placement-left:slide-in-from-right-1",
            "data-[entering]:placement-right:slide-in-from-left-1",
            "data-[exiting]:placement-bottom:slide-out-to-top-1",
            "data-[exiting]:placement-top:slide-out-to-bottom-1",
            "data-[exiting]:placement-left:slide-out-to-right-1",
            "data-[exiting]:placement-right:slide-out-to-left-1",
            "duration-200 ease-out data-[exiting]:duration-150 data-[exiting]:ease-in",
            renderProps.isEntering && "animate-in",
            renderProps.isExiting && "animate-out",
            nextClassName,
          ),
        )}
      >
        {showArrow ? (
          <OverlayArrow className="group">
            <svg
              width={12}
              height={12}
              viewBox="0 0 12 12"
              className="block fill-popover stroke-[hsl(var(--border))] stroke-1 group-placement-bottom:rotate-180 group-placement-left:-rotate-90 group-placement-right:rotate-90"
            >
              <path d="M0 0 L6 6 L12 0" />
            </svg>
          </OverlayArrow>
        ) : null}
        {contentChildren}
      </AriaPopover>
    </AriaDialogTrigger>
  );
}

interface PopoverComponent {
  (props: PopoverRootProps): React.ReactElement | null;
  Trigger: typeof PopoverTrigger;
  Content: typeof PopoverContent;
  Close: typeof PopoverClose;
  Anchor: React.FC<{ children?: React.ReactNode }>;
}

const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
  Anchor: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}) as PopoverComponent;

export { Popover };
