import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@almach/utils";

const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		className={cn(
			"relative h-1.5 w-full overflow-hidden rounded-full",
			className
		)}
		style={{ backgroundColor: "hsl(var(--secondary))" }}
		{...props}
	>
		<ProgressPrimitive.Indicator
			className="h-full w-full flex-1 rounded-full transition-transform duration-500 ease-out"
			style={{
				transform: `translateX(-${100 - (value ?? 0)}%)`,
				backgroundColor: "hsl(var(--foreground))",
			}}
		/>
	</ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
