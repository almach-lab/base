"use client";

import { cn } from "@almach/utils";
import * as React from "react";

const ScrollAreaRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative overflow-hidden", className)}
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
      "h-full w-full overflow-auto rounded-md border border-input bg-background text-foreground",
      "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
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
      "m-2 flex touch-none select-none justify-center rounded-sm bg-border opacity-0",
      "pointer-events-none transition-opacity",
      "group-hover:opacity-100",
      orientation === "vertical"
        ? "h-[calc(100%-1rem)] w-1"
        : "h-1 w-[calc(100%-1rem)] items-center",
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
    className={cn("w-full rounded-sm bg-foreground/50", className)}
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
