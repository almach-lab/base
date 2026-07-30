/** Normalizes a heading/page title for loose matching: lowercase, strip everything but letters/digits. */
function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Slices the `### <name>` section (up to the next `##`/`###` heading) out of
 * llms.txt's raw text. Falls back to a prefix match (e.g. page "Toast" against
 * heading "Toast & Toaster") when no exact heading matches the page name.
 * Returns null if nothing matches — callers should hide the copy button rather
 * than risk copying the wrong section.
 */
export function extractComponentMarkdown(
  fullText: string,
  name: string,
): string | null {
  const headingPattern = /^(#{2,3})\s+(.+)$/gm;
  const headings: { index: number; level: number; title: string }[] = [];

  for (const match of fullText.matchAll(headingPattern)) {
    if (match.index === undefined) continue;
    headings.push({
      index: match.index,
      level: match[1]?.length ?? 3,
      title: (match[2] ?? "").trim(),
    });
  }

  const target = normalize(name);
  const componentHeadings = headings.filter((h) => h.level === 3);

  const exact = componentHeadings.find((h) => normalize(h.title) === target);
  const prefixMatch =
    target.length >= 3
      ? componentHeadings.find((h) => {
          const normalizedTitle = normalize(h.title);
          return (
            normalizedTitle.startsWith(target) ||
            target.startsWith(normalizedTitle)
          );
        })
      : undefined;

  const match = exact ?? prefixMatch;
  if (!match) return null;

  const next = headings.find((h) => h.index > match.index);
  const end = next ? next.index : fullText.length;

  return fullText.slice(match.index, end).trim();
}
