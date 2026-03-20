import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@almach/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 tracking-tight",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground hover:bg-primary/80",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				destructive:
					"bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/15",
				success:
					"bg-success/10 text-success border border-success/20 hover:bg-success/15",
				warning:
					"bg-warning/10 text-warning border border-warning/20 hover:bg-warning/15",
				outline: "border border-input text-foreground bg-transparent hover:bg-accent",
				ghost: "bg-muted text-muted-foreground hover:bg-muted/80",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
	VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };
