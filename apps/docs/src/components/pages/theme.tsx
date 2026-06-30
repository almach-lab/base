import { docsLayout } from "../../lib/docs-layout";
import { DocPageHeader } from "../docs/doc-page-header";
import { ThemeCustomizer } from "../ThemeCustomizer";

export function ThemePage() {
  return (
    <article className={docsLayout.article}>
      <DocPageHeader
        eyebrow="Customization"
        title="Theme"
        description={
          <>
            Customize semantic tokens, radius, and motion. Changes persist in{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              localStorage
            </code>{" "}
            and apply across the docs site.
          </>
        }
      />

      <ThemeCustomizer mode="page" />
    </article>
  );
}
