# ⚠️ Auto-Rollback 需要人工处理

**时间**: Sun Jun 14 23:35:40 CST 2026
**原因**: 公网 HTML HTTP ERR: HTTP Error 404: Not Found
**检测**:
- 公网 HTML 异常
- 或 latest.md 损坏

**已知良好 commit**: 1c7c2cbac71c1fcda1dd64e0abd70b617be32a69
**当前 HEAD**: d84dd8fba4e0ee154a3381f5e68880b1321dbec9
**冲突 commit 数**: 3 (revert range)

## 手动恢复步骤

```bash
cd ~/patricks-reports

# 1. 看历史
git log --oneline -10

# 2. 决定哪个 commit 是 "known good"
# 3. revert (冲突时手动 fix)
git revert --no-edit 1c7c2cbac71c1fcda1dd64e0abd70b617be32a69..HEAD

# 4. 冲突 → 手动 edit 后:
git add <fixed-files>
git revert --continue

# 5. push
git push origin main
```

## 安全建议

**不要**直接 `git reset --hard` + `push -f`, 会丢历史 commit.
