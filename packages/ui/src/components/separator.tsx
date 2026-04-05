"use client";

import { Separator as SeparatorPrimitive } from "react-aria-components";
import * as React from "react";

import { cn } from "@almach/utils";

const Separator = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof SeparatorPrimitive>
>(({ className, orientation = "horizontal", ...props }, ref) => (
	<SeparatorPrimitive
		ref={ref}
		orientation={orientation}
		className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)}
		{...props}
	/>
));
Separator.displayName = "Separator";

export { Separator };
