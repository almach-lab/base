"use client";

import * as React from "react";
import { cn } from "@almach/utils";

/* ── Constants ─────────────────────────────────────────────────────────────── */
const SPRING = "transform 300ms cubic-bezier(0.32,0.72,0,1)";

/* ── Types ─────────────────────────────────────────────────────────────────── */
export type SwipeSide          = "left" | "right" | "top" | "bottom" | null;
export type SwipeActionVariant = "default" | "destructive" | "success" | "warning" | "secondary";

/* ── Slot orientation ─────────────────────────────────────────────────────── */
const SlotCtx = React.createContext<"horizontal" | "vertical">("vertical");

/* ── Internal context ─────────────────────────────────────────────────────── */
interface SwipeCtxValue {
	// Reactive state
	openSide:       SwipeSide;
	dragSide:       SwipeSide;
	pastThreshold:  boolean;
	fullSwipeReady: boolean;
	disabled:       boolean;
	// Config
	threshold:          number;
	overscroll:         number;
	fullSwipe:          boolean;
	fullSwipeThreshold: number;
	// Refs
	contentRef: React.RefObject<HTMLDivElement | null>;
	rootRef:    React.RefObject<HTMLDivElement | null>;
	leftRef:    React.RefObject<HTMLDivElement | null>;
	rightRef:   React.RefObject<HTMLDivElement | null>;
	topRef:     React.RefObject<HTMLDivElement | null>;
	bottomRef:  React.RefObject<HTMLDivElement | null>;
	posRef:     React.RefObject<{ x: number; y: number }>;
	touchAction: string;
	// Actions
	setDragState:    (side: SwipeSide, past: boolean, fsReady?: boolean) => void;
	applyTransform:  (x: number, y: number, animate?: boolean) => void;
	open:            (side: NonNullable<SwipeSide>) => void;
	close:           () => void;
	triggerFullSwipe:(side: NonNullable<SwipeSide>) => void;
}

const SwipeCtx = React.createContext<SwipeCtxValue | null>(null);

function useSwipeCtx() {
	const ctx = React.useContext(SwipeCtx);
	if (!ctx) throw new Error("Must be used inside <SwipeActions>");
	return ctx;
}

/** Programmatic open/close from any child of <SwipeActions> */
export function useSwipeActions() {
	const { openSide, open, close } = useSwipeCtx();
	return { openSide, open, close };
}

/* ── Root ─────────────────────────────────────────────────────────────────── */
export interface SwipeActionsProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Disable all swipe interactions. @default false */
	disabled?: boolean;
	/** Called when the revealed side changes (null = closed). */
	onOpenChange?: (side: SwipeSide) => void;
	/**
	 * Fraction of slot size the user must drag past to snap open (0–1).
	 * @default 0.4
	 */
	threshold?: number;
	/**
	 * Rubber-band resistance factor applied when dragging past the slot edge (0–1).
	 * Lower = more resistance. Use 0 to fully block overscroll.
	 * @default 0.15
	 */
	overscroll?: number;
	/**
	 * Allow a single decisive full-width swipe to immediately fire the primary
	 * action (first button) for that direction — no need to reveal then tap.
	 * Ideal for "swipe to dismiss" / "swipe to pay" patterns.
	 * @default false
	 */
	fullSwipe?: boolean;
	/**
	 * Fraction of the container width the user must drag to trigger a full swipe (0–1).
	 * Only used when `fullSwipe` is true.
	 * @default 0.55
	 */
	fullSwipeThreshold?: number;
	/** Called when a full-swipe gesture fires. Receives the triggered side. */
	onFullSwipe?: (side: NonNullable<SwipeSide>) => void;
}

function SwipeActionsRoot({
	className,
	children,
	disabled          = false,
	onOpenChange,
	threshold         = 0.4,
	overscroll        = 0.15,
	fullSwipe         = false,
	fullSwipeThreshold = 0.55,
	onFullSwipe,
	...props
}: SwipeActionsProps) {
	const [openSide,       setOpenSide]       = React.useState<SwipeSide>(null);
	const [dragSide,       setDragSide]       = React.useState<SwipeSide>(null);
	const [pastThreshold,  setPastThreshold]  = React.useState(false);
	const [fullSwipeReady, setFullSwipeReady] = React.useState(false);
	const [touchAction,    setTouchAction]    = React.useState("none");

	const contentRef = React.useRef<HTMLDivElement>(null);
	const rootRef    = React.useRef<HTMLDivElement>(null);
	const leftRef    = React.useRef<HTMLDivElement>(null);
	const rightRef   = React.useRef<HTMLDivElement>(null);
	const topRef     = React.useRef<HTMLDivElement>(null);
	const bottomRef  = React.useRef<HTMLDivElement>(null);
	const posRef     = React.useRef({ x: 0, y: 0 });
	const timerRef   = React.useRef<ReturnType<typeof setTimeout>>();

	React.useEffect(() => () => clearTimeout(timerRef.current), []);

	React.useLayoutEffect(() => {
		const hasH = (leftRef.current?.offsetWidth   ?? 0) > 0 || (rightRef.current?.offsetWidth   ?? 0) > 0;
		const hasV = (topRef.current?.offsetHeight   ?? 0) > 0 || (bottomRef.current?.offsetHeight ?? 0) > 0;
		if      (hasH && hasV) setTouchAction("none");
		else if (hasH)         setTouchAction("pan-y");
		else if (hasV)         setTouchAction("pan-x");
		else                   setTouchAction("auto");
	}, []);

	const applyTransform = React.useCallback((x: number, y: number, animate = false) => {
		const el = contentRef.current;
		if (!el) return;
		posRef.current = { x, y };
		el.style.transition = animate ? SPRING : "none";
		el.style.transform  = `translate(${x}px,${y}px)`;
	}, []);

	const setDragState = React.useCallback((side: SwipeSide, past: boolean, fsReady = false) => {
		setDragSide(side);
		setPastThreshold(past);
		setFullSwipeReady(fsReady);
	}, []);

	const open = React.useCallback(
		(side: NonNullable<SwipeSide>) => {
			if (disabled) return;
			let dx = 0, dy = 0;
			if (side === "left")   dx =  leftRef.current?.offsetWidth    ?? 0;
			if (side === "right")  dx = -(rightRef.current?.offsetWidth   ?? 0);
			if (side === "top")    dy =  topRef.current?.offsetHeight     ?? 0;
			if (side === "bottom") dy = -(bottomRef.current?.offsetHeight ?? 0);
			if (!dx && !dy) return;
			applyTransform(dx, dy, true);
			setOpenSide(side);
			setDragSide(null);
			setPastThreshold(false);
			setFullSwipeReady(false);
			onOpenChange?.(side);
		},
		[disabled, applyTransform, onOpenChange],
	);

	const close = React.useCallback(() => {
		applyTransform(0, 0, true);
		setOpenSide(null);
		setDragSide(null);
		setPastThreshold(false);
		setFullSwipeReady(false);
		onOpenChange?.(null);
	}, [applyTransform, onOpenChange]);

	const triggerFullSwipe = React.useCallback(
		(side: NonNullable<SwipeSide>) => {
			clearTimeout(timerRef.current);
			const w = rootRef.current?.offsetWidth  ?? 0;
			const h = rootRef.current?.offsetHeight ?? 0;
			const dx = side === "left" ? w : side === "right" ? -w : 0;
			const dy = side === "top"  ? h : side === "bottom" ? -h : 0;
			applyTransform(dx, dy, true);          // fly content off-screen
			onFullSwipe?.(side);                   // notify parent immediately
			timerRef.current = setTimeout(close, 310); // snap back after animation
		},
		[applyTransform, close, onFullSwipe],
	);

	return (
		<SwipeCtx.Provider value={{
			openSide, dragSide, pastThreshold, fullSwipeReady, disabled,
			threshold, overscroll, fullSwipe, fullSwipeThreshold,
			contentRef, rootRef, leftRef, rightRef, topRef, bottomRef,
			posRef, touchAction,
			setDragState, applyTransform, open, close, triggerFullSwipe,
		}}>
			<div
				ref={rootRef}
				data-swipe-open={openSide ?? undefined}
				className={cn("relative overflow-hidden", className)}
				{...props}
			>
				{children}
			</div>
		</SwipeCtx.Provider>
	);
}

/* ── Content ──────────────────────────────────────────────────────────────── */
const AXIS_LOCK = 5; // px before axis is committed

function SwipeActionsContent({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const {
		contentRef, rootRef, leftRef, rightRef, topRef, bottomRef,
		touchAction, posRef, disabled, openSide,
		threshold, overscroll, fullSwipe, fullSwipeThreshold,
		setDragState, applyTransform, open, close, triggerFullSwipe,
	} = useSwipeCtx();

	const drag = React.useRef({
		active:  false,
		startX:  0, startY:  0,
		originX: 0, originY: 0,
		moved:   false,
		axis:    null as "x" | "y" | null,
	});

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (disabled) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		// Freeze spring at its current JS-tracked position (posRef is always accurate)
		applyTransform(posRef.current.x, posRef.current.y, false);
		drag.current = {
			active:  true,
			startX:  e.clientX, startY:  e.clientY,
			originX: posRef.current.x, originY: posRef.current.y,
			moved:   false,
			axis:    null,
		};
	};

	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!drag.current.active) return;
		const dx = e.clientX - drag.current.startX;
		const dy = e.clientY - drag.current.startY;

		if (!drag.current.axis) {
			if (Math.max(Math.abs(dx), Math.abs(dy)) < AXIS_LOCK) return;
			const hasH = (leftRef.current?.offsetWidth  ?? 0) > 0 || (rightRef.current?.offsetWidth  ?? 0) > 0;
			const hasV = (topRef.current?.offsetHeight  ?? 0) > 0 || (bottomRef.current?.offsetHeight ?? 0) > 0;
			const wantsX = Math.abs(dx) >= Math.abs(dy);
			if      (wantsX && hasH)  drag.current.axis = "x";
			else if (!wantsX && hasV) drag.current.axis = "y";
			else return;
			drag.current.moved = true;
		}

		if (drag.current.axis === "x") {
			const raw = drag.current.originX + dx;
			const lw  = leftRef.current?.offsetWidth  ?? 0;
			const rw  = rightRef.current?.offsetWidth ?? 0;
			const cw  = rootRef.current?.offsetWidth  ?? 0;

			// Resistance: when fullSwipe is on, allow free movement up to the
			// full-swipe trigger point; clamp + rubber-band only beyond that.
			let x = raw;
			if (raw > 0) {
				const limit = lw > 0 ? (fullSwipe ? cw * fullSwipeThreshold : lw) : 0;
				if      (lw === 0)     x = raw * overscroll;
				else if (raw > limit)  x = limit + (raw - limit) * overscroll;
			} else if (raw < 0) {
				const limit = rw > 0 ? (fullSwipe ? cw * fullSwipeThreshold : rw) : 0;
				if      (rw === 0)     x = raw * overscroll;
				else if (-raw > limit) x = -(limit + (-raw - limit) * overscroll);
			}
			applyTransform(x, 0, false);

			const side   = raw > 0 ? "left" : raw < 0 ? "right" : null;
			const slotW  = side === "left" ? lw : rw;
			const past   = slotW > 0 && Math.abs(raw) >= slotW * threshold;
			const fsReady = fullSwipe && cw > 0 && Math.abs(raw) >= cw * fullSwipeThreshold;
			setDragState(side, past, fsReady);
		} else {
			const raw = drag.current.originY + dy;
			const th  = topRef.current?.offsetHeight    ?? 0;
			const bh  = bottomRef.current?.offsetHeight ?? 0;
			const ch  = rootRef.current?.offsetHeight   ?? 0;

			let y = raw;
			if (raw > 0) {
				const limit = th > 0 ? (fullSwipe ? ch * fullSwipeThreshold : th) : 0;
				if      (th === 0)     y = raw * overscroll;
				else if (raw > limit)  y = limit + (raw - limit) * overscroll;
			} else if (raw < 0) {
				const limit = bh > 0 ? (fullSwipe ? ch * fullSwipeThreshold : bh) : 0;
				if      (bh === 0)     y = raw * overscroll;
				else if (-raw > limit) y = -(limit + (-raw - limit) * overscroll);
			}
			applyTransform(0, y, false);

			const side   = raw > 0 ? "top" : raw < 0 ? "bottom" : null;
			const slotH  = side === "top" ? th : bh;
			const past   = slotH > 0 && Math.abs(raw) >= slotH * threshold;
			const fsReady = fullSwipe && ch > 0 && Math.abs(raw) >= ch * fullSwipeThreshold;
			setDragState(side, past, fsReady);
		}
	};

	const onPointerUp = () => {
		if (!drag.current.active) return;
		const { axis, moved } = drag.current;
		drag.current.active = false;
		drag.current.axis   = null;
		setDragState(null, false, false);

		// Tap (no movement) on open content → close
		if (!moved) {
			if (openSide) close();
			return;
		}

		const { x, y } = posRef.current;
		const cw = rootRef.current?.offsetWidth  ?? 0;
		const ch = rootRef.current?.offsetHeight ?? 0;

		if (axis === "x") {
			const lw = leftRef.current?.offsetWidth  ?? 0;
			const rw = rightRef.current?.offsetWidth ?? 0;
			// Full-swipe check first
			if (fullSwipe && cw > 0) {
				if (lw > 0 && x >  cw * fullSwipeThreshold) { triggerFullSwipe("left");  return; }
				if (rw > 0 && x < -cw * fullSwipeThreshold) { triggerFullSwipe("right"); return; }
			}
			if      (lw > 0 && x >  lw * threshold) open("left");
			else if (rw > 0 && x < -rw * threshold) open("right");
			else close();
		} else if (axis === "y") {
			const th = topRef.current?.offsetHeight    ?? 0;
			const bh = bottomRef.current?.offsetHeight ?? 0;
			if (fullSwipe && ch > 0) {
				if (th > 0 && y >  ch * fullSwipeThreshold) { triggerFullSwipe("top");    return; }
				if (bh > 0 && y < -ch * fullSwipeThreshold) { triggerFullSwipe("bottom"); return; }
			}
			if      (th > 0 && y >  th * threshold) open("top");
			else if (bh > 0 && y < -bh * threshold) open("bottom");
			else close();
		} else {
			// Tiny movement, axis never locked — restore stable state
			if (openSide) open(openSide);
			else applyTransform(0, 0, true);
		}
	};

	return (
		<div
			ref={contentRef}
			className={cn("relative z-10 will-change-transform select-none", className)}
			style={{ touchAction }}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerCancel={onPointerUp}
			{...props}
		>
			{children}
		</div>
	);
}

/* ── Slot wrappers ────────────────────────────────────────────────────────── */

function SwipeActionsLeft({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { leftRef, openSide, dragSide, pastThreshold, fullSwipeReady } = useSwipeCtx();
	const active = dragSide === "left";
	return (
		<SlotCtx.Provider value="vertical">
			<div
				ref={leftRef}
				aria-hidden={openSide !== "left"}
				data-dragging={active || undefined}
				data-past-threshold={(active && pastThreshold) || undefined}
				data-full-swipe-ready={(active && fullSwipeReady) || undefined}
				className={cn("absolute inset-y-0 left-0 flex items-stretch", className)}
				{...props}
			>
				{children}
			</div>
		</SlotCtx.Provider>
	);
}

function SwipeActionsRight({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { rightRef, openSide, dragSide, pastThreshold, fullSwipeReady } = useSwipeCtx();
	const active = dragSide === "right";
	return (
		<SlotCtx.Provider value="vertical">
			<div
				ref={rightRef}
				aria-hidden={openSide !== "right"}
				data-dragging={active || undefined}
				data-past-threshold={(active && pastThreshold) || undefined}
				data-full-swipe-ready={(active && fullSwipeReady) || undefined}
				className={cn("absolute inset-y-0 right-0 flex items-stretch", className)}
				{...props}
			>
				{children}
			</div>
		</SlotCtx.Provider>
	);
}

function SwipeActionsTop({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { topRef, openSide, dragSide, pastThreshold, fullSwipeReady } = useSwipeCtx();
	const active = dragSide === "top";
	return (
		<SlotCtx.Provider value="horizontal">
			<div
				ref={topRef}
				aria-hidden={openSide !== "top"}
				data-dragging={active || undefined}
				data-past-threshold={(active && pastThreshold) || undefined}
				data-full-swipe-ready={(active && fullSwipeReady) || undefined}
				className={cn("absolute inset-x-0 top-0 flex w-full", className)}
				{...props}
			>
				{children}
			</div>
		</SlotCtx.Provider>
	);
}

function SwipeActionsBottom({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { bottomRef, openSide, dragSide, pastThreshold, fullSwipeReady } = useSwipeCtx();
	const active = dragSide === "bottom";
	return (
		<SlotCtx.Provider value="horizontal">
			<div
				ref={bottomRef}
				aria-hidden={openSide !== "bottom"}
				data-dragging={active || undefined}
				data-past-threshold={(active && pastThreshold) || undefined}
				data-full-swipe-ready={(active && fullSwipeReady) || undefined}
				className={cn("absolute inset-x-0 bottom-0 flex w-full", className)}
				{...props}
			>
				{children}
			</div>
		</SlotCtx.Provider>
	);
}

/* ── Action button ────────────────────────────────────────────────────────── */
export interface SwipeActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: SwipeActionVariant;
	/** Auto-close the panel after clicking. @default true */
	closeOnAction?: boolean;
}

const variantStyles: Record<SwipeActionVariant, string> = {
	default:     "bg-primary     text-primary-foreground",
	destructive: "bg-destructive text-destructive-foreground",
	success:     "bg-success     text-success-foreground",
	warning:     "bg-warning     text-warning-foreground",
	secondary:   "bg-secondary   text-secondary-foreground",
};

function SwipeAction({
	className,
	children,
	variant = "default",
	closeOnAction = true,
	onClick,
	...props
}: SwipeActionProps) {
	const { close } = useSwipeCtx();
	const orientation = React.useContext(SlotCtx);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		onClick?.(e);
		if (closeOnAction) close();
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"select-none transition-[transform,filter] duration-150 active:opacity-70",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0",
				variantStyles[variant],
				// Visual threshold progression via parent slot data-attrs
				"[[data-past-threshold]_&]:scale-105  [[data-past-threshold]_&]:brightness-110",
				"[[data-full-swipe-ready]_&]:scale-110 [[data-full-swipe-ready]_&]:brightness-125",
				orientation === "vertical"
					? "flex min-w-[68px] flex-col items-center justify-center gap-1.5 px-4 text-[11px] font-semibold tracking-wide [&_svg]:size-[18px]"
					: "flex flex-1 flex-row items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium [&_svg]:size-4",
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}

/* ── Compound export ──────────────────────────────────────────────────────── */
export const SwipeActions = Object.assign(SwipeActionsRoot, {
	Content: SwipeActionsContent,
	Left:    SwipeActionsLeft,
	Right:   SwipeActionsRight,
	Top:     SwipeActionsTop,
	Bottom:  SwipeActionsBottom,
	Action:  SwipeAction,
});
