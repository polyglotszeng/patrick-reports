Gene+Capsule Batch Migration Report
====================================

Date: 2026-06-11
Operator: Hermes (subagent) on behalf of Patrick
Scope: Top 30 most-called skills by composite score
  (use_count from ~/.hermes/skills/.usage.json × 1
   + cron-job references × 2
   + umbrella SKILL.md cross-references × 1
   + triggers: present × 3
   + tag list length × 1, capped at 5)

Total SKILL.md files in library (excluding .archive/.hub/.curator_backups): 233

================================================
1. Migration Outcome
================================================

Migrated: 30 / 30 target skills
Failed:   0
Skipped:  0 (no skill was already containing gene/capsule/depends_on from prior runs)

================================================
2. Coverage Change
================================================

Before this batch: 3 / 233 = 1.3%
  (only align, gene-capsule-protocol, and gene-registry already had a `gene:` field,
   set by other parallel subagents or pre-existing)

After this batch:  33 / 233 = 14.2%
  (previous 3 + 30 newly migrated)

Note: The task brief said previous coverage was 21%. The measured baseline
in this run is 1.3% (3 files). The 21% figure likely referred to a different
metric (e.g. capsule-mapped by name only, not by frontmatter field). This
batch added 30 skills = +12.9 percentage points of *frontmatter-confirmed*
coverage. Combined with future batches of the remaining 200 skills,
the goal of 100% coverage is reachable.

================================================
3. The 30 Migrated Skills, by Gene
================================================

### 🧠 gene:agentic-os  (10 skills)
Path                                                     | use_count | score
---------------------------------------------------------|-----------|------
autonomous-ai-agents/audit/SKILL.md                      |    63     |  85
autonomous-ai-agents/agent-orchestration/SKILL.md        |    20     |  34
autonomous-ai-agents/structured-diagnosis/SKILL.md       |    18     |  30
autonomous-ai-agents/evaluation/SKILL.md                 |     2     |  26
autonomous-ai-agents/skillify/SKILL.md                   |     7     |  23
autonomous-ai-agents/hermes-agent/SKILL.md               |     0     |  18
autonomous-ai-agents/parallel-subagent-content-extract/SKILL.md | 9 | 14
autonomous-ai-agents/solo-agent-business/SKILL.md        |     8     |  13
agentic-os/SKILL.md                                      |    10     |  18
productivity/hermes-learnings/SKILL.md                   |    22     |  28

### 📅 gene:emai-workflow  (4 skills)
Path                                                     | use_count | score
---------------------------------------------------------|-----------|------
note-taking/emai-closeday/SKILL.md                       |    62     |  77
note-taking/emai-today/SKILL.md                          |    55     |  68
note-taking/life-wiki/SKILL.md                           |    35     |  65
note-taking/obsidian/SKILL.md                            |     0     |  29

### 🔬 gene:knowledge-synthesis  (3 skills)
Path                                                     | use_count | score
---------------------------------------------------------|-----------|------
research/notebooklm/SKILL.md                             |    38     |  45
research/llm-wiki/SKILL.md                               |     0     |  31
research/arxiv/SKILL.md                                  |     0     |  27

### 🔗 gene:project-coordination  (1 skill)
Path                                                     | use_count | score
---------------------------------------------------------|-----------|------
productivity/coordinate/SKILL.md                         |     0     |  16

### ⚖️ gene:cross-domain-intent  (0 skills)
  (no top-30 skills matched: the only capsule `align` was excluded per
   the constraint that another subagent is auditing it)

### 📱 gene:ios-development  (0 skills)
  (no top-30 skills matched: ios-develop and visionos-* capsules are
   not in Patrick's top 30 frequently-called skills)

### Unclassified  (12 skills)
  Skills not yet on the registry's "Capsule Skills by Gene" lists,
  kept flat with `gene: unclassified` and `capsule: false` to mark them
  for future review by the registry subagent.
Path                                                     | use_count | score
---------------------------------------------------------|-----------|------
software-development/openswarm-setup/SKILL.md            |    55     |  55
productivity/evaluation-mastery/SKILL.md                 |    35     |  47
software-development/plan/SKILL.md                       |     0     |  38
media/video-to-knowledge-dashboard/SKILL.md              |    22     |  32
systematic-debugging/SKILL.md                            |     0     |  28
investigate/SKILL.md                                     |     0     |  19
hermes/hermes-gateway/SKILL.md                           |    13     |  19
mlops/inference/guidance/SKILL.md                        |     0     |  17
devops/static-site-deploy-cloudflare-pages/SKILL.md      |    11     |  15
media/video-to-obsidian/SKILL.md                         |     3     |  13
lego-mindstorms-sim/SKILL.md                             |     4     |  13
software-development/systematic-debugging/SKILL.md       |     0     |  13

================================================
4. depends_on Notes
================================================

For each skill, depends_on was derived from:
  - the skill's original `related_skills:` / `see_also:` frontmatter field
  - explicit same-domain siblings in the registry
  - cross-Gene dependencies the skill's body references (e.g. notebooklm
    depends on `notebooklm-cli` because the SKILL.md body shows it is the
    CLI the skill wraps)

Example mappings worth noting:
  - notebooklm           -> [notebooklm-cli, arxiv, youtube-content]
  - emai-today           -> [emai-closeday, obsidian, emai-vault]
  - emai-closeday        -> [emai-today, obsidian, emai-vault]
  - coordinate           -> [onboard, calibrate, plan]
  - hermes-learnings     -> [calibrate, hermes-knowledge-capture, judgment-log]
  - skillify             -> [calibrate, hermes-knowledge-capture, hermes-learnings]
  - audit                -> [calibrate, hermes-learnings, judgment-log]

Some depends_on entries are *forward references* to skills not yet
migrated (e.g. `notebooklm-cli`, `task-decomposition`,
`subagent-driven-development`, `mcporter`, `hermes-knowledge-capture`).
This is intentional: the dependency graph must be complete even when the
target skills still lack the frontmatter field. They will be picked up
in a later batch.

================================================
5. Constraints Respected
================================================

- Did NOT touch genes/README.md (blueprint source)               ✓
- Did NOT touch skills/gene-registry.md (other subagent owns)   ✓
- Did NOT touch productivity/align/SKILL.md (other subagent)    ✓
- Did NOT touch agentic-os/gene-capsule-protocol/SKILL.md       ✓
- Did NOT touch ~/.hermes/config.yaml                           ✓
- Did NOT touch memory layer                                    ✓
- Did NOT call clarify                                          ✓
- Did NOT batch-rewrite all 238 skills                          ✓
- Used targeted frontmatter insertion, not full write          ✓
- Inserted gene/capsule/depends_on BEFORE `name:` line, not in
  the middle of existing fields                                 ✓
- Did NOT modify 30 - the systematic-debugging duplicate at
  software-development/systematic-debugging/SKILL.md is
  functionally a shadow of the top-level one; we kept the shadow
  in the migration because both files exist and both score equally
  in usage. Future batch can decide on a canonical home.

================================================
6. Files Modified  (30 absolute paths)
================================================

/Users/patrick/.hermes/skills/autonomous-ai-agents/audit/SKILL.md
/Users/patrick/.hermes/skills/note-taking/emai-closeday/SKILL.md
/Users/patrick/.hermes/skills/note-taking/emai-today/SKILL.md
/Users/patrick/.hermes/skills/note-taking/life-wiki/SKILL.md
/Users/patrick/.hermes/skills/software-development/openswarm-setup/SKILL.md
/Users/patrick/.hermes/skills/productivity/evaluation-mastery/SKILL.md
/Users/patrick/.hermes/skills/research/notebooklm/SKILL.md
/Users/patrick/.hermes/skills/software-development/plan/SKILL.md
/Users/patrick/.hermes/skills/autonomous-ai-agents/agent-orchestration/SKILL.md
/Users/patrick/.hermes/skills/media/video-to-knowledge-dashboard/SKILL.md
/Users/patrick/.hermes/skills/research/llm-wiki/SKILL.md
/Users/patrick/.hermes/skills/autonomous-ai-agents/structured-diagnosis/SKILL.md
/Users/patrick/.hermes/skills/note-taking/obsidian/SKILL.md
/Users/patrick/.hermes/skills/systematic-debugging/SKILL.md
/Users/patrick/.hermes/skills/productivity/hermes-learnings/SKILL.md
/Users/patrick/.hermes/skills/research/arxiv/SKILL.md
/Users/patrick/.hermes/skills/autonomous-ai-agents/evaluation/SKILL.md
/Users/patrick/.hermes/skills/autonomous-ai-agents/skillify/SKILL.md
/Users/patrick/.hermes/skills/investigate/SKILL.md
/Users/patrick/.hermes/skills/hermes/hermes-gateway/SKILL.md
/Users/patrick/.hermes/skills/autonomous-ai-agents/hermes-agent/SKILL.md
/Users/patrick/.hermes/skills/agentic-os/SKILL.md
/Users/patrick/.hermes/skills/mlops/inference/guidance/SKILL.md
/Users/patrick/.hermes/skills/productivity/coordinate/SKILL.md
/Users/patrick/.hermes/skills/devops/static-site-deploy-cloudflare-pages/SKILL.md
/Users/patrick/.hermes/skills/autonomous-ai-agents/parallel-subagent-content-extract/SKILL.md
/Users/patrick/.hermes/skills/media/video-to-obsidian/SKILL.md
/Users/patrick/.hermes/skills/autonomous-ai-agents/solo-agent-business/SKILL.md
/Users/patrick/.hermes/skills/lego-mindstorms-sim/SKILL.md
/Users/patrick/.hermes/skills/software-development/systematic-debugging/SKILL.md

================================================
7. Failures / Skip Reasons
================================================

None. All 30 target skills were migrated in a single pass.
No frontmatter was corrupted. No file was unparseable.
The `systematic-debugging` duplicate was intentionally kept (see §5).

================================================
8. Next Batch Recommendation
================================================

The next 30-50 high-priority un-migrated skills to target are roughly:

Priority tier 2 (use_count 5-12, low cron exposure):
  - productivity/financial-analysis (use 13)
  - media/whisper, media/yt-dlp-safari-cookies
  - autonomous-ai-agents/agent-diagnosis, judgment-log
  - productivity/hermes-proactive, hermes-telos-consult, hermes-ontology
  - devops/computer-use-debugging
  - meta/cross-examination
  - autonomous-ai-agents/calibrate
  - notebooklm-cli (the actual CLI skill, distinct from notebooklm)
  - evomap-publishing
  - autonomous-ai-agents/agent-observability

These are all candidates that should map to either gene:agentic-os or
gene:knowledge-synthesis or be marked unclassified for registry review.

================================================
End of report.
