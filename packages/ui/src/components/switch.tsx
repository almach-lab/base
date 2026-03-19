import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@almach/utils";

/* ── Variants ─────────────────────────────────────────────────────────────── */
const switchTrack = cva(
	[
		"relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
		"border-2 border-transparent",
		"transition-colors duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
		"disabled:cursor-not-allowed disabled:opacity-50",
		// Uses CSS variables from globals.css — override --switch-on / --switch-off to theme
		// Note: --switch-on/off are full color values (e.g. hsl(...)), so use var() directly
		"bg-[var(--switch-off)] data-[state=checked]:bg-[var(--switch-on)]",
	],
	{
		variants: {
			size: {
				sm: "h-[22px] w-[38px]",
				default: "h-[28px] w-[48px]",
				lg: "h-[34px] w-[60px]",
			},
		},
		defaultVariants: { size: "default" },
	},
);

const switchThumb = cva(
	[
		"pointer-events-none block rounded-full bg-white",
		// Shadow makes thumb visible on any background color in both light and dark modes
		"shadow-[0_1px_3px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.08]",
		"transition-transform duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
	],
	{
		variants: {
			size: {
				sm: "h-[16px] w-[16px] data-[state=checked]:translate-x-[16px] data-[state=unchecked]:translate-x-0",
				default: "h-[22px] w-[22px] data-[state=checked]:translate-x-[20px] data-[state=unchecked]:translate-x-0",
				lg: "h-[28px] w-[28px] data-[state=checked]:translate-x-[26px] data-[state=unchecked]:translate-x-0",
			},
		},
		defaultVariants: { size: "default" },
	},
);

/* ── Switch ───────────────────────────────────────────────────────────────── */
export interface SwitchProps
	extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
	VariantProps<typeof switchTrack> { }

const Switch = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitive.Root>,
	SwitchProps
>(({ className, size, ...props }, ref) => (
	<SwitchPrimitive.Root
		ref={ref}
		className={cn(switchTrack({ size }), className)}
		{...props}
	>
		<SwitchPrimitive.Thumb className={switchThumb({ size })} />
	</SwitchPrimitive.Root>
));
Switch.displayName = "Switch";

export { Switch };
