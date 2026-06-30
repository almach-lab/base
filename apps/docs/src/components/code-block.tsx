import { cn } from "@almach/utils";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  filename?: string;
  lang?: string;
  className?: string;
  variant?: "default" | "embedded";
}

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

export function CodeBlock({
  code,
  filename,
  lang = "bash",
  className,
  variant = "default",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const isEmbedded = variant === "embedded";

  useEffect(() => {
    let cancelled = false;
    highlight(code, lang).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  const copy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group relative text-sm",
        isEmbedded
          ? "bg-muted/20"
          : "overflow-hidden rounded-lg border border-border/50 bg-card/30",
        className,
      )}
    >
      {!isEmbedded && (
        <div className="flex items-center justify-between border-b border-border/40 px-3 py-2">
          <span className="font-mono text-[11px] text-muted-foreground">
            {filename ?? lang}
          </span>
          <button
            type="button"
            onClick={() => void copy()}
            aria-label={copied ? "Copied" : "Copy code"}
            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            {copied ? (
              <Check className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Copy className="h-3 w-3" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}

      {isEmbedded && (
        <button
          type="button"
          onClick={() => void copy()}
          aria-label={copied ? "Copied" : "Copy code"}
          className="absolute right-2.5 top-2.5 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-[opacity,color,background-color] hover:bg-accent/50 hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      )}

      {html ? (
        <div
          className="overflow-x-auto font-mono [&>pre]:p-4 [&>pre]:font-mono [&>pre]:text-[13px] [&>pre]:leading-6 [&>pre]:[font-variant-ligatures:none] [&>pre]:!bg-transparent [&_code]:!bg-transparent shiki-dual-theme"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6 [font-variant-ligatures:none]">
          <code>{code.trim()}</code>
        </pre>
      )}
    </div>
  );
}
