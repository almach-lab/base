import { Button, Disclosure, DisclosurePanel } from "react-aria-components";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@almach/utils";

interface CollapsibleRootProps extends React.ComponentPropsWithoutRef<typeof Disclosure> {}

const CollapsibleRoot = React.forwardRef<HTMLDivElement, CollapsibleRootProps>(
	({ className, ...props }, ref) => (
		<Disclosure
			ref={ref}
			className={cn("group", className)}
			{...props}
		/>
	),
);
CollapsibleRoot.displayName = "Collapsible";

type CollapsibleTriggerProps = Omit<React.ComponentPropsWithoutRef<typeof Button>, "children"> & {
	children?: React.ReactNode;
};

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(({ className, children, ...props }, ref) => (
	<Button
		ref={ref}
		slot="trigger"
		className={cn(
			"group flex w-full cursor-pointer items-center justify-between rounded-sm py-3 text-sm font-medium",
			"transition-[color,background-color,text-decoration-color] duration-150 ease-out",
			"hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			className,
		)}
		{...props}
	>
		{children}
		<ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-data-[expanded]:rotate-180" />
	</Button>
));
CollapsibleTrigger.displayName = "Collapsible.Trigger";

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DisclosurePanel>>(({ className, children, ...props }, ref) => (
	<DisclosurePanel
		ref={ref}
		className={cn(
			"grid grid-rows-[0fr] text-sm opacity-0",
			"transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
			"group-data-[expanded]:grid-rows-[1fr] group-data-[expanded]:opacity-100",
			className,
		)}
		{...props}
	>
		<div className="min-h-0 overflow-hidden">{children}</div>
	</DisclosurePanel>
));
CollapsibleContent.displayName = "Collapsible.Content";

export const Collapsible = Object.assign(CollapsibleRoot, {
	Trigger: CollapsibleTrigger,
	Content: CollapsibleContent,
});
