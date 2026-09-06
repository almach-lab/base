import { cn } from "@almach/utils";
import { X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  MOTION_EASE_STANDARD,
  MOTION_INTERACTIVE,
  MOTION_OVERLAY,
  MOTION_OVERLAY_DURATION_MS,
  MOTION_VAR_EASE,
  MOTION_VAR_OVERLAY_DURATION,
  motionVar,
  resolveMotionDurationMs,
} from "./_motion.js";
import { lockBodyScroll, unlockBodyScroll } from "./_scroll-lock.js";
import { DIALOG_SURFACE, FOCUS_RING, OVERLAY_BACKDROP } from "./_styles.js";

interface DialogCtxValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const DialogCtx = React.createContext<DialogCtxValue | null>(null);

function useDialogCtx() {
  const ctx = React.useContext(DialogCtx);
  if (!ctx) throw new Error("Dialog parts must be used within Dialog");
  return ctx;
}

type DialogRootProps = {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
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
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const isOpen = open ?? internalOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );
  return (
    <DialogCtx.Provider value={{ open: isOpen, setOpen, triggerRef }}>
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
        OVERLAY_BACKDROP,
        "min-h-dvh supports-[-webkit-touch-callout:none]:absolute",
        className,
      )}
      {...props}
    />
  );
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}
const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild, children, onClick, ...props }, ref) => {
    const { open, setOpen, triggerRef } = useDialogCtx();
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        onClick?: (e: React.MouseEvent<HTMLElement>) => void;
      }>;
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          triggerRef.current = e.currentTarget;
          child.props.onClick?.(e);
          if (!e.defaultPrevented) setOpen(!open);
        },
      });
    }
    return (
      <button
        ref={(node) => {
          triggerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
            return;
          }
          if (ref) {
            ref.current = node;
          }
        }}
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

interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
    const { open, setOpen, triggerRef } = useDialogCtx();
    const [mounted, setMounted] = React.useState(open);
    const [isVisible, setIsVisible] = React.useState(false);
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const restoreFocusRef = React.useRef<HTMLElement | null>(null);

    React.useEffect(() => {
      const motionMs = resolveMotionDurationMs(
        MOTION_VAR_OVERLAY_DURATION,
        MOTION_OVERLAY_DURATION_MS,
      );
      if (open) {
        setMounted(true);
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

    const setOpenRef = React.useRef(setOpen);
    React.useEffect(() => {
      setOpenRef.current = setOpen;
    }, [setOpen]);

    React.useEffect(() => {
      if (!mounted) return;
      restoreFocusRef.current = document.activeElement as HTMLElement | null;

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpenRef.current(false);
        if (event.key === "Tab") trapFocus(event);
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        window.removeEventListener("keydown", onKeyDown);
        const target =
          triggerRef.current ?? restoreFocusRef.current ?? document.body;
        target?.focus?.();
      };
    }, [mounted]);

    const trapFocus = (event: KeyboardEvent) => {
      const el = contentRef.current;
      if (!el) return;
      const focusable = el.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    React.useEffect(() => {
      if (!mounted) return;
      lockBodyScroll();
      return () => unlockBodyScroll();
    }, [mounted]);

    React.useEffect(() => {
      if (!mounted || !isVisible) {
        return;
      }

      const content = contentRef.current;
      if (!content) {
        return;
      }

      // Don't yank focus away if the user already focused something inside
      // (e.g. tapped a field before the open animation settled).
      if (content.contains(document.activeElement)) {
        return;
      }

      const initialFocusable = content.querySelector<HTMLElement>(
        "[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      (initialFocusable ?? content).focus();
    }, [isVisible, mounted]);

    if (!mounted) return null;

    const state = isVisible ? "open" : "closed";

    return (
      <DialogPortal>
        <DialogOverlay
          data-state={state}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
          style={{
            transitionDuration: motionVar(
              MOTION_VAR_OVERLAY_DURATION,
              `${MOTION_OVERLAY_DURATION_MS}ms`,
            ),
            transitionTimingFunction: motionVar(
              MOTION_VAR_EASE,
              MOTION_EASE_STANDARD,
            ),
          }}
          className={cn(
            MOTION_OVERLAY,
            "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
          )}
        />
        <div
          ref={(node) => {
            contentRef.current = node;
            if (typeof ref === "function") {
              ref(node);
              return;
            }
            if (ref) {
              ref.current = node;
            }
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          data-dialog-content="true"
          data-state={state}
          onClick={(event) => event.stopPropagation()}
          style={{
            transitionDuration: motionVar(
              MOTION_VAR_OVERLAY_DURATION,
              `${MOTION_OVERLAY_DURATION_MS}ms`,
            ),
            transitionTimingFunction: motionVar(
              MOTION_VAR_EASE,
              MOTION_EASE_STANDARD,
            ),
          }}
          className={cn(
            DIALOG_SURFACE,
            "rounded-none md:rounded-lg",
            MOTION_OVERLAY,
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "w-[calc(100%-2rem)] max-w-lg max-h-[calc(100svh-4rem)] overflow-y-auto p-6",
            "transition-[opacity,transform] motion-reduce:transition-none motion-reduce:transform-none will-change-transform",
            "data-[state=open]:opacity-100 data-[state=open]:scale-100",
            "data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.96]",
            className,
          )}
          {...props}
        >
          {children}
          {!hideClose && (
            <DialogClose
              className={cn(
                "absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg opacity-50 hover:opacity-100",
                MOTION_INTERACTIVE,
                FOCUS_RING,
              )}
            >
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
