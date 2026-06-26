#!/bin/bash
# 1-click deploy sci-fi-authors to 2017zyl.xyz
# Patrick 自己跑 — agent 不写 GH token / CF token (06-17 硬护栏)
# 用法: bash ~/patricks-reports/sci-fi-authors/push.sh
set -e

cd ~/patricks-reports

echo "=== 1. 检查 working tree ==="
git status --short sci-fi-authors/
echo ""

echo "=== 2. Commit (如果还没) ==="
if git diff --cached --quiet -- sci-fi-authors/; then
  git add sci-fi-authors/sci-fi-authors.md sci-fi-authors/sci-fi-authors.html
  git commit -m "feat(sci-fi-authors): 15 位科幻小说家巡礼 — 4 浪潮/8 范式/Patrick 5 卡"
  echo "✓ Committed"
else
  echo "✓ Already staged"
fi
echo ""

echo "=== 3. Push 到 origin ==="
# Patrick 自己 GUI 输入 GitHub 用户名/密码 / 或用 GH_TOKEN env
# 例: GH_TOKEN=ghp_xxx bash push.sh
if [ -n "$GH_TOKEN" ]; then
  git push https://x-access-token:${GH_TOKEN}@github.com/polyglotszeng/patrick-reports.git main
else
  git push origin main
fi
echo "✓ Pushed"
echo ""

echo "=== 4. CF Pages auto-build ==="
echo "→ cloudflare-workers-and-pages[bot] 会开 PR: feat-pages/sci-fi-authors ..."
echo "→ Patrick 去 https://github.com/polyglotszeng/patrick-reports/pulls 找 bot 的 open PR"
echo "→ 点 'Merge pull request (Squash)' → 5-10 min 内 build → 公网 2017zyl.xyz/sci-fi-authors/ 上线"
echo ""

echo "=== 5. 验证 ==="
echo "→ 等 5 min 后: curl -I https://2017zyl.xyz/sci-fi-authors/sci-fi-authors.html"
echo "→ 应返回 HTTP/2 200"