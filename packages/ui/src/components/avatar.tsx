import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@almach/utils";

const avatarVariants = cva(
	"relative flex shrink-0 overflow-hidden rounded-full",
	{
		variants: {
			size: {
				sm: "h-6 w-6 text-[10px]",
				default: "h-9 w-9 text-sm",
				lg: "h-12 w-12 text-base",
				xl: "h-16 w-16 text-xl",
			},
		},
		defaultVariants: {
			size: "default",
		},
	}
);

interface AvatarProps
	extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
	VariantProps<typeof avatarVariants> { }

const AvatarRoot = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Root>,
	AvatarProps
>(({ className, size, ...props }, ref) => (
	<AvatarPrimitive.Root
		ref={ref}
		className={cn(avatarVariants({ size }), className)}
		{...props}
	/>
));
AvatarRoot.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Image>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Image
		ref={ref}
		className={cn("aspect-square h-full w-full object-cover", className)}
		{...props}
	/>
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Fallback>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Fallback
		ref={ref}
		className={cn(
			"flex h-full w-full items-center justify-center rounded-full font-medium select-none",
			className
		)}
		style={{
			backgroundColor: "hsl(var(--muted))",
			color: "hsl(var(--muted-foreground))",
		}}
		{...props}
	/>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const Avatar = Object.assign(AvatarRoot, {
	Image: AvatarImage,
	Fallback: AvatarFallback,
});

export { Avatar, avatarVariants };
export type { AvatarProps };
