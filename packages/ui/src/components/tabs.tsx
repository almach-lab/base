import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs as TabsPrimitive,
} from "react-aria-components";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { DISABLED_DATA, FOCUS_RING } from "./_styles.js";
import { ScrollArea } from "./scroll-area.js";

const tabsListVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      pill: "gap-1 rounded-lg bg-muted p-1",
      underline: "gap-0 border-b border-border",
      minimal: "gap-4",
    },
  },
  defaultVariants: { variant: "pill" },
});

const tabsTriggerVariants = cva(
  cn(
    "inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium outline-none",
    MOTION_INTERACTIVE,
    FOCUS_RING,
    DISABLED_DATA,
  ),
  {
    variants: {
      variant: {
        pill: [
          "rounded-md px-3 py-1.5 text-muted-foreground",
          "data-[hovered]:text-foreground",
          "data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-xs",
        ],
        underline: [
          "relative -mb-px border-b-2 border-transparent px-4 py-2 text-muted-foreground",
          "data-[hovered]:text-foreground",
          "data-[selected]:border-foreground data-[selected]:text-foreground",
        ],
        minimal: [
          "px-0 py-1.5 text-muted-foreground",
          "data-[hovered]:text-foreground",
          "data-[selected]:font-semibold data-[selected]:text-foreground",
        ],
      },
    },
    defaultVariants: { variant: "pill" },
  },
);

const TabsVariantCtx = React.createContext<"pill" | "underline" | "minimal">(
  "pill",
);

type TabsKey = string | number;

interface TabsProps extends Omit<
  React.ComponentPropsWithoutRef<typeof TabsPrimitive>,
  "selectedKey" | "defaultSelectedKey"
> {
  value?: TabsKey | undefined;
  onValueChange?: (key: TabsKey) => void;
  defaultValue?: TabsKey | undefined;
}

const TabsRoot = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value, defaultValue, onValueChange, ...props }, ref) => (
    <TabsPrimitive
      ref={ref}
      {...(onValueChange !== undefined
        ? { onSelectionChange: onValueChange }
        : {})}
      {...(value !== undefined ? { selectedKey: value } : {})}
      {...(defaultValue !== undefined
        ? { defaultSelectedKey: defaultValue }
        : {})}
      {...props}
    />
  ),
);
TabsRoot.displayName = "Tabs";

interface TabsListProps
  extends
    React.ComponentPropsWithoutRef<typeof TabList>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant = "pill", children, ...props }, ref) => (
    <TabsVariantCtx.Provider value={variant ?? "pill"}>
      <ScrollArea.Root className={cn(variant === "pill" && "rounded-lg")}>
        <ScrollArea.Viewport className="border-0 bg-transparent rounded-none">
          <TabList
            ref={ref}
            className={cn(tabsListVariants({ variant }), className)}
            {...props}
          >
            {children}
          </TabList>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </TabsVariantCtx.Provider>
  ),
);
TabsList.displayName = "Tabs.List";

interface TabsTriggerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Tab>,
  "id"
> {
  value?: TabsKey | undefined;
}

const TabsTrigger = React.forwardRef<HTMLDivElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const variant = React.useContext(TabsVariantCtx);
    return (
      <Tab
        ref={ref}
        className={cn(tabsTriggerVariants({ variant }), className)}
        {...(value !== undefined ? { id: value } : {})}
        {...props}
      />
    );
  },
);
TabsTrigger.displayName = "Tabs.Trigger";

interface TabsContentProps extends Omit<
  React.ComponentPropsWithoutRef<typeof TabPanel>,
  "id"
> {
  value?: TabsKey | undefined;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => (
    <TabPanel
      ref={ref}
      className={cn("mt-3 rounded-md outline-none", FOCUS_RING, className)}
      {...(value !== undefined ? { id: value } : {})}
      {...props}
    />
  ),
);
TabsContent.displayName = "Tabs.Content";

const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { Tabs, tabsListVariants, tabsTriggerVariants };
