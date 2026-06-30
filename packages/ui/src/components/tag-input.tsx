"use client";

import { cn } from "@almach/utils";
import { X } from "lucide-react";
import * as React from "react";
import { badgeVariants } from "./badge.js";
import { MOTION_INTERACTIVE } from "./_motion.js";
import {
  DISABLED,
  fieldErrorClass,
  FOCUS_RING_WITHIN,
} from "./_styles.js";

export interface TagInputProps {
  id?: string;
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
  disabled?: boolean;
  error?: boolean;
  name?: string;
  /** Called to validate/transform a tag before adding. Return null to reject. */
  transform?: (tag: string) => string | null;
  className?: string;
}

export function TagInput({
  id,
  value,
  onChange,
  placeholder = "Add tag…",
  max,
  disabled,
  error,
  name,
  transform,
  className,
}: TagInputProps) {
  const isControlled = value !== undefined;
  const [internalTags, setInternalTags] = React.useState<string[]>(value ?? []);
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listId = React.useId();
  const tags = isControlled ? value : internalTags;

  React.useEffect(() => {
    if (isControlled) {
      setInternalTags(value);
    }
  }, [isControlled, value]);

  const emit = (next: string[]) => {
    if (!isControlled) {
      setInternalTags(next);
    }
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
      role="group"
      aria-invalid={error || undefined}
      aria-disabled={disabled || undefined}
      aria-describedby={tags.length > 0 ? listId : undefined}
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 shadow-xs",
        MOTION_INTERACTIVE,
        FOCUS_RING_WITHIN,
        fieldErrorClass(error),
        error && "focus-within:ring-destructive",
        DISABLED,
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.length > 0 ? (
        <div id={listId} className="contents">
          {tags.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className={cn(badgeVariants({ variant: "secondary", size: "sm" }), "gap-1")}
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(i);
                  }}
                  className={cn(
                    "flex h-3.5 w-3.5 items-center justify-center rounded-sm text-muted-foreground",
                    MOTION_INTERACTIVE,
                    "hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  )}
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </span>
          ))}
        </div>
      ) : null}

      {!isAtMax && !disabled ? (
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
          aria-invalid={error || undefined}
          autoComplete="off"
        />
      ) : null}
      {name ? (
        <input type="hidden" name={name} value={JSON.stringify(tags)} />
      ) : null}
    </div>
  );
}
