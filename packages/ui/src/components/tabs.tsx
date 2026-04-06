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
import { ScrollArea } from "./scroll-area.js";

const tabsListVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      pill: "gap-1 rounded-xl bg-muted p-1",
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
  ),
  {
    variants: {
      variant: {
        pill: [
          "rounded-lg px-3 py-1.5 text-muted-foreground",
          "hover:text-foreground",
          "data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm",
          "focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
        ],
        underline: [
          "relative px-4 py-2 text-muted-foreground border-b-2 border-transparent -mb-px",
          "hover:text-foreground",
          "data-[selected]:border-foreground data-[selected]:text-foreground",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
        ],
        minimal: [
          "px-0 py-1.5 text-muted-foreground",
          "hover:text-foreground",
          "data-[selected]:text-foreground data-[selected]:font-semibold",
          "focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
        ],
      },
    },
    defaultVariants: { variant: "pill" },
  },
);

const TabsVariantCtx = React.createContext<"pill" | "underline" | "minimal">(
  "pill",
);

interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive> {}

const TabsRoot = React.forwardRef<HTMLDivElement, TabsProps>((props, ref) => (
  <TabsPrimitive ref={ref} {...props} />
));
TabsRoot.displayName = "Tabs";

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabList>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant = "pill", children, ...props }, ref) => (
    <TabsVariantCtx.Provider value={variant ?? "pill"}>
      <ScrollArea.Root className={cn(variant === "pill" && "rounded-xl")}>
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

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof Tab> {}

const TabsTrigger = React.forwardRef<HTMLDivElement, TabsTriggerProps>(
  ({ className, ...props }, ref) => {
    const variant = React.useContext(TabsVariantCtx);
    return (
      <Tab
        ref={ref}
        className={cn(tabsTriggerVariants({ variant }), className)}
        {...props}
      />
    );
  },
);
TabsTrigger.displayName = "Tabs.Trigger";

interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabPanel> {}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, ...props }, ref) => (
    <TabPanel
      ref={ref}
      className={cn(
        "mt-3 outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg",
        className,
      )}
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
