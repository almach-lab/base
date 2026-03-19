import * as SelectPrimitive from "@radix-ui/react-select";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { Check, ChevronDown, ChevronUp, ChevronsUpDown, Search } from "lucide-react";
import * as React from "react";

import { cn } from "@almach/utils";

/* ── Sub-components ────────────────────────────────────────────────────── */
const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { error?: boolean }
>(({ className, children, error, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn(
			"flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background",
			"px-3 text-sm transition-all outline-none",
			"hover:border-ring/50 focus:ring-2 focus:ring-ring focus:ring-offset-2",
			"placeholder:text-muted-foreground",
			"disabled:cursor-not-allowed disabled:opacity-50",
			"[&>span]:line-clamp-1",
			error && "border-destructive focus:ring-destructive",
			className
		)}
		aria-invalid={error}
		{...props}
	>
		{children}
		<SelectPrimitive.Icon asChild>
			<ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "Select.Trigger";

const SelectScrollUpButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollUpButton
		ref={ref}
		className={cn("flex cursor-default items-center justify-center py-1", className)}
		{...props}
	>
		<ChevronUp className="h-4 w-4" />
	</SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = "Select.ScrollUpButton";

const SelectScrollDownButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollDownButton
		ref={ref}
		className={cn("flex cursor-default items-center justify-center py-1", className)}
		{...props}
	>
		<ChevronDown className="h-4 w-4" />
	</SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = "Select.ScrollDownButton";

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ref}
			className={cn(
				"relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl",
				"data-[state=open]:animate-in data-[state=closed]:animate-out",
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
				"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
				"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
				"data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
				position === "popper" && "w-[var(--radix-select-trigger-width)] translate-y-1",
				className
			)}
			position={position}
			{...props}
		>
			<SelectScrollUpButton />
			<SelectPrimitive.Viewport className="p-1.5">
				{children}
			</SelectPrimitive.Viewport>
			<SelectScrollDownButton />
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
));
SelectContent.displayName = "Select.Content";

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Label
		ref={ref}
		className={cn("px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", className)}
		{...props}
	/>
));
SelectLabel.displayName = "Select.Label";

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex w-full cursor-default select-none items-center rounded-lg py-1.5 pl-8 pr-2 text-sm outline-none",
			"focus:bg-accent focus:text-accent-foreground",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className
		)}
		{...props}
	>
		<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<Check className="h-4 w-4" />
			</SelectPrimitive.ItemIndicator>
		</span>
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
));
SelectItem.displayName = "Select.Item";

function SelectSeparator({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>) {
	return (
		<SelectPrimitive.Separator
			className={cn("-mx-1.5 my-1 h-px bg-border", className)}
			{...props}
		/>
	);
}

/* ── Searchable (formerly Combobox) ────────────────────────────────────── */
export interface SelectSearchableOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface SelectSearchableProps {
	options: SelectSearchableOption[];
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	empty?: React.ReactNode;
	disabled?: boolean;
	error?: boolean;
	className?: string;
}

function SelectSearchable({
	options,
	value,
	onChange,
	placeholder = "Select…",
	searchPlaceholder = "Search…",
	empty = "No results.",
	disabled,
	error,
	className,
}: SelectSearchableProps) {
	const [open, setOpen] = React.useState(false);
	const selected = options.find((o) => o.value === value);

	const handleSelect = (val: string) => {
		onChange?.(val === value ? "" : val);
		setOpen(false);
	};

	return (
		<PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
			<PopoverPrimitive.Trigger asChild>
				<button
					type="button"
					role="combobox"
					aria-expanded={open}
					aria-haspopup="listbox"
					disabled={disabled}
					className={cn(
						"flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm",
						"transition-all outline-none",
						"hover:border-ring/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
						"disabled:cursor-not-allowed disabled:opacity-50",
						error && "border-destructive focus-visible:ring-destructive",
						!selected && "text-muted-foreground",
						className,
					)}
				>
					<span className="truncate">{selected?.label ?? placeholder}</span>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</button>
			</PopoverPrimitive.Trigger>

			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					className={cn(
						"z-50 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border bg-popover p-0 shadow-xl",
						"data-[state=open]:animate-in data-[state=closed]:animate-out",
						"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
						"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
						"translate-y-1",
					)}
					align="start"
					sideOffset={4}
				>
					<CommandPrimitive className="flex flex-col" aria-label={placeholder}>
						<div className="flex items-center gap-2 border-b px-3" cmdk-input-wrapper="">
							<Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
							<CommandPrimitive.Input
								placeholder={searchPlaceholder}
								aria-label={searchPlaceholder}
								className="flex h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
							/>
						</div>

						<CommandPrimitive.List
							className="max-h-56 overflow-y-auto p-1"
							role="listbox"
							aria-label="Options"
						>
							<CommandPrimitive.Empty className="py-4 text-center text-sm text-muted-foreground">
								{empty}
							</CommandPrimitive.Empty>

							{options.map((opt) => (
								<CommandPrimitive.Item
									key={opt.value}
									value={opt.value}
									disabled={opt.disabled}
									onSelect={handleSelect}
									role="option"
									aria-selected={value === opt.value}
									className={cn(
										"relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none",
										"transition-colors",
										"data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
										"data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
									)}
								>
									<Check
										className={cn(
											"h-4 w-4 shrink-0",
											value === opt.value ? "opacity-100" : "opacity-0",
										)}
										aria-hidden="true"
									/>
									{opt.label}
								</CommandPrimitive.Item>
							))}
						</CommandPrimitive.List>
					</CommandPrimitive>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Root>
	);
}
SelectSearchable.displayName = "Select.Searchable";

/* ── Compound export ───────────────────────────────────────────────────── */
const Select = Object.assign(SelectPrimitive.Root, {
	Group: SelectPrimitive.Group,
	Value: SelectPrimitive.Value,
	Trigger: SelectTrigger,
	Content: SelectContent,
	Label: SelectLabel,
	Item: SelectItem,
	Separator: SelectSeparator,
	ScrollUpButton: SelectScrollUpButton,
	ScrollDownButton: SelectScrollDownButton,
	/** Searchable/combobox variant — renders a popover with a search input */
	Searchable: SelectSearchable,
});

export { Select };
export type { SelectSearchableOption as ComboboxOption, SelectSearchableProps as ComboboxProps };
