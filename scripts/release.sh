#!/bin/bash
set -euo pipefail


cleanup() {
  git checkout -- package.json packages/*/package.json apps/*/package.json 2>/dev/null || true
}
trap cleanup EXIT

# changesets v3 detects the bun workspace via bun.lock / packageManager; removing them hides all packages.
node -e "
  const fs = require('fs');
  const path = require('path');

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

bunx changeset publish
