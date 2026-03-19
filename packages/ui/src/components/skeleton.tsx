import * as React from "react";

import { cn } from "@almach/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

function Skeleton({ className, ...props }: SkeletonProps) {
	return (
		<div
			className={cn("rounded-md skeleton-shimmer", className)}
			{...props}
		/>
	);
}

export { Skeleton };
