import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@almach/utils";

/* ── TabsList variants ─────────────────────────────────────────────────── */
const tabsListVariants = cva(
	"inline-flex items-center",
	{
		variants: {
			variant: {
				pill: "gap-1 rounded-xl bg-muted p-1",
				underline: "gap-0 border-b border-border",
				minimal: "gap-4",
			},
		},
		defaultVariants: { variant: "pill" },
	}
);

const tabsTriggerVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all outline-none",
	{
		variants: {
			variant: {
				pill: [
					"rounded-lg px-3 py-1.5 text-muted-foreground",
					"hover:text-foreground",
					"data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
					"focus-visible:ring-2 focus-visible:ring-ring",
					"disabled:pointer-events-none disabled:opacity-50",
				],
				underline: [
					"relative px-4 py-2 text-muted-foreground border-b-2 border-transparent -mb-px",
					"hover:text-foreground",
					"data-[state=active]:border-foreground data-[state=active]:text-foreground",
					"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					"disabled:pointer-events-none disabled:opacity-50",
				],
				minimal: [
					"px-0 py-1.5 text-muted-foreground",
					"hover:text-foreground",
					"data-[state=active]:text-foreground data-[state=active]:font-semibold",
					"focus-visible:ring-2 focus-visible:ring-ring",
					"disabled:pointer-events-none disabled:opacity-50",
				],
			},
		},
		defaultVariants: { variant: "pill" },
	}
);

/* ── Variant context ───────────────────────────────────────────────────── */
const TabsVariantCtx = React.createContext<"pill" | "underline" | "minimal">("pill");

/* ── Sub-components ────────────────────────────────────────────────────── */
interface TabsListProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
	VariantProps<typeof tabsListVariants> { }

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	TabsListProps
>(({ className, variant = "pill", children, ...props }, ref) => (
	<TabsVariantCtx.Provider value={variant ?? "pill"}>
		<TabsPrimitive.List
			ref={ref}
			className={cn(tabsListVariants({ variant }), className)}
			{...props}
		>
			{children}
		</TabsPrimitive.List>
	</TabsVariantCtx.Provider>
));
TabsList.displayName = "Tabs.List";

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
	const variant = React.useContext(TabsVariantCtx);
	return (
		<TabsPrimitive.Trigger
			ref={ref}
			className={cn(tabsTriggerVariants({ variant }), className)}
			{...props}
		/>
	);
});
TabsTrigger.displayName = "Tabs.Trigger";

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			"mt-3 outline-none",
			"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg",
			className
		)}
		{...props}
	/>
));
TabsContent.displayName = "Tabs.Content";

/* ── Compound export ───────────────────────────────────────────────────── */
const Tabs = Object.assign(TabsPrimitive.Root, {
	List: TabsList,
	Trigger: TabsTrigger,
	Content: TabsContent,
});

export { Tabs, tabsListVariants, tabsTriggerVariants };
