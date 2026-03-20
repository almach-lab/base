#!/bin/bash
set -e

# Build with bun.lock present so turbo can resolve workspaces
bun run build --filter=!docs

# Temporarily hide bun.lock and strip the packageManager field from package.json
# so that package-manager-detector falls back to npm for changeset publish.
# (bun publish fails on non-JS exports such as @almach/ui's ./styles CSS export)
mv bun.lock bun.lock.bak
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
delete pkg.packageManager;
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

npx changeset publish

# Restore
mv bun.lock.bak bun.lock
git checkout package.json
