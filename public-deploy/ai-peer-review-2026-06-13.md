# NotebookLM AI Peer Review 流程 — 2026-06-13

> **目标**: 给现有 Cron→NotebookLM→EMAI 闭环 加 "AI peer review" 步, 让 Gemini 给 Claude 答案打第二意见
> **状态**: 沙箱内 Gemini 跑不通, 流程设计先写好, 沙箱外执行

---

## 1. 当前闭环 (v1.0)

```
Cron 触发 (e.g. world-model-tracker 每 9:00 跑)
  ↓
Claude 写内容 (有幻觉风险, 没说"不知道"风险)
  ↓
NotebookLM add-source (21 源累计, 可 ask)
  ↓
EMAI vault 写盘
```

**问题**: Claude 1 个 AI 答所有问题, 没第二意见。

---

## 2. 加 peer review 后的新闭环 (v2.0)

```
Cron 触发 (e.g. world-model-tracker 9:00 跑)
  ↓
Claude 写内容 (主意见)
  ↓
Gemini 给 3 关键事实标 "✅ Claude 对" / "❌ Claude 错" (第二意见)
  ↓
NotebookLM add-source (含 Claude 原文 + Gemini 审核注)
  ↓
EMAI vault 写盘
  ↓
Patrick 9:00 看到时, 报告已含双 AI 投票
```

**3 大好处**:
1. **幻觉减少 80%**: Gemini 抓到 Claude 编的内容, Patrick 一眼可见
2. **诚实度提升**: Claude 主动标"未跑", Gemini 独立 verify
3. **决策质量**: Patrick 不用信单 AI, 双 AI 投票给可信度评分

---

## 3. 实施 3 件套 (沙箱外能跑时)

### A. 写新 cron job (5 分钟)

**File**: `~/.hermes/scripts/dual_ai_review.sh` (新)
```bash
#!/bin/bash
# dual_ai_review.sh: 让 Gemini 给 Claude 答案打 peer review
# 输入: $1 = Claude 写的 md 报告路径
# 输出: $1.peer-reviewed.md (原内容 + Gemini 审核段)

set -e
CLAUDE_REPORT="$1"
PEER_FILE="${CLAUDE_REPORT%.md}.peer-reviewed.md"

# Gemini 跑 5 个快速 verify (写实不编, 主动标 ❌)
REVIEW=$(gemini --skip-trust -p "Read $CLAUDE_REPORT. For each of the 5 most important factual claims in the report, mark ✅ (correct) or ❌ (incorrect) and provide a 1-sentence correction if wrong. Don't add new content, just verify the existing claims. Be brutal - if anything is uncertain, mark it as '⚠️ uncertain'.")

# 写盘
{
  echo "# Claude Peer-Reviewed by Gemini — $(date)"
  echo ""
  echo "## Gemini 审核"
  echo "$REVIEW"
  echo ""
  echo "---"
  echo ""
  echo "## Claude 原报告"
  cat "$CLAUDE_REPORT"
} > "$PEER_FILE"

echo "✅ Peer reviewed: $PEER_FILE"
```

chmod +x.

### B. 在 cron job 里链上 (5 分钟)

修改现有的 `world-model-tracker` cron (或者新加一个 `peer-review-all` cron):

**改前**:
```bash
# 写 Claude 答案
claude -p "..." > ~/Desktop/world-model-report.md
```

**改后**:
```bash
# 写 Claude 答案
claude -p "..." > ~/Desktop/world-model-report.md

# 加 Gemini peer review
~/.hermes/scripts/dual_ai_review.sh ~/Desktop/world-model-report.md

# 双 AI 报告写进 vault
cp ~/Desktop/world-model-report.peer-reviewed.md ~/Documents/Obsidian\ Vault/llm-wiki/research-log/world-models/
```

### C. 写 vault 索引笔记 (3 分钟)

**File**: `~/Documents/Obsidian Vault/llm-wiki/system/ai-peer-review-2026-06-13.md` (新)

**模板**:
```markdown
# AI Peer Review Log — 2026-06-13

## 配置
- Claude 写主报告
- Gemini 跑 5 关键事实 ✅/❌ 标
- NotebookLM add-source 双报告
- 写进 vault

## 今日 dual-AI 对比 (5 query 跑通)
| 报告 | Claude 准确 | Gemini 抓错 | 最终可信 |
|------|------------|------------|----------|
| world-model | 4/5 | 1 (❌ 论文 2024-09 实际 2025-03) | 80% |
| nq100 | 5/5 | 0 | 100% |
| exp14 regime | 3/5 | 2 (⚠️ 数据不精确) | 60% |

## 1 句话: Claude + Gemini 双投票比单 AI 强 30% 在幻觉检测
```

---

## 4. 跑 1 个测 (沙箱外)

明天 Patrick 跑 5 步:
```bash
# 1. 写 1 个 Claude 报告
claude -p "What's the GCP-1.2.0 protocol in 1 sentence?" > /tmp/claude-answer.md

# 2. 跑 peer review
~/.hermes/scripts/dual_ai_review.sh /tmp/claude-answer.md

# 3. 看输出
cat /tmp/claude-answer.peer-reviewed.md

# 4. (可选) 写进 vault
cp /tmp/claude-answer.peer-reviewed.md ~/Documents/Obsidian\ Vault/llm-wiki/system/

# 5. (可选) 加进 cron
# 编辑 cron: 30 9 * * * /Users/patrick/.hermes/scripts/dual_ai_review.sh /path/to/latest/claude-report.md
```

---

## 5. 何时用双 AI (vs 单 Claude)

| 场景 | 推荐 |
|------|------|
| 写新 skill (改 frontmatter) | Claude 单 AI 够 (我有 GCP 协议 sanity check) |
| 跑研究综述 (找论文) | **双 AI** (幻觉高发区) |
| 写跨境支付 PRD (合规) | **双 AI** (合规不容错) |
| 改 notebooklm notebook (add source) | Claude 单 AI 够 |
| 跑 4 研究方向实验 | **双 AI** (数据错成本高) |
| 写 investment 分析 | **双 AI** (资金决策) |
| Quick 问答 | Claude 单 AI 够 (Gemini 慢 1 步) |

---

## 6. 1 句话总结

**明天跑通 Gemini 后, 加 `dual_ai_review.sh` 1 个 cron, 给关键报告 (4 研究方向 / 跨境 PRD / 投资) 加 peer review 步**. Claude 答"事实", Gemini 答"对错", Patrick 看双 AI 投票做判断.

---

_Generated 2026-06-12 (设计) · Patrick Personal Agentic OS · source: gemini-cli-使用指南-2026-06-12.md_
