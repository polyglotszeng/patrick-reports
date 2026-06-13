REGISTRY EXPANSION REPORT
Protocol: GCP-1.0 (Gene+Capsule v1.0)
Date: 2026-06-11
Operator: subagent (registry-expansion)
Registry version: 1.0.0 → 1.0.1

=========================================
SUMMARY
=========================================

- Capsule promotions: 8 (4 newly listed in Gene blocks, 4 already listed but missing frontmatter)
- New coverage: 21% → 22.7% (54/238, +1.7pp)
- Skills touched: 8 SKILL.md files + 1 registry file
- Gene distribution after: agentic-os 16 (+2), emai-workflow 8 (unchanged), knowledge-synthesis 8 (+2)

=========================================
SELECTED CAPSULES (8)
=========================================

Mix of Underused Top 5 (Gold-Mine scan) and 4 research direction recommendations.
Selection criteria: ① mature body (well-developed sections, operational patterns)
② clean fit into 6 Gene (no forced Unclassified assignment).

1. autonomous-ai-agents/memory-three-layer → gene:agentic-os
   - Status: NOT in registry, NO frontmatter
   - Source: Underused #1 (score 49, maturity 1)
   - Use: Garry Tan Gbrain — Working/Episodic/Procedural memory split
   - deps: hermes-knowledge-capture, hermes-ontology, calibrate

2. note-taking/emai-new → gene:emai-workflow
   - Status: in registry, NO frontmatter
   - Source: Underused #2 (score 49, maturity 1.5)
   - Use: /new — brain-dump routing to EMAI vault
   - deps: emai-vault, emai-today, obsidian

3. note-taking/emai-vault → gene:emai-workflow
   - Status: in registry, NO frontmatter
   - Source: Underused #5 (score 48, maturity 2.5)
   - Use: vault structure + workflow command map
   - deps: obsidian, life-wiki, emai-today, emai-closeday

4. autonomous-ai-agents/agent-observability → gene:agentic-os
   - Status: in registry, NO frontmatter
   - Source: Research dir 1 — AI Agent 经济 (Hidden Gem, 45)
   - Use: watchdog + Agent Mail alerting — the ops reliability story
   - deps: orgo-infra, hermes-agent, claude-code

5. autonomous-ai-agents/orgo-infra → gene:agentic-os
   - Status: in registry, NO frontmatter
   - Source: Research dir 1 — AI Agent 经济 (Hidden Gem, 45)
   - Use: Orgo cloud computer hosting for AI agents
   - deps: agent-observability, hermes-agent, solo-agent-business

6. autonomous-ai-agents/hermes-agent → gene:agentic-os
   - Status: NOT in registry, HAD frontmatter
   - Source: Underused #10 (score 48, maturity 2.5)
   - Use: configure/extend/contribute to Hermes Agent
   - deps: hermes-learnings, calibrate, agent-observability, orgo-infra

7. research/world-model-tracker → gene:knowledge-synthesis
   - Status: NOT in registry, NO frontmatter
   - Source: Research dir 2 — 世界模型 (Gold Mine #18, score 55)
   - Use: 10-faction daily arXiv tracker — already cron-driven
   - deps: arxiv, llm-wiki, notebooklm

8. mlops/local-llm-benchmark → gene:knowledge-synthesis
   - Status: NOT in registry, NO frontmatter
   - Source: Research dir 4 — 量化+AI (Gold-tier capsule)
   - Use: 4-task benchmark framework (PDF/code/translate/agent)
   - deps: mlops/models, mlops/inference, arxiv

=========================================
SKIPPED (with reason)
=========================================

- research/dimension-physics — string theory/M-theory skill; theoretical
  physics content doesn't cleanly fit any of 6 Gene (knowledge-synthesis
  is about active research synthesis, not pure theoretical physics).
  Not promoted to avoid data pollution.

- autonomous-ai-agents/solo-agent-business — already in registry + had
  frontmatter. No action needed.

- productivity/hermes-learnings — already in registry + had frontmatter.
  No action needed.

- research/arxiv — already in registry + had frontmatter.
  No action needed.

=========================================
WHY THESE 8 ARE WORTH PROMOTING
=========================================

These 8 are the structural backbone of Patrick's 4 research directions
(2026-06-09 launch) and the daily EMAI workflow — yet 4 of them were
in the registry without frontmatter, and 4 weren't in the registry at
all. The Gold Mine scan flagged this as a 63% "Underused" problem, but
the deeper issue is that the Gene architecture had a coverage gap: the
agentic-os Gene was missing the delegation contract (hermes-agent) and
the memory architecture (memory-three-layer); the knowledge-synthesis
Gene was missing the cron-driven world-model tracker. By promoting
these 8 — with proper depends_on chains — we close the gap and turn
"documentation waiting to be activated" into properly-typed capsules
that the resolver and audit tools can find via cross-Gene queries.

The new depends_on graph also exposes 2 new cross-Gene edges that
didn't exist before: agent-observability ↔ orgo-infra (AI Agent
经济 stack) and world-model-tracker ↔ arxiv (世界模型 research
loop), which should lift these skills' reference counts and push
some of them from Underused into Hidden Gem in the next scan.

=========================================
NUMBERS RECONCILIATION
=========================================

Task brief mentioned 14.2% baseline coverage. Registry source of
truth shows 21% (50/238). Report uses 21% → 22.7% (registry value).
Possible 14.2% came from a stricter definition of "core capsules"
(only Gold Mine + key Hidden Gem); this expansion follows the
registry's inclusive definition (any skill listed in a Gene block).

=========================================
FILES MODIFIED
=========================================

1. /Users/patrick/.hermes/skills/skills/gene-registry.md (v1.0.0 → v1.0.1)
2. /Users/patrick/.hermes/skills/autonomous-ai-agents/memory-three-layer/SKILL.md
3. /Users/patrick/.hermes/skills/note-taking/emai-new/SKILL.md
4. /Users/patrick/.hermes/skills/note-taking/emai-vault/SKILL.md
5. /Users/patrick/.hermes/skills/autonomous-ai-agents/agent-observability/SKILL.md
6. /Users/patrick/.hermes/skills/autonomous-ai-agents/orgo-infra/SKILL.md
7. /Users/patrick/.hermes/skills/autonomous-ai-agents/hermes-agent/SKILL.md (frontmatter normalized: "gene:agentic-os" → "gene: agentic-os")
8. /Users/patrick/.hermes/skills/research/world-model-tracker/SKILL.md
9. /Users/patrick/.hermes/skills/mlops/local-llm-benchmark/SKILL.md

Untouched (per task constraints): agentic-os/gene-capsule-protocol,
genes/README.md, .archive/, memory, other unrelated skills.

=========================================
END OF REPORT
=========================================
