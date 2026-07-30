import { cn } from "@almach/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import * as React from "react";
import { MOTION_INTERACTIVE, MOTION_OVERLAY } from "./_motion.js";
import {
  DISABLED,
  FOCUS_RING_WITHIN,
  MENU_ITEM,
  MENU_SEPARATOR,
} from "./_styles.js";
import { Dialog } from "./dialog.js";

/* ── Base ─────────────────────────────────────────────────────────────────── */
const CommandRoot = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex w-full min-h-0 flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground",
      MOTION_OVERLAY,
      className,
    )}
    {...props}
  />
));
CommandRoot.displayName = "Command";

/* ── Dialog wrapper ───────────────────────────────────────────────────────── */
interface CommandDialogProps {
  open?: boolean | undefined;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function CommandDialog({ open, onOpenChange, children }: CommandDialogProps) {
  return (
    <Dialog
      {...(open !== undefined && { open })}
      {...(onOpenChange !== undefined && { onOpenChange })}
    >
      <Dialog.Content
        className={cn(
          "w-[min(92vw,_44rem)] max-w-[44rem] p-0 shadow-2xl [&>button]:hidden",
          // Keep command palette visually centered in all states.
          "!-translate-y-1/2 !top-1/2",
          // Content-fit dialog with responsive max-height.
          "max-h-[min(86svh,_40rem)] overflow-hidden flex flex-col",
          // Slightly stronger scale change to improve perceived opening animation.
          "data-[state=closed]:scale-[0.94] data-[state=open]:scale-100",
        )}
      >
        <CommandRoot className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3">
          {children}
        </CommandRoot>
      </Dialog.Content>
    </Dialog>
  );
}

/* ── Input ────────────────────────────────────────────────────────────────── */
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "flex items-center gap-2 border-b px-3",
      MOTION_INTERACTIVE,
      FOCUS_RING_WITHIN,
    )}
    cmdk-input-wrapper=""
  >
    <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full bg-transparent py-3 text-sm outline-none",
        "placeholder:text-muted-foreground",
        DISABLED,
        className,
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = "Command.Input";

/* ── List ─────────────────────────────────────────────────────────────────── */
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      "max-h-[min(70svh,_32rem)] overflow-y-auto overflow-x-hidden overscroll-contain scroll-fade no-scrollbar",
      className,
    )}
    {...props}
  />
));
CommandList.displayName = "Command.List";

/* ── Empty ────────────────────────────────────────────────────────────────── */
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm text-muted-foreground"
    {...props}
  />
));
CommandEmpty.displayName = "Command.Empty";

/* ── Group ────────────────────────────────────────────────────────────────── */
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground",
      "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5",
      "[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...props}
  />
));
CommandGroup.displayName = "Command.Group";

/* ── Separator ────────────────────────────────────────────────────────────── */
const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn(MENU_SEPARATOR, "-mx-1", className)}
    {...props}
  />
));
CommandSeparator.displayName = "Command.Separator";

/* ── Item ─────────────────────────────────────────────────────────────────── */
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      MENU_ITEM,
      "cursor-pointer rounded-sm",
      "aria-selected:bg-accent aria-selected:text-accent-foreground",
      "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
      className,
    )}
    {...props}
  />
));
CommandItem.displayName = "Command.Item";

/* ── Shortcut ─────────────────────────────────────────────────────────────── */
function CommandShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/* ── Compound export ──────────────────────────────────────────────────────── */
export const Command = Object.assign(CommandRoot, {
  Dialog: CommandDialog,
  Input: CommandInput,
  List: CommandList,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Separator: CommandSeparator,
  Item: CommandItem,
  Shortcut: CommandShortcut,
});
