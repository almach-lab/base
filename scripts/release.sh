#!/bin/bash
set -euo pipefail

# Temporarily hide bun.lock and strip the packageManager field so that
# package-manager-detector falls back to npm for `changeset publish`.
# Reason: bun publish rejects non-JS exports (e.g. @almach/ui's ./styles).
cleanup() {
  [[ -f bun.lock.bak ]] && mv bun.lock.bak bun.lock || true
  git checkout -- package.json packages/*/package.json apps/*/package.json 2>/dev/null || true
}
trap cleanup EXIT

mv bun.lock bun.lock.bak
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  delete pkg.packageManager;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# Replace workspace:* references with actual version numbers so that
# npm publish does not ship literal 'workspace:*' strings to the registry.
# (npm does not understand the workspace protocol; only bun/pnpm/yarn do.)
node -e "
  const fs = require('fs');
  const path = require('path');

  // Collect name → version for every local package
  const roots = ['packages', 'apps'];
  const versions = {};
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const dir of fs.readdirSync(root)) {
      const pkgPath = path.join(root, dir, 'package.json');
      if (!fs.existsSync(pkgPath)) continue;
      const { name, version } = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (name && version) versions[name] = version;
    }
  }

  // Rewrite workspace:* / workspace:^ / workspace:~ to the resolved version
  function resolveWorkspaceDeps(deps) {
    if (!deps) return;
    for (const [name, range] of Object.entries(deps)) {
      if (typeof range === 'string' && range.startsWith('workspace:')) {
        if (!versions[name]) {
          console.error('Cannot resolve workspace dep:', name);
          process.exit(1);
        }
        deps[name] = '^' + versions[name];
      }
    }
  }

  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const dir of fs.readdirSync(root)) {
      const pkgPath = path.join(root, dir, 'package.json');
      if (!fs.existsSync(pkgPath)) continue;
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      resolveWorkspaceDeps(pkg.dependencies);
      resolveWorkspaceDeps(pkg.devDependencies);
      resolveWorkspaceDeps(pkg.peerDependencies);
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    }
  }
  console.log('Resolved workspace:* references:', versions);
"

npx changeset publish
