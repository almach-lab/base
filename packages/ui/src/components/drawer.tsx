"use client";

import { cn } from "@almach/utils";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  MOTION_VAR_OVERLAY_DURATION,
  resolveMotionDurationMs,
} from "./_motion.js";
import { lockBodyScroll, unlockBodyScroll } from "./_scroll-lock.js";

const DRAWER_EASE = "cubic-bezier(0.32,0.72,0,1)";
const DRAWER_DURATION_MS = 320;
const DRAWER_PANEL_DURATION_MS = 280;

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

interface DrawerTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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

interface DrawerCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
      data-state={drawerState}
      style={{
        transitionDuration: `var(--theme-motion-overlay-duration, ${DRAWER_DURATION_MS}ms)`,
        transitionTimingFunction: `var(--theme-motion-ease-standard, ${DRAWER_EASE})`,
      }}
      className={cn(
        "fixed inset-0 z-50 min-h-dvh",
        variant === "opaque" && "bg-black/50",
        variant === "blur" && "bg-background/35 backdrop-blur-sm",
        variant === "transparent" && "bg-transparent",
        "transition-opacity motion-reduce:transition-none",
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
      className={cn(
        "fixed inset-0 z-50 flex",
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
        data-state={popupState}
        style={{
          transitionDuration: `var(--theme-motion-interactive-duration, ${DRAWER_PANEL_DURATION_MS}ms)`,
          transitionTimingFunction: `var(--theme-motion-ease-standard, ${DRAWER_EASE})`,
        }}
        className={cn(
          "relative bg-background text-foreground outline outline-1 outline-border/50 shadow-xl overflow-y-auto overscroll-contain touch-auto",
          "transform-gpu will-change-transform [backface-visibility:hidden]",
          "transition-[transform,opacity] motion-reduce:transition-none",
          "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
          side === "bottom" && [
            "w-full max-h-[85svh] rounded-t-lg origin-bottom",
            "data-[state=open]:translate-y-0 data-[state=open]:scale-100",
            "data-[state=closed]:translate-y-[102%] data-[state=closed]:scale-[0.985]",
          ],
          side === "top" && [
            "w-full max-h-[85svh] rounded-b-lg origin-top",
            "data-[state=open]:translate-y-0 data-[state=open]:scale-100",
            "data-[state=closed]:-translate-y-[102%] data-[state=closed]:scale-[0.985]",
          ],
          side === "right" && [
            "h-full w-80 max-w-[100vw] rounded-l-lg origin-right",
            "data-[state=open]:translate-x-0 data-[state=open]:scale-100",
            "data-[state=closed]:translate-x-[102%] data-[state=closed]:scale-[0.99]",
          ],
          side === "left" && [
            "h-full w-80 max-w-[100vw] rounded-r-lg origin-left",
            "data-[state=open]:translate-x-0 data-[state=open]:scale-100",
            "data-[state=closed]:-translate-x-[102%] data-[state=closed]:scale-[0.99]",
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
      backdrop = "opaque",
      isDismissable = true,
      isKeyboardDismissDisabled = false,
      showHandle = true,
      children,
      ...props
    },
    ref,
  ) => {
    const { open, setOpen } = useDrawerCtx();
    const [mounted, setMounted] = React.useState(open);
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      const motionMs = resolveMotionDurationMs(
        MOTION_VAR_OVERLAY_DURATION,
        DRAWER_DURATION_MS,
      );
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
            ref={ref}
            side={side}
            state={state}
            showHandle={showHandle}
            className={className}
            onClick={(event) => event.stopPropagation()}
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
      className={cn("px-4 pt-4 pb-2 flex flex-col space-y-1.5", className)}
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
  return <div className={cn("px-4 py-2", className)} {...props} />;
}
DrawerBody.displayName = "Drawer.Body";

function DrawerHandle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto h-1.5 w-12 rounded-full bg-muted shrink-0",
        className,
      )}
      {...props}
    />
  );
}
DrawerHandle.displayName = "Drawer.Handle";

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
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
