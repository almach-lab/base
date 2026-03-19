import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@almach/utils";

/* ── Sub-components ────────────────────────────────────────────────────── */
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
	<TooltipPrimitive.Portal>
		<TooltipPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			className={cn(
				"z-50 max-w-xs rounded-lg bg-foreground px-3 py-1.5",
				"text-xs font-medium text-background leading-snug",
				"shadow-md select-none",
				"animate-in fade-in-0 zoom-in-95",
				"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
				"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
				"data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
				className
			)}
			{...props}
		/>
	</TooltipPrimitive.Portal>
));
TooltipContent.displayName = "Tooltip.Content";

/* ── Compound export ───────────────────────────────────────────────────── */
const Tooltip = Object.assign(TooltipPrimitive.Root, {
	Provider: TooltipProvider,
	Trigger: TooltipTrigger,
	Content: TooltipContent,
});

export { Tooltip };
