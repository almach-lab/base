"use client";

import { cn } from "@almach/utils";
import * as React from "react";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { FOCUS_RING } from "./_styles.js";

const ScrollAreaRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("group relative overflow-hidden", className)}
    {...props}
  />
));
ScrollAreaRoot.displayName = "ScrollArea.Root";

const ScrollAreaViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "h-full w-full overflow-auto rounded-md border border-border bg-background text-foreground",
      FOCUS_RING,
      className,
    )}
    {...props}
  />
));
ScrollAreaViewport.displayName = "ScrollArea.Viewport";

const ScrollAreaContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props} />
));
ScrollAreaContent.displayName = "ScrollArea.Content";

const ScrollAreaScrollBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "vertical" | "horizontal";
  }
>(({ className, orientation = "vertical", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "m-1 flex touch-none select-none justify-center rounded-full bg-transparent",
      "pointer-events-none opacity-0",
      MOTION_INTERACTIVE,
      "group-hover:opacity-100",
      orientation === "vertical"
        ? "h-[calc(100%-0.5rem)] w-1.5"
        : "h-1.5 w-[calc(100%-0.5rem)] items-center",
      className,
    )}
    {...props}
  />
));
ScrollAreaScrollBar.displayName = "ScrollArea.Scrollbar";

const ScrollAreaThumb = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full rounded-full bg-border", className)}
    {...props}
  />
));
ScrollAreaThumb.displayName = "ScrollArea.Thumb";

const ScrollAreaCorner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("bg-border", className)} {...props} />
));
ScrollAreaCorner.displayName = "ScrollArea.Corner";

const ScrollArea = Object.assign(ScrollAreaRoot, {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Content: ScrollAreaContent,
  Scrollbar: ScrollAreaScrollBar,
  ScrollBar: ScrollAreaScrollBar,
  Thumb: ScrollAreaThumb,
  Corner: ScrollAreaCorner,
});

export {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollBar as ScrollBar,
  ScrollAreaThumb,
  ScrollAreaViewport,
};
