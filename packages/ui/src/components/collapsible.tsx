import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@almach/utils";

/* ── Root ─────────────────────────────────────────────────────────────────── */
const CollapsibleRoot = CollapsiblePrimitive.Root;

/* ── Trigger ──────────────────────────────────────────────────────────────── */
const CollapsibleTrigger = React.forwardRef<
	React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<CollapsiblePrimitive.Trigger
		ref={ref}
		className={cn(
			"flex w-full cursor-pointer items-center justify-between py-3 text-sm font-medium transition-all",
			"hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
			"[&[data-state=open]>svg]:rotate-180",
			className,
		)}
		{...props}
	>
		{children}
		<ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
	</CollapsiblePrimitive.Trigger>
));
CollapsibleTrigger.displayName = "Collapsible.Trigger";

/* ── Content ──────────────────────────────────────────────────────────────── */
const CollapsibleContent = React.forwardRef<
	React.ElementRef<typeof CollapsiblePrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, ...props }, ref) => (
	<CollapsiblePrimitive.Content
		ref={ref}
		className={cn(
			"overflow-hidden text-sm",
			"data-[state=open]:animate-in data-[state=closed]:animate-out",
			"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			className,
		)}
		{...props}
	/>
));
CollapsibleContent.displayName = "Collapsible.Content";

/* ── Compound export ──────────────────────────────────────────────────────── */
export const Collapsible = Object.assign(CollapsibleRoot, {
	Trigger: CollapsibleTrigger,
	Content: CollapsibleContent,
});
