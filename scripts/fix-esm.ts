import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

const SKIP_EXTENSIONS =
  /\.(js|mjs|cjs|jsx|ts|tsx|mts|cts|css|json|d\.ts|svg|png|jpg|jpeg|gif|webp)$/i;

function processDirectory(dir: string): void {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (file === "node_modules" || file === "src") continue;
      processDirectory(fullPath);
    } else {
      const ext = path.extname(fullPath);
      const isTarget =
        TARGET_EXTENSIONS.has(ext) || fullPath.match(/\.d\.(ts|mts|cts)$/);

      if (isTarget) {
        let content = fs.readFileSync(fullPath, "utf8");
        const originalContent = content;

        const regexes = [
          /(import\s+[\s\S]*?from\s+['"])(\.[^'"]*)(['"])/g,
          /(export\s+[\s\S]*?from\s+['"])(\.[^'"]*)(['"])/g,
          /(import\s+['"])(\.[^'"]*)(['"])/g,
          /(import\(\s*['"])(\.[^'"]*)(['"]\s*\))/g,
        ];

        for (const regex of regexes) {
          content = content.replace(
            regex,
            (match, prefix, importPath, suffix) => {
              if (SKIP_EXTENSIONS.test(importPath)) {
                return match;
              }

              const absoluteImportPath = path.resolve(
                path.dirname(fullPath),
                importPath,
              );
              let isDir = false;

              try {
                if (
                  fs.existsSync(absoluteImportPath) &&
                  fs.statSync(absoluteImportPath).isDirectory()
                ) {
                  isDir = true;
                }
              } catch {
                // Ignore missing files during stat
              }

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
  const defaultTargets = [
    path.resolve(__dirname, "../packages"),
    path.resolve(__dirname, "../node_modules/@almach"),
  ];

  for (const targetDir of defaultTargets) {
    if (fs.existsSync(targetDir)) {
      const subDirs = fs.readdirSync(targetDir);
      for (const subDir of subDirs) {
        const distDir = path.join(targetDir, subDir, "dist");

        if (fs.existsSync(distDir)) {
          processDirectory(distDir);
        } else {
          processDirectory(path.join(targetDir, subDir));
        }
      }
    }
  }

  console.log(
    "[ESM Patch] Universal imports patched successfully for all workspace packages!",
  );
}
