import { Drawer as DrawerPrimitive } from "vaul";
import * as React from "react";

import { cn } from "@almach/utils";

/* ── Types ─────────────────────────────────────────────────────────────── */
type DrawerRootProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Root>;
interface DrawerOverlayProps extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> { }
interface DrawerContentProps extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> { }
interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }
interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> { }
interface DrawerTitleProps extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title> { }
interface DrawerDescriptionProps extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description> { }

/* ── Sub-components ────────────────────────────────────────────────────── */
function DrawerOverlay({ className, ...props }: DrawerOverlayProps) {
	return (
		<DrawerPrimitive.Overlay
			className={cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-sm", className)}
			{...props}
		/>
	);
}

const DrawerContent = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Content>,
	DrawerContentProps
>(({ className, children, ...props }, ref) => (
	<DrawerPrimitive.Portal>
		<DrawerOverlay />
		<DrawerPrimitive.Content
			ref={ref}
			className={cn(
				"fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[20px]",
				"bg-background shadow-xl outline-none",
				className
			)}
			{...props}
		>
			{/* Handle */}
			<div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted" />
			<div className="flex-1 overflow-auto px-4 pb-safe">
				{children}
			</div>
		</DrawerPrimitive.Content>
	</DrawerPrimitive.Portal>
));
DrawerContent.displayName = "Drawer.Content";

function DrawerHeader({ className, ...props }: DrawerHeaderProps) {
	return (
		<div
			className={cn("pt-4 pb-2 flex flex-col space-y-1.5", className)}
			{...props}
		/>
	);
}

function DrawerFooter({ className, ...props }: DrawerFooterProps) {
	return (
		<div
			className={cn("mt-auto flex flex-col gap-2 pt-4 pb-4", className)}
			{...props}
		/>
	);
}

const DrawerTitle = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Title>,
	DrawerTitleProps
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Title
		ref={ref}
		className={cn("text-lg font-semibold leading-none tracking-tight", className)}
		{...props}
	/>
));
DrawerTitle.displayName = "Drawer.Title";

const DrawerDescription = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Description>,
	DrawerDescriptionProps
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Description
		ref={ref}
		className={cn("text-sm text-muted-foreground leading-relaxed", className)}
		{...props}
	/>
));
DrawerDescription.displayName = "Drawer.Description";

/* ── Compound export ───────────────────────────────────────────────────── */
const DrawerRoot = ({ shouldScaleBackground = true, ...props }: DrawerRootProps) => (
	<DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
DrawerRoot.displayName = "Drawer";

const Drawer = Object.assign(DrawerRoot, {
	Trigger: DrawerPrimitive.Trigger,
	Portal: DrawerPrimitive.Portal,
	Overlay: DrawerOverlay,
	Content: DrawerContent,
	Header: DrawerHeader,
	Footer: DrawerFooter,
	Title: DrawerTitle,
	Description: DrawerDescription,
	Close: DrawerPrimitive.Close,
}
);

export { Drawer };
