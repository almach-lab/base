import React, { useEffect, useState } from "react";
import { cn } from "@almach/utils";
import { Button } from "@almach/ui";
import { Check, Copy } from "lucide-react";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  filename?: string;
  lang?: string;
  className?: string;
}

// Shared singleton to avoid re-initializing on every render
const cache = new Map<string, string>();

async function highlight(code: string, lang: string): Promise<string> {
  const key = `${lang}:${code}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  const html = await codeToHtml(code.trim(), {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
  cache.set(key, html);
  return html;
}

export function CodeBlock({ code, filename, lang = "bash", className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    highlight(code, lang).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => { cancelled = true; };
  }, [code, lang]);

  const copy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CopyButton = ({ inHeader }: { inHeader?: boolean }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn(
        "h-7 gap-1.5 px-2 text-xs text-muted-foreground",
        !inHeader && "absolute right-2 top-2 z-10 border bg-background/90 opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
      )}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );

  return (
    <div className={cn("group relative overflow-hidden rounded-lg border bg-muted/40 text-sm", className)}>
      {filename && (
        <div className="flex items-center justify-between border-b bg-muted/60 px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">{filename}</span>
          <CopyButton inHeader />
        </div>
      )}
      {!filename && <CopyButton />}

      {html ? (
        <div
          className="overflow-x-auto [&>pre]:p-4 [&>pre]:font-mono [&>pre]:text-[13px] [&>pre]:leading-relaxed [&>pre]:!bg-transparent [&_code]:!bg-transparent shiki-dual-theme"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
          <code>{code.trim()}</code>
        </pre>
      )}
    </div>
  );
}
