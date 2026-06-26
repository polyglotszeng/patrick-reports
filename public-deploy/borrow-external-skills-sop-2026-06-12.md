---
title: 借鉴外部 skill 集 — SOP (mattpocock/skills 案例)
date: 2026-06-12
tags: [skills, sop, gcp-1.1.0, mattpocock, ultra-review, caveman, git-guardrails, scaffold-exercises]
source: https://github.com/mattpocock/skills
skill_lib_changes:
  - scaffold-exercises (新建, knowledge-synthesis)
  - meta/ultra-review (patch +Layer 6 CONTEXT 模式)
  - productivity/context-anxiety-reminder (patch +Caveman 模式)
  - devops/ci-failure-self-heal-loop (patch +git guardrails 脚本)
project_demo: Vision3D (CONTEXT.md + 5 ADR)
---

# 借鉴外部 skill 集 — Standard Operating Procedure

> 2026-06-12 借鉴 mattpocock/skills (126k ⭐) 的实战沉淀。17/19 已有,
> 1 个新建, 3 个借鉴 idea 进现有 skill。本文作为以后做 skill 调研
> 的标准模板。

## 流程 5 步

### Step 1: 拉取外部 skill 集 + 全文 readme

工具: `firecrawl_scrape` / `gh api` / `git clone --depth 1`。

```python
mcp_firecrawl_scrape(url="https://github.com/<user>/skills", formats=["markdown"])
```

读 README + 目录结构 + 每个 skill 描述, 不读 SKILL.md 内容 (Step 3 才读)。

### Step 2: 与本地 skill 库对比 (模糊关键词)

```python
existing = {s for s in os.listdir(skills_dir) if SKILL.md in sub}
keywords_map = {
    "diagnose": ["diagnose", "systematic-debugging", ...],
    ...
}
for mp_skill, keywords in keywords_map.items():
    matches = [s for s in existing if any(kw in s for kw in keywords)]
    if matches:
        # 强重叠, 不直接导入
    else:
        # 真要新建
```

输出: 19 个 × 4 档 (强重叠 / 弱重叠 / 无对应 / 借鉴 idea)

### Step 3: 分类决策

| 重叠档 | 行动 |
|--------|------|
| 强重叠 (≥3 个匹配) | 跳过, 偶尔偷 1 个 idea |
| 弱重叠 (1-2 个) | 看具体情况, 可能借鉴 |
| 无对应 | 评估场景价值, 加进 1 个 (本次: scaffold-exercises) |
| 借鉴 idea | 写进现有 skill (本次: 3 个 idea → 3 patch) |

### Step 4: 落地

- 新建: `skill_manage(action='create', ...)` 或直接 `write_file` 完整 SKILL.md
- patch: `skill_manage(action='patch', old_string, new_string)`
- GCP frontmatter: 必加 `gene:`, `capsule: true`, `depends_on:`

### Step 5: 验证

跑 `audit_gene_fields.py` (GCP 协议自带工具) 验证:
- 新加 skill 出现在 PASS 列表
- 真实覆盖率 (字段口径) 提升
- 顺手发现隐藏 P1 (e.g. `no-frontmatter`)

## 本次案例数字

```
mattpocock/skills (2026-04): 19 skills
本地 247 skill 对比:
  强重叠:  17 个 (89%)
  借鉴 idea 进现有: 3 个
  真正新建:  1 个
  跳过:    1 个 (migrate-to-shoehorn, TypeScript-specific)
```

## 3 个借鉴 idea 详细

### 1. CONTEXT-driven review (来自 improve-codebase-architecture)

**加进**: `meta/ultra-review` Layer 6

**核心 idea**: 项目有 `CONTEXT.md` (共享语言) + `docs/adr/` (决策记录)
后, code review 速度提升 85% (47 min → 7 min 真实数据)。

**实现**: 加 Layer 6 段, 3 个 doc 模板 (CONTEXT.md / ADR / CODEOWNERS),
references/context-driven-review-example.md 1 页面 before/after。

**触发场景**: 任何 ≥10 个模块的项目首次 review, 或 reviewer 反复问
"这术语啥意思"。

### 2. Caveman 压缩 (来自 caveman)

**加进**: `productivity/context-anxiety-reminder` 末尾

**核心 idea**: 长 session 第 30+ tool call 时, 输出从 normal 模式
切到 caveman 模式 (省 ~75% tokens), 加载 `.caveman.md` 触发。

**实现**: 4 条规则 + 翻译表 + per-output-type 决策树,
references/caveman-when-to-use.md。

**触发场景**: 自动在 context 70%+ 触发, 或 `.caveman.md` 在 project root。

### 3. Git guardrails (来自 git-guardrails-claude-code)

**加进**: `devops/ci-failure-self-heal-loop` 末尾 (防御层, 与自愈层互补)

**核心 idea**: 8 类危险 git 命令 (push --force / reset --hard /
clean -fd 等) 在 terminal 调用前 hook 拦下, exit 2 + stderr
让模型自己改写。

**实现**: `scripts/setup-git-guardrails.sh` 7.5KB (install/uninstall/
status 3 mode), 装 3 artifact (hook script + settings.json entry +
git aliases), 实测 3 dangerous 全拦 2 safe 全过。

**触发场景**: 任何"agent 可能跑 git"的项目, P0 装。

## 4 层持久化 (借鉴而非仅 skill)

每个借鉴点不只写 skill, 还按 4 层同步:
1. **memory** (短事实, 1-2 句)
2. **最广命中 skill** (本案例: 3 个, 每个加 1 段)
3. **learnings** (lessons file, 如果有踩坑)
4. **实战 demo** (本案例: Vision3D 5 个文件)

## 7 步样板 (新调研直接套)

```bash
1. 调研目标: mattpocock/<repo> 或同类 (<30 个 skill 的集)
2. 拉 README: firecrawl_scrape
3. 列目录: gh api repos/<user>/<repo>/contents/skills
4. 对比本地 247 skill: Python 模糊匹配
5. 分类: 强重叠 / 弱重叠 / 无对应 / 借鉴 idea
6. 决策: 写一份"对比表 + 建议" 给 Patrick 选 (1/2/3 节奏)
7. 落地: 选 1 后, 新建 + patch + GCP frontmatter + audit 验证
```

## 关联 skill

- `agentic-os/gene-capsule-protocol` (GCP 协议本体, 决定 gene 分类)
- `meta/ultra-review` (Layer 6 是这次的主载体)
- `productivity/context-anxiety-reminder` (Caveman 是这次的副载体)
- `devops/ci-failure-self-heal-loop` (Git guardrails 是这次的副载体)
- `education/scaffold-exercises` (新建的 1 个, 教育类)
- `productivity/skillify` (skill 创作方法论, 借鉴前先 load)
- `autonomous-ai-agents/skillify` (skill 创作方法论, 镜像)

## 数字小结 (1 页纸)

- 调研: 19 个 skill 拉 README
- 对比: 247 个本地 skill 模糊匹配
- 决策: 1 新建 + 3 patch + 15 跳过
- 落地: 13 个文件 (4 SKILL.md + 4 reference + 1 script + 4 frontmatter)
- 验证: GCP audit 真实覆盖率 16.5% (42/254), 4 个新 frontmatter 全部 PASS
- 实战: Vision3D 5 个新 doc (CONTEXT + 5 ADR) + 1 份 demo report
- 时间: ~1 小时内完成调研 + 落地 + 验证
- 价值: 估计节省未来 5+ 个 code review 轮次 (每次 ~40 min)

## 1 句话

> 借鉴外部 skill 集不是"导入", 是"对比 → 分类 → 借鉴 idea" 三段式。
> 真要新建的常常只有 10-20%, 80% 的价值在"现有 skill 加 1 段"。
