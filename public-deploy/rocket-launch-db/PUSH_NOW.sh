#!/bin/bash
# 🚀 Rocket-Launch-DB · 一次性推送 2 commits + CF Pages 自动 deploy
#
# Patrick 怎么用:
#   1. 复制这段脚本到 Terminal
#   2. 确认 /Users/zl/patricks-reports/ 有 git remote 配置 (polyglotszeng@github.com)
#   3. 如果 git push 报 403 (token expired),准备一个 fine-grained PAT token 替换
#
# 已经为你准备好:
#   - 2 个 local git commits: dd00b2c (rocket-launch-db files) + dc921ce (SETUP.md)
#   - clean tag 只动了 rocket-launch-db/ + .github/workflows/rocket-launch-db-update.yml
#   - 不会影响其他 dirty 文件的源文件

set -e

cd /Users/zl/patricks-reports

echo "============================================================"
echo "  Status before push"
echo "============================================================"
git log origin/main..HEAD --oneline | head -10
echo ""
echo "  Files in last 2 commits (only rocket-launch-db + 1 yml, no other project files):"
git diff --stat origin/main..HEAD public-deploy/rocket-launch-db/ .github/workflows/rocket-launch-db-update.yml

echo ""
echo "============================================================"
echo "  Pushing 28 commits (including our 2 rocket-db commits)"
echo "============================================================"

git push origin HEAD:main

echo ""
echo "============================================================"
echo "  Verify CF Pages will deploy from this push"
echo "============================================================"
sleep 12
for path in /rocket-launch-db/ /rocket-launch-db/data/launches.json /rocket-launch-db/data/agencies.json /rocket-launch-db/data/crew.json; do
  http=$(curl -sI -L "https://2017zyl.xyz$path" -o /dev/null -w "%{http_code}" --max-time 30 || echo "TIMEOUT")
  echo "  $http $path"
done

echo ""
echo "============================================================"
echo "  Enable GH Actions auto-update"
echo "============================================================"
echo ""
echo "  1. https://github.com/polyglotszeng/patrick-reports/settings/actions"
echo "     → ensure 'Allow all actions and reusable workflows' is enabled"
echo "  2. https://github.com/polyglotszeng/patrick-reports/actions"
echo "     → enable 'Rocket-Launch-DB auto-update' workflow"
echo "  3. Run once manually → mode=full → verify build (~8 min)"
echo "  4. Done. Cron: 03:17 UTC daily (= 北京 11:17)"
