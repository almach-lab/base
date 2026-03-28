import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [, , fromSha, toSha] = process.argv;

if (!fromSha || !toSha) {
  console.log("Missing commit range. Usage: node scripts/auto-changeset-from-commits.mjs <from> <to>");
  process.exit(0);
}

if (fromSha === "0000000000000000000000000000000000000000") {
  console.log("Initial push range detected. Skipping auto-changeset generation.");
  process.exit(0);
}

const changedFiles = run(`git diff --name-only ${fromSha}..${toSha}`).split("\n").filter(Boolean);
const commits = run(`git log --format=%s%n%b%x1e ${fromSha}..${toSha}`);

if (!changedFiles.length || !commits.trim()) {
  console.log("No changes in range. Skipping auto-changeset generation.");
  process.exit(0);
}

const affectedPackageDirs = new Set(
  changedFiles
    .map((file) => {
      const match = file.match(/^packages\/([^/]+)\//);
      return match ? `packages/${match[1]}` : null;
    })
    .filter(Boolean),
);

if (affectedPackageDirs.size === 0) {
  console.log("No package changes detected. Skipping auto-changeset generation.");
  process.exit(0);
}

const changedPackages = [];
for (const dir of affectedPackageDirs) {
  const pkgPath = join(dir, "package.json");
  if (!existsSync(pkgPath)) continue;
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  if (pkg.private || !pkg.name) continue;
  changedPackages.push(pkg.name);
}

if (changedPackages.length === 0) {
  console.log("No publishable package changes detected. Skipping auto-changeset generation.");
  process.exit(0);
}
changedPackages.sort();

const releaseType = inferReleaseType(commits);
const shortSha = toSha.slice(0, 7);

if (!existsSync(".changeset")) {
  mkdirSync(".changeset", { recursive: true });
}

const changesetFile = `.changeset/auto-${shortSha}.md`;
const header = changedPackages.map((name) => `"${name}": ${releaseType}`).join("\n");
const body = `---\n${header}\n---\n\nauto release from ${fromSha.slice(0, 7)}..${shortSha}\n`;

if (existsSync(changesetFile)) {
  console.log(`Changeset already exists: ${changesetFile}`);
  process.exit(0);
}

writeFileSync(changesetFile, body, "utf8");
console.log(`Generated ${changesetFile} for: ${changedPackages.join(", ")} (${releaseType})`);

function run(command) {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function inferReleaseType(rawCommits) {
  const entries = rawCommits
    .split("\u001e")
    .map((s) => s.trim())
    .filter(Boolean);

  let hasMinor = false;

  for (const entry of entries) {
    if (/\bBREAKING CHANGE\b/i.test(entry)) {
      return "major";
    }

    const firstLine = entry.split("\n")[0] ?? "";
    if (/^[a-z]+(\([^)]+\))?!:/i.test(firstLine)) {
      return "major";
    }
    if (/^feat(\([^)]+\))?:/i.test(firstLine)) {
      hasMinor = true;
    }
  }

  return hasMinor ? "minor" : "patch";
}
