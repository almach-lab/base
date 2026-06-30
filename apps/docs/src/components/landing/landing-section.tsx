import { cn } from "@almach/utils";
import type * as React from "react";

interface LandingSectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  border?: boolean;
  children: React.ReactNode;
}

export function LandingSection({
  id,
  className,
  containerClassName,
  border = true,
  children,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn(border && "border-b border-border/60", className)}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <header
      className={cn(
        "mb-10 max-w-2xl space-y-3",
        centered && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </header>
  );
}
