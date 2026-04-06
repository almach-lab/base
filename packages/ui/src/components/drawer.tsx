"use client";

import { cn } from "@almach/utils";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  MOTION_DURATION_BASE,
  MOTION_DURATION_SLOW,
  MOTION_OVERLAY,
  MOTION_VAR_INTERACTIVE_DURATION,
  MOTION_VAR_OVERLAY_DURATION,
  resolveMotionDurationMs,
} from "./_motion.js";
import { lockBodyScroll, unlockBodyScroll } from "./_scroll-lock.js";

const DRAG_THRESHOLD_PX = 8;
const DRAG_DISMISS_FRACTION = 0.3;
const DRAG_VELOCITY_THRESHOLD = 0.5;
const DRAWER_PANEL_MOTION =
  "transition-[transform,opacity,border-radius,box-shadow] [--tw-duration:var(--theme-motion-interactive-duration,0.22s)] [--tw-ease:var(--theme-motion-ease-standard,cubic-bezier(0.22,1,0.36,1))] motion-reduce:transition-none";

type DrawerSide = "bottom" | "top" | "left" | "right";
type DrawerBackdropVariant = "opaque" | "blur" | "transparent";

interface DrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DrawerCtx = React.createContext<DrawerContextValue | null>(null);

function useDrawerCtx() {
  const ctx = React.useContext(DrawerCtx);
  if (!ctx) throw new Error("Drawer parts must be used within Drawer");
  return ctx;
}

function useDrawerDrag({
  side,
  open,
  isDismissable,
  setOpen,
}: {
  side: DrawerSide;
  open: boolean;
  isDismissable: boolean;
  setOpen: (open: boolean) => void;
}) {
  const popupRef = React.useRef<HTMLDivElement | null>(null);
  const isDraggingRef = React.useRef(false);
  const isActiveRef = React.useRef(false);
  const startPosRef = React.useRef(0);
  const lastPosRef = React.useRef(0);
  const lastTimeRef = React.useRef(0);
  const offsetRef = React.useRef(0);
  const velocityRef = React.useRef(0);

  const isVertical = side === "top" || side === "bottom";

  const getPos = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) =>
      isVertical ? event.clientY : event.clientX,
    [isVertical],
  );

  const clampOffset = React.useCallback(
    (delta: number) => {
      switch (side) {
        case "bottom":
        case "right":
          return Math.max(0, delta);
        case "top":
        case "left":
          return Math.min(0, delta);
        default:
          return delta;
      }
    },
    [side],
  );

  React.useEffect(() => {
    if (!open || !popupRef.current) return;
    popupRef.current.style.transform = "";
    popupRef.current.style.transition = "";
  }, [open]);

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDismissable) return;
      if (event.button !== 0) return;

      const target = event.target as HTMLElement;
      const dragSource = target.closest(
        "[data-slot='drawer-handle'], [data-slot='drawer-header'], [data-slot='drawer-footer']",
      );
      if (!dragSource) return;

      if (
        target.closest(
          "input, textarea, button, [role='button'], select, a, [data-slot='drawer-body']",
        )
      ) {
        return;
      }

      const pos = getPos(event);
      isDraggingRef.current = true;
      isActiveRef.current = false;
      startPosRef.current = pos;
      lastPosRef.current = pos;
      lastTimeRef.current = Date.now();
      offsetRef.current = 0;
      velocityRef.current = 0;
    },
    [getPos, isDismissable],
  );

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current || !popupRef.current) return;

      const currentPos = getPos(event);
      const rawDelta = currentPos - startPosRef.current;
      const delta = clampOffset(rawDelta);

      if (!isActiveRef.current) {
        if (Math.abs(rawDelta) < DRAG_THRESHOLD_PX) return;
        isActiveRef.current = true;
        popupRef.current.style.transition = "none";
        popupRef.current.setPointerCapture(event.pointerId);
      }

      offsetRef.current = delta;

      const now = Date.now();
      const elapsed = now - lastTimeRef.current;
      if (elapsed > 0) {
        velocityRef.current = (currentPos - lastPosRef.current) / elapsed;
        lastTimeRef.current = now;
        lastPosRef.current = currentPos;
      }

      popupRef.current.style.transform = isVertical
        ? `translate3d(0, ${delta}px, 0)`
        : `translate3d(${delta}px, 0, 0)`;
      event.preventDefault();
    },
    [clampOffset, getPos, isVertical],
  );

  const onPointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      const popup = popupRef.current;
      if (!popup || !isActiveRef.current) {
        isActiveRef.current = false;
        return;
      }
      isActiveRef.current = false;

      try {
        popup.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may already be released.
      }

      const dimension = isVertical ? popup.offsetHeight : popup.offsetWidth;
      const shouldDismiss =
        Math.abs(offsetRef.current) > dimension * DRAG_DISMISS_FRACTION ||
        Math.abs(velocityRef.current) > DRAG_VELOCITY_THRESHOLD;

      if (shouldDismiss) {
        setOpen(false);
      } else {
        popup.style.transition =
          "transform var(--theme-motion-interactive-duration, 200ms) var(--theme-motion-ease-standard, cubic-bezier(0.22,1,0.36,1))";
        popup.style.transform = "translate3d(0, 0, 0)";
        const cleanup = () => {
          popup.style.transition = "";
          popup.style.transform = "";
        };
        popup.addEventListener("transitionend", cleanup, { once: true });
      }

      offsetRef.current = 0;
      velocityRef.current = 0;
    },
    [isVertical, setOpen],
  );

  return {
    popupRef,
    dragHandlers: isDismissable
      ? {
          onPointerDown,
          onPointerMove,
          onPointerUp,
          onPointerCancel: onPointerUp,
        }
      : {},
  };
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  if (ref) {
    ref.current = value;
  }
}

type DrawerRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

function DrawerRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: DrawerRootProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DrawerCtx.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </DrawerCtx.Provider>
  );
}
DrawerRoot.displayName = "Drawer";

interface DrawerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}

const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ asChild, children, onClick, ...props }, ref) => {
    const { open, setOpen } = useDrawerCtx();

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        onClick?: (e: React.MouseEvent<HTMLElement>) => void;
      }>;
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          if (!e.defaultPrevented) setOpen(!open);
        },
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) setOpen(!open);
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);
DrawerTrigger.displayName = "Drawer.Trigger";

interface DrawerCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}

const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ asChild, children, onClick, ...props }, ref) => {
    const { setOpen } = useDrawerCtx();

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        onClick?: (e: React.MouseEvent<HTMLElement>) => void;
      }>;
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          if (!e.defaultPrevented) setOpen(false);
        },
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) setOpen(false);
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);
DrawerClose.displayName = "Drawer.Close";

interface DrawerPortalProps {
  children?: React.ReactNode;
}

function DrawerPortal({ children }: DrawerPortalProps) {
  const { open } = useDrawerCtx();
  if (!open) return null;
  return createPortal(children, document.body);
}
DrawerPortal.displayName = "Drawer.Portal";

interface DrawerBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: "open" | "closed";
  variant?: DrawerBackdropVariant;
}

function DrawerBackdrop({
  className,
  state,
  variant = "opaque",
  ...props
}: DrawerBackdropProps) {
  const { open } = useDrawerCtx();
  const drawerState = state ?? (open ? "open" : "closed");
  return (
    <div
      data-slot="drawer-backdrop"
      data-state={drawerState}
      className={cn(
        "fixed inset-0 z-50 min-h-dvh",
        variant === "opaque" && "bg-black/45",
        variant === "blur" && "bg-black/40 backdrop-blur-sm",
        variant === "transparent" && "bg-transparent",
        MOTION_OVERLAY,
        "[--tw-duration:var(--theme-motion-overlay-duration,0.22s)]",
        "transition-opacity",
        "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
        "supports-[-webkit-touch-callout:none]:absolute",
        className,
      )}
      {...props}
    />
  );
}
DrawerBackdrop.displayName = "Drawer.Backdrop";

interface DrawerViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: DrawerSide;
}

function DrawerViewport({
  className,
  side = "bottom",
  ...props
}: DrawerViewportProps) {
  return (
    <div
      data-slot="drawer-content"
      className={cn(
        "pointer-events-none fixed inset-0 z-50 flex h-dvh w-full min-w-0",
        side === "bottom" && "items-end justify-center",
        side === "top" && "items-start justify-center",
        side === "left" && "items-stretch justify-start",
        side === "right" && "items-stretch justify-end",
        className,
      )}
      {...props}
    />
  );
}
DrawerViewport.displayName = "Drawer.Viewport";

interface DrawerPopupProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: DrawerSide;
  state?: "open" | "closed";
  showHandle?: boolean;
}

const DrawerPopup = React.forwardRef<HTMLDivElement, DrawerPopupProps>(
  (
    {
      className,
      side = "bottom",
      state,
      showHandle = true,
      children,
      ...props
    },
    ref,
  ) => {
    const { open } = useDrawerCtx();
    const popupState = state ?? (open ? "open" : "closed");

    return (
      <div
        ref={ref}
        data-slot="drawer-dialog"
        data-placement={side}
        data-state={popupState}
        className={cn(
          "pointer-events-auto relative flex min-h-0 flex-col bg-background text-foreground shadow-xl outline outline-1 outline-border/50",
          "overflow-hidden overscroll-contain touch-none",
          "transform-gpu will-change-transform [backface-visibility:hidden]",
          DRAWER_PANEL_MOTION,
          "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
          "data-[state=open]:shadow-2xl data-[state=closed]:shadow-none",
          side === "bottom" && [
            "w-full max-h-[85svh] rounded-t-lg origin-bottom",
            "data-[state=open]:translate-y-0 data-[state=open]:scale-100",
            "data-[state=closed]:translate-y-[calc(100%+0.5rem)] data-[state=closed]:scale-[0.985]",
          ],
          side === "top" && [
            "w-full max-h-[85svh] rounded-b-lg origin-top",
            "data-[state=open]:translate-y-0 data-[state=open]:scale-100",
            "data-[state=closed]:-translate-y-[calc(100%+0.5rem)] data-[state=closed]:scale-[0.985]",
          ],
          side === "right" && [
            "h-full w-80 max-w-[100vw] rounded-l-lg origin-right",
            "data-[state=open]:translate-x-0 data-[state=open]:scale-100",
            "data-[state=closed]:translate-x-[calc(100%+0.5rem)] data-[state=closed]:scale-[0.99]",
          ],
          side === "left" && [
            "h-full w-80 max-w-[100vw] rounded-r-lg origin-left",
            "data-[state=open]:translate-x-0 data-[state=open]:scale-100",
            "data-[state=closed]:-translate-x-[calc(100%+0.5rem)] data-[state=closed]:scale-[0.99]",
          ],
          className,
        )}
        {...props}
      >
        {showHandle && (side === "bottom" || side === "top") && (
          <DrawerHandle className="mt-3 mb-1" />
        )}
        {children}
      </div>
    );
  },
);
DrawerPopup.displayName = "Drawer.Popup";

interface DrawerContentProps extends DrawerPopupProps {
  viewportClassName?: string;
  backdrop?: DrawerBackdropVariant;
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  (
    {
      className,
      viewportClassName,
      side = "bottom",
      backdrop = "blur",
      isDismissable = true,
      isKeyboardDismissDisabled = false,
      showHandle = true,
      children,
      ...props
    },
    ref,
  ) => {
    const { open, setOpen } = useDrawerCtx();
    const { popupRef, dragHandlers } = useDrawerDrag({
      side,
      open,
      isDismissable,
      setOpen,
    });
    const [mounted, setMounted] = React.useState(open);
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      const overlayMs = resolveMotionDurationMs(
        MOTION_VAR_OVERLAY_DURATION,
        MOTION_DURATION_SLOW,
      );
      const panelMs = resolveMotionDurationMs(
        MOTION_VAR_INTERACTIVE_DURATION,
        MOTION_DURATION_BASE,
      );
      const motionMs = Math.max(overlayMs, panelMs);
      if (open) {
        setMounted(true);
        const rafId = window.requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => window.cancelAnimationFrame(rafId);
      }

      setIsVisible(false);
      if (!mounted) {
        return;
      }

      const timeout = window.setTimeout(() => setMounted(false), motionMs);
      return () => window.clearTimeout(timeout);
    }, [open, mounted]);

    React.useEffect(() => {
      if (!mounted) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (!isKeyboardDismissDisabled && event.key === "Escape")
          setOpen(false);
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [mounted, setOpen, isKeyboardDismissDisabled]);

    React.useEffect(() => {
      if (!mounted) return;
      lockBodyScroll();
      return () => unlockBodyScroll();
    }, [mounted]);

    if (!mounted) return null;

    const state = isVisible ? "open" : "closed";

    return createPortal(
      <>
        <DrawerBackdrop
          variant={backdrop}
          state={state}
          onClick={() => {
            if (isDismissable) setOpen(false);
          }}
        />
        <DrawerViewport side={side} className={viewportClassName}>
          <DrawerPopup
            ref={(node) => {
              popupRef.current = node;
              assignRef(ref, node);
            }}
            side={side}
            state={state}
            showHandle={showHandle}
            className={className}
            onClick={(event) => event.stopPropagation()}
            {...dragHandlers}
            {...props}
          >
            {children}
          </DrawerPopup>
        </DrawerViewport>
      </>,
      document.body,
    );
  },
);
DrawerContent.displayName = "Drawer.Content";

function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1.5 px-4 pt-4 pb-2", className)}
      {...props}
    />
  );
}
DrawerHeader.displayName = "Drawer.Header";

function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 px-4 pt-2 pb-4", className)}
      {...props}
    />
  );
}
DrawerFooter.displayName = "Drawer.Footer";

function DrawerBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="drawer-body"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-2 text-sm leading-[1.43] text-muted-foreground",
        "[touch-action:pan-y] [-webkit-overflow-scrolling:touch]",
        className,
      )}
      {...props}
    />
  );
}
DrawerBody.displayName = "Drawer.Body";

function DrawerHandle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      data-slot="drawer-handle"
      className={cn(
        "flex shrink-0 items-center justify-center pb-2",
        className,
      )}
      {...props}
    >
      <div
        className="h-1.5 w-12 rounded-full bg-muted"
        data-slot="drawer-handle-bar"
      />
    </div>
  );
}
DrawerHandle.displayName = "Drawer.Handle";

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    data-slot="drawer-heading"
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DrawerTitle.displayName = "Drawer.Title";

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="drawer-description"
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
DrawerDescription.displayName = "Drawer.Description";

const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Portal: DrawerPortal,
  Backdrop: DrawerBackdrop,
  Viewport: DrawerViewport,
  Popup: DrawerPopup,
  Content: DrawerContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Handle: DrawerHandle,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
});

export { Drawer };
