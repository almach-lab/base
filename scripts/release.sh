#!/bin/bash
set -euo pipefail

cleanup() {
  [[ -f bun.lock.bak ]] && mv bun.lock.bak bun.lock
  git checkout -- package.json packages/*/package.json apps/*/package.json 2>/dev/null || true
}
trap cleanup EXIT

if [[ -f bun.lock ]]; then
  mv bun.lock bun.lock.bak
fi

node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  delete pkg.packageManager;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

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

npx changeset publish
