import * as React from "react";
import { cn } from "@almach/utils";

// ── Root ───────────────────────────────────────────────────────────────────────
const CardRoot = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
			className,
		)}
		{...props}
	/>
));
CardRoot.displayName = "Card";

// ── Header ─────────────────────────────────────────────────────────────────────
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Right-side element: icon, badge, button, etc. */
	action?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
	({ className, children, action, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"flex items-start justify-between gap-2 px-5 pt-5",
				action && "pb-0",
				className,
			)}
			{...props}
		>
			<div className="flex flex-col gap-1.5 min-w-0">{children}</div>
			{action && (
				<div className="shrink-0 text-muted-foreground">{action}</div>
			)}
		</div>
	),
);
CardHeader.displayName = "Card.Header";

// ── Title ──────────────────────────────────────────────────────────────────────
const CardTitle = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			"text-base font-semibold leading-none tracking-tight",
			className,
		)}
		{...props}
	/>
));
CardTitle.displayName = "Card.Title";

// ── Description ────────────────────────────────────────────────────────────────
const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn("text-sm text-muted-foreground leading-relaxed", className)}
		{...props}
	/>
));
CardDescription.displayName = "Card.Description";

// ── Content ────────────────────────────────────────────────────────────────────
const CardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("px-5 py-4", className)} {...props} />
));
CardContent.displayName = "Card.Content";

// ── Section ────────────────────────────────────────────────────────────────────
const CardSection = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("border-t px-5 py-4", className)}
		{...props}
	/>
));
CardSection.displayName = "Card.Section";

// ── Row ────────────────────────────────────────────────────────────────────────
interface CardRowProps extends React.HTMLAttributes<HTMLDivElement> {
	action?: React.ReactNode;
}

const CardRow = React.forwardRef<HTMLDivElement, CardRowProps>(
	({ className, children, action, onClick, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"flex items-center justify-between gap-2 border-t px-5 py-3 text-sm",
				"transition-colors",
				onClick && "cursor-pointer hover:bg-accent/50",
				className,
			)}
			onClick={onClick}
			{...props}
		>
			<span className="min-w-0 flex-1">{children}</span>
			{action && (
				<span className="shrink-0 text-muted-foreground">{action}</span>
			)}
		</div>
	),
);
CardRow.displayName = "Card.Row";

// ── Footer ─────────────────────────────────────────────────────────────────────
const CardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("border-t flex items-center px-5 py-4", className)}
		{...props}
	/>
));
CardFooter.displayName = "Card.Footer";

// ── Layers ─────────────────────────────────────────────────────────────────────
// Layered card: sections divided by borders, each with its own background.
// Inspired by Claude/macOS-style stacked panels.

const CardLayers = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("overflow-hidden rounded-xl border bg-card divide-y divide-border", className)}
		{...props}
	/>
));
CardLayers.displayName = "Card.Layers";

// ── Layer.Header ───────────────────────────────────────────────────────────────
interface CardLayerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	action?: React.ReactNode;
}

const CardLayerHeader = React.forwardRef<HTMLDivElement, CardLayerHeaderProps>(
	({ className, children, action, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"flex items-center justify-between gap-2 px-4 py-3",
				"text-sm font-medium text-muted-foreground bg-muted/40",
				className,
			)}
			{...props}
		>
			<span>{children}</span>
			{action && <span className="shrink-0">{action}</span>}
		</div>
	),
);
CardLayerHeader.displayName = "Card.LayerHeader";

// ── Layer.Body ─────────────────────────────────────────────────────────────────
const CardLayerBody = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("px-4 py-3 bg-card", className)} {...props} />
));
CardLayerBody.displayName = "Card.LayerBody";

// ── Layer.Row ──────────────────────────────────────────────────────────────────
interface CardLayerRowProps extends React.HTMLAttributes<HTMLDivElement> {
	action?: React.ReactNode;
}

const CardLayerRow = React.forwardRef<HTMLDivElement, CardLayerRowProps>(
	({ className, children, action, onClick, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"flex items-center justify-between gap-2 px-4 py-3 text-sm bg-card",
				"transition-colors",
				onClick && "cursor-pointer hover:bg-accent/50",
				className,
			)}
			onClick={onClick}
			{...props}
		>
			<span className="min-w-0 flex-1">{children}</span>
			{action && (
				<span className="shrink-0 text-muted-foreground">{action}</span>
			)}
		</div>
	),
);
CardLayerRow.displayName = "Card.LayerRow";

// ── Compound ───────────────────────────────────────────────────────────────────
const Card = Object.assign(CardRoot, {
	Header: CardHeader,
	Title: CardTitle,
	Description: CardDescription,
	Content: CardContent,
	Section: CardSection,
	Row: CardRow,
	Footer: CardFooter,
	/** Layered card root — stacked sections divided by borders (Claude-style) */
	Layers: CardLayers,
	LayerHeader: CardLayerHeader,
	LayerBody: CardLayerBody,
	LayerRow: CardLayerRow,
});

export { Card };
