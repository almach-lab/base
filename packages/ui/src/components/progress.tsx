import { ProgressBar } from "react-aria-components";
import * as React from "react";

import { cn } from "@almach/utils";

const Progress = React.forwardRef<
	HTMLDivElement,
	Omit<React.ComponentPropsWithoutRef<typeof ProgressBar>, "value"> & {
		value?: number;
	}
>(({ className, value, ...props }, ref) => (
	<ProgressBar ref={ref} value={value ?? 0} className={cn("relative h-1.5 w-full overflow-hidden rounded-full", className)} {...props}>
		{({ percentage }) => (
			<>
				<div className="h-full w-full rounded-full bg-secondary" />
				<div
					className="absolute inset-y-0 left-0 rounded-full bg-foreground transition-[width] duration-500 ease-out"
					style={{ width: `${percentage}%` }}
				/>
			</>
		)}
	</ProgressBar>
));
Progress.displayName = "Progress";

export { Progress };
