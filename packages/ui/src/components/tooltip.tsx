import { cn } from "@almach/utils";
import * as React from "react";
import {
  Tooltip as TooltipPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
} from "react-aria-components";
import {
  MOTION_OVERLAY,
  MOTION_OVERLAY_ENTER,
  MOTION_OVERLAY_EXIT,
} from "./_motion.js";

type TooltipProviderProps = {
  delay?: number;
  children: React.ReactNode;
};

const TooltipDelayCtx = React.createContext(700);

function TooltipProvider({ delay = 700, children }: TooltipProviderProps) {
  return (
    <TooltipDelayCtx.Provider value={delay}>
      {children}
    </TooltipDelayCtx.Provider>
  );
}

interface TooltipTriggerMarkerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

function TooltipTriggerMarker(_props: TooltipTriggerMarkerProps) {
  return null;
}
TooltipTriggerMarker.displayName = "Tooltip.Trigger";

interface TooltipContentMarkerProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive> {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  children: React.ReactNode;
}

function TooltipContentMarker(_props: TooltipContentMarkerProps) {
  return null;
}
TooltipContentMarker.displayName = "Tooltip.Content";

function TooltipRoot({ children }: { children: React.ReactNode }) {
  const delay = React.useContext(TooltipDelayCtx);
  let triggerProps: TooltipTriggerMarkerProps | null = null;
  let contentProps: TooltipContentMarkerProps | null = null;

  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement(child)) continue;
    if (child.type === TooltipTriggerMarker) {
      triggerProps = child.props as TooltipTriggerMarkerProps;
    }
    if (child.type === TooltipContentMarker) {
      contentProps = child.props as TooltipContentMarkerProps;
    }
  }

  if (!triggerProps || !contentProps) {
    return null;
  }

  const triggerNode = triggerProps.asChild ? (
    (React.Children.only(triggerProps.children) as React.ReactElement)
  ) : (
    <button type="button">{triggerProps.children}</button>
  );

  return (
    <TooltipTriggerPrimitive delay={delay}>
      {triggerNode}
      <TooltipPrimitive
        offset={contentProps.sideOffset ?? 6}
        placement={contentProps.side ?? "top"}
        className={cn(
          "z-50 max-w-xs rounded-lg bg-foreground px-3 py-1.5",
          "text-xs font-medium text-background leading-snug",
          "shadow-md select-none",
          MOTION_OVERLAY,
          MOTION_OVERLAY_ENTER.replaceAll(
            "data-[state=open]:",
            "data-[entering]:",
          ),
          MOTION_OVERLAY_EXIT.replaceAll(
            "data-[state=closed]:",
            "data-[exiting]:",
          ),
          contentProps.className,
        )}
      >
        {contentProps.children}
      </TooltipPrimitive>
    </TooltipTriggerPrimitive>
  );
}
TooltipRoot.displayName = "Tooltip";

const Tooltip = Object.assign(TooltipRoot, {
  Provider: TooltipProvider,
  Trigger: TooltipTriggerMarker,
  Content: TooltipContentMarker,
});

export { Tooltip };
