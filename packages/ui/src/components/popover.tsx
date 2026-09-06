import { cn } from "@almach/utils";
import * as React from "react";
import {
  DialogTrigger as AriaDialogTrigger,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
  composeRenderProps,
  OverlayArrow,
  Pressable,
} from "react-aria-components";
import {
  type OverlayAlign,
  type OverlaySide,
  toOverlayPlacement,
} from "./_placement.js";
import { MOTION_OVERLAY_RAC, MOTION_OVERLAY_RAC_SLIDE } from "./_motion.js";
import { OVERLAY_SURFACE } from "./_styles.js";

/** Marks the trigger so outside-press dismissal can skip it. */
const TRIGGER_ATTR = "data-almach-popover-trigger";

interface PopoverRootProps {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

interface PopoverTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

function PopoverTrigger(_props: PopoverTriggerProps) {
  return null;
}
PopoverTrigger.displayName = "Popover.Trigger";

interface PopoverContentProps extends Omit<
  AriaPopoverProps,
  "children" | "className" | "offset"
> {
  showArrow?: boolean;
  side?: OverlaySide;
  align?: OverlayAlign;
  sideOffset?: number;
  /** Non-modal popovers behave like dropdowns. Modal popovers trap focus with an underlay. */
  isNonModal?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function PopoverContent(_props: PopoverContentProps) {
  return null;
}
PopoverContent.displayName = "Popover.Content";

interface PopoverCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}

/** Supplied by the root so content can dismiss the popover. */
const PopoverCloseCtx = React.createContext<(() => void) | null>(null);

/**
 * Dismisses the popover from inside its content.
 *
 * Used outside a Popover it renders its children inert rather than throwing,
 * so a shared content component can be reused in a non-popover context.
 */
const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
  ({ asChild, children, onClick, ...props }, ref) => {
    const close = React.useContext(PopoverCloseCtx);

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        onClick?: (event: React.MouseEvent<HTMLElement>) => void;
      }>;

      return React.cloneElement(child, {
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(event);
          if (!event.defaultPrevented) close?.();
        },
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) close?.();
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);
PopoverClose.displayName = "Popover.Close";

function getTriggerProps(node: React.ReactNode): PopoverTriggerProps | null {
  if (!React.isValidElement(node)) return null;
  if (node.type !== PopoverTrigger) return null;
  return node.props as PopoverTriggerProps;
}

function getContentProps(node: React.ReactNode): PopoverContentProps | null {
  if (!React.isValidElement(node)) return null;
  if (node.type !== PopoverContent) return null;
  return node.props as PopoverContentProps;
}

/**
 * Closes a non-modal popover when the pointer goes down outside it.
 *
 * React Aria wires outside-press dismissal to `isDismissable`, which it
 * derives as `!isNonModal` — so a non-modal popover never closes on an outside
 * click. Going modal instead would trap focus and lock page scrolling, which
 * is too heavy for a dropdown-style surface, so the dismissal is added here.
 * Presses on the trigger are ignored, since React Aria already toggles there.
 */
function useDismissOnOutsidePress(
  isOpen: boolean,
  popoverRef: React.RefObject<HTMLElement | null>,
  close: () => void,
) {
  React.useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target) return;

      const popover = popoverRef.current;
      if (popover?.contains(target)) return;
      if (target.closest(`[${TRIGGER_ATTR}]`)) return;

      close();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [close, isOpen, popoverRef]);
}

function PopoverRoot({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: PopoverRootProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const popoverRef = React.useRef<HTMLElement | null>(null);

  const isOpen = open ?? internalOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, open],
  );

  const close = React.useCallback(() => setOpen(false), [setOpen]);
  useDismissOnOutsidePress(isOpen, popoverRef, close);

  let triggerProps: PopoverTriggerProps | null = null;
  let contentProps: PopoverContentProps | null = null;

  for (const child of React.Children.toArray(children)) {
    const parsedTrigger = getTriggerProps(child);
    if (parsedTrigger) {
      triggerProps = parsedTrigger;
      continue;
    }

    const parsedContent = getContentProps(child);
    if (parsedContent) {
      contentProps = parsedContent;
    }
  }

  if (!triggerProps || !contentProps) return null;

  const {
    showArrow,
    side,
    align,
    sideOffset,
    isNonModal = true,
    className,
    children: contentChildren,
    ...popoverProps
  } = contentProps;

  const placement = toOverlayPlacement(side, align);
  const offset = sideOffset ?? (showArrow ? 12 : 8);

  const triggerNode = triggerProps.asChild ? (
    <Pressable>
      {
        React.cloneElement(
          React.Children.only(triggerProps.children) as React.ReactElement<
            Record<string, unknown>
          >,
          { [TRIGGER_ATTR]: "" },
        ) as never
      }
    </Pressable>
  ) : (
    <Pressable>
      <button type="button" {...{ [TRIGGER_ATTR]: "" }}>
        {triggerProps.children}
      </button>
    </Pressable>
  );

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
      {triggerNode}
      <AriaPopover
        {...popoverProps}
        ref={popoverRef}
        isNonModal={isNonModal}
        placement={placement}
        offset={offset}
        className={composeRenderProps(className, (nextClassName) =>
          cn(
            OVERLAY_SURFACE,
            "p-4",
            MOTION_OVERLAY_RAC,
            MOTION_OVERLAY_RAC_SLIDE,
            nextClassName,
          ),
        )}
      >
        {showArrow ? (
          <OverlayArrow className="group">
            <svg
              width={12}
              height={12}
              viewBox="0 0 12 12"
              className="block fill-popover stroke-[var(--color-border)] stroke-1 group-placement-bottom:rotate-180 group-placement-left:-rotate-90 group-placement-right:rotate-90"
            >
              <path d="M0 0 L6 6 L12 0" />
            </svg>
          </OverlayArrow>
        ) : null}
        <PopoverCloseCtx.Provider value={close}>
          {contentChildren}
        </PopoverCloseCtx.Provider>
      </AriaPopover>
    </AriaDialogTrigger>
  );
}

interface PopoverComponent {
  (props: PopoverRootProps): React.ReactElement | null;
  Trigger: typeof PopoverTrigger;
  Content: typeof PopoverContent;
  Close: typeof PopoverClose;
  Anchor: React.FC<{ children?: React.ReactNode }>;
}

const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
  Anchor: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}) as PopoverComponent;

export { Popover };
