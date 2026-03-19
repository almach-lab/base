import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "@almach/utils";

const buttonVariants = cva(
	[
		"inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
		"select-none rounded-lg text-sm",
		"transition-all duration-150",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
		"disabled:pointer-events-none disabled:opacity-40",
		"active:scale-[0.97]",
		"[&_svg]:pointer-events-none [&_svg]:shrink-0",
	],
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
				destructive:
					"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
				outline:
					"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				success: "bg-success text-success-foreground shadow-sm hover:bg-success/90",
				warning: "bg-warning text-warning-foreground shadow-sm hover:bg-warning/90",
			},
			size: {
				sm: "h-8 px-3 text-xs [&_svg]:size-3.5",
				default: "h-9 px-4 [&_svg]:size-4",
				lg: "h-11 px-6 text-base [&_svg]:size-4",
				icon: "h-9 w-9 [&_svg]:size-4",
				"icon-sm": "h-8 w-8 [&_svg]:size-3.5",
				"icon-lg": "h-11 w-11 [&_svg]:size-5",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
	VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			loading = false,
			leftIcon,
			rightIcon,
			children,
			disabled,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button";

		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={disabled ?? loading}
				aria-busy={loading}
				{...props}
			>
				{loading ? (
					<Loader2 className="animate-spin" aria-hidden="true" />
				) : (
					leftIcon
				)}
				{children}
				{!loading && rightIcon}
			</Comp>
		);
	}
);

Button.displayName = "Button";

export { Button, buttonVariants };
