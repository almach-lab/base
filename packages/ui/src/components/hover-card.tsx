import { cn } from "@almach/utils";
import * as React from "react";
import { Popover as AriaPopover } from "react-aria-components";
import {
  type OverlayAlign,
  type OverlaySide,
  toOverlayPlacement,
} from "./_placement.js";
import { MOTION_OVERLAY_RAC } from "./_motion.js";
import { OVERLAY_SURFACE } from "./_styles.js";

/**
 * Hover-intent card. React Aria has no hover-triggered overlay, so the open
 * state is driven here and handed to a controlled `Popover` anchored on the
 * trigger. Pointer-only by design: the content is also revealed on keyboard
 * focus, but hover cards must never hold the only copy of important content.
 */

interface HoverCardCtxValue {
  open: boolean;
  triggerRef: React.RefObject<HTMLSpanElement | null>;
  openWithDelay: () => void;
  closeWithDelay: () => void;
  cancelClose: () => void;
  setOpen: (open: boolean) => void;
}

const HoverCardCtx = React.createContext<HoverCardCtxValue | null>(null);

function useHoverCardCtx() {
  const ctx = React.useContext(HoverCardCtx);
  if (!ctx) throw new Error("HoverCard parts must be used within HoverCard");
  return ctx;
}

export interface HoverCardProps {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: (open: boolean) => void;
  /** Delay before opening, in ms. */
  openDelay?: number;
  /** Delay before closing, in ms — long enough to cross the gap to the card. */
  closeDelay?: number;
  children?: React.ReactNode;
}

function HoverCardRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  openDelay = 300,
  closeDelay = 150,
  children,
}: HoverCardProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLSpanElement | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOpen = open ?? internalOpen;

  const clearTimer = React.useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  React.useEffect(() => clearTimer, [clearTimer]);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );

  const openWithDelay = React.useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => setOpen(true), openDelay);
  }, [clearTimer, openDelay, setOpen]);

  const closeWithDelay = React.useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => setOpen(false), closeDelay);
  }, [clearTimer, closeDelay, setOpen]);

  return (
    <HoverCardCtx.Provider
      value={{
        open: isOpen,
        triggerRef,
        openWithDelay,
        closeWithDelay,
        cancelClose: clearTimer,
        setOpen,
      }}
    >
      {children}
    </HoverCardCtx.Provider>
  );
}
HoverCardRoot.displayName = "HoverCard";

export interface HoverCardTriggerProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

const HoverCardTrigger = React.forwardRef<
  HTMLSpanElement,
  HoverCardTriggerProps
>(({ className, children, ...props }, ref) => {
  const { triggerRef, openWithDelay, closeWithDelay } = useHoverCardCtx();

  return (
    <span
      ref={(node) => {
        triggerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
          return;
        }
        if (ref) ref.current = node;
      }}
      className={cn("inline-flex w-fit", className)}
      onPointerEnter={openWithDelay}
      onPointerLeave={closeWithDelay}
      onFocus={openWithDelay}
      onBlur={closeWithDelay}
      {...props}
    >
      {children}
    </span>
  );
});
HoverCardTrigger.displayName = "HoverCard.Trigger";

export interface HoverCardContentProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AriaPopover>,
  | "children"
  | "className"
  | "triggerRef"
  | "isOpen"
  | "onOpenChange"
  | "placement"
  | "offset"
> {
  className?: string;
  children?: React.ReactNode;
  side?: OverlaySide;
  align?: OverlayAlign;
  sideOffset?: number;
}

const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  HoverCardContentProps
>(
  (
    {
      className,
      children,
      side = "bottom",
      align = "center",
      sideOffset = 8,
      ...props
    },
    ref,
  ) => {
    const { open, triggerRef, cancelClose, closeWithDelay, setOpen } =
      useHoverCardCtx();

    return (
      <AriaPopover
        ref={ref}
        triggerRef={triggerRef}
        isOpen={open}
        onOpenChange={setOpen}
        isNonModal
        placement={toOverlayPlacement(side, align)}
        offset={sideOffset}
        className={cn(
          OVERLAY_SURFACE,
          "w-72 p-4 text-sm shadow-md",
          MOTION_OVERLAY_RAC,
          className,
        )}
        {...props}
      >
        {/* Keeps the card open while the pointer travels from trigger to card. */}
        <div
          onPointerEnter={cancelClose}
          onPointerLeave={closeWithDelay}
          className="min-w-0"
        >
          {children}
        </div>
      </AriaPopover>
    );
  },
);
HoverCardContent.displayName = "HoverCard.Content";

const HoverCard = Object.assign(HoverCardRoot, {
  Trigger: HoverCardTrigger,
  Content: HoverCardContent,
});

export { HoverCard };
