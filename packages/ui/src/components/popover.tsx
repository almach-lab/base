import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@almach/utils";
import { MOTION_DURATION_BASE, MOTION_OVERLAY, MOTION_OVERLAY_ENTER, MOTION_OVERLAY_EXIT, MOTION_VAR_OVERLAY_DURATION, resolveMotionDurationMs } from "./_motion.js";

interface PopoverContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const PopoverCtx = React.createContext<PopoverContextValue | null>(null);

function usePopoverCtx() {
	const ctx = React.useContext(PopoverCtx);
	if (!ctx) throw new Error("Popover parts must be used within Popover");
	return ctx;
}

type PopoverRootProps = {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
};

function PopoverRoot({ open, defaultOpen = false, onOpenChange, children }: PopoverRootProps) {
	const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
	const isOpen = open ?? internalOpen;
	const setOpen = React.useCallback(
		(next: boolean) => {
			if (open === undefined) setInternalOpen(next);
			onOpenChange?.(next);
		},
		[open, onOpenChange],
	);

	return <PopoverCtx.Provider value={{ open: isOpen, setOpen }}>{children}</PopoverCtx.Provider>;
}

interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	asChild?: boolean;
	children: React.ReactNode;
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(({ asChild, children, onClick, ...props }, ref) => {
	const { open, setOpen } = usePopoverCtx();
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		onClick?.(e);
		if (!e.defaultPrevented) setOpen(!open);
	};

	if (asChild && React.isValidElement(children)) {
		const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent<HTMLElement>) => void }>;
		return React.cloneElement(child, {
			onClick: (e: React.MouseEvent<HTMLElement>) => {
				child.props.onClick?.(e);
				if (!e.defaultPrevented) setOpen(!open);
			},
		});
	}

	return (
		<button ref={ref} type="button" onClick={handleClick} {...props}>
			{children}
		</button>
	);
});
PopoverTrigger.displayName = "Popover.Trigger";

const PopoverAnchor = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => <div ref={ref} {...props} />);
PopoverAnchor.displayName = "Popover.Anchor";

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
	align?: "start" | "center" | "end";
	sideOffset?: number;
	side?: "top" | "right" | "bottom" | "left";
	popupClassName?: string;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(({ className, popupClassName, ...props }, ref) => {
	const { open } = usePopoverCtx();
	const [mounted, setMounted] = React.useState(open);
	const [isVisible, setIsVisible] = React.useState(false);

	React.useEffect(() => {
		const motionMs = resolveMotionDurationMs(MOTION_VAR_OVERLAY_DURATION, MOTION_DURATION_BASE);
		if (open) {
			setMounted(true);
			const rafId = window.requestAnimationFrame(() => {
				setIsVisible(true);
			});
			return () => window.cancelAnimationFrame(rafId);
		}

		setIsVisible(false);
		if (!mounted) {
			return;
		}

		const timeout = window.setTimeout(() => setMounted(false), motionMs);
		return () => window.clearTimeout(timeout);
	}, [open, mounted]);

	if (!mounted) return null;
	const state = isVisible ? "open" : "closed";

	return createPortal(
		<div className="fixed inset-0 z-50 pointer-events-none">
			<div
				ref={ref}
				data-state={state}
				className={cn(
					"pointer-events-auto fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
					"z-50 w-72 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md outline-none",
					MOTION_OVERLAY,
					MOTION_OVERLAY_ENTER,
					MOTION_OVERLAY_EXIT,
					popupClassName,
					className,
				)}
				{...props}
			/>
		</div>,
		document.body,
	);
});
PopoverContent.displayName = "Popover.Content";

interface PopoverCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	asChild?: boolean;
	children: React.ReactNode;
}

const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(({ asChild, children, onClick, ...props }, ref) => {
	const { setOpen } = usePopoverCtx();
	if (asChild && React.isValidElement(children)) {
		const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent<HTMLElement>) => void }>;
		return React.cloneElement(child, {
			onClick: (e: React.MouseEvent<HTMLElement>) => {
				child.props.onClick?.(e);
				if (!e.defaultPrevented) setOpen(false);
			},
		});
	}
	return (
		<button
			ref={ref}
			type="button"
			onClick={(e) => {
				onClick?.(e);
				if (!e.defaultPrevented) setOpen(false);
			}}
			{...props}
		>
			{children}
		</button>
	);
});
PopoverClose.displayName = "Popover.Close";

interface PopoverComponent {
	(props: PopoverRootProps): React.ReactElement | null;
	Trigger: typeof PopoverTrigger;
	Anchor: typeof PopoverAnchor;
	Content: typeof PopoverContent;
	Close: typeof PopoverClose;
}

const Popover = Object.assign(PopoverRoot, {
	Trigger: PopoverTrigger,
	Anchor: PopoverAnchor,
	Content: PopoverContent,
	Close: PopoverClose,
}) as PopoverComponent;

export { Popover };
