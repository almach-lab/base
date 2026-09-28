"use client";

import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { useIsMobile } from "../hooks/use-media-query.js";
import { X } from "lucide-react";
import { useAutoHeight } from "./_auto-height.js";
import {
  MOTION_DURATION_BASE,
  MOTION_EASE_STANDARD,
  MOTION_INTERACTIVE,
  MOTION_OVERLAY_DURATION_MS,
  MOTION_VAR_INTERACTIVE_DURATION,
  MOTION_VAR_OVERLAY_DURATION,
  resolveMotionDurationMs,
} from "./_motion.js";
import { FOCUS_RING } from "./_styles.js";
import { Button } from "./button.js";
import { Dialog } from "./dialog.js";
import { Drawer } from "./drawer";

type ViewComponent = React.ComponentType<Record<string, unknown>>;
interface ViewsRegistry {
  [viewName: string]: ViewComponent;
}

const MODAL_VIEW_TRANSITION_MS = 180;
const MODAL_VIEW_TRANSITION_EASE = MOTION_EASE_STANDARD;

interface ModalCtxValue {
  isMobile: boolean;
  views: ViewsRegistry | undefined;
  view: string;
  setView: (v: string) => void;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  hasDescription: boolean;
  registerTitle: () => () => void;
  registerDescription: () => () => void;
}

const noopRegister = () => () => {};

const ModalCtx = React.createContext<ModalCtxValue>({
  isMobile: false,
  views: undefined,
  view: "default",
  setView: () => {},
  titleId: "",
  descriptionId: "",
  hasTitle: false,
  hasDescription: false,
  registerTitle: noopRegister,
  registerDescription: noopRegister,
});

const ModalContentCtx = React.createContext<{
  hideClose: boolean;
  registerHeader: () => () => void;
}>({
  hideClose: false,
  registerHeader: noopRegister,
});

function useRegistration() {
  const [count, setCount] = React.useState(0);
  const register = React.useCallback(() => {
    setCount((c) => c + 1);
    return () => setCount((c) => c - 1);
  }, []);
  return [count > 0, register] as const;
}

const modalSizeVariants = cva("", {
  variants: {
    size: {
      sm: "max-w-sm",
      default: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-3xl",
      "2xl": "max-w-5xl",
    },
  },
  defaultVariants: { size: "default" },
});

const MODAL_SECTION_X = { desktop: "px-6", mobile: "px-5" } as const;

function useModalCtx() {
  return React.useContext(ModalCtx);
}

function useModal() {
  const { view, setView } = useModalCtx();
  return { view, setView };
}

interface ModalRootProps {
  children?: React.ReactNode;
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  views?: ViewsRegistry;
  defaultView?: string;
  onViewChange?: (view: string) => void;
}

function ModalRoot({
  children,
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  views: customViews,
  defaultView = "default",
  onViewChange,
}: ModalRootProps) {
  const isMobile = useIsMobile();
  const Root = isMobile ? Drawer : Dialog;

  const [view, setView] = React.useState(defaultView);
  const titleId = React.useId();
  const descriptionId = React.useId();
  const [hasTitle, registerTitle] = useRegistration();
  const [hasDescription, registerDescription] = useRegistration();
  const views =
    customViews && Object.keys(customViews).length > 0
      ? customViews
      : undefined;

  const handleViewChange = (v: string) => {
    setView(v);
    onViewChange?.(v);
  };

  const resetTimerRef = React.useRef<number | null>(null);
  const defaultViewRef = React.useRef(defaultView);
  defaultViewRef.current = defaultView;
  const onViewChangeRef = React.useRef(onViewChange);
  onViewChangeRef.current = onViewChange;

  React.useEffect(
    () => () => {
      if (resetTimerRef.current !== null)
        window.clearTimeout(resetTimerRef.current);
    },
    [],
  );

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange?.(nextOpen);
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    if (!nextOpen) {
      // Swap back to the default view only after the panel has left, so the
      // exit zoom does not resize underneath itself.
      const ms = Math.max(
        resolveMotionDurationMs(
          MOTION_VAR_OVERLAY_DURATION,
          MOTION_OVERLAY_DURATION_MS,
        ),
        resolveMotionDurationMs(
          MOTION_VAR_INTERACTIVE_DURATION,
          MOTION_DURATION_BASE,
        ),
      );
      resetTimerRef.current = window.setTimeout(() => {
        setView(defaultViewRef.current);
        onViewChangeRef.current?.(defaultViewRef.current);
        resetTimerRef.current = null;
      }, ms + 40);
    }
  };

  const rootProps = {
    ...(open !== undefined && { open }),
    ...(defaultOpen !== undefined && { defaultOpen }),
    onOpenChange: handleOpenChange,
  };

  const hasShorthand = trigger !== undefined || title !== undefined;

  const inner = hasShorthand ? (
    <>
      {trigger !== undefined ? (
        <ModalTrigger asChild>{trigger}</ModalTrigger>
      ) : null}
      <ModalContent>
        {title !== undefined ? (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            {description ? (
              <ModalDescription>{description}</ModalDescription>
            ) : null}
          </ModalHeader>
        ) : null}
        {views ? <ModalViewContent /> : children}
      </ModalContent>
    </>
  ) : (
    children
  );

  return (
    <ModalCtx.Provider
      value={{
        isMobile,
        views,
        view,
        setView: handleViewChange,
        titleId,
        descriptionId,
        hasTitle,
        hasDescription,
        registerTitle,
        registerDescription,
      }}
    >
      <Root {...rootProps}>{inner}</Root>
    </ModalCtx.Provider>
  );
}

interface ModalTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}
function ModalTrigger({ asChild, children }: ModalTriggerProps) {
  const { isMobile } = useModalCtx();
  const Trigger = isMobile ? Drawer.Trigger : Dialog.Trigger;
  return (
    <Trigger {...(asChild !== undefined && { asChild })}>{children}</Trigger>
  );
}

interface ModalContentProps extends VariantProps<typeof modalSizeVariants> {
  children?: React.ReactNode;
  className?: string;
  hideClose?: boolean;
}
const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, className, hideClose = false, size }, ref) => {
    const { isMobile, titleId, descriptionId, hasTitle, hasDescription } =
      useModalCtx();
    // With a Modal.Header the close button moves into the header row, so it
    // lines up with the title instead of floating at a fixed corner offset.
    const [hasHeader, registerHeader] = useRegistration();
    const labelling = {
      ...(hasTitle && { "aria-labelledby": titleId }),
      ...(hasDescription && { "aria-describedby": descriptionId }),
    };
    const content = (
      <ModalContentCtx.Provider value={{ hideClose, registerHeader }}>
        {children}
      </ModalContentCtx.Provider>
    );
    if (isMobile)
      return (
        <Drawer.Content
          ref={ref}
          className={cn("px-0", className)}
          {...labelling}
        >
          {content}
        </Drawer.Content>
      );
    return (
      <Dialog.Content
        ref={ref}
        hideClose={hideClose || hasHeader}
        className={cn(
          "flex flex-col gap-0 overflow-hidden border-0 p-0",
          "max-h-[min(88svh,56rem)]",
          modalSizeVariants({ size }),
          className,
        )}
        {...labelling}
      >
        {content}
      </Dialog.Content>
    );
  },
);
ModalContent.displayName = "Modal.Content";

function ModalHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isMobile } = useModalCtx();
  const { hideClose, registerHeader } = React.useContext(ModalContentCtx);
  React.useEffect(() => registerHeader(), [registerHeader]);
  if (isMobile)
    return (
      <Drawer.Header
        className={cn("shrink-0", MODAL_SECTION_X.mobile, className)}
        {...props}
      />
    );
  return (
    <div
      className={cn(
        "flex shrink-0 items-start gap-3 pt-6 pb-3",
        MODAL_SECTION_X.desktop,
      )}
    >
      <Dialog.Header
        className={cn("mb-0 min-w-0 flex-1 gap-1.5 space-y-0", className)}
        {...props}
      />
      {hideClose ? null : (
        // -mt-1 centres the 32px button on the first line of a text-lg title
        // (and on a 32px row such as a back button + title).
        <Dialog.Close
          className={cn(
            "-mt-1 -mr-2 flex size-8 shrink-0 items-center justify-center rounded-lg opacity-50 hover:opacity-100",
            MOTION_INTERACTIVE,
            FOCUS_RING,
          )}
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      )}
    </div>
  );
}

function ModalFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isMobile } = useModalCtx();
  if (isMobile)
    return (
      <Drawer.Footer
        className={cn(
          "shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]",
          MODAL_SECTION_X.mobile,
          className,
        )}
        {...props}
      />
    );
  return (
    <Dialog.Footer
      className={cn(
        "mt-0 shrink-0 pt-4 pb-6",
        MODAL_SECTION_X.desktop,
        className,
      )}
      {...props}
    />
  );
}

interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Animate height changes of the body content. Defaults to true.
   * `className` styles the inner content box; every other prop and `ref`
   * land on the outer scroll container.
   */
  animateHeight?: boolean;
}

const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  (
    {
      className,
      children,
      animateHeight = true,
      style,
      onTransitionEnd,
      onTransitionCancel,
      ...props
    },
    ref,
  ) => {
    const { isMobile } = useModalCtx();
    const autoHeight = useAutoHeight<HTMLDivElement>(animateHeight);
    return (
      <div
        ref={ref}
        data-slot={isMobile ? "drawer-body" : "modal-body"}
        {...props}
        onTransitionEnd={(event) => {
          autoHeight.onTransitionEnd(event);
          onTransitionEnd?.(event);
        }}
        onTransitionCancel={(event) => {
          autoHeight.onTransitionCancel(event);
          onTransitionCancel?.(event);
        }}
        style={{ ...autoHeight.style, ...style }}
        className={cn(
          "group/modal-body min-h-0 flex-initial overflow-x-hidden overscroll-contain",
          autoHeight.animating ? "overflow-y-hidden" : "overflow-y-auto",
          isMobile && "[touch-action:pan-y] [-webkit-overflow-scrolling:touch]",
        )}
      >
        <div
          ref={autoHeight.innerRef}
          className={cn(
            "flow-root py-2 text-sm text-foreground",
            isMobile ? MODAL_SECTION_X.mobile : MODAL_SECTION_X.desktop,
            isMobile
              ? "group-last-of-type/modal-body:pb-4"
              : "group-first-of-type/modal-body:pt-6 group-last-of-type/modal-body:pb-6",
            className,
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);
ModalBody.displayName = "Modal.Body";

const ModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, id, ...props }, ref) => {
  const { isMobile, titleId, registerTitle } = useModalCtx();
  React.useEffect(() => registerTitle(), [registerTitle]);
  const titleProps = {
    ...props,
    ref,
    id: id ?? titleId,
    className: cn("leading-tight", className),
  };
  if (isMobile) return <Drawer.Title {...titleProps} />;
  return <Dialog.Title {...titleProps} />;
});
ModalTitle.displayName = "Modal.Title";

const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, id, ...props }, ref) => {
  const { isMobile, descriptionId, registerDescription } = useModalCtx();
  React.useEffect(() => registerDescription(), [registerDescription]);
  const descriptionProps = {
    ...props,
    ref,
    id: id ?? descriptionId,
    ...(className !== undefined && { className }),
  };
  if (isMobile) return <Drawer.Description {...descriptionProps} />;
  return <Dialog.Description {...descriptionProps} />;
});
ModalDescription.displayName = "Modal.Description";

interface ModalCloseProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}
function ModalClose({ asChild, children, className }: ModalCloseProps) {
  const { isMobile } = useModalCtx();
  const Close = isMobile ? Drawer.Close : Dialog.Close;
  return (
    <Close
      {...(asChild !== undefined && { asChild })}
      {...(className !== undefined && { className })}
    >
      {children}
    </Close>
  );
}

function ModalViewContent({
  views: propViews,
  view: explicitView,
}: {
  views?: ViewsRegistry;
  view?: string;
} = {}) {
  const { views: contextViews, view } = useModalCtx();
  const views = propViews ?? contextViews;
  const activeView = explicitView ?? view;
  if (!views)
    throw new Error("Modal.ViewContent requires views on the Modal root");
  const ViewComponent = views[activeView] ?? views.default;
  return ViewComponent ? <ViewComponent /> : null;
}

function ModalAnimatedViewContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const autoHeight = useAutoHeight<HTMLDivElement>();
  return (
    <div
      className="overflow-hidden"
      style={autoHeight.style}
      onTransitionEnd={autoHeight.onTransitionEnd}
      onTransitionCancel={autoHeight.onTransitionCancel}
    >
      <div ref={autoHeight.innerRef} className={cn("flow-root", className)}>
        {children}
      </div>
    </div>
  );
}

function ModalAnimatedView({
  children,
  views,
}: {
  children?: React.ReactNode;
  views?: ViewsRegistry;
}) {
  const { view } = useModalCtx();
  const [displayedView, setDisplayedView] = React.useState(view);
  const [phase, setPhase] = React.useState<"idle" | "exit" | "enter">("idle");
  const pendingRef = React.useRef(view);
  const exitTimerRef = React.useRef<number | null>(null);
  const enterTimerRef = React.useRef<number | null>(null);
  const transitionMs = resolveMotionDurationMs(
    MOTION_VAR_OVERLAY_DURATION,
    MODAL_VIEW_TRANSITION_MS,
  );

  const clearTimers = React.useCallback(() => {
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    if (enterTimerRef.current !== null) {
      window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }
  }, []);

  React.useEffect(() => clearTimers, [clearTimers]);

  React.useEffect(() => {
    pendingRef.current = view;
    if (view !== displayedView && phase === "idle") {
      setPhase("exit");
    }
  }, [view, displayedView, phase]);

  React.useEffect(() => {
    if (phase !== "exit") return;
    exitTimerRef.current = window.setTimeout(() => {
      setDisplayedView(pendingRef.current);
      setPhase("enter");
      exitTimerRef.current = null;
    }, transitionMs);

    return () => {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
    };
  }, [phase, transitionMs]);

  React.useEffect(() => {
    if (phase !== "enter") return;
    enterTimerRef.current = window.setTimeout(() => {
      setPhase("idle");
      enterTimerRef.current = null;
    }, transitionMs);

    return () => {
      if (enterTimerRef.current !== null) {
        window.clearTimeout(enterTimerRef.current);
        enterTimerRef.current = null;
      }
    };
  }, [phase, transitionMs]);

  React.useEffect(() => {
    if (phase === "idle" && pendingRef.current !== displayedView) {
      setPhase("exit");
    }
  }, [phase, displayedView]);

  const renderedContent = children ?? (
    <ModalViewContent
      {...(views !== undefined && { views })}
      view={displayedView}
    />
  );
  const contentWithView =
    React.isValidElement(renderedContent) &&
    renderedContent.type === ModalViewContent
      ? React.cloneElement(
          renderedContent as React.ReactElement<{ view?: string }>,
          { view: displayedView },
        )
      : renderedContent;

  return (
    <div
      className={cn(
        "will-change-[opacity,transform] transition-[opacity,transform] motion-reduce:transition-none",
        phase === "exit" ? "opacity-0 scale-[0.97]" : "opacity-100 scale-100",
      )}
      style={{
        transitionDuration: `var(--theme-motion-overlay-duration, ${transitionMs}ms)`,
        transitionTimingFunction: `var(--theme-motion-ease-standard, ${MODAL_VIEW_TRANSITION_EASE})`,
      }}
    >
      {contentWithView}
    </div>
  );
}

function ModalViewHeader({
  icon,
  title,
  description,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header className={cn("mt-1", className)}>
      {icon}
      <ModalTitle className="mt-2 text-lg font-semibold text-foreground">
        {title}
      </ModalTitle>
      {description ? (
        <ModalDescription className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {description}
        </ModalDescription>
      ) : null}
    </header>
  );
}

function ModalNavButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="outline"
      {...(onClick !== undefined && { onPress: onClick })}
      className={cn(
        "h-11 w-full justify-start border-input bg-muted px-4 text-foreground",
        "data-[hovered]:bg-accent data-[hovered]:border-accent",
        className,
      )}
    >
      {children}
    </Button>
  );
}

function ModalActionButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      {...(onClick !== undefined && { onPress: onClick })}
      className={cn("h-11 w-full", className)}
    >
      {children}
    </Button>
  );
}

const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  Title: ModalTitle,
  Description: ModalDescription,
  Close: ModalClose,
  ViewHeader: ModalViewHeader,
  ViewContent: ModalViewContent,
  AnimatedViewContainer: ModalAnimatedViewContainer,
  AnimatedView: ModalAnimatedView,
  NavButton: ModalNavButton,
  ActionButton: ModalActionButton,
});

export type { ModalBodyProps, ModalContentProps, ViewComponent, ViewsRegistry };
export { Modal, modalSizeVariants, useModal };
