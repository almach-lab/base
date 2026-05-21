import { cn } from "@almach/utils";
import * as React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("rounded-md skeleton-shimmer", className)}
        {...props}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
