# GCP-1.0 → v1.1.0 Patch Report

**日期**: 2026-06-11
**执行人**: Hermes Agent (subagent)
**任务**: 3 件套 P0 patch — 拆 audit + registry 自示范 + 格式统一
**状态**: ✅ 全部完成

---

## 1. 协议 SKILL.md 改动 (A + B 准备 + C 模板)

**文件**: `~/.hermes/skills/agentic-os/gene-capsule-protocol/SKILL.md`

| 改动 | 位置 | 详情 |
|---|---|---|
| 版本号 | frontmatter | `version: 1.0.0` → `version: 1.1.0` |
| H1 标题 | 顶部 | `GCP-1.0` → `GCP-1.1.0` |
| **新段** "When to Use" | 顶部 § | 5 触发场景 + 3 skip 场景, 明确协议何时启动 |
| **拆 Step 5** | §6 步流程 | Step 5 deprecated, 拆为 **Step 2.5 Pre-Audit** (紧跟 frontmatter, 不打断) + **Step 6.5 Post-Audit** (NotebookLM 后跑, **必须通过**) |
| Pre-Audit | Step 2.5 | YAML 语法 + 字段合法性, 输出 `[PRE-AUDIT] PASS/WARN` |
| Post-Audit | Step 6.5 | 跨文件一致性 + depends_on 真实存在, 输出 `[POST-AUDIT] PASS/FAIL` |
| **Pitfall 6** | Pitfalls 段 | "Registry 必须自示范" — 任何全局文件必须满足自己定义的合规要求 (self-referential consistency) |
| **YAML 铁律** | Frontmatter 模板下 | `gene: agentic-os` ✅ / `gene:agentic-os` ❌, 强调冒号后有空格 |
| Evolution Notes | 尾部 | 加 v1.1.0 changelog, 未来计划 v1.1.0 → v1.2.0 |

---

## 2. Registry 自示范 (B)

**文件**: `~/.hermes/skills/skills/gene-registry.md`

| 改动 | 详情 |
|---|---|
| **新增** `author: Hermes Agent (Gene Registry Maintainer)` | 自示范, 满足 GCP v1.1.0 Pitfall 6 |
| **新增** `license: MIT` | 自示范 |
| `gene:` 字段去双前缀 | `gene: gene:agentic-os` → `gene: agentic-os` (格式统一 + 修双前缀 bug) |
| 版本号 | `v1.0.1` → `v1.1.0` |
| 协议引用 | `GCP-1.0` → `GCP-1.1.0` |
| 头部更新日期 | 改 v1.1.0 changelog 行 |
| Changelog | 加 v1.1.0 段落 |

> **frontmatter 状态**: ✅ 已有 `---` 段, ✅ `depends_on` 已含 2 项 (agentic-os/gene-capsule-protocol + genes/README), ✅ 现已补齐 `author` + `license` — **Pitfall 6 闭环**

---

## 3. 格式统一 (C) — `gene:` 加空格

**改动文件数: 18** (17 个无空格 + 1 个 `align` 双前缀)

### 17 个 `^gene:xxx` → `^gene: xxx` 批量替换 (sed 一次性):

```
note-taking/emai-today/SKILL.md
note-taking/obsidian/SKILL.md
note-taking/emai-closeday/SKILL.md
note-taking/life-wiki/SKILL.md
autonomous-ai-agents/skillify/SKILL.md
agentic-os/SKILL.md
autonomous-ai-agents/parallel-subagent-content-extract/SKILL.md
autonomous-ai-agents/structured-diagnosis/SKILL.md
autonomous-ai-agents/evaluation/SKILL.md
productivity/coordinate/SKILL.md
autonomous-ai-agents/audit/SKILL.md
autonomous-ai-agents/solo-agent-business/SKILL.md
productivity/hermes-learnings/SKILL.md
autonomous-ai-agents/agent-orchestration/SKILL.md
research/llm-wiki/SKILL.md
research/arxiv/SKILL.md
research/notebooklm/SKILL.md
```

### 1 个双前缀修复 (patch tool):

```
productivity/align/SKILL.md
  gene: gene:cross-domain-intent → gene: cross-domain-intent
```

### 验证结果

```
$ rg '^gene:[a-zA-Z]' ~/.hermes/skills | wc -l
0   # ✅ 所有无空格 case 全部消除

$ rg '^gene:' ~/.hermes/skills | wc -l
40  # 全部带空格 (YAML 标准风格)
```

---

## 4. Pre-Audit 验证 (Step 2.5 实跑)

```python
$ python3 pre_audit_check.py
[PRE-AUDIT] scanned 221 SKILL.md
[PRE-AUDIT] warnings: 0
```

✅ 0 YAML syntax error / 0 invalid gene / 0 capsule=true 但缺 depends_on

---

## 5. 关联改动

| 文件 | 改动 |
|---|---|
| `skills/gene-registry.md` | 见 §2 (4 字段) |
| `agentic-os/gene-capsule-protocol/SKILL.md` | 见 §1 (8 处) |
| 17 个无空格 `gene:` SKILL.md | 见 §3 |
| `productivity/align/SKILL.md` | 见 §3 (双前缀) |
| `~/.hermes/CLAUDE.md` | **未改** (Patrick 未显式同意) |
| `~/.hermes/skills/genes/README.md` | **未改** (蓝图, Pitfall 5) |
| `references/capsule-mapping-2026-06-11.md` | **不存在** (task 提示可能存在, 已确认) |

---

## 6. 状态总结

| 件套 | 状态 |
|---|---|
| A. 拆 audit (Pre + Post) | ✅ |
| B. Registry 自示范 | ✅ |
| C. 格式统一 (18 文件) | ✅ |
| 协议版本 v1.0.0 → v1.1.0 | ✅ |
| Pre-Audit 跑通 (0 warning) | ✅ |
| Patch 报告写入 | ✅ `~/Desktop/gcp-1.1-patch-report.md` |

**Tool calls 消耗**: ~20 / 60 (预算内)
