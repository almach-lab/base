"use client";

import { cn } from "@almach/utils";
import {
  type CSSProperties,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MOTION_EASE_STANDARD } from "./_motion.js";
import { FOCUS_RING, swipeTrackVariants } from "./_styles.js";

const EASE = MOTION_EASE_STANDARD;
const SPRING_SNAP = `width 420ms ${EASE}`;
const SPRING_THUMB = "transform 400ms cubic-bezier(0.34, 1.15, 0.64, 1)";
const SPRING_BACK = `transform 300ms ${EASE}`;
const SPRING_FILL = `width 300ms ${EASE}`;

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

export interface SwipeButtonRootProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSuccess"
> {
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
  /** Reset thumb to start after success. @default true */
  resetOnSuccess?: boolean;
  /** Ms before resetting when resetOnSuccess is true. @default 800 */
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
  handlePointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
  handlePointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  handleBlur: () => void;
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
  resetOnSuccess = true,
  resetDelay = 800,
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

  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const activePointerId = useRef<number | null>(null);
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
    setIsAutoSnapping(true);
    setSucceeded(false);
    hasSucceeded.current = false;
    cancelHold();
    isDragging.current = false;
    setSliderPosition(start);
    positionRef.current = start;
    setFillWidth(calcFillWidth(start, cw, sw, inset, reverseRef.current));
    setProgress(calcProgress(start, max, reverseRef.current));
    setIsSwiping(false);
    window.setTimeout(() => setIsAutoSnapping(false), 420);
  }, [getDimensions, getStart, calcFillWidth, calcProgress, cancelHold]);

  const syncIdleGeometry = useCallback(() => {
    if (isDragging.current || isHolding || succeeded || hasSucceeded.current) {
      return;
    }

    const { cw, sw, inset, max } = measureDimensions();
    if (cw <= 0 || sw <= 0 || max <= 0) return;

    const start = getStart(max);
    setSliderPosition(start);
    positionRef.current = start;
    setFillWidth(calcFillWidth(start, cw, sw, inset, reverseRef.current));
    setContainerWidth(cw);
    setProgress(calcProgress(start, max, reverseRef.current));
    setIsAutoSnapping(false);
  }, [
    isHolding,
    succeeded,
    measureDimensions,
    getStart,
    calcFillWidth,
    calcProgress,
  ]);

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
      syncIdleGeometry();
      return;
    }

    if (typeof ResizeObserver === "undefined") {
      syncIdleGeometry();
      return;
    }

    const ro = new ResizeObserver(() => {
      syncIdleGeometry();
    });
    ro.observe(container);
    ro.observe(slider);

    return () => ro.disconnect();
  }, [syncIdleGeometry]);

  useEffect(() => {
    syncIdleGeometry();
  }, [syncIdleGeometry, reverseSwipe]);

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

  /* ── pointer drag ────────────────────────────────────────────────────── */
  const applyPointerX = useCallback(
    (clientX: number) => {
      if (!isDragging.current) return;

      if (holdTimer.current) {
        startX.current = clientX;
        return;
      }

      const { cw, sw, inset, max } = getDimensions();
      if (max <= 0) return;

      const raw = positionRef.current + (clientX - startX.current);
      startX.current = clientX;
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
            clientX,
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

  const finishDrag = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    activePointerId.current = null;

    if (holdTimer.current) {
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

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled || hasSucceeded.current || !e.isPrimary) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;

      e.preventDefault();
      measureDimensions();
      const { max } = getDimensions();
      if (max <= 0) {
        syncIdleGeometry();
        if (dimsRef.current.max <= 0) return;
      }

      activePointerId.current = e.pointerId;
      e.currentTarget.setPointerCapture(e.pointerId);
      isDragging.current = true;
      setIsSwiping(true);
      startX.current = e.clientX;

      debugLog("start", {
        startX: startX.current,
        ...dimsRef.current,
        position: positionRef.current,
        threshold: thresholdRef.current,
        reverseSwipe: reverseRef.current,
      });
    },
    [disabled, measureDimensions, getDimensions, syncIdleGeometry, debugLog],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (activePointerId.current !== e.pointerId) return;
      applyPointerX(e.clientX);
    },
    [applyPointerX],
  );

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (activePointerId.current !== e.pointerId) return;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      finishDrag();
    },
    [finishDrag],
  );

  /* ── keyboard ────────────────────────────────────────────────────────── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled || hasSucceeded.current) return;
      const { cw, sw, inset, max } = getDimensions();
      if (max <= 0) return;

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (holdRef.current > 0) startHold(max);
        else fireSuccess(max);
        return;
      }

      const STEP = 12;
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
    ],
  );

  /** Commits the keyboard-driven position on blur: succeeds if past
   * threshold, otherwise snaps back and reports failure once — unlike
   * per-keystroke resetting, this lets ArrowRight presses accumulate. */
  const handleBlur = useCallback(() => {
    if (disabled || hasSucceeded.current || !isSwiping) return;
    const { cw, sw, inset, max } = getDimensions();
    if (max <= 0) return;

    if (checkThreshold(positionRef.current, max)) {
      if (holdRef.current === 0) fireSuccess(max);
      return;
    }

    cancelHold();
    onFailRef.current?.();
    const start = getStart(max);
    setSliderPosition(start);
    positionRef.current = start;
    setFillWidth(calcFillWidth(start, cw, sw, inset, reverseRef.current));
    setProgress(calcProgress(start, max, reverseRef.current));
    setIsSwiping(false);
    setIsAutoSnapping(false);
  }, [
    disabled,
    isSwiping,
    getDimensions,
    checkThreshold,
    fireSuccess,
    cancelHold,
    getStart,
    calcFillWidth,
    calcProgress,
  ]);

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
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handleKeyDown,
        handleBlur,
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
        className={cn(
          swipeTrackVariants(),
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
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
        className={cn(
          "absolute inset-y-0 bg-primary/12 -z-10 rounded-full overflow-hidden",
          className,
        )}
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
        className={cn(
          "absolute inset-0 z-10 flex items-center justify-center pointer-events-none rounded-full overflow-hidden",
          "px-12 text-center text-[13px] font-medium text-muted-foreground",
          "transition-opacity duration-200",
          succeeded ? "opacity-0" : "opacity-100",
          className,
        )}
        style={{
          ...(isSwiping ? { clipPath } : {}),
          transform: `translate3d(${offset}px,0,0)`,
          willChange: "transform, opacity",
          transition:
            isSwiping && !isAutoSnapping
              ? "none"
              : `transform 240ms ${EASE}, opacity 200ms`,
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
export interface SwipeButtonOverlayProps extends HTMLAttributes<HTMLDivElement> {}

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
        className={cn(
          "absolute inset-y-0 flex items-center justify-center z-20 rounded-full overflow-hidden",
          "bg-primary text-primary-foreground font-medium",
          "pointer-events-none whitespace-nowrap overflow-hidden",
          className,
        )}
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
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
      handleKeyDown,
      handleBlur,
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={cn(
          "absolute z-30 touch-none rounded-full",
          "flex items-center justify-center",
          "cursor-grab shadow-sm active:cursor-grabbing",
          "transition-[background-color,box-shadow] duration-150",
          FOCUS_RING,
          "will-change-transform",
          "[&>svg:not(.hold-ring)]:size-5 [&>svg:not(.hold-ring)]:pointer-events-none [&>svg:not(.hold-ring)]:shrink-0",
          variantClasses[variant],
          className,
        )}
        style={{
          width: thumbSize,
          height: thumbSize,
          top: "50%",
          left: thumbPad,
          transform: `translate3d(${sliderPosition}px,-50%,0)`,
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
