import { execSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const rawArgs = process.argv.slice(2);
const defaultPackages = ["utils", "ui", "forms", "query"];
const envFile = ".env";
const tagArg = rawArgs.find((arg) => arg.startsWith("--tag="));
const onlyArg = rawArgs.find((arg) => arg.startsWith("--only="));
const defaultTag = tagArg ? tagArg.slice("--tag=".length) : "latest";
const onlyPackages = onlyArg
  ? onlyArg
      .slice("--only=".length)
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
  : null;

function loadEnvFile(path: string): void {
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

function run(command: string, cwd?: string): string {
  return execSync(command, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
    shell: true,
  }).trim();
}

function isPublished(
  name: string,
  version: string,
  npmrcPath: string,
): boolean {
  try {
    run(`npm view ${name}@${version} version --userconfig "${npmrcPath}"`);
    return true;
  } catch {
    return false;
  }
}

function bumpPatch(version: string): string {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    throw new Error(`[publish-from-env] Invalid semver: ${version}`);
  }
  return `${match[1]}.${match[2]}.${Number(match[3]) + 1}`;
}

function resolvePublishVersion(
  name: string,
  version: string,
  npmrcPath: string,
): string {
  let candidate = version;
  while (isPublished(name, candidate, npmrcPath)) {
    console.log(
      `[publish-from-env] ${name}@${candidate} already on npm — bumping patch`,
    );
    candidate = bumpPatch(candidate);
  }
  return candidate;
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

const packages = onlyPackages ?? defaultPackages;
const unknown = packages.filter((pkg) => !defaultPackages.includes(pkg));
if (unknown.length > 0) {
  console.error(
    `[publish-from-env] Unknown package(s): ${unknown.join(", ")}. Expected: ${defaultPackages.join(", ")}`,
  );
  process.exit(1);
}

try {
  let publishedCount = 0;

  for (const pkg of packages) {
    const cwd = `packages/${pkg}`;
    const pkgJson = JSON.parse(
      readFileSync(join(cwd, "package.json"), "utf8"),
    ) as {
      name?: string;
      version?: string;
      publishConfig?: { tag?: string };
    };

    const name = pkgJson.name;
    const baseVersion = pkgJson.version;
    if (!name || !baseVersion) {
      console.error(
        `[publish-from-env] Missing name/version in ${cwd}/package.json`,
      );
      process.exit(1);
    }

    const version = resolvePublishVersion(name, baseVersion, npmrcPath);
    if (version !== baseVersion) {
      pkgJson.version = version;
      writeFileSync(
        join(cwd, "package.json"),
        `${JSON.stringify(pkgJson, null, 2)}\n`,
        "utf8",
      );
    }

    const publishTag = pkgJson.publishConfig?.tag ?? defaultTag;
    console.log(
      `[publish-from-env] Publishing ${name}@${version} with tag ${publishTag}`,
    );

    execSync(
      `npm publish --access public --tag ${publishTag} --provenance=false --userconfig "${npmrcPath}"`,
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
    publishedCount += 1;
  }

  if (publishedCount === 0) {
    console.log(
      "[publish-from-env] Nothing to publish — all selected versions are already on npm.",
    );
  } else {
    console.log(
      `[publish-from-env] Done. Published ${publishedCount} package(s).`,
    );
  }
} finally {
  try {
    unlinkSync(npmrcPath);
  } catch {
    // Ignore cleanup errors for temp npmrc.
  }
}
