import { cn } from "@almach/utils";
import { GripVertical } from "lucide-react";
import * as React from "react";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { FOCUS_RING } from "./_styles.js";

type ResizableDirection = "horizontal" | "vertical";

interface ResizableCtxValue {
  direction: ResizableDirection;
  sizes: number[];
  startDrag: (handleIndex: number, event: React.PointerEvent) => void;
  nudge: (handleIndex: number, deltaPercent: number) => void;
  setMinSize: (panelIndex: number, minSize: number) => void;
}

const ResizableCtx = React.createContext<ResizableCtxValue | null>(null);

function useResizableCtx() {
  const ctx = React.useContext(ResizableCtx);
  if (!ctx) throw new Error("Resizable parts must be used within Resizable");
  return ctx;
}

/** Moves `delta` percent from the panel after the handle into the one before. */
function redistribute(
  sizes: number[],
  handleIndex: number,
  delta: number,
  minSizes: number[],
): number[] {
  const before = sizes[handleIndex];
  const after = sizes[handleIndex + 1];
  if (before === undefined || after === undefined) return sizes;

  const minBefore = minSizes[handleIndex] ?? 10;
  const minAfter = minSizes[handleIndex + 1] ?? 10;
  const clamped = Math.max(
    Math.min(delta, after - minAfter),
    -(before - minBefore),
  );

  const next = [...sizes];
  next[handleIndex] = before + clamped;
  next[handleIndex + 1] = after - clamped;
  return next;
}

export interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: ResizableDirection;
  /** Starting sizes as percentages, one per panel. Defaults to an even split. */
  defaultSizes?: number[];
  onSizesChange?: (sizes: number[]) => void;
}

const ResizableRoot = React.forwardRef<HTMLDivElement, ResizableProps>(
  (
    {
      className,
      direction = "horizontal",
      defaultSizes,
      onSizesChange,
      children,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const minSizesRef = React.useRef<number[]>([]);

    const childArray = React.Children.toArray(children);
    const panelCount = childArray.filter(
      (child) => React.isValidElement(child) && child.type === ResizablePanel,
    ).length;

    const [sizes, setSizes] = React.useState<number[]>(
      () =>
        defaultSizes ??
        Array.from({ length: Math.max(panelCount, 1) }, () =>
          panelCount > 0 ? 100 / panelCount : 100,
        ),
    );

    // Re-even the split if the number of panels changes at runtime.
    React.useEffect(() => {
      if (panelCount > 0 && sizes.length !== panelCount) {
        setSizes(Array.from({ length: panelCount }, () => 100 / panelCount));
      }
    }, [panelCount, sizes.length]);

    const sizesRef = React.useRef(sizes);
    React.useEffect(() => {
      sizesRef.current = sizes;
    }, [sizes]);

    const commit = React.useCallback(
      (next: number[]) => {
        setSizes(next);
        onSizesChange?.(next);
      },
      [onSizesChange],
    );

    const setMinSize = React.useCallback(
      (panelIndex: number, minSize: number) => {
        minSizesRef.current[panelIndex] = minSize;
      },
      [],
    );

    const startDrag = React.useCallback(
      (handleIndex: number, event: React.PointerEvent) => {
        const container = containerRef.current;
        if (!container) return;

        event.preventDefault();
        const rect = container.getBoundingClientRect();
        const total = direction === "horizontal" ? rect.width : rect.height;
        if (total === 0) return;

        const origin =
          direction === "horizontal" ? event.clientX : event.clientY;
        const startSizes = [...sizesRef.current];

        const onMove = (moveEvent: PointerEvent) => {
          const position =
            direction === "horizontal" ? moveEvent.clientX : moveEvent.clientY;
          const deltaPercent = ((position - origin) / total) * 100;
          commit(
            redistribute(
              startSizes,
              handleIndex,
              deltaPercent,
              minSizesRef.current,
            ),
          );
        };

        const onUp = () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          document.body.style.removeProperty("user-select");
          document.body.style.removeProperty("cursor");
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        document.body.style.setProperty("user-select", "none");
        document.body.style.setProperty(
          "cursor",
          direction === "horizontal" ? "col-resize" : "row-resize",
        );
      },
      [commit, direction],
    );

    const nudge = React.useCallback(
      (handleIndex: number, deltaPercent: number) => {
        commit(
          redistribute(
            sizesRef.current,
            handleIndex,
            deltaPercent,
            minSizesRef.current,
          ),
        );
      },
      [commit],
    );

    // Panels and handles are indexed here, so callers never pass indices.
    let panelIndex = 0;
    let handleIndex = 0;
    const indexedChildren = childArray.map((child) => {
      if (!React.isValidElement(child)) return child;
      if (child.type === ResizablePanel) {
        return React.cloneElement(
          child as React.ReactElement<{ index?: number }>,
          { index: panelIndex++ },
        );
      }
      if (child.type === ResizableHandle) {
        return React.cloneElement(
          child as React.ReactElement<{ index?: number }>,
          { index: handleIndex++ },
        );
      }
      return child;
    });

    return (
      <ResizableCtx.Provider
        value={{ direction, sizes, startDrag, nudge, setMinSize }}
      >
        <div
          ref={(node) => {
            containerRef.current = node;
            if (typeof ref === "function") {
              ref(node);
              return;
            }
            if (ref) ref.current = node;
          }}
          className={cn(
            "flex w-full overflow-hidden rounded-lg border border-border bg-card",
            direction === "horizontal" ? "flex-row" : "flex-col",
            className,
          )}
          {...props}
        >
          {indexedChildren}
        </div>
      </ResizableCtx.Provider>
    );
  },
);
ResizableRoot.displayName = "Resizable";

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Minimum size as a percentage of the container. */
  minSize?: number;
  /** Injected by `Resizable`. */
  index?: number;
}

const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({ className, minSize = 10, index = 0, style, ...props }, ref) => {
    const { sizes, setMinSize } = useResizableCtx();

    React.useEffect(() => {
      setMinSize(index, minSize);
    }, [index, minSize, setMinSize]);

    const size = sizes[index] ?? 100 / Math.max(sizes.length, 1);

    return (
      <div
        ref={ref}
        className={cn("min-h-0 min-w-0 overflow-auto", className)}
        style={{ flexBasis: `${size}%`, flexGrow: 0, flexShrink: 0, ...style }}
        {...props}
      />
    );
  },
);
ResizablePanel.displayName = "Resizable.Panel";

export interface ResizableHandleProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onPointerDown"
> {
  /** Show the grip affordance. */
  withGrip?: boolean;
  /** Percent moved per arrow-key press. */
  keyboardStep?: number;
  /** Injected by `Resizable`. */
  index?: number;
}

const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  (
    { className, withGrip = false, keyboardStep = 4, index = 0, ...props },
    ref,
  ) => {
    const { direction, startDrag, nudge, sizes } = useResizableCtx();
    const isHorizontal = direction === "horizontal";

    return (
      <div
        ref={ref}
        role="separator"
        tabIndex={0}
        aria-orientation={isHorizontal ? "vertical" : "horizontal"}
        aria-valuenow={Math.round(sizes[index] ?? 0)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Resize panels"
        onPointerDown={(event) => startDrag(index, event)}
        onKeyDown={(event) => {
          const decrease = isHorizontal ? "ArrowLeft" : "ArrowUp";
          const increase = isHorizontal ? "ArrowRight" : "ArrowDown";
          if (event.key === decrease) {
            event.preventDefault();
            nudge(index, -keyboardStep);
          } else if (event.key === increase) {
            event.preventDefault();
            nudge(index, keyboardStep);
          }
        }}
        className={cn(
          "relative flex shrink-0 items-center justify-center bg-border",
          MOTION_INTERACTIVE,
          FOCUS_RING,
          "hover:bg-primary/40",
          // A 1px line with a wider invisible hit area either side.
          isHorizontal
            ? "w-px cursor-col-resize after:absolute after:inset-y-0 after:-left-1 after:w-2"
            : "h-px cursor-row-resize after:absolute after:inset-x-0 after:-top-1 after:h-2",
          className,
        )}
        {...props}
      >
        {withGrip && (
          <span
            aria-hidden="true"
            className={cn(
              "z-10 flex items-center justify-center rounded-sm border border-border bg-background text-muted-foreground",
              isHorizontal ? "h-5 w-3" : "h-3 w-5",
            )}
          >
            <GripVertical
              className={cn("size-2.5", !isHorizontal && "rotate-90")}
            />
          </span>
        )}
      </div>
    );
  },
);
ResizableHandle.displayName = "Resizable.Handle";

const Resizable = Object.assign(ResizableRoot, {
  Panel: ResizablePanel,
  Handle: ResizableHandle,
});

export { Resizable };
