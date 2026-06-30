import { cn } from "@almach/utils";
import { Check, Copy } from "lucide-react";
import * as React from "react";
import { docsLayout } from "../../lib/docs-layout";
import { isPackageEyebrow } from "../../lib/docs-package";
import { PackageEyebrow } from "./package-breadcrumb";

interface DocPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function DocPageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  children,
}: DocPageHeaderProps) {
  return (
    <header className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          {eyebrow &&
            (isPackageEyebrow(eyebrow) ? (
              <PackageEyebrow eyebrow={eyebrow} />
            ) : (
              <p className="text-xs font-medium text-muted-foreground/75">
                {eyebrow}
              </p>
            ))}
          <h1 className="text-3xl font-semibold tracking-tight sm:text-[2rem]">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </header>
  );
}

export function DocSectionHeading({
  id,
  title,
  description,
  className,
  level = 2,
}: {
  id?: string;
  title: string;
  description?: string;
  className?: string;
  level?: 2 | 3;
}) {
  const Heading = level === 3 ? "h3" : "h2";

  return (
    <div
      {...(id ? { id } : {})}
      className={cn(docsLayout.scrollAnchor, "space-y-1", className)}
    >
      <Heading
        className={cn(
          level === 3
            ? "text-sm font-medium"
            : "text-base font-semibold tracking-tight",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className="text-sm leading-[1.6] text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

export function DocCopyButton({
  label,
  copiedLabel = "Copied",
  onClick,
  iconOnly = false,
}: {
  label: string;
  copiedLabel?: string;
  onClick: () => void | Promise<void>;
  iconOnly?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleClick = async () => {
    await onClick();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={() => void handleClick()}
        aria-label={copied ? copiedLabel : label}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border/50 px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-border/80 hover:bg-accent/40 hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {copied ? copiedLabel : label}
    </button>
  );
}
