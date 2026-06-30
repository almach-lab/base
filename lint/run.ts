/**
 * Almach UI lint standardizers — adapted from Cloudflare Kumo lint rules.
 * Run: bun lint/run.ts
 */

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

// ── Semantic color tokens (from packages/ui/src/styles/globals.css) ─────────

const VALID_SEMANTIC_COLORS = new Set([
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-border",
  "sidebar-accent",
  "white",
  "black",
  "transparent",
  "current",
  "inherit",
  "none",
]);

const TAILWIND_PRIMITIVE_FAMILIES = new Set([
  "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal",
  "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink",
  "slate", "gray", "zinc", "neutral", "stone",
]);

const COLOR_TOKEN_RE =
  /(?:^|[^a-zA-Z0-9-])(((?:[a-z-]+:)*)?(?:bg|border|text|ring(?:-offset)?|fill|stroke|placeholder|caret|accent|decoration|divide|outline|from|via|to)-([a-z][a-z0-9-]*)(?:-\d{2,3})?(?:\/[0-9]{1,3})?)/gim;

const NON_COLOR_NAMES = new Set([
  "xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl",
  "left", "center", "right", "justify", "wrap", "nowrap",
  "0", "1", "2", "4", "8", "t", "r", "b", "l", "x", "y",
  "solid", "dashed", "dotted", "hidden", "collapse", "inner", "inset", "auto",
]);

const PACKAGE_DIRS = new Set(["utils", "ui", "forms", "query", "docs"]);
const CROSS_PKG_RE = /^((?:\.\.\/)+)([a-z0-9-]+)\//;

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
  let match: RegExpExecArray | null;
  while ((match = COLOR_TOKEN_RE.exec(content)) !== null) {
    const fullToken = match[1] ?? "";
    const colorFamily = match[3];
    if (!colorFamily) continue;

    if (NON_COLOR_NAMES.has(colorFamily)) continue;
    if (colorFamily.startsWith("[")) continue;
    if (VALID_SEMANTIC_COLORS.has(colorFamily)) continue;

    const baseFamily = colorFamily.replace(/-\d+$/, "");
    if (VALID_SEMANTIC_COLORS.has(colorFamily.replace(/\/\d+$/, ""))) continue;

    if (TAILWIND_PRIMITIVE_FAMILIES.has(baseFamily)) {
      issues.push({
        file: rel,
        line: lineOf(content, match.index),
        rule: "no-primitive-colors",
        message: `Avoid Tailwind primitive \`${fullToken.trim()}\`. Use semantic tokens (e.g. bg-primary, text-muted-foreground).`,
      });
    }
  }

  return issues;
}

// ── Rule: no-cross-package-imports ──────────────────────────────────────────

function checkCrossPackageImports(file: string, content: string): LintIssue[] {
  const issues: LintIssue[] = [];
  const rel = relative(ROOT, file).replace(/\\/g, "/");

  const importRe = /(?:import|export)\s+.*?from\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g;
  let match: RegExpExecArray | null;
  while ((match = importRe.exec(content)) !== null) {
    const importPath = match[1] ?? match[2];
    if (!importPath?.startsWith("..")) continue;

    const crossMatch = importPath.match(CROSS_PKG_RE);
    if (!crossMatch) continue;

    const levelsUp = (crossMatch[1].match(/\.\.\//g) ?? []).length;
    const packageDir = crossMatch[2];
    if (levelsUp < 2) continue;
    if (!PACKAGE_DIRS.has(packageDir)) continue;

    issues.push({
      file: rel,
      line: lineOf(content, match.index),
      rule: "no-cross-package-imports",
      message: `Cross-package relative import \`${importPath}\`. Use \`@almach/${packageDir}\` instead.`,
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
      message: "Component has static className strings but no cn() import — merge with cn(base, className).",
    });
  }

  if (!content.includes("from \"@almach/utils\"") && !content.includes("from '@almach/utils'")) {
    if (content.includes("className")) {
      issues.push({
        file: rel,
        line: 1,
        rule: "enforce-component-standard",
        message: "Component should import cn from @almach/utils for className merging.",
      });
    }
  }

  return issues;
}

// ── Rule: no-tailwind-config ──────────────────────────────────────────────────

async function checkNoTailwindConfig(): Promise<LintIssue[]> {
  const issues: LintIssue[] = [];
  const forbidden = ["tailwind.config.js", "tailwind.config.ts", "postcss.config.js"];
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
    console.error(`${issue.file}:${issue.line} [${issue.rule}] ${issue.message}`);
  }
  console.error(`\nlint:ui — ${issues.length} issue(s) found`);
  process.exit(1);
}
