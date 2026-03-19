import * as React from "react";
import { cn } from "@almach/utils";

/* ── Root ─────────────────────────────────────────────────────────────────── */
interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Small label shown above the group */
	label?: string;
	/** Helper text shown below the group */
	hint?: string;
}

function GroupRoot({ label, hint, className, children, ...props }: GroupProps) {
	return (
		<div className={cn("space-y-1.5", className)} {...props}>
			{label && (
				<p className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
					{label}
				</p>
			)}
			<div className="overflow-hidden rounded-xl border bg-card divide-y">
				{children}
			</div>
			{hint && (
				<p className="px-1 text-xs text-muted-foreground">{hint}</p>
			)}
		</div>
	);
}

/* ── Row ──────────────────────────────────────────────────────────────────── */
interface GroupRowProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Left-side primary label */
	label?: string;
	/** Left-side secondary text under label */
	description?: string;
	/** Associates label with a form control */
	htmlFor?: string;
	/** Marks the field as required (adds red asterisk) */
	required?: boolean;
	/** Right-side element: form control, toggle, arrow, badge, etc. */
	action?: React.ReactNode;
}

function GroupRow({
	label,
	description,
	htmlFor,
	required,
	action,
	children,
	className,
	onClick,
	...props
}: GroupRowProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-3 px-4 py-3 bg-card transition-colors",
				onClick && "cursor-pointer hover:bg-accent/50",
				className,
			)}
			onClick={onClick}
			{...props}
		>
			{/* Left: label block OR plain children (full width) */}
			{label ? (
				<div className="min-w-0 flex-1">
					<label
						htmlFor={htmlFor}
						className={cn(
							"text-sm font-medium leading-none",
							htmlFor && "cursor-pointer",
						)}
					>
						{label}
						{required && (
							<span className="ml-1 text-destructive" aria-hidden>
								*
							</span>
						)}
					</label>
					{description && (
						<p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
							{description}
						</p>
					)}
				</div>
			) : (
				<div className="min-w-0 flex-1 text-sm">{children}</div>
			)}

			{/* Right: children when label exists */}
			{label && children && (
				<div className="shrink-0">{children}</div>
			)}

			{/* Far right: action */}
			{action && (
				<div className="shrink-0 text-muted-foreground">{action}</div>
			)}
		</div>
	);
}

/* ── Compound export ──────────────────────────────────────────────────────── */
export const Group = Object.assign(GroupRoot, {
	Row: GroupRow,
});
