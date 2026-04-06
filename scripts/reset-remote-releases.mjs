import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);

if (args.has("--help") || args.has("-h")) {
  printHelp();
  process.exit(0);
}

const envFileArg = rawArgs.find((a) => a.startsWith("--env-file="));
const envFilePath = envFileArg
  ? envFileArg.slice("--env-file=".length)
  : ".env";

if (existsSync(envFilePath)) {
  loadEnvFile(envFilePath);
}

const apply = args.has("--apply");
const skipGithubFlag = args.has("--skip-github");
const skipNpmFlag = args.has("--skip-npm");
const npmModeArg = rawArgs.find((a) => a.startsWith("--npm-mode="));
const npmMode = npmModeArg ? npmModeArg.slice("--npm-mode=".length) : "auto";
const minVersionArg = rawArgs.find((a) => a.startsWith("--min-version="));
const minVersion = minVersionArg
  ? minVersionArg.slice("--min-version=".length)
  : "0.0.1";

const repo = process.env.GITHUB_REPOSITORY || "";
const ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";
const npmToken = process.env.NPM_TOKEN || "";

const deprecateMessage =
  "This release line is deprecated after a clean reset. Use the latest documented release line.";

function log(msg) {
  console.log(`[reset-remote] ${msg}`);
}

function fail(msg) {
  console.error(`[reset-remote] ${msg}`);
  process.exit(1);
}

function loadEnvFile(path) {
  const text = readFileSync(path, "utf8");
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
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

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function printHelp() {
  console.log(`Usage: node scripts/reset-remote-releases.mjs [options]

Options:
  --apply                Execute destructive/deprecating actions (default is dry-run)
  --skip-github          Skip GitHub release/tag cleanup
  --skip-npm             Skip npm version deprecations
  --npm-mode=MODE        npm cleanup mode: auto | unpublish | deprecate (default: auto)
  --min-version=SEMVER   Only process versions >= this value (default: 0.0.1)
  --env-file=PATH        Load env vars from file (default: .env if present)
  -h, --help             Show this help

Required env when applying:
  GitHub cleanup: GH_TOKEN or GITHUB_TOKEN, and GITHUB_REPOSITORY=owner/repo
  npm cleanup: NPM_TOKEN
`);
}

function parseVersion(version) {
  const [core] = version.split("-");
  const [majorRaw, minorRaw, patchRaw] = core.split(".");
  const major = Number(majorRaw);
  const minor = Number(minorRaw);
  const patch = Number(patchRaw);
  if ([major, minor, patch].some((n) => Number.isNaN(n))) return null;
  return { major, minor, patch };
}

function compareVersions(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

function shouldIncludeVersion(version) {
  const parsed = parseVersion(version);
  const parsedMin = parseVersion(minVersion);
  if (!parsed || !parsedMin) return true;
  return compareVersions(parsed, parsedMin) >= 0;
}

function getPublishablePackages() {
  const root = "packages";
  if (!existsSync(root)) return [];

  const names = [];
  for (const dir of readdirSync(root)) {
    const path = join(root, dir, "package.json");
    if (!existsSync(path)) continue;

    const pkg = JSON.parse(readFileSync(path, "utf8"));
    if (!pkg?.name || pkg.private) continue;

    names.push(pkg.name);
  }

  return names.sort((a, b) => a.localeCompare(b));
}

async function fetchJson(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} ${url}\n${text}`);
  }
  return res.json();
}

async function cleanupGithubReleases() {
  if (skipGithubFlag) {
    log("Skipping GitHub cleanup (--skip-github).");
    return;
  }

  if (!repo || !ghToken) {
    if (apply) {
      if (!repo) {
        fail("Missing GITHUB_REPOSITORY (expected owner/repo) for --apply.");
      }
      fail("Missing GH_TOKEN or GITHUB_TOKEN for --apply GitHub cleanup.");
    }

    log(
      "GitHub credentials not found. Skipping GitHub API calls in dry-run (set GH_TOKEN/GITHUB_TOKEN + GITHUB_REPOSITORY to preview remote objects).",
    );
    return;
  }

  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${ghToken}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const releases = [];
  let page = 1;
  while (true) {
    const pageItems = await fetchJson(
      `https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`,
      { headers },
    );
    if (!Array.isArray(pageItems) || pageItems.length === 0) break;
    releases.push(...pageItems);
    if (pageItems.length < 100) break;
    page += 1;
  }

  if (!Array.isArray(releases) || releases.length === 0) {
    log("No GitHub releases found.");
    return;
  }

  log(`Found ${releases.length} GitHub releases.`);

  for (const release of releases) {
    const releaseId = release.id;
    const tagName = release.tag_name;
    if (!releaseId || !tagName) continue;

    if (!apply) {
      log(`[dry-run] delete release id=${releaseId} tag=${tagName}`);
      log(`[dry-run] delete tag ref tags/${tagName}`);
      continue;
    }

    await fetch(`https://api.github.com/repos/${repo}/releases/${releaseId}`, {
      method: "DELETE",
      headers,
    });

    await fetch(
      `https://api.github.com/repos/${repo}/git/refs/tags/${encodeURIComponent(tagName)}`,
      {
        method: "DELETE",
        headers,
      },
    ).catch(() => {
      // Tag may already be missing; ignore.
    });

    log(`Deleted release and tag: ${tagName}`);
  }
}

function runNpm(command) {
  const commandWithAuth = npmToken
    ? `${command} --//registry.npmjs.org/:_authToken=${npmToken}`
    : command;

  return execSync(commandWithAuth, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      ...(npmToken ? { NODE_AUTH_TOKEN: npmToken, NPM_TOKEN: npmToken } : {}),
    },
    shell: true,
  }).trim();
}

function getNpmVersions(pkgName) {
  try {
    const out = runNpm(`npm view ${pkgName} versions --json`);
    const parsed = JSON.parse(out || "[]");
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function deprecateNpmVersion(spec) {
  runNpm(`npm deprecate ${spec} "${deprecateMessage}"`);
}

function tryUnpublishNpmVersion(spec) {
  try {
    runNpm(`npm unpublish ${spec} --force`);
    return true;
  } catch {
    return false;
  }
}

function cleanupNpmReleases() {
  if (skipNpmFlag) {
    log("Skipping npm cleanup (--skip-npm).");
    return;
  }

  if (!npmToken) {
    if (apply) {
      fail("Missing NPM_TOKEN for --apply npm cleanup.");
    }

    log(
      "NPM_TOKEN not found. Skipping npm API calls in dry-run (set NPM_TOKEN to preview remote versions).",
    );
    return;
  }

  if (!["auto", "unpublish", "deprecate"].includes(npmMode)) {
    fail("Invalid --npm-mode. Use one of: auto, unpublish, deprecate.");
  }

  const packages = getPublishablePackages();
  if (packages.length === 0) {
    log("No publishable packages found for npm cleanup.");
    return;
  }

  for (const pkgName of packages) {
    const versions = getNpmVersions(pkgName).filter(shouldIncludeVersion);
    if (versions.length === 0) {
      log(
        `No published npm versions found for ${pkgName} matching >= ${minVersion}.`,
      );
      continue;
    }

    log(
      `Found ${versions.length} npm versions for ${pkgName} matching >= ${minVersion}.`,
    );

    for (const version of versions) {
      const spec = `${pkgName}@${version}`;
      if (!apply) {
        if (npmMode === "unpublish") {
          log(`[dry-run] npm unpublish ${spec} --force`);
        } else if (npmMode === "deprecate") {
          log(`[dry-run] npm deprecate ${spec} "${deprecateMessage}"`);
        } else {
          log(
            `[dry-run] npm unpublish ${spec} --force (fallback: npm deprecate ${spec} "${deprecateMessage}")`,
          );
        }
        continue;
      }

      if (npmMode === "unpublish") {
        const unpublished = tryUnpublishNpmVersion(spec);
        if (unpublished) {
          log(`Unpublished ${spec}`);
        } else {
          log(`Failed to unpublish ${spec}`);
        }
        continue;
      }

      if (npmMode === "deprecate") {
        deprecateNpmVersion(spec);
        log(`Deprecated ${spec}`);
        continue;
      }

      const unpublished = tryUnpublishNpmVersion(spec);
      if (unpublished) {
        log(`Unpublished ${spec}`);
      } else {
        deprecateNpmVersion(spec);
        log(`Unpublish denied, deprecated ${spec}`);
      }
    }
  }
}

async function main() {
  log(`Mode: ${apply ? "apply" : "dry-run"}`);
  log(`npm cleanup mode: ${npmMode}`);
  log(`minimum version: ${minVersion}`);
  if (existsSync(envFilePath)) {
    log(`Loaded env file: ${envFilePath}`);
  }

  await cleanupGithubReleases();
  cleanupNpmReleases();

  log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
