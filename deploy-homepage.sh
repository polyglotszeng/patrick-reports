#!/usr/bin/env bash
# Deploy new homepage for 2017zyl.xyz (Cloudflare Workers, git-integrated auto-deploy)
#
# WHAT IT DOES:
#   1. Clears any stale .git/index.lock
#   2. Renames current homepage (OpenSwarm investor pitch) index.html -> investor.html
#   3. Swaps in your new homepage (new-index.html -> index.html)
#   4. Rebases past the 2 automated wrangler-name bot commits on origin/main
#   5. Commits and pushes  -> Cloudflare Workers auto-deploys
#
# PREREQ: save the redesigned homepage as ./new-index.html in this repo root.
#
# USAGE:  cd ~/patricks-reports && bash deploy-homepage.sh

set -euo pipefail
cd "$(dirname "$0")"

NEW="new-index.html"

echo "==> Repo: $(pwd)"

# 0. sanity checks
if [[ ! -f "$NEW" ]]; then
  echo "ERROR: $NEW not found. Save your redesigned homepage as ./$NEW first." >&2
  exit 1
fi
if [[ ! -f index.html ]]; then
  echo "ERROR: index.html not found in repo root." >&2
  exit 1
fi
if [[ -f investor.html ]]; then
  echo "ERROR: investor.html already exists — refusing to overwrite. Resolve manually." >&2
  exit 1
fi
# guard against an empty/tiny new homepage
NEWSIZE=$(wc -c < "$NEW" | tr -d ' ')
if (( NEWSIZE < 2000 )); then
  echo "ERROR: $NEW is only ${NEWSIZE} bytes — looks wrong. Aborting." >&2
  exit 1
fi
echo "==> New homepage: $NEW (${NEWSIZE} bytes)"

# 1. clear stale lock (safe: only removes a zero-byte lock with no git running)
if [[ -f .git/index.lock ]]; then
  echo "==> Removing stale .git/index.lock"
  rm -f .git/index.lock
fi

# 2. make sure we're on main and the tree (apart from our files) is sane
git rev-parse --abbrev-ref HEAD | grep -qx main || { echo "ERROR: not on main branch." >&2; exit 1; }

# 3. sync with origin first (pull the 2 wrangler bot commits) BEFORE making changes
echo "==> Fetching + rebasing onto origin/main"
git fetch origin
git rebase origin/main

# 4. the swap
echo "==> git mv index.html -> investor.html"
git mv index.html investor.html
echo "==> moving $NEW -> index.html"
git mv "$NEW" index.html

# 5. commit
git add -A
git commit -m "feat(homepage): new landing page; move investor pitch to /investor

- index.html -> investor.html (OpenSwarm investor pitch now at /investor)
- new redesigned homepage -> index.html"

# 6. push -> triggers Cloudflare Workers auto-deploy
echo "==> Pushing to origin/main"
git push origin main

echo ""
echo "==> DONE. Cloudflare Workers will auto-deploy in ~1-3 min."
echo "    Homepage:        https://2017zyl.xyz/"
echo "    Investor pitch:  https://2017zyl.xyz/investor   (also /investor.html)"
