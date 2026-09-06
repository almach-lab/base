#!/usr/bin/env bun
/**
 * Regenerates the `exports` subpath map in `packages/ui/package.json` from the
 * component files on disk, so per-component deep imports (`@almach/ui/button`)
 * can never drift away from `src/components/`.
 *
 * Usage:
 *   bun scripts/sync-package-exports.ts          # write
 *   bun scripts/sync-package-exports.ts --check  # fail if out of date (CI)
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const UI_ROOT = join(import.meta.dir, "..", "packages", "ui");
const COMPONENTS_DIR = join(UI_ROOT, "src", "components");
const PACKAGE_JSON = join(UI_ROOT, "package.json");

/** Modules that are internal helpers rather than public components. */
const PRIVATE_MODULES = new Set(["input-date-shared"]);

function publicComponentNames(): string[] {
  return readdirSync(COMPONENTS_DIR)
    .filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"))
    .map((file) => file.replace(/\.tsx?$/, ""))
    .filter((name) => !name.startsWith("_") && !PRIVATE_MODULES.has(name))
    .sort();
}

function buildExports(): Record<string, unknown> {
  const map: Record<string, unknown> = {
    ".": {
      import: "./dist/index.js",
      types: "./dist/index.d.ts",
    },
    "./styles": "./src/styles/globals.css",
  };

  for (const name of publicComponentNames()) {
    map[`./${name}`] = {
      import: `./dist/components/${name}.js`,
      types: `./dist/components/${name}.d.ts`,
    };
  }

  return map;
}

const checkOnly = process.argv.includes("--check");
const raw = readFileSync(PACKAGE_JSON, "utf8");
const pkg = JSON.parse(raw) as Record<string, unknown>;
const next = buildExports();

const before = JSON.stringify(pkg.exports);
const after = JSON.stringify(next);

if (before === after) {
  console.log("exports:sync — packages/ui/package.json is up to date");
  process.exit(0);
}

if (checkOnly) {
  const currentKeys = new Set(Object.keys(pkg.exports as object));
  const nextKeys = Object.keys(next);
  const missing = nextKeys.filter((key) => !currentKeys.has(key));
  const extra = [...currentKeys].filter((key) => !nextKeys.includes(key));

  console.error("exports:sync — packages/ui/package.json is out of date");
  if (missing.length) console.error(`  missing: ${missing.join(", ")}`);
  if (extra.length) console.error(`  stale:   ${extra.join(", ")}`);
  console.error("  run: bun run exports:sync");
  process.exit(1);
}

pkg.exports = next;
// Preserve the file's trailing newline convention.
writeFileSync(PACKAGE_JSON, `${JSON.stringify(pkg, null, 2)}\n`);
console.log(
  `exports:sync — wrote ${Object.keys(next).length - 2} component subpaths`,
);
