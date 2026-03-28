# Deployment Setup

## Prerequisites

- [Bun](https://bun.sh) installed locally (`curl -fsSL https://bun.sh/install | bash`)
- GitHub repository with Actions enabled
- npm account at [npmjs.com](https://npmjs.com)
- Cloudflare account at [dash.cloudflare.com](https://dash.cloudflare.com)

---

## 1. npm Publishing

### Create an npm Automation Token

1. Go to [npmjs.com → Access Tokens](https://www.npmjs.com/settings/~/tokens)
2. Click **Generate New Token → Granular Access Token**
3. Set permissions: **Read and write** on all `@almach/*` packages
4. Copy the token

### Add to GitHub Secrets

**Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|-------------|-------|
| `NPM_TOKEN` | The token you just created |

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

| Secret name | Value |
|-------------|-------|
| `CLOUDFLARE_API_TOKEN` | API token from the step above |
| `CLOUDFLARE_ACCOUNT_ID` | Your account ID |

### How deploys work

| Event | Result |
|-------|--------|
| Push to `main` | Production deploy → `based-ui-docs.pages.dev` |
| Open a PR | Preview deploy → unique URL posted as a PR comment |

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
bun run build --filter=!docs

# Type-check everything
bun run typecheck

# Run release publish flow manually (same command CI uses)
bun run release
```

---

## 4. Emergency Manual Publish

```bash
# Build all packages (skip docs)
bun run build --filter=!docs

# Publish all public packages
bun run release
```

---

## 5. Secrets Summary

| Secret | Where used | How to get it |
|--------|-----------|---------------|
| `NPM_TOKEN` | `release.yml` | npmjs.com → Granular Access Token (read/write) |
| `CLOUDFLARE_API_TOKEN` | docs deployment workflow (if enabled) | Cloudflare → Profile → API Tokens → Pages Edit template |
| `CLOUDFLARE_ACCOUNT_ID` | docs deployment workflow (if enabled) | Cloudflare dashboard URL |
