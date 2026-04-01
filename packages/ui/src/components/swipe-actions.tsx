"use client";

import * as React from "react";
import { cn } from "@almach/utils";

/* ── Types ────────────────────────────────────────────────────────────────── */
export type SwipeSide = "left" | "right" | "top" | "bottom" | null;
export type SwipeActionVariant = "default" | "destructive" | "success" | "warning" | "secondary";

/* ── Slot orientation (passed from slot wrappers to Action buttons) ────────── */
const SlotOrientationCtx = React.createContext<"horizontal" | "vertical">("vertical");

/* ── Internal context ─────────────────────────────────────────────────────── */
interface SwipeActionsCtx {
	openSide: SwipeSide;
	contentRef: React.RefObject<HTMLDivElement | null>;
	leftRef: React.RefObject<HTMLDivElement | null>;
	rightRef: React.RefObject<HTMLDivElement | null>;
	topRef: React.RefObject<HTMLDivElement | null>;
	bottomRef: React.RefObject<HTMLDivElement | null>;
	moveContent: (x: number, y: number, animate?: boolean) => void;
	open: (side: NonNullable<SwipeSide>) => void;
	close: () => void;
}

const SwipeActionsCtx = React.createContext<SwipeActionsCtx | null>(null);

function useSwipeActionsCtx() {
	const ctx = React.useContext(SwipeActionsCtx);
	if (!ctx) throw new Error("Must be used inside <SwipeActions>");
	return ctx;
}

/** Programmatic open/close from any child of <SwipeActions> */
export function useSwipeActions() {
	const { openSide, close, open } = useSwipeActionsCtx();
	return { openSide, close, open };
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
	const [openSide, setOpenSide] = React.useState<SwipeSide>(null);
	const contentRef = React.useRef<HTMLDivElement>(null);
	const leftRef    = React.useRef<HTMLDivElement>(null);
	const rightRef   = React.useRef<HTMLDivElement>(null);
	const topRef     = React.useRef<HTMLDivElement>(null);
	const bottomRef  = React.useRef<HTMLDivElement>(null);

	const moveContent = React.useCallback((x: number, y: number, animate = false) => {
		const el = contentRef.current;
		if (!el) return;
		el.style.transition = animate ? "transform 240ms cubic-bezier(0.32,0.72,0,1)" : "none";
		el.style.transform  = `translate(${x}px,${y}px)`;
	}, []);

	const open = React.useCallback(
		(side: NonNullable<SwipeSide>) => {
			if (disabled) return;
			let dx = 0, dy = 0;
			if (side === "left")   dx =  leftRef.current?.offsetWidth   ?? 0;
			if (side === "right")  dx = -(rightRef.current?.offsetWidth  ?? 0);
			if (side === "top")    dy =  topRef.current?.offsetHeight    ?? 0;
			if (side === "bottom") dy = -(bottomRef.current?.offsetHeight ?? 0);
			if (!dx && !dy) return;
			moveContent(dx, dy, true);
			setOpenSide(side);
			onOpenChange?.(side);
		},
		[disabled, moveContent, onOpenChange],
	);

	const close = React.useCallback(() => {
		moveContent(0, 0, true);
		setOpenSide(null);
		onOpenChange?.(null);
	}, [moveContent, onOpenChange]);

	return (
		<SwipeActionsCtx.Provider
			value={{ openSide, contentRef, leftRef, rightRef, topRef, bottomRef, moveContent, open, close }}
		>
			<div
				data-swipe-open={openSide ?? undefined}
				className={cn("relative overflow-hidden", className)}
				{...props}
			>
				{children}
			</div>
		</SwipeActionsCtx.Provider>
	);
}

/* ── Content ──────────────────────────────────────────────────────────────── */
const AXIS_LOCK_PX = 6;
const SNAP_RATIO   = 0.4;
const RESISTANCE   = 0.18;

function SwipeActionsContent({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const { contentRef, leftRef, rightRef, topRef, bottomRef, moveContent, open, close } =
		useSwipeActionsCtx();

	const drag = React.useRef({
		active: false,
		startX: 0, startY: 0,
		originX: 0, originY: 0,
		axis: null as "x" | "y" | null,
	});

	const readTranslate = (): [number, number] => {
		const t = contentRef.current?.style.transform ?? "";
		const m = t.match(/translate\((-?[\d.]+)px,(-?[\d.]+)px\)/);
		return m && m[1] && m[2] ? [parseFloat(m[1]), parseFloat(m[2])] : [0, 0];
	};

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		const [ox, oy] = readTranslate();
		moveContent(ox, oy, false); // freeze ongoing animation
		drag.current = { active: true, startX: e.clientX, startY: e.clientY, originX: ox, originY: oy, axis: null };
	};

	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!drag.current.active) return;
		const dx = e.clientX - drag.current.startX;
		const dy = e.clientY - drag.current.startY;

		// Lock axis on first significant movement, then capture pointer
		if (!drag.current.axis) {
			if (Math.max(Math.abs(dx), Math.abs(dy)) < AXIS_LOCK_PX) return;
			drag.current.axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
			e.currentTarget.setPointerCapture(e.pointerId);
		}

		if (drag.current.axis === "x") {
			const raw = drag.current.originX + dx;
			const lw  = leftRef.current?.offsetWidth  ?? 0;
			const rw  = rightRef.current?.offsetWidth ?? 0;
			let xFinal = raw;
			if (lw > 0 && raw > lw)   xFinal = lw  + (raw - lw)  * RESISTANCE;
			else if (lw === 0 && raw > 0) xFinal = raw * RESISTANCE;
			if (rw > 0 && raw < -rw)  xFinal = -rw + (raw + rw)  * RESISTANCE;
			else if (rw === 0 && raw < 0) xFinal = raw * RESISTANCE;
			moveContent(xFinal, 0, false);
		} else {
			const raw = drag.current.originY + dy;
			const th  = topRef.current?.offsetHeight    ?? 0;
			const bh  = bottomRef.current?.offsetHeight ?? 0;
			let yFinal = raw;
			if (th > 0 && raw > th)   yFinal = th  + (raw - th)  * RESISTANCE;
			else if (th === 0 && raw > 0) yFinal = raw * RESISTANCE;
			if (bh > 0 && raw < -bh)  yFinal = -bh + (raw + bh)  * RESISTANCE;
			else if (bh === 0 && raw < 0) yFinal = raw * RESISTANCE;
			moveContent(0, yFinal, false);
		}
	};

	const onPointerUp = () => {
		if (!drag.current.active) return;
		const axis = drag.current.axis;
		drag.current.active = false;
		drag.current.axis   = null;
		const [x, y] = readTranslate();

		if (axis === "x") {
			const lw = leftRef.current?.offsetWidth  ?? 0;
			const rw = rightRef.current?.offsetWidth ?? 0;
			if (lw > 0 && x >  lw * SNAP_RATIO) open("left");
			else if (rw > 0 && x < -rw * SNAP_RATIO) open("right");
			else close();
		} else if (axis === "y") {
			const th = topRef.current?.offsetHeight    ?? 0;
			const bh = bottomRef.current?.offsetHeight ?? 0;
			if (th > 0 && y >  th * SNAP_RATIO) open("top");
			else if (bh > 0 && y < -bh * SNAP_RATIO) open("bottom");
			else close();
		} else {
			close();
		}
	};

	return (
		<div
			ref={contentRef}
			className={cn("relative z-10 will-change-transform select-none", className)}
			style={{ touchAction: "none" }}
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

/** Actions on the left — revealed by swiping right */
function SwipeActionsLeft({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { leftRef, openSide } = useSwipeActionsCtx();
	return (
		<SlotOrientationCtx.Provider value="vertical">
			<div ref={leftRef} aria-hidden={openSide !== "left"}
				className={cn("absolute inset-y-0 left-0 flex items-stretch", className)} {...props}>
				{children}
			</div>
		</SlotOrientationCtx.Provider>
	);
}

/** Actions on the right — revealed by swiping left */
function SwipeActionsRight({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { rightRef, openSide } = useSwipeActionsCtx();
	return (
		<SlotOrientationCtx.Provider value="vertical">
			<div ref={rightRef} aria-hidden={openSide !== "right"}
				className={cn("absolute inset-y-0 right-0 flex items-stretch", className)} {...props}>
				{children}
			</div>
		</SlotOrientationCtx.Provider>
	);
}

/** Actions on the top — revealed by swiping down */
function SwipeActionsTop({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { topRef, openSide } = useSwipeActionsCtx();
	return (
		<SlotOrientationCtx.Provider value="horizontal">
			<div ref={topRef} aria-hidden={openSide !== "top"}
				className={cn("absolute inset-x-0 top-0 flex w-full", className)} {...props}>
				{children}
			</div>
		</SlotOrientationCtx.Provider>
	);
}

/** Actions on the bottom — revealed by swiping up */
function SwipeActionsBottom({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { bottomRef, openSide } = useSwipeActionsCtx();
	return (
		<SlotOrientationCtx.Provider value="horizontal">
			<div ref={bottomRef} aria-hidden={openSide !== "bottom"}
				className={cn("absolute inset-x-0 bottom-0 flex w-full", className)} {...props}>
				{children}
			</div>
		</SlotOrientationCtx.Provider>
	);
}

/* ── Action button ────────────────────────────────────────────────────────── */
export interface SwipeActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: SwipeActionVariant;
	/** Auto-close after action. @default true */
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
	const { close } = useSwipeActionsCtx();
	const orientation = React.useContext(SlotOrientationCtx);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		onClick?.(e);
		if (closeOnAction) close();
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"select-none transition-opacity duration-100 active:opacity-60",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0",
				variantStyles[variant],
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
