import { cn } from "@almach/utils";
import { Check, ChevronRight } from "lucide-react";
import * as React from "react";
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  MenuSection as AriaMenuSection,
  type MenuSectionProps as AriaMenuSectionProps,
  MenuTrigger as AriaMenuTrigger,
  type MenuTriggerProps as AriaMenuTriggerProps,
  SubmenuTrigger as AriaSubmenuTrigger,
  Collection,
  composeRenderProps,
  Header,
  Popover,
  Separator,
  type SeparatorProps,
  type SubmenuTriggerProps,
} from "react-aria-components";
import {
  MOTION_OVERLAY,
  MOTION_OVERLAY_ENTER,
  MOTION_OVERLAY_EXIT,
} from "./_motion.js";

type DropdownPlacement =
  | "top"
  | "top start"
  | "top end"
  | "right"
  | "right top"
  | "right bottom"
  | "bottom"
  | "bottom start"
  | "bottom end"
  | "left"
  | "left top"
  | "left bottom";

function toPlacement(
  side: "top" | "right" | "bottom" | "left" = "bottom",
  align: "start" | "center" | "end" = "center",
): DropdownPlacement {
  if (align === "center") return side;
  const cross =
    side === "top" || side === "bottom"
      ? align
      : align === "start"
        ? "top"
        : "bottom";
  return `${side} ${cross}` as DropdownPlacement;
}

interface DropdownRootProps extends Omit<AriaMenuTriggerProps, "children"> {
  children?: React.ReactNode;
}

interface DropdownTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

function DropdownMenuTrigger(_props: DropdownTriggerProps) {
  return null;
}
DropdownMenuTrigger.displayName = "DropdownMenu.Trigger";

interface DropdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  menuClassName?: string;
  menuProps?: Omit<AriaMenuProps<object>, "children" | "className">;
}

function DropdownMenuContent(_props: DropdownContentProps) {
  return null;
}
DropdownMenuContent.displayName = "DropdownMenu.Content";

function getContentProps(
  element: React.ReactNode,
): DropdownContentProps | null {
  if (!React.isValidElement(element)) return null;
  if (element.type !== DropdownMenuContent) return null;
  return element.props as DropdownContentProps;
}

function DropdownRoot({ children, ...props }: DropdownRootProps) {
  let triggerProps: DropdownTriggerProps | null = null;
  let contentProps: DropdownContentProps | null = null;

  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement(child)) continue;
    if (child.type === DropdownMenuTrigger) {
      triggerProps = child.props as DropdownTriggerProps;
    }
    const parsedContent = getContentProps(child);
    if (parsedContent) contentProps = parsedContent;
  }

  if (!triggerProps || !contentProps) {
    return null;
  }

  const triggerNode = triggerProps.asChild ? (
    (React.Children.only(triggerProps.children) as React.ReactElement)
  ) : (
    <button type="button">{triggerProps.children}</button>
  );

  const {
    side,
    align,
    sideOffset,
    className,
    menuClassName,
    menuProps,
    children: menuChildren,
  } = contentProps;

  const placement = toPlacement(side, align);
  const offset = sideOffset ?? 8;

  return (
    <AriaMenuTrigger {...props}>
      {triggerNode}
      <Popover
        offset={offset}
        placement={placement}
        className={cn(
          "min-w-[12rem] overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl outline-none",
          MOTION_OVERLAY,
          MOTION_OVERLAY_ENTER.replaceAll(
            "data-[state=open]:",
            "data-[entering]:",
          ),
          MOTION_OVERLAY_EXIT.replaceAll(
            "data-[state=closed]:",
            "data-[exiting]:",
          ),
          className,
        )}
      >
        <AriaMenu
          {...(menuProps ?? {})}
          className={cn(
            "max-h-[min(60svh,_24rem)] overflow-y-auto overflow-x-hidden p-0.5 outline-none",
            menuClassName,
          )}
        >
          {menuChildren}
        </AriaMenu>
      </Popover>
    </AriaMenuTrigger>
  );
}

interface DropdownMenuItemProps
  extends Omit<AriaMenuItemProps, "className" | "isDisabled"> {
  inset?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  isDisabled?: boolean;
  className?: string;
}

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(
  (
    {
      className,
      inset,
      destructive,
      children,
      textValue,
      disabled,
      isDisabled,
      ...props
    },
    ref,
  ) => {
    const resolvedTextValue =
      textValue ?? (typeof children === "string" ? children : null);

    return (
      <AriaMenuItem
        ref={ref}
        {...(resolvedTextValue !== null
          ? { textValue: resolvedTextValue }
          : {})}
        className={composeRenderProps(className, (nextClassName, renderProps) =>
          cn(
            "group relative flex cursor-default select-none items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none",
            "transition-colors duration-150 ease-out",
            renderProps.isFocused && "bg-accent text-accent-foreground",
            renderProps.isDisabled && "pointer-events-none opacity-50",
            inset && "pl-8",
            destructive && "text-destructive",
            "[&_svg]:size-4 [&_svg]:shrink-0",
            nextClassName,
          ),
        )}
        {...((isDisabled ?? disabled) ? { isDisabled: true } : {})}
        {...props}
      >
        {composeRenderProps(children, (childContent, renderProps) => (
          <>
            {renderProps.selectionMode !== "none" && (
              <span className="flex w-4 items-center justify-center">
                {renderProps.isSelected ? (
                  <Check aria-hidden className="h-4 w-4" />
                ) : null}
              </span>
            )}
            <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
              {childContent}
            </span>
            {renderProps.hasSubmenu ? (
              <ChevronRight aria-hidden className="absolute right-2 h-4 w-4" />
            ) : null}
          </>
        ))}
      </AriaMenuItem>
    );
  },
);
DropdownMenuItem.displayName = "DropdownMenu.Item";

(
  DropdownMenuItem as unknown as {
    getCollectionNode?: unknown;
  }
).getCollectionNode = (
  AriaMenuItem as unknown as {
    getCollectionNode?: unknown;
  }
).getCollectionNode;

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(({ className, ...props }, ref) => (
  <DropdownMenuItem ref={ref} className={cn("pl-8", className)} {...props} />
));
DropdownMenuCheckboxItem.displayName = "DropdownMenu.CheckboxItem";

(
  DropdownMenuCheckboxItem as unknown as {
    getCollectionNode?: unknown;
  }
).getCollectionNode = (
  AriaMenuItem as unknown as {
    getCollectionNode?: unknown;
  }
).getCollectionNode;

const DropdownMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(({ className, ...props }, ref) => (
  <DropdownMenuItem ref={ref} className={cn("pl-8", className)} {...props} />
));
DropdownMenuRadioItem.displayName = "DropdownMenu.RadioItem";

(
  DropdownMenuRadioItem as unknown as {
    getCollectionNode?: unknown;
  }
).getCollectionNode = (
  AriaMenuItem as unknown as {
    getCollectionNode?: unknown;
  }
).getCollectionNode;

interface DropdownMenuLabelProps {
  className?: string;
  inset?: boolean;
  children?: React.ReactNode;
}

function DropdownMenuLabel({
  className,
  inset,
  children,
}: DropdownMenuLabelProps) {
  const textValue = typeof children === "string" ? children : undefined;

  return (
    <AriaMenuItem
      isDisabled
      {...(textValue !== undefined ? { textValue } : {})}
      className={cn(
        "cursor-default px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
        inset && "pl-8",
        className,
      )}
    >
      {children}
    </AriaMenuItem>
  );
}

(
  DropdownMenuLabel as unknown as {
    getCollectionNode?: unknown;
  }
).getCollectionNode = (
  AriaMenuItem as unknown as {
    getCollectionNode?: unknown;
  }
).getCollectionNode;

function DropdownMenuSeparator({ className, ...props }: SeparatorProps) {
  return (
    <Separator
      {...props}
      className={cn("-mx-1.5 my-1 h-px bg-border", className)}
    />
  );
}

(
  DropdownMenuSeparator as unknown as {
    getCollectionNode?: unknown;
  }
).getCollectionNode = (
  Separator as unknown as {
    getCollectionNode?: unknown;
  }
).getCollectionNode;

interface DropdownMenuSectionProps<T extends object>
  extends AriaMenuSectionProps<T> {
  title?: string;
  items?: Iterable<T>;
}

function DropdownMenuGroup<T extends object>({
  title,
  items,
  children,
  ...props
}: DropdownMenuSectionProps<T>) {
  return (
    <AriaMenuSection
      {...props}
      className="after:block after:h-1 after:content-['']"
    >
      {title ? (
        <Header className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </Header>
      ) : null}
      <Collection {...(items !== undefined && { items })}>
        {children}
      </Collection>
    </AriaMenuSection>
  );
}

(
  DropdownMenuGroup as unknown as {
    getCollectionNode?: unknown;
  }
).getCollectionNode = (
  AriaMenuSection as unknown as {
    getCollectionNode?: unknown;
  }
).getCollectionNode;

function DropdownMenuSubTrigger(props: SubmenuTriggerProps) {
  const [trigger, menu] = React.Children.toArray(props.children) as [
    React.ReactElement,
    React.ReactElement,
  ];

  const contentProps = getContentProps(menu);

  if (!contentProps) {
    return <AriaSubmenuTrigger {...props}>{props.children}</AriaSubmenuTrigger>;
  }

  const {
    side,
    align,
    sideOffset,
    className,
    menuClassName,
    menuProps,
    children: menuChildren,
  } = contentProps;

  const placement = toPlacement(side ?? "right", align ?? "start");
  const offset = sideOffset ?? 6;

  return (
    <AriaSubmenuTrigger {...props}>
      {trigger}
      <Popover
        offset={offset}
        crossOffset={-4}
        placement={placement}
        className={cn(
          "min-w-[12rem] overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl outline-none",
          MOTION_OVERLAY,
          MOTION_OVERLAY_ENTER.replaceAll(
            "data-[state=open]:",
            "data-[entering]:",
          ),
          MOTION_OVERLAY_EXIT.replaceAll(
            "data-[state=closed]:",
            "data-[exiting]:",
          ),
          className,
        )}
      >
        <AriaMenu
          {...(menuProps ?? {})}
          className={cn(
            "max-h-[min(60svh,_24rem)] overflow-y-auto overflow-x-hidden p-0.5 outline-none",
            menuClassName,
          )}
        >
          {menuChildren}
        </AriaMenu>
      </Popover>
    </AriaSubmenuTrigger>
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-50", className)}
      {...props}
    />
  );
}

const DropdownMenu = Object.assign(DropdownRoot, {
  Trigger: DropdownMenuTrigger,
  Portal: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Sub: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  RadioGroup: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Group: DropdownMenuGroup,
  Content: DropdownMenuContent,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioItem: DropdownMenuRadioItem,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Shortcut: DropdownMenuShortcut,
});

export { DropdownMenu };
