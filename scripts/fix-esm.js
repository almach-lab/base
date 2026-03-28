import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// We want to support ALL flavors of JavaScript and TypeScript
const TARGET_EXTENSIONS = new Set([
  ".js",
  ".mjs",
  ".cjs",
  ".jsx",
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
]);

// Extensions that already have a valid module resolution target
const SKIP_EXTENSIONS =
  /\.(js|mjs|cjs|jsx|ts|tsx|mts|cts|css|json|d\.ts|svg|png|jpg|jpeg|gif|webp)$/i;

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Prevent infinite loops in node_modules, and strictly avoid scanning src/
      // to prevent dirtying the Git working tree during CI/CD or releases.
      if (file === "node_modules" || file === "src") continue;
      processDirectory(fullPath);
    } else {
      const ext = path.extname(fullPath);
      const isTarget =
        TARGET_EXTENSIONS.has(ext) || fullPath.match(/\.d\.(ts|mts|cts)$/);

      if (isTarget) {
        let content = fs.readFileSync(fullPath, "utf8");
        let originalContent = content;

        // Multi-line aware regexes to catch complex formatting (e.g. Prettier formatting)
        const regexes = [
          // import { ... } from "./path"
          // import type { ... } from "./path"
          /(import\s+[\s\S]*?from\s+['"])(\.[^'"]*)(['"])/g,

          // export { ... } from "./path"
          // export * from "./path"
          /(export\s+[\s\S]*?from\s+['"])(\.[^'"]*)(['"])/g,

          // import "./path" (side-effect imports)
          /(import\s+['"])(\.[^'"]*)(['"])/g,

          // const module = await import("./path")
          /(import\(\s*['"])(\.[^'"]*)(['"]\s*\))/g,
        ];

        for (const regex of regexes) {
          content = content.replace(
            regex,
            (match, prefix, importPath, suffix) => {
              // If it already has an extension we recognize, leave it alone
              if (SKIP_EXTENSIONS.test(importPath)) {
                return match;
              }

              const absoluteImportPath = path.resolve(
                path.dirname(fullPath),
                importPath,
              );
              let isDir = false;

              try {
                // Node/Bun resolution: check if it resolves to a directory directly
                if (
                  fs.existsSync(absoluteImportPath) &&
                  fs.statSync(absoluteImportPath).isDirectory()
                ) {
                  isDir = true;
                }
              } catch (e) {
                // Ignore missing files during stat
              }

              // Universal ESM rule: TS/JS bundlers (Vite, Astro, Rollup, Bun, Node) all respect
              // the `.js` extension in the import string even if the underlying file is `.ts` or `.tsx`
              const appendExt = isDir ? "/index.js" : ".js";

              return `${prefix}${importPath}${appendExt}${suffix}`;
            },
          );
        }

        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content, "utf8");
        }
      }
    }
  }
}

const targetArg = process.argv[2];

if (targetArg) {
  // If invoked with a specific target (e.g., from Turborepo: `node fix-esm.js dist`)
  const targetDir = path.resolve(process.cwd(), targetArg);

  if (fs.existsSync(targetDir)) {
    processDirectory(targetDir);
    console.log(
      `[ESM Patch] Universal imports patched successfully for: ${targetArg}`,
    );
  } else {
    console.error(`[ESM Patch] Target directory not found: ${targetDir}`);
    process.exit(1);
  }
} else {
  // If invoked globally (e.g., `postinstall`), scan the entire workspace
  const defaultTargets = [
    path.resolve(__dirname, "../packages"),
    path.resolve(__dirname, "../node_modules/@almach"),
  ];

  for (const targetDir of defaultTargets) {
    if (fs.existsSync(targetDir)) {
      const subDirs = fs.readdirSync(targetDir);
      for (const subDir of subDirs) {
        // Target ONLY compiled dist files to be extremely robust and avoid dirtying src/
        const distDir = path.join(targetDir, subDir, "dist");

        if (fs.existsSync(distDir)) {
          processDirectory(distDir);
        } else {
          // Fallback: If no dist (e.g., standard npm package), process the root of the package
          processDirectory(path.join(targetDir, subDir));
        }
      }
    }
  }

  console.log(
    "[ESM Patch] Universal imports patched successfully for all workspace packages!",
  );
}
