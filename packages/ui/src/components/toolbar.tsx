import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import {
  Separator as AriaSeparator,
  Toolbar as AriaToolbar,
} from "react-aria-components";

const toolbarVariants = cva("flex items-center gap-1", {
  variants: {
    variant: {
      plain: "",
      bordered: "rounded-lg border border-border bg-card p-1 shadow-xs",
      floating:
        "rounded-full border border-border bg-popover/95 p-1 shadow-md backdrop-blur-sm",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "w-fit flex-col items-stretch",
    },
  },
  defaultVariants: { variant: "plain", orientation: "horizontal" },
});

export interface ToolbarProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof AriaToolbar>,
      "className" | "orientation"
    >,
    Omit<VariantProps<typeof toolbarVariants>, "orientation"> {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const ToolbarRoot = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, variant, orientation = "horizontal", ...props }, ref) => (
    <AriaToolbar
      ref={ref}
      orientation={orientation}
      className={cn(toolbarVariants({ variant, orientation }), className)}
      {...props}
    />
  ),
);
ToolbarRoot.displayName = "Toolbar";

/** Groups related controls so arrow-key navigation reads as one unit. */
const ToolbarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
));
ToolbarGroup.displayName = "Toolbar.Group";

const ToolbarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof AriaSeparator>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <AriaSeparator
    ref={ref as never}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "vertical" ? "mx-1 h-5 w-px" : "my-1 h-px w-full",
      className,
    )}
    {...props}
  />
));
ToolbarSeparator.displayName = "Toolbar.Separator";

const Toolbar = Object.assign(ToolbarRoot, {
  Group: ToolbarGroup,
  Separator: ToolbarSeparator,
});

export { Toolbar, toolbarVariants };
