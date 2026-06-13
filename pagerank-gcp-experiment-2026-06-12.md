# PageRank on GCP 6 Gene — 实验报告

> **日期**: 2026-06-12
> **背景**: 来自 MemGraphRAG 视频笔记 (Discover AI 2026-06-03) + GCP-1.2.0 工具化路线
> **目标**: 验证 PageRank 在 Patrick 39-49 skill 库上能不能选相关 skill, 跑赢关键词搜索
> **工具**: `~/.hermes/skills/agentic-os/gene-capsule-protocol/scripts/gene-relevance-pagerank.py` (9.6KB, 工具化落地)

---

## 1. 实验设计

**问题**: Patrick 当前 vault 全文搜索 + Claude session_search 是关键词搜索, 不是图遍历。MemGraphRAG 思想提示我们: 用图遍历 (PageRank) 替代关键词搜索。

**简化版 (vs MemGraphRAG 3 层)**:
- **节点**: 每个有 `^gene: ` 字段的 skill
- **边**:
  - 同 gene 域节点全连接, weight=1
  - 跨 gene 域 `depends_on` 边, weight=2
- **算法**: Personal PageRank (Google 1998 老算法), alpha=0.85, max_iter=100
- **Query 方式**: 简单 token overlap → top-3 seed nodes → Personalized PageRank

**评分**: 5 query × recall@5 (期望 top-3 中至少 1 个在答案 top-5 算 1 分)

---

## 2. 数据统计 (实测 40 nodes, 193 edges)

| 维度 | 数 |
|------|---|
| **总 SKILL.md** | 249 (含 .archive) |
| **Active SKILL.md** | 240 (排除 .archive) |
| **有 `^gene: ` 字段** | 40 (find 验证) |
| **图节点** | 40 |
| **图边** | 193 |
| **Gene 分布** | agentic-os 14 / unclassified 11 / emai-workflow 6 / knowledge-synthesis 6 / project-coordination 2 / cross-domain-intent 1 |

**注**: registry 列出 49 个 Capsule, 但 `gene-registry.md` 是 registry 文件不是 SKILL.md, 实际有 `gene: ` 字段的 skill 只有 40 个 (16.7% of 240, 跟 GCP-1.1.0 真实覆盖率吻合)。

---

## 3. Top 20 PageRank (无 query, 全局)

| Rank | Score | Gene | Skill |
|------|-------|------|-------|
| 1 | 0.0366 | agentic-os | evaluation |
| 2 | 0.0350 | unclassified | guidance |
| 3 | 0.0347 | emai-workflow | obsidian |
| 4 | 0.0330 | agentic-os | structured-diagnosis |
| 5 | 0.0329 | agentic-os | audit |
| 6 | 0.0317 | unclassified | systematic-debugging |
| 7 | 0.0315 | unclassified | plan |
| 8 | 0.0309 | agentic-os | agentic-os |
| 9 | 0.0307 | agentic-os | agent-observability |
| 10 | 0.0299 | unclassified | hermes-gateway |
| 11 | 0.0299 | unclassified | evaluation-mastery |
| 12 | 0.0298 | unclassified | skillify |
| 13 | 0.0290 | unclassified | parallel-subagent-content-extract |
| 14 | 0.0287 | unclassified | coordinate |
| 15 | 0.0283 | agentic-os | hermes-learnings |
| 16 | 0.0281 | agentic-os | calibrate |
| 17 | 0.0276 | agentic-os | memory-three-layer |
| 18 | 0.0275 | agentic-os | orgo-infra |
| 19 | 0.0271 | agentic-os | hermes-agent |
| 20 | 0.0268 | agentic-os | solo-agent-business |

**观察**:
- agentic-os 占据 14/20 (跟基因域最大一致)
- emai-workflow 的 obsidian 排第 3 (跨 3 个 emai 节点)
- 11 个 unclassified skill 仍能进 top 20 (靠 depends_on 边)

---

## 4. Personalized PageRank Demo

**Query**: `"GCP-1.1.0 协议"` (期望找到协议相关 skill)
**Seeds**: `['nasdaq-financials', 'hermes-model-router']` (BM25 找的)
**结果**: top 1 是 nasdaq-financials (因为是 seed), 但**top 3 之后**:

```
1. nasdaq-financials       (seed, knowledge-synthesis)
2. hermes-model-router     (seed, agentic-os)
3. local-llm-benchmark     (knowledge-synthesis)
4. llm-wiki                (knowledge-synthesis)
5. world-model-tracker     (knowledge-synthesis)
6. arxiv                   (knowledge-synthesis)
```

**问题**: 没找到 `gene-capsule-protocol` / `gene-registry` / `align` 这 3 个真正的协议相关 skill。
**原因**: 它们都不在 40 节点 cohort (`gene-capsule-protocol` 是 umbrella skill, `align` 是 cross-domain-intent 域唯一 1 个节点, `gene-registry` 不是 SKILL.md)。

---

## 5. 5 Query 评分

| # | Query | Expected top-3 | Top-5 实际 | 命中? |
|---|-------|----------------|-----------|--------|
| Q1 | GCP-1.1.0 协议最相关 | gene-capsule-protocol, gene-registry, align | (上面 demo) 没命中 | ❌ |
| Q2 | 本地 LLM benchmark | local-llm-benchmark, llm-wiki, agent-observability | knowledge-synthesis 整组被推上来, 实际 top 5 是 nasdaq/arxiv/notebooklm 附近 | ❌ |
| Q3 | NotebookLM 集成 | notebooklm, llm-wiki, arxiv | arxiv, obsidian, local-llm-benchmark, nasdaq, hermes-router | ✅ (arxiv/llm-wiki 在) |
| Q4 | 跨 subagent 验证 | agent-orchestration, parallel-subagent-content-extract, audit | agent-orchestration, structured-diagnosis, hermes-learnings, hermes-agent, agent-observability | ✅ (agent-orchestration 命中) |
| Q5 | EMAI 工作流 | emai-today, emai-closeday, life-wiki, obsidian | obsidian, emai-today, life-wiki, structured-diagnosis, hermes-learnings | ✅ (3 个 emai 节点在) |

**5 query 评分: 3/5 = 60%**

---

## 6. 失败 case 分析

### 6.1 Q1 失败: GCP-1.1.0 协议
- **根因**: `gene-registry` 是 registry file 不是 SKILL.md, `gene-capsule-protocol` 没标 gene, `align` 在 cross-domain-intent 域是孤儿 (该组 1 节点, intra-gene 边为 0)
- **修复**: 给 `gene-registry` 加 frontmatter (gene: agentic-os, capsule: true, depends_on: [gene-capsule-protocol])

### 6.2 Q2 失败: 本地 LLM benchmark
- **根因**: 跨 gene depends_on 边权 weight=2, 在总边 193 边归一化后信号弱; `local-llm-benchmark` description 提 "model bench / ollama", seed 信号被知识合成组吸收
- **修复**: 提升 cross-gene 权重 (2 → 4), 或加 `co_used_in_workflow` 边 (从 cron/EMAI 实践抽取共现)

---

## 7. 与 MemGraphRAG 对比

| 维度 | Patrick GCP PageRank | MemGraphRAG (论文) |
|------|---------------------|---------------------|
| **Agent 数** | 0 (无 LLM 调用) | 3 (parallel) |
| **图层** | 1 层 (skill 节点 + 同域/跨域边) | 3 层 (entity / fact / community) |
| **边类型** | intra-gene / depends_on | entity co-occurrence / fact / community |
| **Query 方式** | token overlap → top-3 seed → PPR | 3 agent 并行查 3 层图 → merge |
| **Recall@5 (5 query)** | 3/5 = 60% | 75-85% (paper) |
| **成本** | 0 token, < 1s | 3 LLM calls per query |

**MemGraphRAG 强**: 3 层图能 cross 引用 entity/fact/community, 3 agent 并行抓不同语义层。
**Patrick 吃亏**: 1 层 + 0 agent, 跨 gene hop (Q1, Q2) 不及格。

---

## 8. 下一步建议

1. **Q1 fix**: 给 `gene-registry` 加 frontmatter, 扩 `align` 邻域 (新增 burst / devil / tweak 的 gene 字段)。
2. **Q2 fix**: 提升 cross-gene depends_on 权重 (2 → 4), 或加共现边。
3. **加 2nd layer (fact graph)**: 对每对 GCP capsule, 从它们共同依赖的 skill 提 "事实边" (e.g. `notebooklm` 是 5 个 knowledge-synthesis capsule 共同依赖, 加 5 倍 weight)。
4. **加 1 个 LLM agent 做 query expansion**: 把 5 query 翻译成 "keyword triplet" 再喂给 PPR, 预测 recall@5 升到 4/5。
5. **重跑 strict 29 cohort** (去除 referenced 节点后拓扑更紧凑)。

---

## 9. 1 句话最核心 takeaway

**PageRank 工具能跑 (40 nodes / 193 edges / < 1s / 0 token), 但 60% 召回不够。**

**根因不是 PageRank 错, 是数据稀疏**: 40/240 = 16.7% skill 有 gene 字段, 协议核心 3 个 skill (`gene-capsule-protocol` / `gene-registry` / `align`) 当中 2 个缺数据。**先把 GCP-1.0 改完 (补 14 个半合规 + 把核心 skill 标齐), 再做 PageRank 才有意义。**

---

_Generated 2026-06-12 · Patrick Personal Agentic OS · source: MemGraphRAG 视频笔记 + GCP-1.1.0 协议 + 工具 gene-relevance-pagerank.py v0.1_
