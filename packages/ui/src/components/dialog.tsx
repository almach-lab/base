import { cn } from "@almach/utils";
import { X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  MOTION_VAR_OVERLAY_DURATION,
  resolveMotionDurationMs,
} from "./_motion.js";
import { lockBodyScroll, unlockBodyScroll } from "./_scroll-lock.js";

interface DialogCtxValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogCtx = React.createContext<DialogCtxValue | null>(null);
const DIALOG_ANIMATION_MS = 260;
const DIALOG_EASE = "cubic-bezier(0.22,1,0.36,1)";

function useDialogCtx() {
  const ctx = React.useContext(DialogCtx);
  if (!ctx) throw new Error("Dialog parts must be used within Dialog");
  return ctx;
}

type DialogRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

function DialogRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogRootProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = open ?? internalOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );
  return (
    <DialogCtx.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </DialogCtx.Provider>
  );
}
DialogRoot.displayName = "Dialog";

interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}
function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 min-h-dvh bg-black/40 backdrop-blur-sm supports-[-webkit-touch-callout:none]:absolute",
        className,
      )}
      {...props}
    />
  );
}

interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}
const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild, children, onClick, ...props }, ref) => {
    const { open, setOpen } = useDialogCtx();
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
DialogTrigger.displayName = "Dialog.Trigger";

interface DialogCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}
const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ asChild, children, onClick, ...props }, ref) => {
    const { setOpen } = useDialogCtx();
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
DialogClose.displayName = "Dialog.Close";

interface DialogPortalProps {
  children?: React.ReactNode;
}
function DialogPortal({ children }: DialogPortalProps) {
  return createPortal(children, document.body);
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  hideClose?: boolean | undefined;
}
const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, hideClose, ...props }, ref) => (
    <DialogContentInner
      ref={ref}
      className={className}
      hideClose={hideClose}
      {...props}
    >
      {children}
    </DialogContentInner>
  ),
);
DialogContent.displayName = "Dialog.Content";

const DialogContentInner = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, hideClose, ...props }, ref) => {
    const { open, setOpen } = useDialogCtx();
    const [mounted, setMounted] = React.useState(open);
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      const motionMs = resolveMotionDurationMs(
        MOTION_VAR_OVERLAY_DURATION,
        DIALOG_ANIMATION_MS,
      );
      if (open) {
        setMounted(true);
        // Double RAF: the first frame lets the browser paint the "closed"
        // (opacity-0 / scale-[0.96]) state; the second frame triggers the
        // CSS transition to "open". A single RAF can be absorbed into the
        // same paint as the mount commit, so the enter animation never fires.
        let raf2: number | null = null;
        const raf1 = window.requestAnimationFrame(() => {
          raf2 = window.requestAnimationFrame(() => {
            setIsVisible(true);
          });
        });
        return () => {
          window.cancelAnimationFrame(raf1);
          if (raf2 !== null) window.cancelAnimationFrame(raf2);
        };
      }

      setIsVisible(false);
      if (!mounted) {
        return;
      }
      const timeoutId = setTimeout(() => setMounted(false), motionMs);
      return () => clearTimeout(timeoutId);
    }, [open, mounted]);

    React.useEffect(() => {
      if (!mounted) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [mounted, setOpen]);

    React.useEffect(() => {
      if (!mounted) return;
      lockBodyScroll();
      return () => unlockBodyScroll();
    }, [mounted]);

    if (!mounted) return null;

    const state = isVisible ? "open" : "closed";

    return (
      <DialogPortal>
        <DialogOverlay
          data-state={state}
          onClick={() => setOpen(false)}
          style={{
            transitionDuration: `var(--theme-motion-overlay-duration, ${DIALOG_ANIMATION_MS}ms)`,
            transitionTimingFunction: `var(--theme-motion-ease-standard, ${DIALOG_EASE})`,
          }}
          className={cn(
            "transition-opacity motion-reduce:transition-none",
            "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
          )}
        />
        <div
          ref={ref}
          data-state={state}
          onClick={(event) => event.stopPropagation()}
          style={{
            transitionDuration: `var(--theme-motion-overlay-duration, ${DIALOG_ANIMATION_MS}ms)`,
            transitionTimingFunction: `var(--theme-motion-ease-standard, ${DIALOG_EASE})`,
          }}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "w-[calc(100%-2rem)] max-w-lg max-h-[calc(100svh-4rem)] overflow-y-auto",
            "rounded-lg bg-background p-6 shadow-xl outline-none",
            "transition-[opacity,transform] motion-reduce:transition-none motion-reduce:transform-none will-change-transform",
            // Keep viewport-centering stable; animate with opacity/scale only.
            "data-[state=open]:opacity-100 data-[state=open]:scale-100",
            "data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.96]",
            className,
          )}
          {...props}
        >
          {children}
          {!hideClose && (
            <DialogClose className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg opacity-50 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          )}
        </div>
      </DialogPortal>
    );
  },
);
DialogContentInner.displayName = "Dialog.ContentInner";

function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-4 flex flex-col space-y-1.5", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

const DialogTitle = React.forwardRef<
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
DialogTitle.displayName = "Dialog.Title";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
DialogDescription.displayName = "Dialog.Description";

const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});

export { Dialog };
