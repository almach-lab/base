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

// ── Group.Root ─────────────────────────────────────────────────────────────────
interface CardGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Small-caps label shown above the group */
	label?: string;
	/** Helper text shown below the group */
	hint?: string;
}

const CardGroup = React.forwardRef<HTMLDivElement, CardGroupProps>(
	({ label, hint, className, children, ...props }, ref) => (
		<div ref={ref} className={cn("space-y-1.5", className)} {...props}>
			{label && (
				<p className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
					{label}
				</p>
			)}
			<div className="overflow-hidden rounded-xl border bg-card divide-y">{children}</div>
			{hint && <p className="px-1 text-xs text-muted-foreground">{hint}</p>}
		</div>
	),
);
CardGroup.displayName = "Card.Group";

// ── Group.Row ──────────────────────────────────────────────────────────────────
interface CardGroupRowProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Left-side primary label */
	label?: string;
	/** Left-side secondary text under label */
	description?: string;
	/** Associates label with a form control */
	htmlFor?: string;
	/** Marks the field as required (adds red asterisk) */
	required?: boolean;
	/** Right-side element: toggle, badge, arrow, input, etc. */
	action?: React.ReactNode;
}

const CardGroupRow = React.forwardRef<HTMLDivElement, CardGroupRowProps>(
	({ label, description, htmlFor, required, action, children, className, onClick, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"flex items-center gap-3 px-4 py-3 bg-card transition-colors",
				onClick && "cursor-pointer hover:bg-accent/50",
				className,
			)}
			onClick={onClick}
			{...props}
		>
			{label ? (
				<div className="min-w-0 flex-1">
					<label
						htmlFor={htmlFor}
						className={cn("text-sm font-medium leading-none", htmlFor && "cursor-pointer")}
					>
						{label}
						{required && <span className="ml-1 text-destructive" aria-hidden>*</span>}
					</label>
					{description && (
						<p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
					)}
				</div>
			) : (
				<div className="min-w-0 flex-1 text-sm">{children}</div>
			)}
			{label && children && <div className="shrink-0">{children}</div>}
			{action && <div className="shrink-0 text-muted-foreground">{action}</div>}
		</div>
	),
);
CardGroupRow.displayName = "Card.GroupRow";

// ── Compound ───────────────────────────────────────────────────────────────────
const Card = Object.assign(CardRoot, {
	Header: CardHeader,
	Title: CardTitle,
	Description: CardDescription,
	Content: CardContent,
	Section: CardSection,
	Row: CardRow,
	Footer: CardFooter,
	/** Layered card root — stacked sections divided by borders */
	Layers: CardLayers,
	LayerHeader: CardLayerHeader,
	LayerBody: CardLayerBody,
	LayerRow: CardLayerRow,
	/** Grouped rows with optional label/hint — for settings, nav, and forms */
	Group: CardGroup,
	GroupRow: CardGroupRow,
});

export { Card };

// Backward-compat: Group was previously a standalone export
export const Group = Object.assign(CardGroup, { Row: CardGroupRow });
