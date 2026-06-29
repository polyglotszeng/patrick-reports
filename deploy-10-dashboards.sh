#!/usr/bin/bash
# Deploy 10 new vault dashboards + updated daily-reports.html + reports.json
# CF Pages auto-deploy on push to main

set -euo pipefail
cd "$(dirname "$0")"

echo "==> Repo: $(pwd)"
echo "==> Branch: $(git rev-parse --abbrev-ref HEAD)"

# 0. sanity
if [[ ! -f daily-reports.html ]]; then echo "ERROR: daily-reports.html missing"; exit 1; fi

# 1. Show diff stats
echo "==> Files to commit:"
git status --short | head -30

# 2. Add all
git add -A

# 3. Commit
git commit -m "feat(daily-reports): 10 new vault dashboards + reports.json (v1.6.0 pipeline)

- 6 video dashboards (l8-principal / peter-yang / howie-liu / discover / ooda-infinite-brain / sensor-tower)
- 4 v1.6.0 auto dashboards (zai-glm-5-2 / wwdc26 / task-decomposition + 1 earlier)
- daily-reports.html: 198 entries (188->198), 3 meta '143+' -> '158+', comment 133->211
- reports.json: 211 entries (201->211)

Pattern: v1.6.0 drop-link pipeline (YouTube URL -> 3-artifact + auto v1.4.2 TOC)
- 12 vault 主题 = 60+ Patrick 关联 card 跨 video
- 32 daily-reports HTML dashboards (was 22, +10 new)
- 5 工具 build: Telegram bot / Content Multiplier / 4-Answer Checker / Heartbeat / Poisson Router
- claude_api.py (v1.0.1): 替代 subprocess.run(['claude','-print']) 非 TTY 报 Not logged in

Triggered CF Pages auto-deploy on push."

# 4. Push
echo "==> Pushing to origin/main"
git push origin main

echo ""
echo "==> DONE. CF Pages will auto-deploy in ~1-3 min."
echo "    Verify:  https://2017zyl.xyz/daily-reports"
echo "    RSS:     https://2017zyl.xyz/rss.xml"