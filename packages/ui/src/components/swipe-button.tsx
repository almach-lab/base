"use client";

import {
  type CSSProperties,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  type TouchEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/* ── Spring curves ──────────────────────────────────────────────────────────── */
const SPRING_SNAP = "width 400ms cubic-bezier(0.34,1.26,0.64,1)";
const SPRING_THUMB = "transform 380ms cubic-bezier(0.34,1.26,0.64,1)";
const SPRING_BACK = "transform 320ms cubic-bezier(0.25,1.0,0.5,1)";
const SPRING_FILL = "width 320ms cubic-bezier(0.25,1.0,0.5,1)";

interface SwipeButtonDimensions {
  cw: number;
  sw: number;
  inset: number;
  max: number;
}

function snapToDevicePixel(v: number): number {
  const dpr =
    typeof window !== "undefined"
      ? Math.max(1, window.devicePixelRatio || 1)
      : 1;
  return Math.round(v * dpr) / dpr;
}

/* ── Types ─────────────────────────────────────────────────────────────────── */
export type SwipeButtonVariant =
  | "default"
  | "destructive"
  | "success"
  | "warning";

export interface SwipeButtonRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSuccess"> {
  /** Fired when swipe (+ optional hold) completes. */
  onSuccess?: () => void;
  /** Fired when the thumb is released without completing. */
  onFail?: () => void;
  disabled?: boolean;
  /** Swipe right-to-left instead of left-to-right. */
  reverseSwipe?: boolean;
  /** Fraction (0–1) of track width required to trigger success. @default 0.85 */
  threshold?: number;
  /**
   * Hold the thumb at the threshold for this many ms before success fires.
   * 0 = instant (no hold required). @default 0
   */
  hold?: number;
  /** Reset thumb to start after success. @default false */
  resetOnSuccess?: boolean;
  /** Ms before resetting when resetOnSuccess is true. @default 1200 */
  resetDelay?: number;
  /** Enables console debug logs and data attributes for swipe geometry. @default false */
  debug?: boolean;
}

/* ── Context ─────────────────────────────────────────────────────────────── */
interface SwipeButtonCtxValue {
  /** True while the user is actively dragging. */
  isSwiping: boolean;
  /** True once threshold reached and (if hold>0) held long enough. */
  succeeded: boolean;
  /** True while holding at threshold, waiting for hold timer. */
  isHolding: boolean;
  /** 0–100 hold-countdown progress (only meaningful when isHolding=true). */
  holdProgress: number;
  /** 0–100 swipe progress. */
  progress: number;
  /** True while thumb/fill are auto-snapping to the end. */
  isAutoSnapping: boolean;
  /** Thumb translateX value (px). */
  sliderPosition: number;
  /** Width of the progress fill / overlay (px). */
  fillWidth: number;
  /** Full container width (px) — used for the success state. */
  containerWidth: number;
  disabled: boolean;
  reverseSwipe: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  sliderRef: RefObject<HTMLDivElement | null>;
  handleDragStart: (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
  ) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
}

const SwipeButtonCtx = createContext<SwipeButtonCtxValue | null>(null);

function useSwipeButtonCtx() {
  const ctx = useContext(SwipeButtonCtx);
  if (!ctx)
    throw new Error("SwipeButton parts must be used inside <SwipeButton>");
  return ctx;
}

/* ── Root ───────────────────────────────────────────────────────────────── */
function SwipeButtonRoot({
  className = "",
  style,
  children,
  onSuccess,
  onFail,
  disabled = false,
  reverseSwipe = false,
  threshold = 0.85,
  hold = 0,
  resetOnSuccess = false,
  resetDelay = 1200,
  debug = false,
  ...props
}: SwipeButtonRootProps) {
  const clampThreshold = useCallback(
    (v: number) => Math.max(0, Math.min(v, 1)),
    [],
  );

  const [isSwiping, setIsSwiping] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [fillWidth, setFillWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAutoSnapping, setIsAutoSnapping] = useState(false);
  const [_layoutVersion, setLayoutVersion] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const positionRef = useRef(0);
  const hasSucceeded = useRef(false);

  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdRaf = useRef<number | null>(null);
  const holdStart = useRef(0);
  const dimsRef = useRef<SwipeButtonDimensions>({
    cw: 0,
    sw: 0,
    inset: 0,
    max: 0,
  });

  /* stable refs for props that change */
  const reverseRef = useRef(reverseSwipe);
  const thresholdRef = useRef(clampThreshold(threshold));
  const holdRef = useRef(hold);
  const onSuccessRef = useRef(onSuccess);
  const onFailRef = useRef(onFail);
  const resetOnRef = useRef(resetOnSuccess);
  const resetDelRef = useRef(resetDelay);
  const debugRef = useRef(debug);
  const lastMoveDebugAt = useRef(0);

  const debugLog = useCallback(
    (event: string, payload?: Record<string, unknown>) => {
      if (!debugRef.current) return;
      console.debug(`[SwipeButton] ${event}`, payload ?? {});
    },
    [],
  );

  useEffect(() => {
    reverseRef.current = reverseSwipe;
    thresholdRef.current = clampThreshold(threshold);
    holdRef.current = hold;
    onSuccessRef.current = onSuccess;
    onFailRef.current = onFail;
    resetOnRef.current = resetOnSuccess;
    resetDelRef.current = resetDelay;
    debugRef.current = debug;
  }, [
    reverseSwipe,
    threshold,
    hold,
    onSuccess,
    onFail,
    resetOnSuccess,
    resetDelay,
    debug,
    clampThreshold,
  ]);

  /* cleanup on unmount */
  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      if (holdTimer.current) {
        clearTimeout(holdTimer.current);
        holdTimer.current = null;
      }
      if (holdRaf.current) {
        cancelAnimationFrame(holdRaf.current);
        holdRaf.current = null;
      }
    },
    [],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── helpers ─────────────────────────────────────────────────────────── */
  const measureDimensions = useCallback((): SwipeButtonDimensions => {
    const cw = containerRef.current?.offsetWidth ?? 0;
    const sw = sliderRef.current?.offsetWidth ?? 0;
    const inset = sliderRef.current?.offsetLeft ?? 0;
    // Use one consistent geometry model:
    // - start keeps left inset
    // - end reaches right edge
    const max = Math.max(0, cw - sw - inset);
    const next = { cw, sw, inset, max };
    dimsRef.current = next;
    return next;
  }, []);

  const getDimensions = useCallback((): SwipeButtonDimensions => {
    const current = dimsRef.current;
    if (current.cw === 0 || current.sw === 0) return measureDimensions();
    return current;
  }, [measureDimensions]);

  const clamp = useCallback(
    (v: number, max: number) =>
      snapToDevicePixel(Math.max(0, Math.min(v, max))),
    [],
  );

  const calcProgress = useCallback((pos: number, max: number, rev: boolean) => {
    if (max === 0) return 0;
    return rev ? ((max - pos) / max) * 100 : (pos / max) * 100;
  }, []);

  const calcFillWidth = useCallback(
    (pos: number, cw: number, sw: number, inset: number, rev: boolean) => {
      const raw = rev ? cw - (pos + inset) : pos + inset + sw;
      return snapToDevicePixel(Math.max(0, Math.min(cw, raw)));
    },
    [],
  );

  const getStart = useCallback(
    (max: number) => (reverseRef.current ? max : 0),
    [],
  );

  /* ── cancel hold countdown ───────────────────────────────────────────── */
  const cancelHold = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (holdRaf.current) {
      cancelAnimationFrame(holdRaf.current);
      holdRaf.current = null;
    }
    holdStart.current = 0;
    setIsHolding(false);
    setHoldProgress(0);
  }, []);

  /* ── reset to start ──────────────────────────────────────────────────── */
  const resetToStart = useCallback(() => {
    const { cw, sw, inset, max } = getDimensions();
    const start = getStart(max);
    setSliderPosition(start);
    positionRef.current = start;
    setFillWidth(calcFillWidth(start, cw, sw, inset, reverseRef.current));
    setProgress(calcProgress(start, max, reverseRef.current));
    setIsSwiping(false);
    setIsAutoSnapping(false);
    setSucceeded(false);
    cancelHold();
    hasSucceeded.current = false;
  }, [getDimensions, getStart, calcFillWidth, calcProgress, cancelHold]);

  /* ── init on mount / direction change ───────────────────────────────── */
  useEffect(() => {
    const { cw, sw, inset, max } = measureDimensions();
    const start = getStart(max);
    setSliderPosition(start);
    positionRef.current = start;
    setFillWidth(calcFillWidth(start, cw, sw, inset, reverseSwipe));
    setContainerWidth(containerRef.current?.offsetWidth ?? 0);
    setProgress(calcProgress(start, max, reverseSwipe));
    setIsAutoSnapping(false);
    hasSucceeded.current = false;
    debugLog("init", {
      cw,
      sw,
      inset,
      max,
      start,
      reverseSwipe,
      threshold: thresholdRef.current,
    });
  }, [
    reverseSwipe,
    getStart,
    calcFillWidth,
    calcProgress,
    debugLog,
    measureDimensions,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    const slider = sliderRef.current;
    if (!container || !slider) {
      measureDimensions();
      return;
    }

    if (typeof ResizeObserver === "undefined") {
      measureDimensions();
      return;
    }

    const ro = new ResizeObserver(() => {
      measureDimensions();
      setLayoutVersion((v) => v + 1);
    });
    ro.observe(container);
    ro.observe(slider);

    return () => ro.disconnect();
  }, [measureDimensions]);

  useEffect(() => {
    // Keep preview/demo environments stable: if size is resolved after mount,
    // re-sync the idle geometry so thumb/fill are not stuck at a collapsed width.
    if (
      isDragging.current ||
      isSwiping ||
      isHolding ||
      succeeded ||
      hasSucceeded.current
    ) {
      return;
    }

    const { cw, sw, inset, max } = getDimensions();
    if (cw <= 0 || sw <= 0) return;

    const start = getStart(max);
    setSliderPosition(start);
    positionRef.current = start;
    setFillWidth(calcFillWidth(start, cw, sw, inset, reverseRef.current));
    setContainerWidth(cw);
    setProgress(calcProgress(start, max, reverseRef.current));
  }, [
    isSwiping,
    isHolding,
    succeeded,
    getDimensions,
    getStart,
    calcFillWidth,
    calcProgress,
  ]);

  /* ── fire success ────────────────────────────────────────────────────── */
  const fireSuccess = useCallback(
    (max: number) => {
      cancelHold();
      const { cw, sw, inset } = getDimensions();
      const end = reverseRef.current ? 0 : max;
      const fill = resetOnRef.current
        ? calcFillWidth(end, cw, sw, inset, reverseRef.current)
        : cw;
      setSliderPosition(end);
      positionRef.current = end;
      setContainerWidth(cw);
      setFillWidth(fill);
      setProgress(100);
      setIsAutoSnapping(false);
      setSucceeded(true);
      hasSucceeded.current = true;
      isDragging.current = false;
      debugLog("success", {
        max,
        end,
        cw,
        sw,
        inset,
        fillWidth: fill,
      });
      onSuccessRef.current?.();

      if (resetOnRef.current) {
        if (resetTimer.current) clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(
          () => resetToStart(),
          resetDelRef.current,
        );
      }
    },
    [cancelHold, getDimensions, calcFillWidth, resetToStart, debugLog],
  );

  /* ── start hold countdown ────────────────────────────────────────────── */
  const startHold = useCallback(
    (max: number) => {
      if (holdTimer.current) return; // already counting

      // Once hold starts, snap to the end so the control looks fully complete
      // while waiting for the hold timer to finish.
      const { cw, sw, inset } = getDimensions();
      const end = reverseRef.current ? 0 : max;
      const fill = resetOnRef.current
        ? calcFillWidth(end, cw, sw, inset, reverseRef.current)
        : cw;
      setIsAutoSnapping(true);
      setSliderPosition(end);
      positionRef.current = end;
      setFillWidth(fill);
      setProgress(100);

      setIsHolding(true);
      holdStart.current = performance.now();
      debugLog("hold-start", { max, end, cw });

      const tick = (now: number) => {
        const elapsed = now - holdStart.current;
        const prog = Math.min((elapsed / holdRef.current) * 100, 100);
        setHoldProgress(prog);
        if (prog < 100) {
          holdRaf.current = requestAnimationFrame(tick);
        }
      };
      holdRaf.current = requestAnimationFrame(tick);

      holdTimer.current = setTimeout(() => {
        holdTimer.current = null;
        fireSuccess(max);
      }, holdRef.current);
    },
    [fireSuccess, getDimensions, calcFillWidth, debugLog],
  );

  /* ── check threshold ─────────────────────────────────────────────────── */
  const checkThreshold = useCallback((pos: number, max: number): boolean => {
    const thresh = max * thresholdRef.current;
    return reverseRef.current ? pos <= max - thresh : pos >= thresh;
  }, []);

  /* ── drag move ───────────────────────────────────────────────────────── */
  const handleDragging = useCallback(
    (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
      if (!isDragging.current) return;
      const cx = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;

      // Once hold has started, keep thumb/fill pinned at the end to avoid
      // micro-jitter while the user is still touching/moving.
      if (holdTimer.current) {
        startX.current = cx;
        return;
      }

      const { cw, sw, inset, max } = getDimensions();

      const raw = positionRef.current + (cx - startX.current);
      startX.current = cx;
      const next = clamp(raw, max);
      setSliderPosition(next);
      positionRef.current = next;

      const fill = calcFillWidth(next, cw, sw, inset, reverseRef.current);
      const nextProgress = calcProgress(next, max, reverseRef.current);
      setFillWidth(fill);
      setProgress(nextProgress);

      if (debugRef.current) {
        const now = performance.now();
        if (now - lastMoveDebugAt.current > 80) {
          lastMoveDebugAt.current = now;
          debugLog("move", {
            cx,
            next,
            max,
            cw,
            sw,
            inset,
            fill,
            progress: nextProgress,
            reverseSwipe: reverseRef.current,
          });
        }
      }

      if (checkThreshold(next, max)) {
        if (holdRef.current > 0) {
          startHold(max);
        } else {
          fireSuccess(max);
        }
      } else {
        // dropped below threshold — cancel any in-progress hold
        cancelHold();
      }
    },
    [
      getDimensions,
      clamp,
      calcFillWidth,
      calcProgress,
      debugLog,
      checkThreshold,
      startHold,
      fireSuccess,
      cancelHold,
    ],
  );

  /* ── drag end ────────────────────────────────────────────────────────── */
  const handleDragEnd = useCallback(() => {
    // always clean up listeners first
    window.removeEventListener("mousemove", handleDragging);
    window.removeEventListener("touchmove", handleDragging);
    window.removeEventListener("mouseup", handleDragEnd);
    window.removeEventListener("touchend", handleDragEnd);
    window.removeEventListener("touchcancel", handleDragEnd);

    if (!isDragging.current) return; // success already fired mid-drag
    isDragging.current = false;

    // if hold was in progress, user released too early — cancel and fail
    if (isHolding || holdTimer.current) {
      cancelHold();
      setIsAutoSnapping(false);
      onFailRef.current?.();
      resetToStart();
      return;
    }

    const { sw, max } = getDimensions();
    debugLog("end", {
      position: positionRef.current,
      max,
      threshold: thresholdRef.current,
      reverseSwipe: reverseRef.current,
      hold: holdRef.current,
      succeeded: hasSucceeded.current,
    });

    // instant-mode (no hold): check threshold at release
    if (!hasSucceeded.current) {
      if (checkThreshold(positionRef.current, max) && holdRef.current === 0) {
        fireSuccess(max);
      } else {
        onFailRef.current?.();
        const start = getStart(max);
        setSliderPosition(start);
        positionRef.current = start;
        setFillWidth(
          calcFillWidth(
            start,
            containerRef.current?.offsetWidth ?? 0,
            sw,
            sliderRef.current?.offsetLeft ?? 0,
            reverseRef.current,
          ),
        );
        setProgress(calcProgress(start, max, reverseRef.current));
        setIsSwiping(false);
        setIsAutoSnapping(false);
      }
    }
  }, [
    handleDragging,
    isHolding,
    cancelHold,
    resetToStart,
    getDimensions,
    checkThreshold,
    fireSuccess,
    getStart,
    calcFillWidth,
    calcProgress,
    debugLog,
  ]);

  /* ── drag start ──────────────────────────────────────────────────────── */
  const handleDragStart = useCallback(
    (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
      if (disabled || hasSucceeded.current) return;
      isDragging.current = true;
      setIsSwiping(true);
      startX.current =
        "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;

      const { cw, sw, inset, max } = measureDimensions();
      debugLog("start", {
        startX: startX.current,
        cw,
        sw,
        inset,
        max,
        position: positionRef.current,
        threshold: thresholdRef.current,
        reverseSwipe: reverseRef.current,
      });

      window.addEventListener("mousemove", handleDragging);
      window.addEventListener("touchmove", handleDragging, { passive: true });
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchend", handleDragEnd);
      window.addEventListener("touchcancel", handleDragEnd);
    },
    [disabled, measureDimensions, debugLog, handleDragging, handleDragEnd],
  );

  /* ── keyboard ────────────────────────────────────────────────────────── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled || hasSucceeded.current) return;
      const STEP = 12;
      const { cw, sw, inset, max } = getDimensions();
      let next = positionRef.current;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") next += STEP;
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next -= STEP;
      else return;
      e.preventDefault();

      next = clamp(next, max);
      setSliderPosition(next);
      positionRef.current = next;
      const fill = calcFillWidth(next, cw, sw, inset, reverseRef.current);
      setFillWidth(fill);
      setIsSwiping(true);
      setProgress(calcProgress(next, max, reverseRef.current));

      if (checkThreshold(next, max)) {
        if (holdRef.current > 0) startHold(max);
        else fireSuccess(max);
      } else {
        cancelHold();
        setTimeout(handleDragEnd, 0);
      }
    },
    [
      disabled,
      getDimensions,
      clamp,
      calcFillWidth,
      calcProgress,
      checkThreshold,
      startHold,
      fireSuccess,
      cancelHold,
      handleDragEnd,
    ],
  );

  /* ── global listener cleanup ─────────────────────────────────────────── */
  useEffect(
    () => () => {
      window.removeEventListener("mousemove", handleDragging);
      window.removeEventListener("touchmove", handleDragging);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchend", handleDragEnd);
      window.removeEventListener("touchcancel", handleDragEnd);
    },
    [handleDragging, handleDragEnd],
  );

  const debugDimensions = debug ? getDimensions() : null;

  return (
    <SwipeButtonCtx.Provider
      value={{
        isSwiping,
        succeeded,
        isHolding,
        holdProgress,
        sliderPosition,
        fillWidth,
        containerWidth,
        progress,
        isAutoSnapping,
        disabled,
        reverseSwipe,
        containerRef,
        sliderRef,
        handleDragStart,
        handleKeyDown,
      }}
    >
      <div
        ref={containerRef}
        {...(debug
          ? {
              "data-debug": true,
              "data-slider": Math.round(sliderPosition),
              "data-fill": Math.round(fillWidth),
              "data-max": Math.round(debugDimensions?.max ?? 0),
            }
          : {})}
        data-disabled={disabled || undefined}
        data-swiping={isSwiping || undefined}
        data-succeeded={succeeded || undefined}
        data-holding={isHolding || undefined}
        data-reverse={reverseSwipe || undefined}
        data-progress={Math.round(progress)}
        className={[
          "relative isolate flex items-center w-full h-[52px]",
          "rounded-full overflow-hidden select-none touch-none",
          "bg-secondary border border-border/40",
          "font-sans text-[13px] text-muted-foreground",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-default",
          className,
        ].join(" ")}
        style={style}
        {...props}
      >
        {children}
      </div>
    </SwipeButtonCtx.Provider>
  );
}
SwipeButtonRoot.displayName = "SwipeButton";

/* ── Fill ───────────────────────────────────────────────────────────────── */
const Fill = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", style, ...props }, ref) => {
    const { fillWidth, isSwiping, isAutoSnapping, succeeded, reverseSwipe } =
      useSwipeButtonCtx();
    const showFill = isSwiping || succeeded;

    const posStyle: CSSProperties = reverseSwipe
      ? { right: 0, left: "auto", width: fillWidth }
      : { left: 0, width: fillWidth };

    return (
      <div
        ref={ref}
        aria-hidden
        className={[
          "absolute inset-y-0 bg-primary/15 -z-10 rounded-full overflow-hidden",
          className,
        ].join(" ")}
        style={{
          ...posStyle,
          transform: "translate3d(0,0,0)",
          willChange: "width",
          opacity: showFill ? 1 : 0,
          transition: succeeded
            ? `${SPRING_SNAP}, opacity 180ms ease`
            : isSwiping && !isAutoSnapping
              ? "none"
              : `${SPRING_FILL}, opacity 180ms ease`,
          ...style,
        }}
        {...props}
      />
    );
  },
);
Fill.displayName = "SwipeButton.Fill";

/* ── Track ──────────────────────────────────────────────────────────────── */
const Track = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", style, children, ...props }, ref) => {
    const {
      isSwiping,
      isAutoSnapping,
      succeeded,
      progress,
      reverseSwipe,
      sliderPosition,
      containerRef,
      sliderRef,
    } = useSwipeButtonCtx();
    const offset = Math.round((progress / 100) * 24 * (reverseSwipe ? 1 : -1));
    const cw = containerRef.current?.offsetWidth ?? 0;
    const sw = sliderRef.current?.offsetWidth ?? 0;
    const inset = sliderRef.current?.offsetLeft ?? 0;
    const thumbLeft = snapToDevicePixel(sliderPosition + inset);
    const thumbRight = snapToDevicePixel(thumbLeft + sw);

    const clipPath = reverseSwipe
      ? `inset(0 0 0 ${Math.max(0, thumbRight)}px)`
      : `inset(0 ${Math.max(0, snapToDevicePixel(cw - thumbLeft))}px 0 0)`;

    return (
      <div
        ref={ref}
        aria-hidden
        className={[
          "absolute inset-0 flex items-center pointer-events-none z-40 rounded-full overflow-hidden",
          "text-foreground font-medium [text-shadow:0_1px_1px_rgba(0,0,0,0.35)]",
          "transition-opacity duration-150",
          succeeded ? "opacity-0" : "opacity-100",
          className,
        ].join(" ")}
        style={{
          ...(isSwiping ? { clipPath } : {}),
          transform: `translate3d(${offset}px,0,0)`,
          willChange: "transform, opacity",
          transition:
            isSwiping && !isAutoSnapping
              ? "none"
              : "transform 260ms cubic-bezier(0.25,1.0,0.5,1), opacity 150ms",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Track.displayName = "SwipeButton.Track";

/* ── Overlay ────────────────────────────────────────────────────────────── */
export interface SwipeButtonOverlayProps
  extends HTMLAttributes<HTMLDivElement> {}

const Overlay = forwardRef<HTMLDivElement, SwipeButtonOverlayProps>(
  ({ className = "", style, children, ...props }, ref) => {
    const { fillWidth, containerWidth, isSwiping, succeeded, reverseSwipe } =
      useSwipeButtonCtx();

    // Only mount the overlay element while the user is actively swiping or done.
    if (!isSwiping && !succeeded) return null;

    const posStyle: CSSProperties = reverseSwipe
      ? { right: 0, left: "auto", width: fillWidth }
      : { left: 0, width: fillWidth };

    return (
      <div
        ref={ref}
        aria-hidden={!succeeded}
        className={[
          // z-20 — sits ABOVE the thumb (z-10) once fully expanded on success
          "absolute inset-y-0 flex items-center justify-center z-20 rounded-full overflow-hidden",
          "bg-primary text-primary-foreground font-medium",
          "pointer-events-none whitespace-nowrap overflow-hidden",
          className,
        ].join(" ")}
        style={{
          ...posStyle,
          transition: succeeded ? SPRING_SNAP : "none",
          ...(succeeded ? { width: containerWidth } : {}),
          ...style,
        }}
        {...props}
      >
        {/* Content only reveals AFTER success — invisible during drag */}
        <span
          className="flex items-center gap-1.5"
          style={{
            opacity: succeeded ? 1 : 0,
            transition: succeeded ? "opacity 200ms ease 280ms" : "none",
          }}
        >
          {children}
        </span>
      </div>
    );
  },
);
Overlay.displayName = "SwipeButton.Overlay";

/* ── Thumb ──────────────────────────────────────────────────────────────── */
const variantClasses: Record<SwipeButtonVariant, string> = {
  default: "bg-background text-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
};

export interface SwipeButtonThumbProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SwipeButtonVariant;
  thumbSize?: number;
  thumbPad?: number;
}

const CIRCUMFERENCE = 2 * Math.PI * 17; // r=17, inside a 40×40 viewBox

const Thumb = forwardRef<HTMLDivElement, SwipeButtonThumbProps>(
  (
    {
      className = "",
      style,
      children,
      variant = "default",
      thumbSize = 44,
      thumbPad = 4,
      ...props
    },
    _ref,
  ) => {
    const {
      sliderPosition,
      isSwiping,
      isAutoSnapping,
      succeeded,
      isHolding,
      holdProgress,
      handleDragStart,
      handleKeyDown,
      sliderRef,
      progress,
    } = useSwipeButtonCtx();

    return (
      <div
        ref={sliderRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label="Swipe to confirm"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onKeyDown={handleKeyDown}
        className={[
          "absolute inset-y-0 my-auto rounded-full z-30",
          "flex items-center justify-center",
          "cursor-grab active:cursor-grabbing",
          "shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.06)]",
          "will-change-transform outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "[&>svg:not(.hold-ring)]:size-5 [&>svg:not(.hold-ring)]:pointer-events-none [&>svg:not(.hold-ring)]:shrink-0",
          variantClasses[variant],
          className,
        ].join(" ")}
        style={{
          width: thumbSize,
          height: thumbSize,
          top: thumbPad,
          bottom: thumbPad,
          left: thumbPad,
          transform: `translate3d(${sliderPosition}px,0,0)`,
          willChange: "transform",
          transition:
            succeeded || isAutoSnapping
              ? SPRING_THUMB
              : isSwiping
                ? "none"
                : SPRING_BACK,
          ...style,
        }}
        {...props}
      >
        {children}

        {/* Hold ring — only rendered while hold countdown is active */}
        {isHolding && (
          <svg
            className="hold-ring absolute inset-0 size-full -rotate-90 pointer-events-none"
            viewBox={`0 0 ${thumbSize} ${thumbSize}`}
          >
            {/* track */}
            <circle
              cx={thumbSize / 2}
              cy={thumbSize / 2}
              r={thumbSize / 2 - 3}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeOpacity="0.2"
            />
            {/* progress arc */}
            <circle
              cx={thumbSize / 2}
              cy={thumbSize / 2}
              r={thumbSize / 2 - 3}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - holdProgress / 100)}
            />
          </svg>
        )}
      </div>
    );
  },
);
Thumb.displayName = "SwipeButton.Thumb";

/* ── Progress accessor ──────────────────────────────────────────────────── */
interface SwipeButtonProgressProps {
  children: (progress: number) => ReactNode;
}
function Progress({ children }: SwipeButtonProgressProps) {
  const { progress } = useSwipeButtonCtx();
  return <>{children(progress)}</>;
}
Progress.displayName = "SwipeButton.Progress";

/* ── Compound export ────────────────────────────────────────────────────── */
export const SwipeButton = Object.assign(SwipeButtonRoot, {
  Fill,
  Track,
  Overlay,
  Thumb,
  Progress,
});
