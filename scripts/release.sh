#!/bin/bash
set -euo pipefail

# Temporarily hide bun.lock and strip the packageManager field so that
# package-manager-detector falls back to npm for `changeset publish`.
# Reason: bun publish rejects non-JS exports (e.g. @almach/ui's ./styles).
cleanup() {
  [[ -f bun.lock.bak ]] && mv bun.lock.bak bun.lock || true
  git checkout -- package.json 2>/dev/null || true
}
trap cleanup EXIT

mv bun.lock bun.lock.bak
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  delete pkg.packageManager;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

npx changeset publish
