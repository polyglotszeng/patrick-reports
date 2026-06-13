# GCP Self-Heal Report - 2026-06-12

## Audit
- Total skills: 255
- With gene field (PASS): 243 (95.3%)
- Missing capsule (有 gene 但无 capsule): 8
- No frontmatter: 4
- 1-node Gene (skip cross-domain-intent): 0

Gene distribution (PASS):
  - `agentic-os`: 93
  - `knowledge-synthesis`: 86
  - `cross-domain-intent`: 33
  - `ios-development`: 15
  - `emai-workflow`: 11
  - `project-coordination`: 5

No-frontmatter skills:
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/knowledge-base/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/google-workspace/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/obsidian-tasks/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/asana/SKILL.md

Missing capsule (前 20 个, 共 8):
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/model-optimization/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/format-conversion/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/slicing-preview/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/model-validation/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/texture-handling/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/error-recovery/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/dimension-analysis/SKILL.md
  - /Users/patrick/.hermes/skills/.archive/openclaw-imports-2026-06-11/batch-processing/SKILL.md

## PageRank 5 Query Recall
| Q | Top-3 实际 | 期望 | Hits | Recall@3 | Exact? |
|---|---|---|---|---|---|
| GCP 协议 | gcp-skill-registry-bootstrap, gene-capsule-protocol, align | gcp-skill-registry-bootstrap, gene-capsule-protocol, align | gcp-skill-registry-bootstrap, gene-capsule-protocol, align | 100% | Y |
| 本地 LLM | local-llm-benchmark, serving-llms-vllm, local-llm-deployment-bench | local-llm-benchmark, local-llm-deployment-bench, serving-llms-vllm | local-llm-benchmark, local-llm-deployment-bench, serving-llms-vllm | 100% | N |
| NotebookLM 集成 | notebooklm, video-to-obsidian, llm-wiki | notebooklm, video-to-obsidian, llm-wiki | notebooklm, video-to-obsidian, llm-wiki | 100% | Y |
| 跨 subagent 验证 | subagent-driven-development, parallel-subagent-content-extract, calibrate | subagent-driven-development, parallel-subagent-content-extract, calibrate | subagent-driven-development, parallel-subagent-content-extract, calibrate | 100% | Y |
| emai 工作流 | emai-vault, emai-new, emai-today | emai-vault, emai-new, emai-today | emai-vault, emai-new, emai-today | 100% | Y |

平均 Recall@3: 100%  |  完全匹配 query 数: 4/5

## 建议修复
### [P0] 暂无 (所有 umbrella/registry 已有完整 frontmatter)

### [P1] 1 节点 Gene 域
- `agentic-os` (raw: `agentic-os                # GCP-1.1.0: 协议源本身隶属 agentic-os`)
  - issue: single-node domain (>=2 recommended for PageRank diversity)
  - action: merge into nearby domain or expand with 1-2 sibling skills

## 1 句话
覆盖率 95.3% (缺口 4.7%) + 平均 Recall@3 100%; 下次 self-heal 目标: 补 4 个 no-frontmatter + 8 个 missing capsule, 把覆盖率推到 50%+, recall 推到 80%+。
## Phase D: Auto-Apply Summary

- Mode: DRY-RUN
- Applied: 0
- Skipped: 0
- Errors: 0