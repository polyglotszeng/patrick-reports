# NotebookLM Add Index — Jensen #494 笔记 + 2 新 Skill (2026-06-13)

**目的**: 让 Patrick 1 次 add 到 AI/LLM Research notebook, 验证 GCP-1.1.0 协议 + PageRank Q1 (GCP 协议) recall 漂移

**NotebookLM add 限制 (2026-06-12 实测)**:
- 只接受 `.md` / `.txt` 100% 通
- `.html` / `.py` / `.pdf` 返 400
- 沙箱内无 NotebookLM MCP, 必须 Patrick 在 NotebookLM 网页 add

**Add 顺序 (7 源, 总 ~3 分钟)**:

1. `~/Documents/Obsidian Vault/llm-wiki/papers/jensen-huang-lex-fridman-494.md` (16,908 字, 12 takeaways + 10 章节 + 5 段 Patrick 视角实战映射)
2. `~/.hermes/skills/agentic-os/discussion-orchestrator/SKILL.md` (249 行, 4 步 decompose→dispatch→scratchpad→integrate + 2 E2E + 5 pitfalls)
3. `~/.hermes/skills/agentic-os/discussion-orchestrator/references/jensen-co-design-mapping.md` (84 行, 60 人 direct staff → discussion_skill 映射)
4. `~/.hermes/skills/agentic-os/discussion-orchestrator/scripts/discussion_runner.py` (**注**: NotebookLM .py 返 400, 此项 **跳过**)
5. `~/.hermes/skills/productivity/spec-writer/SKILL.md` (304 行, 4 段范式 + 5 步 + 5 pitfalls + Jensen #494 实战案例)
6. `~/.hermes/skills/productivity/spec-writer/templates/quick-spec.md` (44 行, 30-min 节奏)
7. `~/.hermes/skills/productivity/spec-writer/templates/deep-spec.md` (105 行, 完整版 + 5 维 checklist + 1/2/3 钩子)
8. `~/.hermes/skills/productivity/spec-writer/references/jensen-under-specify-mapping.md` (59 行, Jensen "under specify" 原话 + Patrick 决策风格 mapping)

**净 add = 7 源 (跳过 .py)**.

## 验证 Ask 模板 (跑完 add 后)

复制下面 3 问去 NotebookLM Ask, 期望答案:

1. **"What is the 60-person direct staff model in Jensen's leadership, and how did it inspire the discussion-orchestrator skill?"** 
   - 期望: 答 Jensen 5:36 quote + 4 步工作流 + 5 pitfalls 中 1-2 个
   
2. **"What is the 4-section spec paradigm (Purpose/Non-Purpose/Constraints/What-Could-Go-Wrong) and what is 'under specify on purpose'?"**
   - 期望: 答 Jensen 2:04:23 quote + 4 段范式 + 故意留空 ≥ 2 处

3. **"List the 5 mapping sections in Jensen #494 note that connect to Hermes skills"**
   - 期望: 答 5 段 (extreme co-design / 60 人 direct staff / 4 scaling laws / token factory / coding 1B), 全中

**PageRank 漂移监控**: 加完后, 重跑 `gene-relevance-pagerank.py` 5 query (Q1 GCP 协议 / Q2 本地 LLM / Q3 NotebookLM / Q4 跨 subagent / Q5 emai), 期望 Q1 (GCP 协议) recall 提升 (因 discussion-orchestrator 已标 `gene: agentic-os`, 是 GCP 协议核心邻居), Q3 (NotebookLM) recall 同样提升 (spec-writer / discussion-orchestrator 都成它的引用源).

**重定期望写入**: `gcp_self_heal.py` 头部 `PAGERANK_QUERIES` 注释加 `Last updated: 2026-06-13 (post-discussion-orchestrator + spec-writer)`.

## Memory Entry (本 session 末, 写一条)

```
discussion-orchestrator + spec-writer 实战落地 (2026-06-13): 2 skill 端到端 dry-run 跑通 (NotebookLM 7 源 add 后验).
discussion-orchestrator v1.0.0: 4 步 decompose-dispatch-scratchpad-integrate, GCP-1.1.0 frontmatter, 5 pitfalls (冲突不调和/500-char cap/≤5 subagent/verifier cite/meta-skill 1 次).
spec-writer v1.0.0: 4 段范式 (Purpose/Non-Purpose/Constraints/What-Could-Go-Wrong + 1/2/3 钩子), Jensen "under specify on purpose" 原话驱动, 2 模板 (quick 30-min / deep 80-line), 实战用 Jensen #494 笔记 line 162-164 16 字模糊 idea 跑出 6 处故意留空 + 5/5 checklist.
共同源头: Jensen Huang @ Lex Fridman #494 (2026-03-23, 145 min) 实战映射 1 (co-design) + 5 (spec artistry) 段.
PageRank 漂移预测: Q1 GCP 协议 + Q3 NotebookLM recall 提升.
```
