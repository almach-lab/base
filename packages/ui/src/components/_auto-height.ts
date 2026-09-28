import * as React from "react";
import {
  MOTION_EASE_STANDARD,
  MOTION_OVERLAY_DURATION_MS,
  MOTION_VAR_EASE,
  MOTION_VAR_OVERLAY_DURATION,
  motionVar,
  resolveMotionDurationMs,
} from "./_motion.js";

const AUTO_HEIGHT_FALLBACK = "180ms";
const AUTO_HEIGHT_SETTLE_MS = 600;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Tracks the rendered height of an inner node so an outer node can animate
 * to it. The first measurement is applied without a transition so content
 * never grows from zero on mount.
 */
export function useAutoHeight<T extends HTMLElement>(enabled = true) {
  const innerRef = React.useRef<T | null>(null);
  const [height, setHeight] = React.useState<number | null>(null);
  const [ready, setReady] = React.useState(false);
  const [animateNext, setAnimateNext] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);
  const heightRef = React.useRef<number | null>(null);
  const readyRef = React.useRef(false);
  const settleTimerRef = React.useRef<number | null>(null);

  const settle = React.useCallback(() => {
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
    setAnimating(false);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const node = innerRef.current;
    if (!enabled || !node) return;

    const measure = () => {
      const panel = node.closest(
        "[data-dialog-content], [data-slot='drawer-dialog']",
      );
      const panelState = panel?.getAttribute("data-state");
      // Keep the exit size stable. Updating height while the panel is
      // fading would resize it under the zoom.
      if (panelState === "closed" && heightRef.current !== null) return;

      const next = node.offsetHeight;
      // A zero read means layout has not happened yet. Locking it would
      // make the panel grow up from nothing once content appears.
      if (next === 0) return;
      const prev = heightRef.current;
      if (prev === next) return;
      heightRef.current = next;
      setHeight(next);
      if (prev === null || !readyRef.current || panelState === "closed") return;
      setAnimating(true);
      // transitionend never fires for a cancelled transition; settle anyway.
      if (settleTimerRef.current !== null)
        window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = window.setTimeout(settle, AUTO_HEIGHT_SETTLE_MS);
    };

    measure();
    // Hold height snaps until the dialog zoom has finished, so open/close
    // only fades and scales. Later content changes still tween.
    const lockMs = prefersReducedMotion()
      ? 0
      : resolveMotionDurationMs(
          MOTION_VAR_OVERLAY_DURATION,
          MOTION_OVERLAY_DURATION_MS,
        ) + 50;
    const enableTimer = window.setTimeout(() => {
      readyRef.current = !prefersReducedMotion();
      setReady(readyRef.current);
      // The first lock matches the natural height. Arm the tween on the
      // next frame so auto → px does not play as a size change.
      if (readyRef.current) {
        window.requestAnimationFrame(() => setAnimateNext(true));
      }
    }, lockMs);
    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => {
      window.clearTimeout(enableTimer);
      observer.disconnect();
      settle();
    };
  }, [enabled, settle]);

  const onTransitionEnd = React.useCallback(
    (event: React.TransitionEvent<HTMLElement>) => {
      if (
        event.target === event.currentTarget &&
        event.propertyName === "height"
      ) {
        settle();
      }
    },
    [settle],
  );

  const style: React.CSSProperties | undefined =
    enabled && ready && height !== null
      ? {
          height: `${height}px`,
          transitionProperty: animateNext ? "height" : "none",
          transitionDuration: motionVar(
            MOTION_VAR_OVERLAY_DURATION,
            AUTO_HEIGHT_FALLBACK,
          ),
          transitionTimingFunction: motionVar(
            MOTION_VAR_EASE,
            MOTION_EASE_STANDARD,
          ),
        }
      : undefined;

  return {
    innerRef,
    style,
    animating: enabled && animating,
    onTransitionEnd,
    onTransitionCancel: onTransitionEnd,
  };
}
