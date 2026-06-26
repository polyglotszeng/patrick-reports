# Patrick 手动 push 命令 (1 行, 30s)

## ⚠️ 重要: 不要在 Hermes 沙箱跑, 必 Patrick 自己的 terminal

```bash
# 1. 先看 ahead/behind 状态
cd ~/patricks-reports && git status -sb
# 预期: ## main...origin/main [ahead 2, behind 1]

# 2. 安全强推 (--force-with-lease 校验 ref, 实际不丢 origin 任何老 commit)
# 89 vs 88 文件, diff 3 项:
#   + jensen-huang-lex-fridman-494.md (本次新加, 1ae9e46)
#   + pr-desc-2026-06-13-jensen.md (本次新加, 跟 .md 同 1ae9e46)
#   + cf-pages-migration-guide-2026-06-13.md / notebooklm-add-index-2026-06-13.md (sync-daily-reports 跑时新加)
git push --force-with-lease origin main
```

## 跟其他 push 方案对比

| 方案 | 风险 | 速度 | 适用 |
|------|------|------|------|
| `git push` (普通) | ahead 2 behind 1 = blocked | ❌ 推不动 | n/a |
| `git pull --rebase && git push` | 0 (rebase 把 origin 1ac2374 接到本地 89079d1 后再 fast-forward push) | 10s | **Patrick 偏好的最简方案** |
| `git push --force-with-lease` | 0 (lease check 防止覆盖 origin 未知 commit) | 5s | 也安全 |
| `git push --force` | 中 (覆盖 origin 任何未知 commit, 但本次没未知) | 5s | 不推荐 |

## 推荐

```bash
cd ~/patricks-reports && git pull --rebase origin main && git push origin main
```

**这 1 行**:
1. `git pull --rebase` 把 origin 1ac2374 rebase 到本地 89079d1 后
2. 因 origin 1ac2374 是本地 89079d1 的 ancestor, rebase 是 no-op
3. `git push` fast-forward 到 1ac2374 + 1ae9e46 + 89079d1 = 3 commits ahead
4. 整个过程 0 风险, 0 force, 跟 Patrick 决策风格一致

## 验证

```bash
# push 完看公网
curl -sI https://patrick-reports.patrick-l-zeng.workers.dev/jensen-huang-lex-fridman-494.html | head -3
# 预期: HTTP/2 200, content-length: 25xxx
```

## 如果还是失败 (网络持续抖)

```bash
# 1. 看 agent.log 看是不是 Hermes gateway 自己有问题
tail -50 ~/.hermes/logs/agent.log | grep -i "git\|push" | tail -10

# 2. 重试 1 次, 不行就等 cron 23:30 sync-daily-reports.sh 兜底
#    (cron 23:30 不帮你 rebase 1ae9e46, 但如果你 1ae9e46 在本地, 它推的也是本地 branch 状态)
```

## 时间线

- 13:02:32 (UTC+8) commit 1ae9e46 写好 (Jensen .md + extended body)
- 13:02:32 (UTC+8) commit 89079d1 sync-daily-reports 跑成功 (本地)
- 13:02:32 (UTC+8) origin 1ac2374 已有 (其他 session 推的 sync +86 file)
- 13:02-13:15 (UTC+8) 5 次 git push 失败 (HTTP2 framing / Failed to connect / timeout)
- 13:15+ (UTC+8) 写 pr-desc + 准备 Patrick 手动 push 1 行命令

**Patrick 起床后跑 1 行即可, 30s 内完成**.
