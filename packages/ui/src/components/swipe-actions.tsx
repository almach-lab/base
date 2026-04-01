"use client";

import * as React from "react";
import { cn } from "@almach/utils";

/* ── Constants ─────────────────────────────────────────────────────────────── */
const AXIS_LOCK  = 5;    // px before axis is committed
const SNAP_RATIO = 0.4;  // fraction of slot size to trigger snap-open
const OVERSCROLL = 0.15; // rubber-band factor past slot edge
const SPRING     = "transform 300ms cubic-bezier(0.32,0.72,0,1)";

/* ── Types ─────────────────────────────────────────────────────────────────── */
export type SwipeSide          = "left" | "right" | "top" | "bottom" | null;
export type SwipeActionVariant = "default" | "destructive" | "success" | "warning" | "secondary";

/* ── Slot orientation ─────────────────────────────────────────────────────── */
const SlotCtx = React.createContext<"horizontal" | "vertical">("vertical");

/* ── Internal context ─────────────────────────────────────────────────────── */
interface SwipeCtxValue {
	openSide:      SwipeSide;
	dragSide:      SwipeSide;
	pastThreshold: boolean;
	disabled:      boolean;
	contentRef:    React.RefObject<HTMLDivElement | null>;
	leftRef:       React.RefObject<HTMLDivElement | null>;
	rightRef:      React.RefObject<HTMLDivElement | null>;
	topRef:        React.RefObject<HTMLDivElement | null>;
	bottomRef:     React.RefObject<HTMLDivElement | null>;
	/** Tracked position in JS — never read back from the DOM string */
	posRef:        React.RefObject<{ x: number; y: number }>;
	touchAction:   string;
	setDragState:  (side: SwipeSide, past: boolean) => void;
	applyTransform:(x: number, y: number, animate?: boolean) => void;
	open:  (side: NonNullable<SwipeSide>) => void;
	close: () => void;
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
	/** Disable all swipe interactions */
	disabled?: boolean;
	/** Called when the revealed side changes (null = closed) */
	onOpenChange?: (side: SwipeSide) => void;
}

function SwipeActionsRoot({
	className,
	children,
	disabled = false,
	onOpenChange,
	...props
}: SwipeActionsProps) {
	const [openSide,      setOpenSide]      = React.useState<SwipeSide>(null);
	const [dragSide,      setDragSide]      = React.useState<SwipeSide>(null);
	const [pastThreshold, setPastThreshold] = React.useState(false);
	const [touchAction,   setTouchAction]   = React.useState("none");

	const contentRef = React.useRef<HTMLDivElement>(null);
	const leftRef    = React.useRef<HTMLDivElement>(null);
	const rightRef   = React.useRef<HTMLDivElement>(null);
	const topRef     = React.useRef<HTMLDivElement>(null);
	const bottomRef  = React.useRef<HTMLDivElement>(null);
	/** Source of truth for current translate — never read back from CSS */
	const posRef     = React.useRef({ x: 0, y: 0 });

	// Detect which slots exist and set the correct touch-action so the page can
	// still scroll in the perpendicular direction.
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

	const setDragState = React.useCallback((side: SwipeSide, past: boolean) => {
		setDragSide(side);
		setPastThreshold(past);
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
			onOpenChange?.(side);
		},
		[disabled, applyTransform, onOpenChange],
	);

	const close = React.useCallback(() => {
		applyTransform(0, 0, true);
		setOpenSide(null);
		setDragSide(null);
		setPastThreshold(false);
		onOpenChange?.(null);
	}, [applyTransform, onOpenChange]);

	return (
		<SwipeCtx.Provider value={{
			openSide, dragSide, pastThreshold, disabled,
			contentRef, leftRef, rightRef, topRef, bottomRef,
			posRef, touchAction,
			setDragState, applyTransform, open, close,
		}}>
			<div
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
function SwipeActionsContent({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const {
		contentRef, leftRef, rightRef, topRef, bottomRef,
		touchAction, posRef, disabled, openSide,
		setDragState, applyTransform, open, close,
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
		// Freeze spring animation at its current JS-tracked position.
		// posRef is always current — no need to parse the CSS string.
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

		// Commit to an axis once movement passes the lock threshold
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
			// Rubber-band: clamp at slot edge with resistance
			let x = raw;
			if      (lw > 0 && raw >  lw) x =  lw + (raw - lw)  * OVERSCROLL;
			else if (lw === 0 && raw > 0) x = raw * OVERSCROLL;
			if      (rw > 0 && raw < -rw) x = -rw + (raw + rw)  * OVERSCROLL;
			else if (rw === 0 && raw < 0) x = raw * OVERSCROLL;
			applyTransform(x, 0, false);
			// Threshold feedback
			const side   = raw > 0 ? "left" : raw < 0 ? "right" : null;
			const slotW  = side === "left" ? lw : rw;
			const past   = slotW > 0 && Math.abs(raw) >= slotW * SNAP_RATIO;
			setDragState(side, past);
		} else {
			const raw = drag.current.originY + dy;
			const th  = topRef.current?.offsetHeight    ?? 0;
			const bh  = bottomRef.current?.offsetHeight ?? 0;
			let y = raw;
			if      (th > 0 && raw >  th) y =  th + (raw - th)  * OVERSCROLL;
			else if (th === 0 && raw > 0) y = raw * OVERSCROLL;
			if      (bh > 0 && raw < -bh) y = -bh + (raw + bh)  * OVERSCROLL;
			else if (bh === 0 && raw < 0) y = raw * OVERSCROLL;
			applyTransform(0, y, false);
			const side  = raw > 0 ? "top" : raw < 0 ? "bottom" : null;
			const slotH = side === "top" ? th : bh;
			const past  = slotH > 0 && Math.abs(raw) >= slotH * SNAP_RATIO;
			setDragState(side, past);
		}
	};

	const onPointerUp = () => {
		if (!drag.current.active) return;
		const { axis, moved } = drag.current;
		drag.current.active = false;
		drag.current.axis   = null;
		setDragState(null, false);

		// Tap (no movement) on open content → close
		if (!moved) {
			if (openSide) close();
			return;
		}

		const { x, y } = posRef.current;

		if (axis === "x") {
			const lw = leftRef.current?.offsetWidth  ?? 0;
			const rw = rightRef.current?.offsetWidth ?? 0;
			if      (lw > 0 && x >  lw * SNAP_RATIO) open("left");
			else if (rw > 0 && x < -rw * SNAP_RATIO) open("right");
			else close();
		} else if (axis === "y") {
			const th = topRef.current?.offsetHeight    ?? 0;
			const bh = bottomRef.current?.offsetHeight ?? 0;
			if      (th > 0 && y >  th * SNAP_RATIO) open("top");
			else if (bh > 0 && y < -bh * SNAP_RATIO) open("bottom");
			else close();
		} else {
			// Tiny movement, axis never locked — bounce back to stable state
			if (openSide) open(openSide);
			else applyTransform(0, 0, true);
		}
	};

	return (
		<div
			ref={contentRef}
			className={cn(
				"relative z-10 will-change-transform select-none",
				className,
			)}
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
	const { leftRef, openSide, dragSide, pastThreshold } = useSwipeCtx();
	const active = dragSide === "left";
	return (
		<SlotCtx.Provider value="vertical">
			<div
				ref={leftRef}
				aria-hidden={openSide !== "left"}
				data-dragging={active || undefined}
				data-past-threshold={(active && pastThreshold) || undefined}
				className={cn("absolute inset-y-0 left-0 flex items-stretch", className)}
				{...props}
			>
				{children}
			</div>
		</SlotCtx.Provider>
	);
}

function SwipeActionsRight({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { rightRef, openSide, dragSide, pastThreshold } = useSwipeCtx();
	const active = dragSide === "right";
	return (
		<SlotCtx.Provider value="vertical">
			<div
				ref={rightRef}
				aria-hidden={openSide !== "right"}
				data-dragging={active || undefined}
				data-past-threshold={(active && pastThreshold) || undefined}
				className={cn("absolute inset-y-0 right-0 flex items-stretch", className)}
				{...props}
			>
				{children}
			</div>
		</SlotCtx.Provider>
	);
}

function SwipeActionsTop({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { topRef, openSide, dragSide, pastThreshold } = useSwipeCtx();
	const active = dragSide === "top";
	return (
		<SlotCtx.Provider value="horizontal">
			<div
				ref={topRef}
				aria-hidden={openSide !== "top"}
				data-dragging={active || undefined}
				data-past-threshold={(active && pastThreshold) || undefined}
				className={cn("absolute inset-x-0 top-0 flex w-full", className)}
				{...props}
			>
				{children}
			</div>
		</SlotCtx.Provider>
	);
}

function SwipeActionsBottom({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { bottomRef, openSide, dragSide, pastThreshold } = useSwipeCtx();
	const active = dragSide === "bottom";
	return (
		<SlotCtx.Provider value="horizontal">
			<div
				ref={bottomRef}
				aria-hidden={openSide !== "bottom"}
				data-dragging={active || undefined}
				data-past-threshold={(active && pastThreshold) || undefined}
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
				// Base
				"select-none transition-[transform,filter] duration-150 active:opacity-70",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0",
				variantStyles[variant],
				// Threshold feedback — parent slot sets data-past-threshold
				"[[data-past-threshold]_&]:scale-105 [[data-past-threshold]_&]:brightness-110",
				// Layout by orientation
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
