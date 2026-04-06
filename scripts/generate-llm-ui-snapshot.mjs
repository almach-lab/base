#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ROOT = resolve(process.cwd());
const INDEX_PATH = resolve(ROOT, "packages/ui/src/index.ts");
const METADATA_PATH = resolve(ROOT, "apps/docs/src/data/llm-ui-metadata.json");
const BASELINE_PATH = resolve(ROOT, "apps/docs/src/data/llm-ui-baseline.json");
const OUT_MARKDOWN_PATH = resolve(ROOT, "apps/docs/public/llms.md");
const OUT_JSON_PATH = resolve(
  ROOT,
  "apps/docs/public/llms-ui-api.snapshot.json",
);

const mode = process.argv.includes("--check") ? "check" : "update";

function toModuleMap(indexSource) {
  const map = new Map();
  const lines = indexSource.split(/\r?\n/);

  for (const line of lines) {
    const valueMatch = line.match(
      /^export \{([^}]+)\} from "\.\/components\/([^".]+)\.js";/,
    );
    if (valueMatch) {
      const [, rawExports, moduleName] = valueMatch;
      const valueExports = rawExports
        .split(",")
        .map((token) => token.trim())
        .filter(Boolean)
        .map((token) => token.replace(/\/\/.*$/, "").trim())
        .filter(Boolean);

      const current = map.get(moduleName) ?? { exports: [], typeExports: [] };
      current.exports.push(...valueExports);
      map.set(moduleName, current);
      continue;
    }

    const typeMatch = line.match(
      /^export type \{([^}]+)\} from "\.\/components\/([^".]+)\.js";/,
    );
    if (typeMatch) {
      const [, rawTypes, moduleName] = typeMatch;
      const typeExports = rawTypes
        .split(",")
        .map((token) => token.trim())
        .filter(Boolean);
      const current = map.get(moduleName) ?? { exports: [], typeExports: [] };
      current.typeExports.push(...typeExports);
      map.set(moduleName, current);
    }
  }

  const entries = [...map.entries()].map(([module, value]) => {
    const exports = [...new Set(value.exports)].sort((a, b) =>
      a.localeCompare(b),
    );
    const typeExports = [...new Set(value.typeExports)].sort((a, b) =>
      a.localeCompare(b),
    );
    return [module, { exports, typeExports }];
  });

  return Object.fromEntries(entries.sort(([a], [b]) => a.localeCompare(b)));
}

function inferPrimary(moduleName, exports) {
  const modulePrefix = moduleName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const firstExact = exports.find((item) => item === modulePrefix);
  if (firstExact) return firstExact;

  const firstComponent = exports.find((item) => /^[A-Z]/.test(item));
  return firstComponent ?? modulePrefix;
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf-8"));
}

function renderMarkdown(moduleMap, metadata) {
  const now = new Date().toISOString();
  const modules = Object.keys(moduleMap);

  const lines = [];
  lines.push("# Almach UI LLM API Snapshot");
  lines.push("");
  lines.push(`Generated: ${now}`);
  lines.push("");
  lines.push(
    "This file is generated from `packages/ui/src/index.ts` and docs metadata.",
  );
  lines.push("Use this as the primary LLM-oriented API reference.");
  lines.push("");

  for (const moduleName of modules) {
    const { exports, typeExports } = moduleMap[moduleName];
    const meta = metadata[moduleName] ?? {};
    const title = meta.title ?? inferPrimary(moduleName, exports);

    lines.push(`## ${title}`);
    lines.push("");
    lines.push(`Module: \`${moduleName}\``);
    lines.push("");

    lines.push("### Import");
    lines.push("");
    lines.push("```tsx");
    lines.push(`import { ${title} } from "@almach/ui";`);
    lines.push("```");
    lines.push("");

    lines.push("### Most Common Tasks");
    lines.push("");
    const tasks = meta.tasks ?? [
      "Use the exported component in controlled or uncontrolled form.",
    ];
    for (const task of tasks) lines.push(`- ${task}`);
    lines.push("");

    lines.push("### Anatomy");
    lines.push("");
    const anatomy = meta.anatomy ?? [title];
    for (const part of anatomy) lines.push(`- \`${part}\``);
    lines.push("");

    lines.push("### API Notes");
    lines.push("");
    const api = meta.api ?? [
      "Refer to the component page for full prop and behavior details.",
    ];
    for (const note of api) lines.push(`- ${note}`);
    lines.push("");

    lines.push("### Exported Symbols");
    lines.push("");
    lines.push(
      `- Values: ${exports.map((item) => `\`${item}\``).join(", ") || "(none)"}`,
    );
    lines.push(
      `- Types: ${typeExports.map((item) => `\`${item}\``).join(", ") || "(none)"}`,
    );
    lines.push("");

    if (meta.accessibility?.length) {
      lines.push("### Accessibility Notes");
      lines.push("");
      for (const note of meta.accessibility) lines.push(`- ${note}`);
      lines.push("");
    }
  }

  return `${lines.join("\n")}\n`;
}

function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

function run() {
  const indexSource = readFileSync(INDEX_PATH, "utf-8");
  const moduleMap = toModuleMap(indexSource);
  const metadata = readJson(METADATA_PATH, {});

  const unknownMetadataKeys = Object.keys(metadata).filter(
    (key) => !(key in moduleMap),
  );
  if (unknownMetadataKeys.length > 0) {
    console.error("Unknown metadata modules:");
    for (const key of unknownMetadataKeys) console.error(`- ${key}`);
    process.exit(1);
  }

  const baseline = readJson(BASELINE_PATH, null);

  if (mode === "check") {
    if (!baseline) {
      console.error(
        "Missing baseline snapshot. Run: bun run llms:snapshot:update",
      );
      process.exit(1);
    }

    const current = JSON.stringify(moduleMap);
    const expected = JSON.stringify(baseline);

    if (current !== expected) {
      console.error(
        "LLM docs drift detected: @almach/ui exports/types changed.",
      );
      console.error("Run: bun run llms:snapshot:update");
      process.exit(1);
    }

    console.log("LLM API snapshot check passed.");
    return;
  }

  ensureDir(BASELINE_PATH);
  writeFileSync(BASELINE_PATH, `${JSON.stringify(moduleMap, null, 2)}\n`);

  const markdown = renderMarkdown(moduleMap, metadata);

  ensureDir(OUT_MARKDOWN_PATH);
  writeFileSync(OUT_MARKDOWN_PATH, markdown);

  ensureDir(OUT_JSON_PATH);
  writeFileSync(
    OUT_JSON_PATH,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), components: moduleMap }, null, 2)}\n`,
  );

  console.log(`Updated baseline: ${BASELINE_PATH}`);
  console.log(`Generated markdown: ${OUT_MARKDOWN_PATH}`);
  console.log(`Generated snapshot: ${OUT_JSON_PATH}`);
}

run();
