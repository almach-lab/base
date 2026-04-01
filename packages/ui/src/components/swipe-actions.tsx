"use client";

import * as React from "react";
import { cn } from "@almach/utils";

/* ── Types ────────────────────────────────────────────────────────────────── */
export type SwipeSide = "leading" | "trailing" | null;
export type SwipeActionVariant = "default" | "destructive" | "success" | "warning" | "secondary";

/* ── Context ──────────────────────────────────────────────────────────────── */
interface SwipeActionsCtx {
	openSide: SwipeSide;
	contentRef: React.RefObject<HTMLDivElement | null>;
	leadingRef: React.RefObject<HTMLDivElement | null>;
	trailingRef: React.RefObject<HTMLDivElement | null>;
	moveContent: (x: number, animate?: boolean) => void;
	openLeading: () => void;
	openTrailing: () => void;
	close: () => void;
}

const SwipeActionsCtx = React.createContext<SwipeActionsCtx | null>(null);

function useSwipeActionsCtx() {
	const ctx = React.useContext(SwipeActionsCtx);
	if (!ctx) throw new Error("Must be used inside <SwipeActions>");
	return ctx;
}

/** Access open/close controls from any child of <SwipeActions> */
export function useSwipeActions() {
	const { openSide, close, openLeading, openTrailing } = useSwipeActionsCtx();
	return { openSide, close, openLeading, openTrailing };
}

/* ── Root ─────────────────────────────────────────────────────────────────── */
export interface SwipeActionsProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Disable all swipe interactions */
	disabled?: boolean;
	/** Called whenever the revealed side changes (null = closed) */
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
	const leadingRef = React.useRef<HTMLDivElement>(null);
	const trailingRef = React.useRef<HTMLDivElement>(null);

	const moveContent = React.useCallback((x: number, animate = false) => {
		const el = contentRef.current;
		if (!el) return;
		el.style.transition = animate
			? "transform 220ms cubic-bezier(0.32, 0.72, 0, 1)"
			: "none";
		el.style.transform = `translateX(${x}px)`;
	}, []);

	const openLeading = React.useCallback(() => {
		if (disabled) return;
		const w = leadingRef.current?.offsetWidth ?? 0;
		if (!w) return;
		moveContent(w, true);
		setOpenSide("leading");
		onOpenChange?.("leading");
	}, [disabled, moveContent, onOpenChange]);

	const openTrailing = React.useCallback(() => {
		if (disabled) return;
		const w = trailingRef.current?.offsetWidth ?? 0;
		if (!w) return;
		moveContent(-w, true);
		setOpenSide("trailing");
		onOpenChange?.("trailing");
	}, [disabled, moveContent, onOpenChange]);

	const close = React.useCallback(() => {
		moveContent(0, true);
		setOpenSide(null);
		onOpenChange?.(null);
	}, [moveContent, onOpenChange]);

	return (
		<SwipeActionsCtx.Provider
			value={{
				openSide,
				contentRef,
				leadingRef,
				trailingRef,
				moveContent,
				openLeading,
				openTrailing,
				close,
			}}
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
function SwipeActionsContent({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const { contentRef, leadingRef, trailingRef, moveContent, openLeading, openTrailing, close } =
		useSwipeActionsCtx();

	const drag = React.useRef({ active: false, startX: 0, startTranslate: 0 });

	const getCurrentTranslate = (): number => {
		const el = contentRef.current;
		if (!el || !el.style.transform) return 0;
		const m = el.style.transform.match(/translateX\((-?[\d.]+)px\)/);
		return m ? parseFloat(m[1]) : 0;
	};

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		e.currentTarget.setPointerCapture(e.pointerId);
		const current = getCurrentTranslate();
		moveContent(current, false); // freeze any ongoing animation
		drag.current = { active: true, startX: e.clientX, startTranslate: current };
	};

	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!drag.current.active) return;
		const raw = drag.current.startTranslate + (e.clientX - drag.current.startX);

		const leadingW = leadingRef.current?.offsetWidth ?? 0;
		const trailingW = trailingRef.current?.offsetWidth ?? 0;
		const R = 0.2; // rubber-band resistance beyond bounds

		let x = raw;
		if (leadingW > 0 && raw > leadingW) x = leadingW + (raw - leadingW) * R;
		else if (leadingW === 0 && raw > 0) x = raw * R;
		if (trailingW > 0 && raw < -trailingW) x = -trailingW + (raw + trailingW) * R;
		else if (trailingW === 0 && raw < 0) x = raw * R;

		moveContent(x, false);
	};

	const onPointerUp = () => {
		if (!drag.current.active) return;
		drag.current.active = false;

		const current = getCurrentTranslate();
		const leadingW = leadingRef.current?.offsetWidth ?? 0;
		const trailingW = trailingRef.current?.offsetWidth ?? 0;
		const THRESHOLD = 0.4; // 40% of action width snaps open

		if (leadingW > 0 && current > leadingW * THRESHOLD) {
			openLeading();
		} else if (trailingW > 0 && current < -trailingW * THRESHOLD) {
			openTrailing();
		} else {
			close();
		}
	};

	return (
		<div
			ref={contentRef}
			className={cn("relative z-10 will-change-transform", className)}
			style={{ touchAction: "pan-y" }}
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

/* ── Leading (left side) ──────────────────────────────────────────────────── */
function SwipeActionsLeading({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const { leadingRef, openSide } = useSwipeActionsCtx();
	return (
		<div
			ref={leadingRef}
			aria-hidden={openSide !== "leading"}
			className={cn("absolute inset-y-0 left-0 flex items-stretch", className)}
			{...props}
		>
			{children}
		</div>
	);
}

/* ── Trailing (right side) ────────────────────────────────────────────────── */
function SwipeActionsTrailing({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const { trailingRef, openSide } = useSwipeActionsCtx();
	return (
		<div
			ref={trailingRef}
			aria-hidden={openSide !== "trailing"}
			className={cn("absolute inset-y-0 right-0 flex items-stretch", className)}
			{...props}
		>
			{children}
		</div>
	);
}

/* ── Action button ────────────────────────────────────────────────────────── */
export interface SwipeActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Visual style of the action */
	variant?: SwipeActionVariant;
	/**
	 * Auto-close the swipe when this action is triggered.
	 * @default true
	 */
	closeOnAction?: boolean;
}

const actionStyles: Record<SwipeActionVariant, string> = {
	default: "bg-primary text-primary-foreground hover:brightness-90 active:brightness-75",
	destructive:
		"bg-destructive text-destructive-foreground hover:brightness-90 active:brightness-75",
	success: "bg-success text-success-foreground hover:brightness-90 active:brightness-75",
	warning: "bg-warning text-warning-foreground hover:brightness-90 active:brightness-75",
	secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/60",
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

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		onClick?.(e);
		if (closeOnAction) close();
	};

	return (
		<button
			type="button"
			className={cn(
				"flex min-w-[64px] flex-col items-center justify-center gap-1 px-4",
				"text-xs font-medium select-none transition-[filter,background-color] duration-150",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-5",
				actionStyles[variant],
				className,
			)}
			onClick={handleClick}
			{...props}
		>
			{children}
		</button>
	);
}

/* ── Compound export ──────────────────────────────────────────────────────── */
export const SwipeActions = Object.assign(SwipeActionsRoot, {
	Content: SwipeActionsContent,
	Leading: SwipeActionsLeading,
	Trailing: SwipeActionsTrailing,
	Action: SwipeAction,
});
