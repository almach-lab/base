# Deployment Setup

## Prerequisites

- [Bun](https://bun.sh) installed locally (`curl -fsSL https://bun.sh/install | bash`)
- GitHub repository with Actions enabled
- npm account at [npmjs.com](https://npmjs.com)
- Cloudflare account at [dash.cloudflare.com](https://dash.cloudflare.com)

---

## 1. npm Publishing

### Configure npm Trusted Publishing (OIDC)

`release.yml` publishes via npm trusted publishing, so no npm token is stored in GitHub.

For each package (`@almach/utils`, `@almach/ui`, `@almach/forms`, `@almach/query`):

1. Open the package on npmjs.com → **Settings → Trusted Publisher → GitHub Actions**
2. Organization or user: `almach-lab`
3. Repository: `base`
4. Workflow filename: `release.yml`
5. Environment: leave empty
6. Save. The first publish must succeed within 2 days of creating the config.
7. Optional hardening: **Publishing access → Require two-factor authentication and disallow tokens**

Constraints: the release job must run on a GitHub-hosted runner (self-hosted runners such as Blacksmith are not supported), with npm CLI ≥ 11.5.1 and Node ≥ 22.14.

### Configure GitHub Actions for Releases

To allow the automated release process to open Pull Requests and trigger CI checks:

1. Go to your repository **Settings → Actions → General**.
2. Under **Workflow permissions**, make sure **Read and write permissions** is selected.
3. Check the box for **"Allow GitHub Actions to create and approve pull requests"**.

### Add to GitHub Secrets

**Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value                                                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GH_PAT`    | (Optional) A GitHub Personal Access Token (repo, workflow scope). Provide this if you want the Release PRs to automatically trigger CI checks. If missing, defaults to the built-in token. |

### How releases work

1. Make changes in a branch and open a PR
2. Use conventional commits (`feat:`, `fix:`, `feat!:` or `BREAKING CHANGE`)
3. Merge to `main`
4. `release.yml` auto-generates changesets from commits, versions packages, and publishes automatically

---

## 2. Cloudflare Pages

### Create the Pages Project (one-time)

1. Go to [dash.cloudflare.com → Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Click **Create a project → Direct Upload**
3. Name it exactly: **`based-ui-docs`**
4. Skip the initial upload — CI handles it

### Create a Cloudflare API Token

1. Go to [dash.cloudflare.com → Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token → Use template: Cloudflare Pages — Edit**
3. Copy the token

### Find your Account ID

On any Cloudflare dashboard page, look at the URL:
`https://dash.cloudflare.com/<ACCOUNT_ID>/...`

### Add to GitHub Secrets

| Secret name             | Value                         |
| ----------------------- | ----------------------------- |
| `CLOUDFLARE_API_TOKEN`  | API token from the step above |
| `CLOUDFLARE_ACCOUNT_ID` | Your account ID               |

### How deploys work

| Event          | Result                                             |
| -------------- | -------------------------------------------------- |
| Push to `main` | Production deploy → `based-ui-docs.pages.dev`      |
| Open a PR      | Preview deploy → unique URL posted as a PR comment |

---

## 3. Local Development

```bash
# Install all dependencies
bun install

# Run the Astro docs dev server (hot reload across all packages)
bun run docs

# Build everything
bun run build

# Build packages only (skip docs)
bun run build:packages

# Lint code (Biome)
bun run lint

# Check formatting (Biome)
bun run format:check

# Type-check everything
bun run typecheck

# Run release publish flow manually (same command CI uses)
bun run release
```

---

## 4. Emergency Manual Publish

```bash
# Build all packages (skip docs)
bun run build:packages

# Publish all public packages
bun run release
```

---

## 5. Secrets Summary

| Secret                  | Where used                            | How to get it                                                       |
| ----------------------- | ------------------------------------- | ------------------------------------------------------------------- |
| `GH_PAT`                | `release.yml`                         | GitHub → Settings → Developer settings → PAT (repo, workflow scope) |
| `CLOUDFLARE_API_TOKEN`  | docs deployment workflow (if enabled) | Cloudflare → Profile → API Tokens → Pages Edit template             |
| `CLOUDFLARE_ACCOUNT_ID` | docs deployment workflow (if enabled) | Cloudflare dashboard URL                                            |
