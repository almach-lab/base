import { cn } from "@almach/utils";
import type * as React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("rounded-md skeleton-shimmer", className)} {...props} />
  );
}

export { Skeleton };
