import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@almach/utils";

/* ── Types ─────────────────────────────────────────────────────────────── */
type DialogRootProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;

interface DialogOverlayProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> { }
interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> { }
interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }
interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> { }
interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> { }
interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> { }

/* ── Sub-components ────────────────────────────────────────────────────── */
function DialogOverlay({ className, ...props }: DialogOverlayProps) {
	return (
		<DialogPrimitive.Overlay
			className={cn(
				"fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
				"data-[state=open]:animate-in data-[state=closed]:animate-out",
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
				className
			)}
			{...props}
		/>
	);
}

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	DialogContentProps
>(({ className, children, ...props }, ref) => (
	<DialogPrimitive.Portal>
		<DialogOverlay />
		<DialogPrimitive.Content
			ref={ref}
			className={cn(
				"fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
				"w-[calc(100%-2rem)] max-w-lg",
				"max-h-[calc(100svh-4rem)] overflow-y-auto",
				"rounded-2xl bg-background p-6 shadow-xl",
				"data-[state=open]:animate-in data-[state=closed]:animate-out",
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
				"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
				"data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
				"data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
				"outline-none",
				className
			)}
			{...props}
		>
			{children}
			<DialogPrimitive.Close className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg opacity-50 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
				<X className="h-4 w-4" />
				<span className="sr-only">Close</span>
			</DialogPrimitive.Close>
		</DialogPrimitive.Content>
	</DialogPrimitive.Portal>
));
DialogContent.displayName = "Dialog.Content";

function DialogHeader({ className, ...props }: DialogHeaderProps) {
	return (
		<div
			className={cn("mb-4 flex flex-col space-y-1.5", className)}
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: DialogFooterProps) {
	return (
		<div
			className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
			{...props}
		/>
	);
}

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	DialogTitleProps
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn("text-lg font-semibold leading-none tracking-tight", className)}
		{...props}
	/>
));
DialogTitle.displayName = "Dialog.Title";

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	DialogDescriptionProps
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn("text-sm text-muted-foreground leading-relaxed", className)}
		{...props}
	/>
));
DialogDescription.displayName = "Dialog.Description";

/* ── Compound export ───────────────────────────────────────────────────── */
const DialogRoot = (props: DialogRootProps) => <DialogPrimitive.Root {...props} />;
DialogRoot.displayName = "Dialog";

const Dialog = Object.assign(DialogRoot, {
	Trigger: DialogPrimitive.Trigger,
	Portal: DialogPrimitive.Portal,
	Overlay: DialogOverlay,
	Content: DialogContent,
	Header: DialogHeader,
	Footer: DialogFooter,
	Title: DialogTitle,
	Description: DialogDescription,
	Close: DialogPrimitive.Close,
}
);

export { Dialog };
