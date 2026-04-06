import { execSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const rawArgs = process.argv.slice(2);
const packages = ["utils", "ui", "forms", "query"];
const envFile = ".env";
const tagArg = rawArgs.find((arg) => arg.startsWith("--tag="));
const publishTag = tagArg ? tagArg.slice("--tag=".length) : "reset-v0";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(envFile);

const token = process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN || "";
if (!token) {
  console.error("[publish-from-env] Missing NPM_TOKEN/NODE_AUTH_TOKEN in .env");
  process.exit(1);
}

const npmrcPath = join(tmpdir(), `.npmrc.publish.${Date.now()}`);
writeFileSync(
  npmrcPath,
  `//registry.npmjs.org/:_authToken=${token}\nregistry=https://registry.npmjs.org/\n`,
  "utf8",
);

try {
  for (const pkg of packages) {
    const cwd = `packages/${pkg}`;
    console.log(`[publish-from-env] Publishing ${cwd} with tag ${publishTag}`);
    execSync(
      `npm publish --access public --tag ${publishTag} --provenance=false`,
      {
        cwd,
        stdio: "inherit",
        env: {
          ...process.env,
          NPM_TOKEN: token,
          NODE_AUTH_TOKEN: token,
          NPM_CONFIG_USERCONFIG: npmrcPath,
        },
        shell: true,
      },
    );
  }

  console.log("[publish-from-env] Done.");
} finally {
  try {
    unlinkSync(npmrcPath);
  } catch {
    // Ignore cleanup errors for temp npmrc.
  }
}
