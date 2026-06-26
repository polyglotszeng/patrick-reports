# GCP Self-Heal Report - 2026-06-12

## Audit
- Total skills: 249
- With gene field (PASS): 37 (14.9%)
- Missing capsule (有 gene 但无 capsule): 205
- No frontmatter: 5
- 1-node Gene (skip cross-domain-intent): 0

Gene distribution (PASS):
  - `agentic-os`: 15
  - `emai-workflow`: 6
  - `ios-development`: 5
  - `knowledge-synthesis`: 5
  - `cross-domain-intent`: 4
  - `project-coordination`: 2

No-frontmatter skills:
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/knowledge-base/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/google-workspace/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/obsidian-tasks/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/asana/SKILL.md
  - /Users/patrick/.hermes/skills/context-summarizer/SKILL.md

Missing capsule (前 20 个, 共 205):
  - /Users/patrick/.hermes/skills/apple/icloud-dataless-document-ingestion/SKILL.md
  - /Users/patrick/.hermes/skills/apple/apple-reminders/SKILL.md
  - /Users/patrick/.hermes/skills/apple/findmy/SKILL.md
  - /Users/patrick/.hermes/skills/apple/apple-notes/SKILL.md
  - /Users/patrick/.hermes/skills/research/blogwatcher/SKILL.md
  - /Users/patrick/.hermes/skills/research/distributed-research-playbook/SKILL.md
  - /Users/patrick/.hermes/skills/research/polymarket/SKILL.md
  - /Users/patrick/.hermes/skills/research/dimension-math/SKILL.md
  - /Users/patrick/.hermes/skills/research/web-research-cn/SKILL.md
  - /Users/patrick/.hermes/skills/research/research-paper-writing/SKILL.md
  - /Users/patrick/.hermes/skills/research/dimension-physics/SKILL.md
  - /Users/patrick/.hermes/skills/gaming/minecraft-modpack-server/SKILL.md
  - /Users/patrick/.hermes/skills/gaming/pokemon-player/SKILL.md
  - /Users/patrick/.hermes/skills/social-media/xurl/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/model-optimization/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/format-conversion/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/slicing-preview/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/model-validation/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/texture-handling/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/error-recovery/SKILL.md

## PageRank 5 Query Recall
| Q | Top-3 实际 | 期望 | Hits | Recall@3 | Exact? |
|---|---|---|---|---|---|
| GCP 协议 | align, gene-capsule-protocol, burst | align, gene-capsule-protocol, registry | align, gene-capsule-protocol | 67% | N |
| 本地 LLM | local-llm-benchmark, guidance, llm-wiki | local-llm-benchmark, llm-wiki, agent-observability | local-llm-benchmark, llm-wiki | 67% | N |
| NotebookLM 集成 | notebooklm, local-llm-benchmark, llm-wiki | notebooklm, llm-wiki, arxiv | notebooklm, llm-wiki | 67% | N |
| 跨 subagent 验证 | parallel-subagent-content-extract, evaluation, audit | agent-orchestration, parallel-subagent-content-extract, audit | parallel-subagent-content-extract, audit | 67% | N |
| emai 工作流 | emai-vault, emai-new, emai-today | emai-today, emai-closeday, life-wiki | emai-today | 33% | N |

平均 Recall@3: 60%  |  完全匹配 query 数: 0/5

## 建议修复
### [P0] 暂无 (所有 umbrella/registry 已有完整 frontmatter)

### [P1] 1 节点 Gene 域
- `agentic-os` (raw: `agentic-os                # GCP-1.1.0: 协议源本身隶属 agentic-os`)
  - issue: single-node domain (>=2 recommended for PageRank diversity)
  - action: merge into nearby domain or expand with 1-2 sibling skills

## 1 句话
覆盖率 14.9% (缺口 85.1%) + 平均 Recall@3 60%; 下次 self-heal 目标: 补 5 个 no-frontmatter + 205 个 missing capsule, 把覆盖率推到 50%+, recall 推到 80%+。