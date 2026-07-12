#!/usr/bin/env bash
# ship.sh — one-shot CF Pages deploy for patricks-reports
#
# 用法:
#   ./ship.sh "commit message here"
#
# 流程:
#   1. git add + commit (单文件或全量)
#   2. git push (走 HTTP/1.1 workaround 治 China 网络 github.com TCP 黑)
#   3. wrangler pages deploy (keychain token)
#   4. 30s 等 CDN + 4 路 verify
#
# PITFALL 已知:
#   - HTTP/1.1 fallback 治 github.com web-tier blackhole (api 通但 web 黑)
#   - keychain token via env var 是 one-shot 安全边界 (per PITFALL #52)
#   - CF Pages 项目是 Direct Upload, 不是 Git integration — 改用 wrangler 而非依赖 webhook

set -euo pipefail

MSG="${1:-"chore(ship): $(date -u '+%Y-%m-%dT%H:%M:%SZ')"}"
ACCT="973acd5a421519e1a390fe9cd75de28a"

cd "$(dirname "$0")"

echo "============================================================"
echo "  1/4 git add + commit"
echo "============================================================"
# Default: add all modified files. Override with FILES="file1 file2" ./ship.sh
if [ -n "${FILES:-}" ]; then
  git add $FILES
else
  git add -A
fi

if git diff --staged --quiet; then
  echo "  (no staged changes — skip commit, just deploy)"
  SKIP_COMMIT=1
else
  echo "  Staged:"
  git diff --staged --stat | sed 's/^/    /'
  git commit -m "$MSG" --no-verify
fi

echo ""
echo "============================================================"
echo "  2/4 git push (HTTP/1.1 fallback for github.com TCP blackhole)"
echo "============================================================"
if [ -z "${SKIP_COMMIT:-}" ]; then
  GIT_HTTP_LOW_SPEED_TIME=30 GIT_HTTP_LOW_SPEED_LIMIT=1000 \
    git -c http.version=HTTP/1.1 -c http.postBuffer=524288000 \
    push origin main 2>&1 | tail -5
fi

echo ""
echo "============================================================"
echo "  3/4 wrangler pages deploy"
echo "============================================================"
TOKEN=$(security find-internet-password -s "api.cloudflare.com" -w)
export CLOUDFLARE_API_TOKEN="$TOKEN"

wrangler pages deploy public-deploy \
  --project-name patrick-reports \
  --commit-dirty=true \
  --branch=main 2>&1 | tail -10

echo ""
echo "============================================================"
echo "  4/4 wait 30s + 4-way verify"
echo "============================================================"
sleep 30
VER="v=$(date +%Y%m%d%H%M)"
echo "  cache-buster: ?$VER"
echo ""

for url in "https://2017zyl.xyz/rocket-launch-db-live/?$VER" \
           "https://patrick-reports.pages.dev/rocket-launch-db-live/?$VER"; do
  size=$(curl -sL --max-time 10 "$url" 2>&1 | wc -c)
  markers=$(curl -sL --max-time 10 "$url" 2>&1 | grep -c "renderSparkline\|computeDailyBuckets\|status-pill\|recent-summary\|day-separator")
  printf "  %s\n    size=%s markers=%s\n" "$url" "$size" "$markers"
done

echo ""
echo "============================================================"
echo "  ✓ Done. Live URL: https://2017zyl.xyz/"
echo "============================================================"