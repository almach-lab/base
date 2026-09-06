import { cn } from "@almach/utils";
import { ChevronRight } from "lucide-react";
import * as React from "react";
import {
  Button,
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
} from "react-aria-components";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { DISABLED_DATA, FOCUS_RING } from "./_styles.js";

export interface TreeProps<T extends object> extends Omit<
  React.ComponentPropsWithoutRef<typeof AriaTree<T>>,
  "className"
> {
  className?: string;
}

function TreeRootInner<T extends object>(
  { className, ...props }: TreeProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaTree
      ref={ref}
      className={cn(
        "flex w-full flex-col gap-0.5 overflow-auto rounded-lg border border-border bg-card p-1.5 text-sm outline-none",
        className,
      )}
      {...props}
    />
  );
}

const TreeRoot = React.forwardRef(TreeRootInner) as <T extends object>(
  props: TreeProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement | null;
(TreeRoot as { displayName?: string }).displayName = "Tree";

export interface TreeItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AriaTreeItem>,
  "className"
> {
  className?: string;
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  ({ className, ...props }, ref) => (
    <AriaTreeItem
      ref={ref}
      className={cn(
        "group/row outline-none",
        // React Aria indents by depth via a CSS variable on the row.
        "[--tree-indent:1.25rem]",
        className,
      )}
      {...props}
    />
  ),
);
TreeItem.displayName = "Tree.Item";

export interface TreeItemContentProps {
  children?: React.ReactNode;
  className?: string;
  /** Hide the expand chevron for leaf rows that still have children slots. */
  hideExpandButton?: boolean;
}

/**
 * Row chrome for a tree item. Renders the expand affordance, then the row
 * content, indented by the item's depth.
 */
function TreeItemContent({
  children,
  className,
  hideExpandButton = false,
}: TreeItemContentProps) {
  return (
    <AriaTreeItemContent>
      {({ level, hasChildItems, isExpanded }) => (
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-foreground",
            MOTION_INTERACTIVE,
            FOCUS_RING,
            DISABLED_DATA,
            "group-data-[hovered]/row:bg-accent/50",
            className,
          )}
          style={{
            paddingLeft: `calc(0.5rem + var(--tree-indent) * ${level - 1})`,
          }}
        >
          {hasChildItems && !hideExpandButton ? (
            <Button
              slot="chevron"
              className={cn(
                "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground",
                MOTION_INTERACTIVE,
                FOCUS_RING,
                "data-[hovered]:text-foreground",
              )}
            >
              <ChevronRight
                aria-hidden="true"
                className={cn(
                  "size-3.5",
                  MOTION_INTERACTIVE,
                  isExpanded && "rotate-90",
                )}
              />
            </Button>
          ) : (
            <span aria-hidden="true" className="size-4 shrink-0" />
          )}
          {children}
        </div>
      )}
    </AriaTreeItemContent>
  );
}
TreeItemContent.displayName = "Tree.ItemContent";

const Tree = Object.assign(TreeRoot, {
  Item: TreeItem,
  ItemContent: TreeItemContent,
});

export { Tree };
