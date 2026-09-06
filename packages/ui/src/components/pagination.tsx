import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";
import { Button } from "react-aria-components";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { DISABLED_DATA, FOCUS_RING } from "./_styles.js";

const paginationItemVariants = cva(
  [
    "inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1",
    "rounded-md text-sm font-medium tabular-nums",
    MOTION_INTERACTIVE,
    FOCUS_RING,
    DISABLED_DATA,
    "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      size: {
        sm: "h-8 min-w-8 px-2 text-xs [&_svg]:size-3.5",
        default: "h-9 min-w-9 px-2.5 [&_svg]:size-4",
        lg: "h-11 min-w-11 px-3 text-base [&_svg]:size-4",
      },
      active: {
        true: "border border-input bg-background text-foreground shadow-xs data-[hovered]:bg-background",
        false: "text-muted-foreground",
      },
    },
    defaultVariants: { size: "default", active: false },
  },
);

/** Sentinel for a collapsed run of pages. */
const ELLIPSIS = "ellipsis" as const;

export type PaginationRangeEntry = number | typeof ELLIPSIS;

/**
 * Builds the visible page list: always the first and last `boundaryCount`
 * pages, plus `siblingCount` pages either side of the current one, with
 * ellipses standing in for whatever is skipped.
 */
export function getPaginationRange({
  page,
  pageCount,
  siblingCount = 1,
  boundaryCount = 1,
}: {
  page: number;
  pageCount: number;
  siblingCount?: number;
  boundaryCount?: number;
}): PaginationRangeEntry[] {
  if (pageCount <= 0) return [];

  const clampedPage = Math.min(Math.max(page, 1), pageCount);
  const visible = new Set<number>();

  for (let i = 1; i <= Math.min(boundaryCount, pageCount); i += 1) {
    visible.add(i);
    visible.add(pageCount - i + 1);
  }

  for (
    let i = clampedPage - siblingCount;
    i <= clampedPage + siblingCount;
    i += 1
  ) {
    if (i >= 1 && i <= pageCount) visible.add(i);
  }

  const pages = [...visible].sort((a, b) => a - b);
  const range: PaginationRangeEntry[] = [];

  pages.forEach((value, index) => {
    const previous = pages[index - 1];
    if (previous !== undefined && value - previous > 1) range.push(ELLIPSIS);
    range.push(value);
  });

  return range;
}

export interface PaginationProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, "onChange">,
    VariantProps<typeof paginationItemVariants> {
  /** Current page, 1-indexed. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  onPageChange?: (page: number) => void;
  /** Pages rendered either side of the current page. */
  siblingCount?: number;
  /** Pages always rendered at each end. */
  boundaryCount?: number;
  /** Render page numbers. When false, only the prev/next controls show. */
  showPageNumbers?: boolean;
  /** Accessible label for the surrounding `nav`. */
  label?: string;
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      page,
      pageCount,
      onPageChange,
      siblingCount = 1,
      boundaryCount = 1,
      showPageNumbers = true,
      size,
      label = "Pagination",
      ...props
    },
    ref,
  ) => {
    const range = React.useMemo(
      () =>
        showPageNumbers
          ? getPaginationRange({ page, pageCount, siblingCount, boundaryCount })
          : [],
      [page, pageCount, siblingCount, boundaryCount, showPageNumbers],
    );

    const goTo = (next: number) => {
      const clamped = Math.min(Math.max(next, 1), pageCount);
      if (clamped !== page) onPageChange?.(clamped);
    };

    return (
      <nav
        ref={ref}
        aria-label={label}
        className={cn("flex items-center gap-1", className)}
        {...props}
      >
        <Button
          aria-label="Go to previous page"
          isDisabled={page <= 1}
          onPress={() => goTo(page - 1)}
          className={cn(paginationItemVariants({ size }), "px-2")}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>

        {range.map((entry, index) =>
          entry === ELLIPSIS ? (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis slots have no stable identity
              key={`ellipsis-${index}`}
              role="presentation"
              className={cn(
                paginationItemVariants({ size }),
                "cursor-default text-muted-foreground",
              )}
            >
              <MoreHorizontal aria-hidden="true" />
              <span className="sr-only">More pages</span>
            </span>
          ) : (
            <Button
              key={entry}
              aria-label={`Go to page ${entry}`}
              {...(entry === page ? { "aria-current": "page" as const } : {})}
              onPress={() => goTo(entry)}
              className={cn(
                paginationItemVariants({ size, active: entry === page }),
              )}
            >
              {entry}
            </Button>
          ),
        )}

        <Button
          aria-label="Go to next page"
          isDisabled={page >= pageCount}
          onPress={() => goTo(page + 1)}
          className={cn(paginationItemVariants({ size }), "px-2")}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </nav>
    );
  },
);
Pagination.displayName = "Pagination";

export { Pagination, paginationItemVariants };
