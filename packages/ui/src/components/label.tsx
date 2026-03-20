"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

import { cn } from "@almach/utils";

const Label = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
		required?: boolean;
	}
>(({ className, required, children, ...props }, ref) => (
	<LabelPrimitive.Root
		ref={ref}
		className={cn(
			"cursor-pointer text-sm font-medium leading-none tracking-tight",
			"peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
			className
		)}
		{...props}
	>
		{children}
		{required && (
			<span className="ml-0.5 text-destructive" aria-hidden="true">
				*
			</span>
		)}
	</LabelPrimitive.Root>
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
