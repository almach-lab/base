import { useCopyToClipboard } from "@almach/ui";
import * as React from "react";
import { extractComponentMarkdown } from "../../lib/page-markdown";
import { DocCopyButton } from "./doc-page-header";

let llmsTxtPromise: Promise<string> | null = null;

function loadLlmsTxt(): Promise<string> {
  llmsTxtPromise ??= fetch("/llms.txt").then((res) => {
    if (!res.ok) throw new Error(`Failed to load /llms.txt: ${res.status}`);
    return res.text();
  });
  return llmsTxtPromise;
}

export function CopyMarkdownButton({ name }: { name: string }) {
  const { copy } = useCopyToClipboard();
  const [markdown, setMarkdown] = React.useState<string | null | undefined>(
    undefined,
  );

  React.useEffect(() => {
    let cancelled = false;
    loadLlmsTxt()
      .then((text) => {
        if (!cancelled) setMarkdown(extractComponentMarkdown(text, name));
      })
      .catch(() => {
        if (!cancelled) setMarkdown(null);
      });
    return () => {
      cancelled = true;
    };
  }, [name]);

  if (!markdown) return null;

  return (
    <DocCopyButton
      label="Copy page"
      copiedLabel="Copied"
      onClick={async () => {
        await copy(markdown);
      }}
    />
  );
}
