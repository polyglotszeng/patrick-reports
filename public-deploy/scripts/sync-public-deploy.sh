#!/bin/bash
# Sync tracked root files to public-deploy/ (CF Workers deploy bundle)
# Run this BEFORE git push if you changed any tracked HTML/file.
# Worker + assets are read from public-deploy/, not root.
set -euo pipefail
cd "$(dirname "$0")/.."

rsync -a \
  --exclude='.git' --exclude='.git/**' \
  --exclude='neo-labs-build' --exclude='neo-labs-build/**' \
  --exclude='agentic-3d-mvp' --exclude='agentic-3d-mvp/**' \
  --exclude='.github' --exclude='.github/**' \
  --exclude='**/node_modules' --exclude='**/node_modules/**' \
  --exclude='**/.next' --exclude='**/out' \
  --exclude='bazi-*' \
  --exclude='deploy-*.sh' \
  --exclude='new-index.html' \
  --exclude='poetry-authors' --exclude='poetry-authors/**' \
  --exclude='reports.json.bak' \
  --exclude='public-deploy' --exclude='public-deploy/**' \
  --exclude='.deploy-trigger' \
  --exclude='.deploy-trigger-2' \
  --exclude='.deploy-trigger-3' \
  --exclude='.wranglerignore' \
  ./  public-deploy/

echo "✓ Synced."
git status -s public-deploy/ | head -10
echo ""
echo "Next: git add public-deploy/ && git commit && git push"
