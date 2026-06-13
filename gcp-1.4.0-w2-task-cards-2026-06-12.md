---
title: GCP-1.4.0 W2 Task Cards — cross-domain-intent 扩 6+ + 新 query
date: 2026-06-12
tags: [gcp, gcp-1.4.0, w2, cross-domain-intent, umbrella, pagerank]
week: 2026-06-19 ~ 2026-06-26
related: [gcp-1.4.0-w1-task-cards, gcp-skill-registry-bootstrap, cross-domain-intent]
state_at_w2_start: 95.3% (243/255) / PageRank 100% (5/5) / p1=1
w1_completed: 2/5 (W1-1 + W1-2 + W1-3 标 DONE)
w1_pending: W1-4 (cross-domain umbrella, 1-2 hr) + W1-5 (pre-commit 5+ 项目, 30 min)
---

# GCP-1.4.0 W2 Task Cards (3 任务)

> W2 主题: **cross-domain-intent 域扩展 (6+ 节点) + umbrella + 新 query + audit 加域节点检查**
> 当前: 95.3% / 100% / p1=1
> 时间预算: 6-10 小时 (3-4 天, 1 任务/天节奏)
> 依赖: W1-4 (cross-domain umbrella) 是 W2-1 前提

## 进度仪表

| Task | 状态 | 时间 | 优先级 |
|---|---|---|---|
| [W1-1] PageRank 期望 v3.5 重定 | ✓ DONE | 5 min | P0 |
| [W1-2] audit 加 v1.4 version 字段 | ✓ DONE | 30 min | P1 |
| [W1-3] archive 评估 (0 任务, 标 DONE) | ✓ DONE | 30 min | P1 |
| [W1-4] cross-domain-intent umbrella skill | ⏳ TODO | 1-2 hr | P2 |
| [W1-5] pre-commit 部署到 5+ 项目 | ⏳ TODO | 30 min | P0 |
| **W2-1** 加 2 个新 cross-domain skill | ⏳ TODO | 2-3 hr | P1 |
| **W2-2** PageRank Q6 + Q7 (新 query) | ⏳ TODO | 30 min | P1 |
| **W2-3** audit 加 "cross-domain 域 ≥2 节点" 检查 | ⏳ TODO | 30 min | P1 |

**完成度**: 3/8 (37.5%) — 2 W2 任务待。

---

## [W2-1] 加 2 个新 cross-domain skill (2-3 hr, P1)

**目标**: cross-domain-intent 域从 33 节点扩到 35+ 节点 (加 2 个真 cross-domain skill, 1 个 umbrella 1 个新创).

**候选方向** (Patrick 选 2 个):

### A. `ctx-compress` (上下文压缩器)

**What**: 通用上下文压缩器, 跟 context-summarizer 互补, 但更"格式化" 输出.

**特点**:
- 接受任意对话/文档/工具结果
- 输出结构化压缩 (key facts + 决策 + 行动项)
- 不只压缩, 还**重写**让 LLM 易回读
- 跟 context-anxiety-reminder 配套 (焦虑检测 + ctx-compress 处理)

**Gene**: cross-domain-intent (元方法)
**Depends_on**: context-summarizer / context-anxiety-reminder / align

**实现步骤**:
```bash
mkdir -p ~/.hermes/skills/cross-domain-intent/ctx-compress
# 写 SKILL.md (~3KB):
#   - When to use (vs context-summarizer)
#   - 3-step compression pipeline
#   - 1 reference example
# 加 GCP frontmatter
```

### B. `scope-check` (任务范围检查)

**What**: 任务粒度检查 — 当前任务是大是小? 是不是要拆分? 是不是超出 SKILL 库能力?

**特点**:
- 接受 1 个任务描述
- 输出: 大小评级 (XS/S/M/L/XL) + 是否建议拆分 + 是否缺相关 skill
- 跟 good-task-definition 配套
- 跟 task-decomposition 互补

**Gene**: cross-domain-intent
**Depends_on**: good-task-definition / task-decomposition / align

**实现步骤**: 同上

### C. `intent-clarify` (意图澄清)

**What**: 在 LLM 执行任务前, 主动找歧义点问用户.

**特点**:
- 接受 1 个模糊请求
- 输出: 3-5 个歧义维度 + 每个的"如果我猜会怎样" 选项
- 跟 burst/devil (多方案) 互补
- 跟 align (跨域) 配套

**Gene**: cross-domain-intent
**Depends_on**: align / burst / devil

**Patrick 选**: **A + C** (ctx-compress + intent-clarify, 都是 cross-domain 元方法)
   或: **B + C** (scope-check + intent-clarify, 都是决策辅助)
   或: 全 3 个 (W2 一次扩 3 节点)

**验收**:
- 2 (或 3) 个新 skill 落地
- cross-domain-intent 域 33 → 35+ 节点
- GCP audit PASS 率 95.3% → 96%+
- PageRank Q6 (新 query "意图澄清" / "上下文压缩") top-3 包含新 skill

**估计**:
- 30 min / skill × 3 = 90 min
- 10 min 跑 audit 验证
- 10 min PageRank 期望重定 (W2-2 任务)

**关联**: skill `agentic-os/gcp-skill-registry-bootstrap` 协议 (新 skill 必须用此协议), PageRank 漂移历史.

---

## [W2-2] PageRank Q6 + Q7 (新 query, 30 min, P1)

**目标**: 加 2 个新 PageRank query 验证 W2-1 新 skill + 域节点足够.

**新 query 设计**:

### Q6: 意图澄清
```python
("意图澄清", [
    "intent-clarify",  # W2-1 新加
    "align",
    "burst",
]),
```

**判定**: 合理性 — intent-clarify 属 cross-domain-intent, 跟 align/burst 强连接, top-3 合理.

### Q7: 上下文压缩
```python
("上下文压缩", [
    "ctx-compress",     # W2-1 新加
    "context-summarizer",
    "context-anxiety-reminder",
]),
```

**判定**: 合理性 — ctx-compress 跟 context-summarizer 是姊妹 skill (都做压缩), 跟 context-anxiety-reminder 是配套, top-3 合理.

**实现步骤**:
```bash
# 编辑 gcp_self_heal.py 第 45 行 PAGERANK_QUERIES, 加 2 行
# 跑 verify
python3 gcp_self_heal.py --phase pagerank
# 期望: 5/5 + 2/2 = 7 query 全 OK
# (PageRank 漂移必然, Q1-Q5 可能再变, 必重定)
```

**验收**: 7 query Recall@3 ≥ 80% (新 query 可能首次不 100%, 慢慢调).

**估计**:
- 10 分钟设计 + 写
- 10 分钟跑 + 调
- 10 分钟 verify 其他 5 query 没回归

**关联**: vault `system/gcp/2026-06-12-w1-task-cards.md` 第 W1-1 段, PageRank 漂移历史 (5 次).

---

## [W2-3] audit 加 "cross-domain 域 ≥2 节点" 检查 (30 min, P1)

**目标**: audit 不只数 6-Gene 分布, 还报警单节点域 (P1 永不复发).

**为什么**: W1-3 archive 评估发现 W1-3 阶段**单节点 gene 域**是慢性 false positive (agentic-os umbrella 自指 + code-review 1 个 + 干空 域). 审计应自动检测.

**实现步骤**:
```python
# 编辑 audit_gene_fields.py
# 在 main() 输出后, 加 1 段:
single_node_genes = {g: c for g, c in gene_dist.items() if c == 1}
if single_node_genes:
    print(f"⚠️  P1: {len(single_node_genes)} single-node gene domains")
    for g, c in single_node_genes.items():
        print(f"     {g} ({c} skill)")
```

**期望触发场景** (W2 之后):
- `agentic-os`: 89 节点 (umbrella 误判, 已知)
- 任何新 ≤ 1 节点 域

**验收**:
- 跑 audit, 看到 P1 报警 + 列出 single-node 域
- 写进 gcp_self_heal.py 的 patch 候选报告
- 写进 roadmap W3 任务 (解决 false positive)

**估计**:
- 10 分钟 patch audit
- 5 分钟跑 verify
- 15 分钟写新 P1 段到 self_heal 报告

**关联**: skill `agentic-os/gene-capsule-protocol` 协议 (P1 patch 候选定义), gcp_self_heal.py P0/P1 输出.

---

## W2 时间预估

| Task | 时间 | 累计 |
|---|---|---|
| W2-1 (2 新 skill) | 2-3 hr | 2-3 hr |
| W2-2 (Q6+Q7) | 30 min | 3-3.5 hr |
| W2-3 (audit P1 检查) | 30 min | 3.5-4 hr |

**W2 收尾目标**:
- cross-domain-intent 域 33 → 35+ 节点
- PageRank 7 query Recall ≥ 80% (新 query 慢慢调)
- audit 报 P1 自动化 (含 1 节点域检测)
- 总覆盖率 95.3% → 96%+

**W1+W2 合计 (2 周)**:
- W1 5 任务 (3 done + 2 pending): 2.5 hr
- W2 3 任务: 3.5-4 hr
- 总: **6-7 hr / 2 周** (每天 1 hr 即可推进)

---

## W2 → W3 衔接

W2 完成后 W3 启动:
- W3-1: pre-commit 5+ 项目部署 (W1-5 推迟) — **1 hr**
- W3-2: gcp_self_heal --watch 真 cron 化 (安装) — **30 min**
- W3-3: GCP-1.4.0 W3 收尾 task cards — **30 min**

W3 收尾 → GCP-1.4.0 done → GCP-2.0 蓝图.

## 1 句话

> GCP-1.4.0 W2 = 加 2 个 cross-domain skill (扩 6+ 节点) + 2 个新 PageRank query
> + audit 加 P1 单节点域检查, 3-4 hr 收尾, 95.3% → 96%+, 域节点
> 5 → 6 (cross-domain-intent 升级), 协议韧性 +1.
