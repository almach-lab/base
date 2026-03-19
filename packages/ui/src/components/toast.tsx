import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheck, CircleX, Info, X } from "lucide-react";
import * as React from "react";

import { cn } from "@almach/utils";

/* ── Provider & Viewport ──────────────────────────────────────────────────── */
const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Viewport>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={cn(
			"fixed bottom-4 right-4 z-[100] flex max-h-screen w-full max-w-sm flex-col gap-2 p-1",
			className,
		)}
		{...props}
	/>
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

/* ── Variants ─────────────────────────────────────────────────────────────── */
export type ToastVariant = "default" | "destructive" | "success";

const toastVariants = cva(
	[
		"group pointer-events-auto relative flex w-full items-start gap-3",
		"overflow-hidden rounded-2xl border bg-background p-4 shadow-lg",
		"transition-all",
		// enter
		"data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-4 data-[state=open]:fade-in-0",
		// exit
		"data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full data-[state=closed]:fade-out-80",
		// swipe
		"data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
		"data-[swipe=move]:transition-none data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-full",
	],
	{
		variants: {
			variant: {
				default: "border-border",
				destructive:
					"border-destructive/20 bg-destructive/[0.03]",
				success:
					"border-success/20 bg-success/[0.03]",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

const iconMap: Record<ToastVariant, React.ReactNode> = {
	default: <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />,
	destructive: <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />,
	success: <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />,
};

/* ── Toast ────────────────────────────────────────────────────────────────── */
export interface ToastProps
	extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
	VariantProps<typeof toastVariants> { }

const Toast = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Root>,
	ToastProps
>(({ className, variant = "default", children, ...props }, ref) => (
	<ToastPrimitives.Root
		ref={ref}
		className={cn(toastVariants({ variant }), className)}
		{...props}
	>
		{iconMap[variant ?? "default"]}
		<div className="flex min-w-0 flex-1 flex-col gap-0.5">{children}</div>
	</ToastPrimitives.Root>
));
Toast.displayName = ToastPrimitives.Root.displayName;

/* ── Action ───────────────────────────────────────────────────────────────── */
const ToastAction = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Action>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Action
		ref={ref}
		className={cn(
			"mt-1 inline-flex h-7 shrink-0 items-center justify-center rounded-md border px-3 text-xs font-medium",
			"transition-colors hover:bg-secondary",
			"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
			"disabled:pointer-events-none disabled:opacity-50",
			className,
		)}
		{...props}
	/>
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

/* ── Close ────────────────────────────────────────────────────────────────── */
const ToastClose = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Close>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Close
		ref={ref}
		className={cn(
			"absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-lg",
			"text-muted-foreground/40 transition-colors",
			"hover:text-foreground hover:bg-muted",
			"focus:outline-none focus:ring-2 focus:ring-ring",
			"opacity-0 group-hover:opacity-100",
			className,
		)}
		toast-close=""
		aria-label="Dismiss"
		{...props}
	>
		<X className="h-3 w-3" />
	</ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

/* ── Title & Description ──────────────────────────────────────────────────── */
const ToastTitle = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Title>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Title
		ref={ref}
		className={cn("text-sm font-semibold leading-tight", className)}
		{...props}
	/>
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Description>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Description
		ref={ref}
		className={cn("text-sm text-muted-foreground leading-snug", className)}
		{...props}
	/>
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

/* ── Types ────────────────────────────────────────────────────────────────── */
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
	Toast,
	ToastAction,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
	type ToastActionElement,
};
