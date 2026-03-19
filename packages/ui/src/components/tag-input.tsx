"use client";

import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@almach/utils";

/* ── Types ────────────────────────────────────────────────────────────────── */
export interface TagInputProps {
	id?: string;
	value?: string[];
	onChange?: (tags: string[]) => void;
	placeholder?: string;
	max?: number;
	disabled?: boolean;
	error?: boolean;
	/** Called to validate/transform a tag before adding. Return null to reject. */
	transform?: (tag: string) => string | null;
	className?: string;
}

/* ── TagInput ─────────────────────────────────────────────────────────────── */
export function TagInput({
	id,
	value,
	onChange,
	placeholder = "Add tag…",
	max,
	disabled,
	error,
	transform,
	className,
}: TagInputProps) {
	const [tags, setTags] = React.useState<string[]>(value ?? []);
	// id passed to the inner input for label association
	const [input, setInput] = React.useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);

	// Sync from controlled value
	React.useEffect(() => {
		if (value !== undefined) setTags(value);
	}, [value]);

	const emit = (next: string[]) => {
		setTags(next);
		onChange?.(next);
	};

	const addTag = (raw: string) => {
		const trimmed = raw.trim();
		if (!trimmed) return;
		const processed = transform ? transform(trimmed) : trimmed;
		if (processed === null) return;
		if (tags.includes(processed)) return;
		if (max !== undefined && tags.length >= max) return;
		emit([...tags, processed]);
		setInput("");
	};

	const removeTag = (index: number) => {
		emit(tags.filter((_, i) => i !== index));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addTag(input);
		}
		if (e.key === "Backspace" && !input && tags.length > 0) {
			removeTag(tags.length - 1);
		}
	};

	const isAtMax = max !== undefined && tags.length >= max;

	return (
		<div
			className={cn(
				"flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5",
				"ring-offset-background transition-colors",
				"focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
				error && "border-destructive focus-within:ring-destructive",
				disabled && "cursor-not-allowed opacity-50",
				className,
			)}
			onClick={() => inputRef.current?.focus()}
		>
			{tags.map((tag, i) => (
				<span
					key={tag}
					className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
				>
					{tag}
					{!disabled && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								removeTag(i);
							}}
							className="flex h-3.5 w-3.5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
							aria-label={`Remove ${tag}`}
						>
							<X className="h-2.5 w-2.5" />
						</button>
					)}
				</span>
			))}

			{!isAtMax && !disabled && (
				<input
					ref={inputRef}
					id={id}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					onBlur={() => addTag(input)}
					placeholder={tags.length === 0 ? placeholder : ""}
					className="min-w-[6rem] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
					disabled={disabled}
				/>
			)}
		</div>
	);
}
