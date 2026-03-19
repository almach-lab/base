import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

import { cn } from "@almach/utils";

/* ── Root ─────────────────────────────────────────────────────────────────── */
const RadioGroupRoot = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
	<RadioGroupPrimitive.Root
		ref={ref}
		className={cn("grid gap-2", className)}
		{...props}
	/>
));
RadioGroupRoot.displayName = "Radio.Group";

/* ── Item ─────────────────────────────────────────────────────────────────── */
interface RadioItemProps
	extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
	label?: string;
	description?: string;
}

const RadioItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	RadioItemProps
>(({ className, label, description, id, ...props }, ref) => {
	const innerId = id ?? React.useId();
	return (
		<label
			htmlFor={innerId}
			className={cn(
				"flex cursor-pointer items-start gap-3",
				props.disabled && "cursor-not-allowed opacity-50",
			)}
		>
			<RadioGroupPrimitive.Item
				ref={ref}
				id={innerId}
				className={cn(
					"mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full",
					"border border-input bg-background",
					"transition-colors",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
					"data-[state=checked]:border-foreground data-[state=checked]:bg-foreground",
					"disabled:pointer-events-none",
					className,
				)}
				{...props}
			>
				<RadioGroupPrimitive.Indicator>
					<span className="block h-2 w-2 rounded-full bg-background" />
				</RadioGroupPrimitive.Indicator>
			</RadioGroupPrimitive.Item>
			{(label || description) && (
				<div className="flex flex-col gap-0.5">
					{label && (
						<span className="text-sm font-medium leading-none">{label}</span>
					)}
					{description && (
						<span className="text-xs text-muted-foreground leading-relaxed">
							{description}
						</span>
					)}
				</div>
			)}
		</label>
	);
});
RadioItem.displayName = "Radio.Item";

/* ── Compound export ──────────────────────────────────────────────────────── */
export const Radio = Object.assign(RadioGroupRoot, {
	Item: RadioItem,
});
