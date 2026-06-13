---
title: GCP-1.3.0 收尾指南 — Batch 补 50+ Capsule
date: 2026-06-12
tags: [gcp, gcp-1.3.0, batch-migration, skills, audit, capsule]
related: [gene-capsule-protocol, audit_gene_fields.py, gcp_self_heal.py]
current_state:
  total: 254
  pass: 43 (16.9%)
  missing_capsule: 203
  no_frontmatter: 4 (all in .archive)
---

# GCP-1.3.0 收尾指南

> 当前快照 (2026-06-12): 254 total / 43 PASS (16.9%) / 203 missing
> capsule / 4 no-frontmatter (全 archive). PageRank Recall@3 53%
> (期望已过期, 见 Self-Heal 报告).

## 目标

把覆盖率从 16.9% 推到 50%+ (~130 PASS), 主要靠 **补 203 missing capsule**.
不靠批量新建 (那样 narrative 太薄), 而是**给现有 203 个非合规 skill 加 frontmatter**.

## 5 步实操

### Step 1: 拿清单

```bash
python3 ~/.hermes/skills/agentic-os/gene-capsule-protocol/scripts/audit_gene_fields.py \
  > ~/Desktop/gcp-audit-snapshot-$(date +%Y-%m-%d).txt
```

或定向:
```bash
python3 ~/.hermes/skills/agentic-os/gene-capsule-protocol/scripts/audit_gene_fields.py \
  | grep FAIL | head -20  # 头 20 个失败案例
```

### Step 2: 分类 (1 一次性手工)

把 203 个 missing capsule 按 6 Gene domain 归类, 写到一份 `gene-mapping.md`:

| Skill 路径 | 推荐 gene | 理由 |
|---|---|---|
| `apple/icloud-dataless-document-ingestion` | `agentic-os` | 文档摄入是 agent 基础能力 |
| `apple/apple-reminders` | `emai-workflow` | 提醒是 EMAI 系统的一部分 |
| `apple/findmy` | `ios-development` | Apple 平台能力 |
| `apple/apple-notes` | `emai-workflow` | 同 reminders |
| `apple/macos-computer-use` | (已 PASS) | - |
| ... | ... | ... |

**关键判断**:
- **真值 = 现有 skill 名称 + 描述**，不看 frontmatter（没 frontmatter 才进这步）
- **同一 category 的子 skill 通常同一 gene**（如 `apple/*` 全 ios-development）
- **跨域 skill 用 cross-domain-intent**（如 align/burst/devil/tweak 这种元方法）

### Step 3: 写批量脚本 (Python, 安全)

不要逐个 patch (慢 + 易错), 写一个 batch patcher:

```python
#!/usr/bin/env python3
# batch_add_gene_fields.py
# 给所有 FAIL skill 加 frontmatter 块 (含 gene/capsule/depends_on)
import re
import sys
from pathlib import Path

# 手工定义的 mapping (来自 Step 2)
GENE_MAP = {
    "apple/icloud-dataless-document-ingestion": "agentic-os",
    "apple/apple-reminders": "emai-workflow",
    "apple/findmy": "ios-development",
    # ... 全 203 个
}

DEFAULT_DEPENDS = {
    "agentic-os": ["productivity/calibrate", "meta/claude-superpowers"],
    "knowledge-synthesis": ["research/notebooklm", "meta/ultra-review"],
    "emai-workflow": ["note-taking/emai-today", "note-taking/emai-closeday"],
    "ios-development": ["ios-develop", "software-development/visionos-3d-project-lifecycle"],
    "cross-domain-intent": ["productivity/align", "productivity/devil"],
    "project-coordination": ["productivity/coordinate"],
}

def add_frontmatter(skill_path: Path, gene: str, depends: list[str]):
    if not skill_path.exists():
        return False, "not found"
    content = skill_path.read_text()
    if content.startswith("---\n"):
        return False, "already has frontmatter"

    # 找第 1 个 # 标题之前
    first_heading = content.find("\n# ")
    if first_heading == -1:
        return False, "no heading found"

    fm = f"""---
name: {skill_path.parent.name}
gene: {gene}
capsule: true
version: 1.0.0
author: Hermes Agent
license: MIT
depends_on:
"""
    for d in depends:
        fm += f"  - {d}\n"
    fm += "---\n\n"

    new_content = content[:first_heading+1] + fm + content[first_heading+1:]
    skill_path.write_text(new_content)
    return True, "ok"

skills_root = Path.home() / ".hermes" / "skills"
for relpath, gene in GENE_MAP.items():
    skill_md = skills_root / relpath / "SKILL.md"
    depends = DEFAULT_DEPENDS.get(gene, [])
    ok, msg = add_frontmatter(skill_md, gene, depends)
    print(f"  {'✓' if ok else '✗'} {relpath}: {msg}")
```

### Step 4: 跑 + 验证

```bash
python3 batch_add_gene_fields.py
python3 ~/.hermes/skills/agentic-os/gene-capsule-protocol/scripts/audit_gene_fields.py | tail -10
```

期望: `PASS` 数 43 → 200+, `Total coverage` 16.9% → 80%+.

### Step 5: 跑 Self-Heal + 期望更新

```bash
python3 ~/.hermes/skills/agentic-os/gene-capsule-protocol/scripts/gcp_self_heal.py \
  --out /Users/patrick/Desktop/gcp-self-heal-$(date +%Y-%m-%d).md
```

读报告, 看 PageRank Recall 是不是回到 80%+.

## 注意事项 (踩坑 SOP)

### 1. 跳过 .archive/ 目录

`audit_gene_fields.py` **会**扫 `.archive/` 里的 skill, 算进 254 total. 但
**这 4 个**都是被有意归档的, 不要复活它们. Step 1 输出时手动 grep
掉 `.archive/`.

### 2. 单节点 Gene 域是 P1

audit 报 P1 = 3 个 1 节点 Gene 域 (devops / code-review / agentic-os).
- `devops` 真: 7 个 skill, 但其中 4 个没 frontmatter, 只算 1-3 个 → 单节点错觉
- `code-review` 真: 只有 `zoom-out-explainer` 1 个 → 真单节点
- `agentic-os` 误判: 是 GCP 自指 umbrella, 应排除

**修法**: 把 `code-review/zoom-out-explainer` 移到 `meta/zoom-out` 或
`meta/ultra-review/references/`, 让 code-review category 消失.

### 3. PageRank 期望会过期

Phase B 的 5 query 期望 (GCP 协议 / 本地 LLM / NotebookLM 集成 / 跨 subagent
验证 / emai 工作流) 是 2026-06-11 GCP-1.2.0 patch 时定下的. 每次 batch
migrate 后重测, 期望要重定:

1. 跑 `--phase pagerank` 拿 5 query 实际 top-3
2. 对每个 query, 人工判断: top-3 是否合理
3. 如果合理 → 更新到 `gcp_self_heal.py` 第 45 行的 `PAGERANK_QUERIES` 元组
4. 如果不合理 → 是数据稀疏, 加更多 skill frontmatter

### 4. depends_on 不要拍脑袋

每个 skill 的 `depends_on` 应该反映**真实依赖**, 不是"凑 3 个好看的".

| Skill 类型 | depends_on 真实来源 |
|---|---|
| 教育类 (scaffold-exercises) | 教育方法论 skill (learning-frameworks) + skill 创作 (skillify) |
| Cron 类 (hermes-publish-cron) | agent 监控 (agent-observability) + 自愈 (closed-loop-trace) |
| Apple 类 (imessage) | macOS 自动化 (macos-computer-use) + iOS 开发 (ios-develop) |

**反模式**: 全部塞 4 个一样的依赖 (productivity/calibrate / meta/ultra-review
/ etc.) — 这让 PageRank 退化为单一 hub, 失去意义.

### 5. capsule: true 不是可选项

按 GCP-1.1.0 spec, `capsule: true` **必须**有, 否则不算合规. 早期
archive 里的 skill 只有 gene 字段, 没 capsule — 这就是之前 Phase 7
报告里"14 个半合规"的来源.

## 下次目标 (GCP-1.4.0)

- [ ] 50+ capsule batch migrate
- [ ] PageRank 期望重定 (5 query → 7 query, 加 2 个新 domain)
- [ ] audit_gene_fields.py 加 v1.1.0 检查: version 字段
- [ ] gcp_self_heal.py 加 self-patch 模式 (CONFIRM 后真改文件)
- [ ] cross-domain-intent 域从 4 节点 → 8 节点 (新增 burst/tweak/devil
      在该域, 移除 align 节点重叠)

## 关联

- `~/.hermes/skills/agentic-os/gene-capsule-protocol/SKILL.md` (协议源)
- `~/.hermes/skills/agentic-os/gene-capsule-protocol/scripts/audit_gene_fields.py` (Step 1 工具)
- `~/.hermes/skills/agentic-os/gene-capsule-protocol/scripts/gcp_self_heal.py` (Step 5 工具)
- `~/Desktop/gcp-self-heal-2026-06-12.md` (本次 self-heal 报告)
- `~/Documents/Obsidian Vault/llm-wiki/system/gcp/2026-06-12-self-heal.md` (vault 镜像)

## 1 句话

> GCP 收尾 = audit 拿清单 + 人工分类 + batch script 安全 patch + 验证
> + 更新期望. 4 步走完覆盖率 16.9% → 80%+, PageRank 回到 80%+.
