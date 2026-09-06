import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { DISABLED_DATA, FOCUS_RING } from "./_styles.js";
import { DropdownMenu } from "./dropdown-menu.js";

const menubarVariants = cva("flex items-center gap-0.5", {
  variants: {
    variant: {
      plain: "",
      bordered: "rounded-lg border border-border bg-card p-1 shadow-xs",
    },
  },
  defaultVariants: { variant: "bordered" },
});

const menubarTriggerClasses = cn(
  "inline-flex h-8 cursor-pointer select-none items-center gap-1.5 rounded-md px-3",
  "text-sm font-medium text-foreground outline-none",
  MOTION_INTERACTIVE,
  FOCUS_RING,
  DISABLED_DATA,
  "hover:bg-accent hover:text-accent-foreground",
  "data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground",
  "[&_svg]:size-4 [&_svg]:shrink-0",
);

const TRIGGER_SELECTOR = "[data-menubar-trigger]";

export interface MenubarProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof menubarVariants> {}

const MenubarRoot = React.forwardRef<HTMLDivElement, MenubarProps>(
  ({ className, variant, onKeyDown, ...props }, ref) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null);

    /** Left/Right arrows walk between top-level menus, as ARIA expects. */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const root = rootRef.current;
      if (!root) return;

      const triggers = Array.from(
        root.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR),
      );
      const active = document.activeElement as HTMLElement | null;
      const index = active ? triggers.indexOf(active) : -1;
      if (index === -1) return;

      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next =
        triggers[(index + delta + triggers.length) % triggers.length];
      next?.focus();
    };

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === "function") {
            ref(node);
            return;
          }
          if (ref) ref.current = node;
        }}
        role="menubar"
        className={cn(menubarVariants({ variant }), className)}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);
MenubarRoot.displayName = "Menubar";

export interface MenubarMenuProps {
  /** Top-level menu label. */
  label: React.ReactNode;
  /** Menu contents — use `Menubar.Item`, `.Label`, `.Separator`, `.Sub`. */
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

/** One top-level menu. Wraps DropdownMenu so item styling stays shared. */
function MenubarMenu({
  label,
  children,
  disabled = false,
  className,
}: MenubarMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          role="menuitem"
          data-menubar-trigger=""
          disabled={disabled}
          aria-disabled={disabled || undefined}
          className={cn(menubarTriggerClasses, className)}
        >
          {label}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" sideOffset={6} className="min-w-48">
        {children}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
MenubarMenu.displayName = "Menubar.Menu";

const Menubar = Object.assign(MenubarRoot, {
  Menu: MenubarMenu,
  Item: DropdownMenu.Item,
  CheckboxItem: DropdownMenu.CheckboxItem,
  RadioItem: DropdownMenu.RadioItem,
  RadioGroup: DropdownMenu.RadioGroup,
  Label: DropdownMenu.Label,
  Separator: DropdownMenu.Separator,
  Shortcut: DropdownMenu.Shortcut,
  Sub: DropdownMenu.Sub,
  SubTrigger: DropdownMenu.SubTrigger,
  SubContent: DropdownMenu.SubContent,
});

export { Menubar, menubarVariants };
