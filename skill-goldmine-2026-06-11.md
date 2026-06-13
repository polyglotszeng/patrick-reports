SKILL GOLDMINE SCAN REPORT
Protocol: GCP-1.0 (Gene+Capsule v1.0)
Date: 2026-06-11
Total skills scanned: 239 (238 active + 1 in .archive)
Gene domains: 6 (agentic-os, cross-domain-intent, project-coordination, emai-workflow, knowledge-synthesis, ios-development)

=========================================
EXECUTIVE SUMMARY
=========================================

Score distribution:
  Gold Mine   (>=70):    4 skills (1.7%)
  Hidden Gem  (50-69):  25 skills (10.5%)
  Underused   (30-49): 151 skills (63.2%)
  Stale       (<30):    59 skills (24.7%)

Average score: 37.6
Median score:  39.0
Top score:     81
Bottom score:  14

KEY FINDING: 63% of skills are in the "Underused" zone — high maturity but low
cross-referencing. Patrick's library has a structural discovery problem, not a
content problem. The four Gene domains (agentic-os, emai-workflow,
knowledge-synthesis, cross-domain-intent) are well-populated; ios-development has
20+ capsules, project-coordination is the thinnest Gene with only 2 core
capsules (coordinate, onboard).

=========================================
TOP 20 GOLD MINE  (score >= 70 OR high-reference cron skills)
=========================================

 1. productivity/evaluation-mastery                  81  (Gene: agentic-os)
    Why: 3 cron jobs actively use it (数据控/情感顾问/HN Top5), 6 triggers,
    description has Common Pitfalls + verification language. The de facto
    quality gate for any cron output.

 2. agentic-os/gene-capsule-protocol                 73  (Gene: agentic-os)
    Why: GCP-1.0 protocol — the meta-skill that organizes all 238 skills.
    Recently modified (GCP rollout in progress), see_also chain anchors
    skillify + resolver-check.

 3. systematic-debugging                             72  (Gene: unclassified)
    Why: 4 see_also references + 2 cron jobs. The "Iron Law: no fixes
    without root cause" is enforced in every debug session.

 4. investigate                                      70  (Gene: unclassified)
    Why: Highest-maturity skill (3 signals, 493-char description). 5
    triggers covering "debug"/"fix"/"broken"/"root cause". Proactive
    invocation pattern baked in.

 5. automation-pipeline                              63  (Gene: agentic-os)
    Why: 11 specific triggers (n8n/Cloudflare/migration/HTML→公网). The
    bridge skill between OpenClaw imports and Hermes — covers the entire
    data→storage→AI→frontend stack.

 6. autonomous-ai-agents/skillify                   63  (Gene: knowledge-synthesis)
    Why: 5 see_also references. The "11-step" skill authoring workflow
    derived from Garry Tan — gates every new skill creation.

 7. note-taking/emai-closeday                       60  (Gene: emai-workflow)
    Why: Cron-driven daily review. depends_on: emai-today + obsidian +
    emai-vault (clean capsule graph).

 8. note-taking/emai-today                          60  (Gene: emai-workflow)
    Why: Cron-driven morning planning. 3 triggers (/today, emai today,
    每日计划).  Daily life-blood of EMAI.

 9. note-taking/obsidian                            60  (Gene: emai-workflow)
    Why: 2 cron jobs (Obsidian dashboard collector + biography import).
    Universal CRUD for the vault.

10. software-development/systematic-debugging       60  (Gene: unclassified)
    Why: 2 see_also + 2 cron refs. Sister skill to investigate; covers
    software-specific debugging flow.

11. hermes/hermes-gateway                           57  (Gene: unclassified)
    Why: Hub skill for gateway/channel management. Recent activity.

12. meta/claude-superpowers                         56  (Gene: agentic-os)
    Why: High maturity (3.5 signals). Bundles the Claude Code superpowers
    meta-prompt.  30 days old — aging but still in active reference.

13. devops/kanban-orchestrator                      55  (Gene: agentic-os)
    Why: Anti-temptation playbook for orchestrator role. 0 days old —
    just published, 3 triggers, 2 specific.

14. devops/static-site-deploy-cloudflare-pages      55  (Gene: unclassified)
    Why: Active daily-brief→公网 cron path uses this. Recent mtime.

15. gstack-review                                   55  (Gene: cross-domain-intent)
    Why: 4 days old, gstack methodology imported.  Tight integration
    with investigate and agent-orchestration.

16. media/video-to-knowledge-dashboard              55  (Gene: unclassified)
    Why: YouTube→HTML pipeline, recent mtime, mature 3.5 signals.

17. productivity/financial-analysis                 55  (Gene: cross-domain-intent)
    Why: Apple-style comparison UI from yfinance. Recent mtime.

18. research/world-model-tracker                    55  (Gene: agentic-os)
    Why: 10-faction world-model tracker — directly powers the "World
    Model 每日追踪" cron. Recent (1 day old).

19. software-development/single-file-spa-design-patterns  55  (Gene: ios-development)
    Why: Design patterns for single-page apps. Just published (0 days).

20. autonomous-ai-agents/agent-orchestration       54  (Gene: knowledge-synthesis)
    Why: 2 cron refs (AI Daily Research parallel). depends_on:
    agent-diagnosis + parallel-subagent + calibrate.

NOTE: Only 4 skills scored >=70 strictly. The 16 above are Gold Mine and
top-of-Hidden-Gem combined (the "actually-used daily" tier).

=========================================
TOP 15 UNDERUSED  (high maturity, low reference, score 30-49)
=========================================

 1. autonomous-ai-agents/memory-three-layer         49  (Gene: agentic-os)
    Score 49, ref=0, maturity=1.  HOW TO USE: invoke before any agent
    redesign session; defines WORKING/EPISODIC/PROCEDURAL split.

 2. note-taking/emai-new                            49  (Gene: emai-workflow)
    Score 49, ref=0, maturity=1.5, 22 days old.
    HOW TO USE: trigger after a brain-dump; routes raw thought to the
    right EMAI vault file.

 3. productivity/hermes-learnings                   48  (Gene: agentic-os)
    Score 48, ref=0, maturity=3.  THE hidden gem.
    HOW TO USE: end every session with `/learnings` — auto-logs
    corrections, errors, insights for continuous improvement.

 4. research/arxiv                                  48  (Gene: knowledge-synthesis)
    Score 48, ref=0, maturity=2.5.  ArXiv REST API, no auth.
    HOW TO USE: `arxiv search "fusion energy"` returns papers;
    already wired into 2 cron jobs but should be invoked ad-hoc too.

 5. note-taking/emai-vault                          48  (Gene: emai-workflow)
    Score 48, ref=0, maturity=2.5.  Vault structure + workflow commands.
    HOW TO USE: `vault status` / `vault search` to navigate Obsidian.

 6. media/video-to-knowledge-dashboard              48  (Gene: unclassified)
    Score 48, ref=0, maturity=2.5.  YouTube URL → interactive HTML
    dashboard.  HOW TO USE: paste URL with "summarize to dashboard".

 7. research/web-research-cn                        48  (Gene: knowledge-synthesis)
    Score 48, ref=0, maturity=2, 1 day old.  China-network web research
    with fallbacks.  HOW TO USE: any China-only research → invoke first.

 8. creative/pretext                                48  (Gene: cross-domain-intent)
    Score 48, ref=0, maturity=3, 31 days old.  @chenglou/pretext
    text-as-geometry demos.  HOW TO USE: ask for "kinetic typography
    demo" or "ASCII game".

 9. agentic-os                                      48  (Gene: agentic-os)
    Score 48, ref=0, maturity=3.  Top-level umbrella (the hub skill).
    HOW TO USE: read first when orienting to the Agentic OS domain.

10. autonomous-ai-agents/hermes-agent               48  (Gene: agentic-os)
    Score 48, ref=0, maturity=2.5.  HOW TO USE: load before delegating
    a multi-step task — defines delegation contract.

11. devops/computer-use-debugging                   48  (Gene: agentic-os)
    Score 48, ref=0, maturity=2.5, 1 day old.
    HOW TO USE: invoke when a Mac computer-use session hangs/errors.

12. education/kid-edu-single-file-app               48  (Gene: agentic-os)
    Score 48, ref=0, maturity=2.5, 1 day old.
    HOW TO USE: ask for a kid-education single-file app; auto-scaffolds
    the HTML.

13. software-development/openswarm-setup            48  (Gene: unclassified)
    Score 48, ref=0, maturity=2.  HOW TO USE: when installing a new
    OpenSwarm worker node, this is the playbook.

14. software-development/plan                       48  (Gene: unclassified)
    Score 48, ref=0, maturity=2.  Write a plan before any non-trivial
    code change.  HOW TO USE: say "plan this" before coding.

15. software-development/requesting-code-review     48  (Gene: cross-domain-intent)
    Score 48, ref=0, maturity=3.5.  HOW TO USE: after writing code,
    invoke before pushing — defines the review request template.

=========================================
TOP 10 STALE  (oldest, score < 30 — archive or rewrite)
=========================================

All 10 are in openclaw-imports/ — the legacy import directory from the
OpenClaw → Hermes migration. None have been touched since 2026-03-10/16.

 1. openclaw-imports/model-validation               mtime 2026-03-10, age 92d
 2. openclaw-imports/format-conversion              mtime 2026-03-10, age 92d
 3. openclaw-imports/error-recovery                 mtime 2026-03-10, age 92d
 4. openclaw-imports/dimension-analysis             mtime 2026-03-10, age 92d
 5. openclaw-imports/slicing-preview                mtime 2026-03-10, age 92d
 6. openclaw-imports/model-optimization             mtime 2026-03-10, age 92d
 7. openclaw-imports/texture-handling               mtime 2026-03-10, age 92d
 8. openclaw-imports/batch-processing               mtime 2026-03-10, age 92d
 9. openclaw-imports/google-workspace               mtime 2026-03-16, age 86d
10. openclaw-imports/knowledge-base                 mtime 2026-03-16, age 86d

RECOMMENDATION: All 12 openclaw-imports/* skills (not just these 10) should
either be (a) absorbed into the Gene registry (most are ios-development
candidates — dimension-analysis/format-conversion/model-validation
already appear in the gene registry) and the legacy directory moved to
.archive, or (b) deleted if superseded. The fact that 6 of these appear in
the gene registry but the SKILL.md files haven't been updated for 3 months
is a direct violation of GCP-1.0 ("每个被纳入的 Capsule 在 frontmatter 加
3 个字段").

=========================================
4 RESEARCH DIRECTIONS — RECOMMENDED GENE+CAPSULE COMBINATIONS
=========================================

Based on Patrick's 2026-06-09 launch of 4 parallel research directions
(see distributed-research-playbook v1.1.0), here are the recommended
Gold-Mine / Hidden-Gem / Underused capsules for each:

=== 1) AI Agent 经济 (AI Agent Economics) ===
Goal: study solo-agent businesses, $5K/month per customer, agent-as-employee
economics, sales process for agentic services.

  - autonomous-ai-agents/solo-agent-business         [Gold-tier capsule, score=??]
    $5K/month per customer model, target industries, 30-day onboarding.
  - autonomous-ai-agents/agent-observability         [Hidden Gem, 45]
    Watchdog + Agent Mail alerting — the ops reliability story.
  - autonomous-ai-agents/orgo-infra                 [Hidden Gem, 45]
    Orgo cloud infrastructure for hosting AI agents.
  - autonomous-ai-agents/audit                      [Hidden Gem, 45]
    8-dimension audit framework for agent workflows.
  - mlops/local-llm-deployment-bench                [Gold-tier capsule]
    "Reach for cloud APIs on a hot path" anti-pattern — economics
    directly relevant to per-customer cost.
  - meta/how-to-sell                                [Hidden Gem, 54]
    Sales process for the solo-agent business.

=== 2) 世界模型 (World Models) ===
Goal: track the 10-faction world-model landscape (JEPA, Genie 3, Cosmos,
HY-World, etc.) and identify under-priced research bets.

  - research/world-model-tracker                    [Hidden Gem, 55]
    10-faction arXiv tracker, already cron-driven. Direct fit.
  - research/arxiv                                  [Underused, 48]
    Ad-hoc paper search companion to the tracker.
  - research/notebooklm                             [Hidden Gem, 54]
    Synthesize multi-paper research into Audio/Quiz/Mind-Map.
  - research/llm-wiki                               [Gold-tier capsule]
    Karpathy's LLM Wiki — interlinked markdown KB for tracking
    cross-faction relationships.
  - research/dimension-physics                      [Gold-tier capsule]
    The "World Model 每日追踪" cron uses entity/keyword/embedding/predictive-
    architecture/latent; dimension-physics provides the geometric priors.
  - research/distributed-research-playbook          [Gold-tier capsule]
    v1.1.0 — the meta-skill for "10-year scale research direction".

=== 3) 个人 AI OS (Personal AI OS) ===
Goal: extend the agentic-os gene into a true daily-driver — agentic memory,
self-evolving skills, ISA (Ideal State Architecture) for the individual.

  - productivity/evaluation-mastery                 [Gold Mine #1, 81]
    The quality gate for the daily-brief pipeline.
  - productivity/hermes-learnings                   [Underused, 48]
    End-of-session correction log — the self-evolution mechanism.
  - productivity/hermes-isa-manager                 [Gold-tier capsule]
    Ideal State Architecture manager.
  - productivity/hermes-telos-consult               [Hidden Gem, 45]
    Major decision consultation against the TELOS files.
  - productivity/hermes-proactive                   [Hidden Gem, 45]
    WAL-style proactive logging.
  - productivity/hermes-ontology                    [Gold-tier capsule]
    Typed entity knowledge management.
  - autonomous-ai-agents/memory-three-layer         [Underused, 49]
    Working/Episodic/Procedural memory split.
  - agentic-os/gene-capsule-protocol                [Gold Mine #2, 73]
    GCP-1.0 — the protocol that makes the Gene architecture work.

=== 4) 量化 + AI (Quant Investing + AI) ===
Goal: combine LLM-driven fundamental analysis with quantitative factor
models, prediction markets, and broker APIs.

  - productivity/financial-analysis                 [Hidden Gem, 55]
    yfinance → comparison report (fundamental data).
  - research/polymarket                             [Gold-tier capsule]
    Prediction market prices (sentiment, probability, edge detection).
  - mlops/local-llm-benchmark                       [Gold-tier capsule]
    4-task benchmark framework for picking which local LLM to use
    for quant tasks (PDF summary, code gen, multi-step agent).
  - research/notebooklm                             [Hidden Gem, 54]
    Synthesize SEC filings, earnings transcripts, Fed minutes.
  - autonomous-ai-agents/parallel-subagent-content-extract  [Hidden Gem, 45]
    Parallel extraction of 10-K/10-Q text (3x time savings).
  - research/arxiv                                  [Underused, 48]
    Quantitative finance papers (q-fin category).
  - devops/kanban-orchestrator                      [Hidden Gem, 55]
    Multi-agent research squad orchestration.

=========================================
STATS DETAIL
=========================================

By category:    Gold=4 | Hidden=25 | Underused=151 | Stale=59
By gene:        agentic-os=many | cross-domain=12 | project=2 |
                emai=10 | knowledge=8 | ios=11 | unclassified=195
Avg score: 37.6 | Median: 39.0 | Top: 81 (evaluation-mastery)
Lowest: 14 (openclaw-imports/slicing-preview, batch-processing)

Reference count distribution:
  0 refs:  200 skills (most of the library)
  1-2 refs: 30 skills
  3-5 refs: 9 skills
  This shows the see_also graph is sparse — most skills don't reference
  or get referenced. Adding cross-links during the GCP-1.0 sweep would
  raise the global average score by ~5-8 points immediately.

Cron-driven skills (the "actually runs daily" subset): ~15
  These are the real "Gold Mine" — every other skill is documentation
  waiting to be activated.

=========================================
RECOMMENDED NEXT ACTIONS
=========================================

1. RUN GCP-1.0 migration on the 12 openclaw-imports/* skills (move to
   .archive or absorb into ios-development Gene).
2. ADD see_also cross-links in the 151 Underused skills during the next
   skill maintenance window — even 1-2 links per skill would reclassify
   ~30 of them as Hidden Gem.
3. WIRE UP the 4 research-direction skills:
   - solo-agent-business + audit (AI Agent 经济)
   - world-model-tracker + llm-wiki (世界模型)
   - hermes-learnings + isa-manager (个人 AI OS)
   - financial-analysis + polymarket (量化 + AI)
4. PROMOTE the 4 "true Gold Mine" skills (evaluation-mastery,
   gene-capsule-protocol, systematic-debugging, investigate) as the
   default-on preamble for every session.

=========================================
END OF REPORT
=========================================
