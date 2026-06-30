import { cn } from "@almach/utils";
import type * as React from "react";
import { docsLayout } from "../../lib/docs-layout";
import { CodeBlock } from "../code-block";

interface DocExampleProps {
  preview: React.ReactNode;
  code: string;
  lang?: string;
  filename?: string;
  centered?: boolean;
  className?: string;
  previewClassName?: string;
}

export function DocExample({
  preview,
  code,
  lang = "tsx",
  filename,
  centered = true,
  className,
  previewClassName,
}: DocExampleProps) {
  return (
    <div
      className={cn(
        docsLayout.preview,
        "overflow-hidden rounded-lg border border-border/50",
        className,
      )}
    >
      <div
        className={cn(
          "border-b border-border/40 bg-background px-5 py-5 sm:px-6 sm:py-6",
          centered && "flex min-h-[7.5rem] items-center justify-center",
          previewClassName,
        )}
      >
        {preview}
      </div>
      <CodeBlock
        code={code}
        lang={lang}
        {...(filename ? { filename } : {})}
        variant="embedded"
      />
    </div>
  );
}
