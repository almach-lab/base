import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@almach/utils";

const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
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
});

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof avatarVariants> {}

const AvatarRoot = React.forwardRef<HTMLSpanElement, AvatarProps>(({ className, size, ...props }, ref) => (
	<span ref={ref} className={cn(avatarVariants({ size }), className)} {...props} />
));
AvatarRoot.displayName = "Avatar";

const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(({ className, ...props }, ref) => (
	<img ref={ref} className={cn("aspect-square h-full w-full object-cover", className)} {...props} />
));
AvatarImage.displayName = "Avatar.Image";

const AvatarFallback = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => (
	<span
		ref={ref}
		className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground select-none", className)}
		{...props}
	/>
));
AvatarFallback.displayName = "Avatar.Fallback";

const Avatar = Object.assign(AvatarRoot, {
	Image: AvatarImage,
	Fallback: AvatarFallback,
});

export { Avatar, avatarVariants };
export type { AvatarProps };
