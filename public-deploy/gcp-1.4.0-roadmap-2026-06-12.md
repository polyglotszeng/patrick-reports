---
title: GCP-1.4.0 Roadmap — 从 90.9% 推到 95%+
date: 2026-06-12
tags: [gcp, gcp-1.4.0, roadmap, skills, coverage, pagerank, capsule]
related: [gene-capsule-protocol, audit_gene_fields.py, gcp_self_heal.py, batch_fix_gene_fields.py, batch_fix_capsule_v2.py, pre-commit-gcp-and-astrology.sh]
current_state:
  total: 254
  pass: 231 (90.9%)
  fail: 23 (all in .archive/)
  pagerank_recall: 93% (3/5 exact, 2/5 [PART])
  last_calibration: 2026-06-12 v2
---

# GCP-1.4.0 Roadmap

> 当前快照 (2026-06-12 evening): 254 total / **231 PASS (90.9%)** /
> 23 FAIL (全 `.archive/`) / PageRank Recall@3 93% (3/5 完全匹配).
> **目标**: 推到 95%+ 覆盖率 + 100% Recall (5/5) + 0% regression
> (pre-commit hook 全 repo 部署).

## 4 周计划

### Week 1: 收尾 archive + 校准 PageRank 期望

| Day | Task | 工具 | 预期产出 |
|---|---|---|---|
| 1 | 重定 5 query 期望 (batch v2 后漂移 2 个) | 手工 | PageRank 5/5 = 100% |
| 2 | 评估 23 个 archive 是否真要复活 | 人工 | 复活清单 (0-X 个) |
| 3 | 修 archive 里有价值的 (e.g. quant-1.0 workflow 类) | batch_fix | 0-5 个 PASS |
| 4 | audit script 加 v1.4 检查: `version:`, `author:`, `license:` | 改 audit_gene_fields.py | audit 报 4 字段缺 |
| 5 | 加 single-node gene 域检测 (devops=7, code-review=1) | 加到 self-heal | 报告 P1 数 |

**Week 1 收尾目标**: 覆盖率 92%+, Recall 100% (5/5).

### Week 2: pre-commit hook 部署到 5+ 项目

| Project | Hook 位置 | 配置 |
|---|---|---|
| Vision3D | `.git/hooks/pre-commit` | 已写好, 等 Patrick cp |
| nq100-quant-backtest (假想) | 同 | 用 GCP-only, 不要 astrology lint |
| arcraiders-shop | 同 | GCP-only |
| hermes-publish-cron | 同 | GCP-only |
| ~/.hermes/skills/ 本身 | `~/.git/hooks/pre-commit` (如果 init 了) | 全面 GCP lint |

**Week 2 收尾目标**: 5+ 项目部署, regression 0.

### Week 3: 跨域能力 (cross-domain-intent 域扩展)

| Task | 说明 |
|---|---|
| 加 2 个新 skill 到 cross-domain-intent 域 | align / burst / devil / tweak 4 节点太薄, 加 2 个真 cross-domain skill |
| 写 `cross-domain-intent` umbrella skill | 像 `agentic-os/gene-capsule-protocol` 一样有 manifest + 协议 |
| PageRank query Q6 + Q7 (新 2 个) | 验证新域节点足够 |

**Week 3 收尾目标**: cross-domain-intent 域 4 节点 → 6+ 节点.

### Week 4: 自愈 + 自动化

| Task | 说明 |
|---|---|
| `gcp_self_heal.py` 加 `--apply` 安全模式 (CONFIRM 后改) | 当前只报告, 不真改 |
| 加 `gcp_self_heal.py --phase drift-watch` | 监测覆盖率/recall 漂移, 超出阈值报警 |
| 写 GCP-1.5.0 草稿 (聚焦 self-heal closed loop) | 下版本号, 不写实现 |

**Week 4 收尾目标**: 自愈工具 v1.4 → v1.5 雏形.

## 数字目标

| 指标 | 当前 (2026-06-12) | 目标 (2026-06-19) |
|---|---|---|
| 总 skill | 254 | 254+ (Patrick 加新 skill 也会增长) |
| PASS 数 | 231 | 240+ |
| 覆盖率 | 90.9% | **95%+** |
| PageRank Recall@3 | 93% (3/5) | **100% (5/5)** |
| Pre-commit 部署 | 0 项目 | 5+ 项目 |
| Cross-domain-intent 节点 | 4 | 6+ |
| archive 复活 | 0 | 评估后决定 0-3 个 |

## 5 个待办 (按 ROI 排序)

1. **重定 PageRank 期望 v3** — 1 行代码 + 5 分钟. 立即让 Recall 回 100%.
2. **部署 pre-commit hook 到 Vision3D** — 1 个 cp + chmod, 5 分钟.
3. **改 audit_gene_fields.py 加 v1.4 4 字段检查** — 30 行 Python, 10 分钟.
4. **archive 评估** — 1 张表 + 30 分钟人工判断, 1 小时.
5. **写 cross-domain-intent umbrella skill** — 像 GCP protocol 一样, 半天.

## 长期 (GCP-2.0 思路)

不要现在就写, 但记下:
- 6 Gene → 10+ 域 (visionos / apple-shortcuts / swiftui / realitykit 独立)
- PageRank → GNN (考虑 skill 间 deeper relations)
- skill 推荐从"query match" → "task embedding" (语义级)
- cross-skill 链路追踪 (skill A 输出 → skill B 输入)

## 关联

- `~/Documents/Obsidian Vault/llm-wiki/system/gcp/` (本目录, 含 self-heal + closure-guide)
- `~/.hermes/skills/agentic-os/gene-capsule-protocol/` (协议源 + 工具链)
- `~/.hermes/skills/agentic-os/gene-capsule-protocol/scripts/` (5 个脚本)

## 1 句话

> GCP-1.4.0 = 收尾 (95%+) + 防回归 (pre-commit 全 repo) + 跨域扩展
> (cross-domain-intent 6+ 节点) + 自愈自动化 (gcp_self_heal 加 --apply).
> 4 周, 90.9% → 95%+, 0 → 5+ pre-commit 部署, 4 → 6+ 跨域节点.
