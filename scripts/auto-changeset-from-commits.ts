import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [, , fromArg, toArg] = process.argv;
const toSha = toArg?.trim() || run("git rev-parse HEAD");
const fromSha = resolveFromSha(fromArg, toSha);

if (!fromSha || !toSha) {
  console.log(
    "Unable to resolve commit range. Skipping auto-changeset generation.",
  );
  process.exit(0);
}

const changedFiles = run(`git diff --name-only ${fromSha}..${toSha}`)
  .split("\n")
  .filter(Boolean);
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
    .filter((d): d is string => d !== null),
);

if (affectedPackageDirs.size === 0) {
  console.log(
    "No package changes detected. Skipping auto-changeset generation.",
  );
  process.exit(0);
}

const changedPackages: string[] = [];
for (const dir of affectedPackageDirs) {
  const pkgPath = join(dir, "package.json");
  if (!existsSync(pkgPath)) continue;
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  if (pkg.private || !pkg.name) continue;
  changedPackages.push(pkg.name);
}

if (changedPackages.length === 0) {
  console.log(
    "No publishable package changes detected. Skipping auto-changeset generation.",
  );
  process.exit(0);
}
changedPackages.sort();

const releaseType = inferReleaseType(commits);

if (!releaseType) {
  console.log(
    "Only release or merge commits detected. Skipping auto-changeset generation.",
  );
  process.exit(0);
}

const shortSha = toSha.slice(0, 7);

if (!existsSync(".changeset")) {
  mkdirSync(".changeset", { recursive: true });
}

const changesetFile = `.changeset/auto-${shortSha}.md`;
const header = changedPackages
  .map((name) => `"${name}": ${releaseType}`)
  .join("\n");
const body = `---\n${header}\n---\n\nauto release from ${fromSha.slice(0, 7)}..${shortSha}\n`;

if (existsSync(changesetFile)) {
  console.log(`Changeset already exists: ${changesetFile}`);
  process.exit(0);
}

writeFileSync(changesetFile, body, "utf8");
console.log(
  `Generated ${changesetFile} for: ${changedPackages.join(", ")} (${releaseType})`,
);

function run(command: string): string {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function inferReleaseType(
  rawCommits: string,
): "major" | "minor" | "patch" | null {
  const entries = rawCommits
    .split("\u001e")
    .map((s) => s.trim())
    .filter(Boolean);

  let hasMinor = false;
  let hasValidCommit = false;

  for (const entry of entries) {
    const firstLine = entry.split("\n")[0] ?? "";

    if (
      firstLine.startsWith("chore: version packages") ||
      firstLine.startsWith("Version Packages") ||
      firstLine.startsWith("Merge pull request") ||
      firstLine.startsWith("Merge branch") ||
      firstLine.includes("chore(release)")
    ) {
      continue;
    }

    hasValidCommit = true;

    if (/\bBREAKING CHANGE\b/i.test(entry)) {
      return "major";
    }

    if (/^[a-z]+(\([^)]+\))?!:/i.test(firstLine)) {
      return "major";
    }
    if (/^feat(\([^)]+\))?:/i.test(firstLine)) {
      hasMinor = true;
    }
  }

  if (!hasValidCommit) {
    return null;
  }

  return hasMinor ? "minor" : "patch";
}

function resolveFromSha(
  fromCandidate: string | undefined,
  toShaValue: string,
): string {
  const candidate = fromCandidate?.trim() || "";
  const zero = "0000000000000000000000000000000000000000";

  if (candidate && candidate !== zero && commitExists(candidate)) {
    return candidate;
  }

  const latestTag = run("git describe --tags --abbrev=0");
  if (latestTag) {
    const shaFromTag = run(`git rev-list -n 1 ${latestTag}`);
    if (shaFromTag && shaFromTag !== toShaValue) {
      console.log(
        `Using fallback range from latest tag ${latestTag} (${shaFromTag.slice(0, 7)})`,
      );
      return shaFromTag;
    }
  }

  const parent = run(`git rev-parse ${toShaValue}^`);
  if (parent) {
    console.log(
      `Using fallback range from previous commit ${parent.slice(0, 7)}`,
    );
    return parent;
  }

  return "";
}

function commitExists(sha: string): boolean {
  try {
    const type = execSync(`git cat-file -t ${sha}`, {
      encoding: "utf8",
    }).trim();
    return type === "commit";
  } catch {
    return false;
  }
}
