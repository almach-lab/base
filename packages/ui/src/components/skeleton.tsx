import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const skeletonVariants = cva("skeleton-shimmer", {
  variants: {
    /** Shape preset. `text` matches a line of body copy. */
    variant: {
      rect: "rounded-md",
      text: "h-4 rounded-sm",
      circle: "aspect-square rounded-full",
      button: "h-9 rounded-md",
      input: "h-9 w-full rounded-md",
      avatar: "size-9 rounded-full",
    },
  },
  defaultVariants: { variant: "rect" },
});

export interface SkeletonProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const SkeletonRoot = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  ),
);
SkeletonRoot.displayName = "Skeleton";

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of lines to render. */
  lines?: number;
  /** Width of the final line, which is shortened to read as a paragraph. */
  lastLineWidth?: string;
}

/** A stack of text lines, with the last one shortened. */
const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, lines = 3, lastLineWidth = "60%", ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {Array.from({ length: Math.max(lines, 1) }, (_, index) => {
        const isLast = index === lines - 1;
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: placeholder lines have no identity
            key={index}
            className={cn(skeletonVariants({ variant: "text" }), "w-full")}
            {...(isLast && lines > 1
              ? { style: { width: lastLineWidth } }
              : {})}
          />
        );
      })}
    </div>
  ),
);
SkeletonText.displayName = "Skeleton.Text";

const Skeleton = Object.assign(SkeletonRoot, { Text: SkeletonText });

export { Skeleton, skeletonVariants };
