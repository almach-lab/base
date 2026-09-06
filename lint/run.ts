/**
 * Almach UI lint standardizers — adapted from Cloudflare Kumo lint rules.
 * Run: bun lint/run.ts
 */

import { readFileSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dir, "..");

export interface LintIssue {
  file: string;
  line: number;
  rule: string;
  message: string;
}

const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".astro",
  "coverage",
  ".turbo",
  ".git",
]);

const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".astro"]);

// ── Semantic color tokens ──────────────────────────────────────────────────

/** Keywords Tailwind accepts that are not design tokens. */
const COLOR_KEYWORDS = [
  "white",
  "black",
  "transparent",
  "current",
  "inherit",
  "none",
];

const UI_GLOBALS_CSS = join(
  ROOT,
  "packages",
  "ui",
  "src",
  "styles",
  "globals.css",
);

/**
 * Derives the allowlist from the `--color-*` entries in the library's
 * `@theme inline` block, so the rule tracks the tokens that actually exist
 * instead of a hand-maintained copy that drifts.
 */
function readSemanticColors(): Set<string> {
  const names = new Set(COLOR_KEYWORDS);

  let css = "";
  try {
    css = readFileSync(UI_GLOBALS_CSS, "utf8");
  } catch {
    throw new Error(
      `lint:ui — cannot read ${UI_GLOBALS_CSS}; semantic color allowlist unavailable`,
    );
  }

  for (const match of css.matchAll(/--color-([a-z0-9-]+)\s*:/g)) {
    const name = match[1];
    if (name) names.add(name);
  }

  return names;
}

const VALID_SEMANTIC_COLORS = readSemanticColors();

const TAILWIND_PRIMITIVE_FAMILIES = new Set([
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
]);

const COLOR_TOKEN_RE =
  /(?:^|[^a-zA-Z0-9-])(((?:[a-z-]+:)*)?(?:bg|border|text|ring(?:-offset)?|fill|stroke|placeholder|caret|accent|decoration|divide|outline|from|via|to)-([a-z][a-z0-9-]*)(?:-\d{2,3})?(?:\/[0-9]{1,3})?)/gim;

const NON_COLOR_NAMES = new Set([
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "left",
  "center",
  "right",
  "justify",
  "wrap",
  "nowrap",
  "0",
  "1",
  "2",
  "4",
  "8",
  "t",
  "r",
  "b",
  "l",
  "x",
  "y",
  "solid",
  "dashed",
  "dotted",
  "hidden",
  "collapse",
  "inner",
  "inset",
  "auto",
]);

/** Workspace roots, longest first so `apps/docs` wins over `apps`. */
const WORKSPACE_ROOTS = [
  "packages/utils",
  "packages/ui",
  "packages/forms",
  "packages/query",
  "apps/docs",
];

/** Maps a workspace root to the specifier that should be used instead. */
const WORKSPACE_SPECIFIERS: Record<string, string> = {
  "packages/utils": "@almach/utils",
  "packages/ui": "@almach/ui",
  "packages/forms": "@almach/forms",
  "packages/query": "@almach/query",
};

// ── File discovery ──────────────────────────────────────────────────────────

async function walk(dir: string, files: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, files);
    } else {
      const ext = entry.name.slice(entry.name.lastIndexOf("."));
      if (SCAN_EXTENSIONS.has(ext)) files.push(full);
    }
  }
  return files;
}

function lineOf(content: string, index: number): number {
  return content.slice(0, index).split("\n").length;
}

// ── Rule: no-primitive-colors ───────────────────────────────────────────────

function checkPrimitiveColors(file: string, content: string): LintIssue[] {
  const issues: LintIssue[] = [];
  const rel = relative(ROOT, file).replace(/\\/g, "/");

  // Only enforce in UI package and docs app
  if (!rel.startsWith("packages/ui/") && !rel.startsWith("apps/docs/")) {
    return issues;
  }

  COLOR_TOKEN_RE.lastIndex = 0;
  let match = COLOR_TOKEN_RE.exec(content);
  while (match !== null) {
    const current = match;
    match = COLOR_TOKEN_RE.exec(content);

    const fullToken = current[1] ?? "";
    const colorFamily = current[3];
    if (!colorFamily) continue;

    if (NON_COLOR_NAMES.has(colorFamily)) continue;
    if (colorFamily.startsWith("[")) continue;
    if (VALID_SEMANTIC_COLORS.has(colorFamily)) continue;

    const baseFamily = colorFamily.replace(/-\d+$/, "");
    if (VALID_SEMANTIC_COLORS.has(colorFamily.replace(/\/\d+$/, ""))) continue;

    if (TAILWIND_PRIMITIVE_FAMILIES.has(baseFamily)) {
      issues.push({
        file: rel,
        line: lineOf(content, current.index),
        rule: "no-primitive-colors",
        message: `Avoid Tailwind primitive \`${fullToken.trim()}\`. Use semantic tokens (e.g. bg-primary, text-muted-foreground).`,
      });
    }
  }

  return issues;
}

// ── Rule: no-cross-package-imports ──────────────────────────────────────────

/** Returns the workspace root a repo-relative path belongs to, if any. */
function workspaceRootOf(relPath: string): string | null {
  return WORKSPACE_ROOTS.find((root) => relPath.startsWith(`${root}/`)) ?? null;
}

function checkCrossPackageImports(file: string, content: string): LintIssue[] {
  const issues: LintIssue[] = [];
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const ownRoot = workspaceRootOf(rel);
  if (!ownRoot) return issues;

  const importRe =
    /(?:import|export)\s+.*?from\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g;
  importRe.lastIndex = 0;
  let match = importRe.exec(content);
  while (match !== null) {
    const current = match;
    match = importRe.exec(content);

    const importPath = current[1] ?? current[2];
    if (!importPath?.startsWith("..")) continue;

    // Reading a sibling package's manifest is metadata, not a code import —
    // and `package.json` is not reachable through the published exports map.
    if (importPath.endsWith("/package.json")) continue;

    // Resolve the specifier for real rather than pattern-matching it, so a
    // path that climbs and comes back inside the same package is fine.
    const resolved = relative(ROOT, join(file, "..", importPath)).replace(
      /\\/g,
      "/",
    );

    const targetRoot = workspaceRootOf(resolved);
    if (!targetRoot || targetRoot === ownRoot) continue;

    const specifier = WORKSPACE_SPECIFIERS[targetRoot];
    issues.push({
      file: rel,
      line: lineOf(content, current.index),
      rule: "no-cross-package-imports",
      message: specifier
        ? `Cross-package relative import \`${importPath}\` reaches into ${targetRoot}. Use \`${specifier}\` instead.`
        : `Cross-package relative import \`${importPath}\` reaches into ${targetRoot}.`,
    });
  }

  return issues;
}

// ── Rule: enforce-component-standard ──────────────────────────────────────────

function checkComponentStandard(file: string, content: string): LintIssue[] {
  const issues: LintIssue[] = [];
  const rel = relative(ROOT, file).replace(/\\/g, "/");

  if (!rel.match(/^packages\/ui\/src\/components\/[a-z0-9-]+\.tsx$/)) {
    return issues;
  }
  if (rel.startsWith("packages/ui/src/components/_")) return issues;
  if (rel === "packages/ui/src/components/toaster.tsx") return issues;

  if (content.includes("forwardRef") && !content.includes("displayName")) {
    issues.push({
      file: rel,
      line: 1,
      rule: "enforce-component-standard",
      message: "Component uses forwardRef but missing displayName assignment.",
    });
  }

  // className without cn() — heuristic: JSX className="..." without cn(
  const bareClassRe = /className=["'`][^"'`]+["'`]/g;
  if (bareClassRe.test(content) && !content.includes("cn(")) {
    issues.push({
      file: rel,
      line: 1,
      rule: "enforce-component-standard",
      message:
        "Component has static className strings but no cn() import — merge with cn(base, className).",
    });
  }

  if (
    !content.includes('from "@almach/utils"') &&
    !content.includes("from '@almach/utils'")
  ) {
    if (content.includes("className")) {
      issues.push({
        file: rel,
        line: 1,
        rule: "enforce-component-standard",
        message:
          "Component should import cn from @almach/utils for className merging.",
      });
    }
  }

  return issues;
}

// ── Rule: no-tailwind-config ──────────────────────────────────────────────────

async function checkNoTailwindConfig(): Promise<LintIssue[]> {
  const issues: LintIssue[] = [];
  const forbidden = [
    "tailwind.config.js",
    "tailwind.config.ts",
    "postcss.config.js",
  ];
  for (const name of forbidden) {
    try {
      await readFile(join(ROOT, name));
      issues.push({
        file: name,
        line: 1,
        rule: "no-tailwind-config",
        message: `\`${name}\` is a Tailwind v3 artifact. Use CSS-first config in globals.css.`,
      });
    } catch {
      // file doesn't exist — good
    }
  }
  return issues;
}

// ── Runner ───────────────────────────────────────────────────────────────────

export async function runLint(): Promise<LintIssue[]> {
  const scanRoots = [
    join(ROOT, "packages/ui"),
    join(ROOT, "packages/forms"),
    join(ROOT, "apps/docs"),
    join(ROOT, "packages/utils"),
    join(ROOT, "packages/query"),
  ];

  const allIssues: LintIssue[] = [];
  allIssues.push(...(await checkNoTailwindConfig()));

  for (const root of scanRoots) {
    let files: string[];
    try {
      files = await walk(root);
    } catch {
      continue;
    }

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      allIssues.push(...checkPrimitiveColors(file, content));
      allIssues.push(...checkCrossPackageImports(file, content));
      allIssues.push(...checkComponentStandard(file, content));
    }
  }

  return allIssues;
}

if (import.meta.main) {
  const issues = await runLint();
  if (issues.length === 0) {
    console.log("lint:ui — no issues found");
    process.exit(0);
  }

  for (const issue of issues) {
    console.error(
      `${issue.file}:${issue.line} [${issue.rule}] ${issue.message}`,
    );
  }
  console.error(`\nlint:ui — ${issues.length} issue(s) found`);
  process.exit(1);
}
