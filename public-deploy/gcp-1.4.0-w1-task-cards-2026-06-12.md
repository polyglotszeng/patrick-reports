---
title: GCP-1.4.0 W1 Task Cards — 4 任务卡 (可勾选)
date: 2026-06-12
tags: [gcp, gcp-1.4.0, w1, task-cards, kanban]
week: 2026-06-12 ~ 2026-06-19
related: [gene-capsule-protocol, audit_gene_fields.py, gcp_self_heal.py, gcp_self_heal_watch.py]
current_state: 95.3% (243/255) / PageRank 100% (5/5)
---

# GCP-1.4.0 W1 Task Cards (4 任务)

> W1 主题: 收尾 (95%+ 覆盖率 + 100% PageRank Recall + 0% regression)
> 当前: **95.3% / 100% / p1=1** (W1 task 1 已完成, 3 任务待)
> 时间预算: 4-6 小时
> 依赖: 全部可独立执行, 无 blocker

## 进度仪表

| Task | 状态 | 时间 | 优先级 |
|---|---|---|---|
| [W1-1] PageRank 期望 v3.5 重定 | ✓ DONE | 5 min | P0 |
| [W1-2] audit 加 v1.4 4 字段检查 | ⏳ TODO | 30 min | P1 |
| [W1-3] archive 23 个评估 | ⏳ TODO | 30 min | P1 |
| [W1-4] cross-domain-intent umbrella skill | ⏳ TODO | 1-2 hr | P2 |
| [W1-5] pre-commit 部署到 5+ 项目 | ⏳ TODO | 30 min | P0 |

**完成度**: 1/5 (20%) — task 1 done, 4 to go.

---

## [W1-1] PageRank 期望 v3.5 重定 ✓ DONE

**为什么 P0**: GCP-1.3.0 unarchive 加 11 skill 后 PageRank 期望过期, 4/5 漂移.

**实际**:
```bash
python3 ~/.hermes/skills/agentic-os/gene-capsule-protocol/scripts/gcp_self_heal.py --phase pagerank
# 跑 1 次 → 看 5 query 实际 top-3
# 编辑 gcp_self_heal.py 第 45 行 PAGERANK_QUERIES
# Q2 加 local-llm-deployment-bench
# Q3 加 llm-wiki
# 跑再验 → 100% (5/5)
```

**结果**: 87% → 100% (5/5), 5 次漂移 5 次重定历史. 已落地 v3.5 (后来 v3.6 顶替为 v3.5).

**关联**: vault `system/gcp/2026-06-13-summary-gcp-1.3.0.md` 第 "R9 final" 段.

---

## [W1-2] audit 加 v1.4 4 字段检查 (30 min, P1)

**目标**: audit 从 3 字段 (gene/capsule/depends_on) 升级到 4 字段 (+ **version**).

**为什么**: GCP-1.3.0 加了 `version:` 字段到所有 patch 过的 skill, 但 audit 还没检查这字段. 新建的 skill 可能没 version, audit 抓不到.

**步骤**:
```bash
# 1. 编辑 audit_gene_fields.py
#    第 ~135 行 audit_skill 函数内, has_capsule 检查后加:
#    has_version = bool(re.search(r"^version:\s*\S+", fm, re.M))
#    if not has_version: missing.append("version")
#    字段 stat dict 同样 +version 字段

# 2. 跑验证
python3 audit_gene_fields.py
# 应该看到 audit 报 "missing:version" 类失败 (新建的 skill)
# 估计 5-10 个 skill 没 version 字段

# 3. 补缺
python3 batch_fix_gene_fields.py --apply  # 复用同 map, 补 version 字段
# 或者手工写 minimal version: "1.0.0" 到 缺 version 的 skill
```

**验收**: 跑 audit, 看不到 `missing:version` 类失败 (排除 archive).

**估计**:
- 5-10 个 skill 缺 version (新加未跟 GCP-1.3.0 模板)
- 5 分钟 patch
- 5 分钟 跑 verify
- 20 分钟 verify 其他 4 字段没回归

**关联**: skill GCP-1.3.0 patch 加 version 字段的所有 skill (参考 R5-R8 段).

---

## [W1-3] archive 23 个 skill 评估 (30 min, P1)

**目标**: 评估 `.archive/` 里剩 12 个 KEEP_ARCHIVE 是否真要留, 还是变 DELETE.

**为什么 P1**: archive 占用审计时间, 但 R9 已复活 11 个有价值的. 剩 12 个是"有 active 替代或历史性" — 评估决定永久 KEEP 或变 DELETE.

**步骤**:
```bash
# 1. 列 12 个 KEEP_ARCHIVE
python3 ~/.hermes/skills/agentic-os/gene-capsule-protocol/scripts/audit_gene_fields.py \
  | grep "FAIL" | grep "\.archive" | grep -v "openclaw-imports"

# 2. 手工分类 (3 档)
# - KEEP: 真值得历史保留 (e.g. evomap 旧版本)
# - DELETE: 完全无价值, 删
# - REVIVE: 改 batch_unarchive.py 加进 REVIVE 字典, 复活

# 3. 写 1 张表:
# skill-name | KEEP/DELETE/REVIVE | 理由

# 4. DELETE 类的实际删 (需 Patrick 二次确认)
# cp -r .archive/<name> /tmp/archive-final-backup/
# rm -rf .archive/<name>

# 5. 跑 audit 验证 FAIL 数 -N
```

**评估准则**:
- KEEP: 与 active 重复但有历史价值 (e.g. equity-portfolio-backtest 旧版本)
- DELETE: 完全废弃, 无 active 替代需求
- REVIVE: 之前误判, 实则有用

**估计**:
- 5 分钟列 12 个
- 15 分钟评估 + 写表
- 5 分钟跟 Patrick 确认
- 5 分钟删 + 验证

**验收**: archive 缩到 < 10 个 skill, 95.3% → 96%+ 覆盖率.

**关联**: skill batch_unarchive.py REVIVE/KEEP_ARCHIVE 字典, vault `system/gcp/2026-06-13-summary-gcp-1.3.0.md` 第 11 个 REVIVE 段.

---

## [W1-4] cross-domain-intent umbrella skill (1-2 hr, P2)

**目标**: 像 `agentic-os/gene-capsule-protocol` 一样, 给 `cross-domain-intent` 域 (33 节点) 写 1 个 umbrella 协议 skill.

**为什么 P2**: cross-domain-intent 域节点最多 (33), 但没 umbrella 协议. 写 1 个明确"这个域是干嘛的"文档 + 跨域协作 SOP.

**步骤**:
```bash
# 1. 创建 skill
mkdir -p ~/.hermes/skills/cross-domain-intent/{references,templates}

# 2. 写 SKILL.md (~5KB)
# - shared language (4-5 个术语)
# - counter-intuitive decisions (3-4 条)
# - 5 段 SOP
# - 关联 skill (列出 33 个节点里最重要的 8 个)

# 3. 写 references/ 1-2 个实战 demo
# - burst + devil + tweak 怎么协同用
# - align 跟 calibrate 边界
# - cross-domain skill selection (用 PageRank)

# 4. 加 frontmatter (GCP-1.1.0)
# gene: cross-domain-intent
# capsule: true
# depends_on: 4-5 个核心 skill (align / burst / devil / tweak / calibrate)

# 5. 跑 self_heal, PageRank 期望重定
```

**验收**: 1 个新 umbrella skill, PageRank Recall 5/5 (新加节点会触发 1 次漂移).

**估计**:
- 30 分钟写 SKILL.md
- 30 分钟写 references/
- 10 分钟 frontmatter
- 5 分钟 audit
- 10 分钟 重定 PageRank 期望

**关联**: skill `agentic-os/gene-capsule-protocol` (umbrella 模板), PageRank 漂移历史 (5 次).

---

## [W1-5] pre-commit 部署到 5+ 项目 (30 min, P0)

**目标**: GCP-1.3.0 已在 Vision3D 真部署 (3 commit 验证), 推广到 Patrick 的其他活跃项目.

**为什么 P0**: pre-commit hook 是 **regression 防御**第一线. 1 个新项目没 hook 就可能从 95% 跌回 80%.

**5 候选项目** (Patrick 选):
1. `~/.hermes/skills/` (skill 库本身, 但没 .git — 需 git init)
2. nq100-quant-backtest (如存在 git repo)
3. arcraiders-shop (如存在)
4. 任何 Patrick 提到的活跃 repo
5. 1 个 "scratch test repo" 作为部署样板

**步骤**:
```bash
# 1. 选 5 个项目, 各跑:
cd /path/to/project
ls .git  # 确认是 git repo
# 如不是 git repo, git init (跟 Vision3D 一样)

# 2. 装 hook
cp ~/.hermes/skills/agentic-os/gene-capsule-protocol/scripts/pre-commit-gcp-and-astrology.sh \
   .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# 3. 测试 (跟 Vision3D 一样 3 真实 commit 验证)
echo "test" > /tmp/test-ok.md && git add /tmp/test-ok.md && git commit -m "test"
echo "test prediction" > /tmp/test-bad.md && git add /tmp/test-bad.md && git commit -m "test"
# 期望: 第一个 PASS, 第二个 BLOCK (如有 prediction)
# 如无 swift 跳过 astrology lint, 测 GCP 字段就行
```

**验收**: 5+ 项目部署完, 任何新 commit 自动过 GCP 审计.

**估计**:
- 5 分钟选项目
- 5 分钟 / 项目 × 5 = 25 分钟
- 5 分钟总 verify

**关联**: skill `devops/ci-failure-self-heal-loop` (CI 部署参考), Vision3D 3 commit 验证样板.

---

## 4 任务 合计: 4-6 小时

| Task | 时间 | 累计 |
|---|---|---|
| W1-1 (done) | 5 min | 5 min |
| W1-2 | 30 min | 35 min |
| W1-3 | 30 min | 1 hr 5 min |
| W1-4 | 1-2 hr | 2-3 hr |
| W1-5 | 30 min | 3-4 hr |

**W1 收尾目标**: 95.3% → **97%+ 覆盖率** / PageRank 100% / **5+ 项目 hook 部署** / cross-domain-intent umbrella 存在 / archive < 10 个.

---

## 关联 (W1 完成后, W2 启动时用)

W2 主题: **cross-domain-intent 扩 6+ 节点 + umbrella + 新 query**

| W2 任务 | 来自 | 备注 |
|---|---|---|
| 加 2 个新 skill 到 cross-domain-intent | W1-4 umbrella | 写 2 个真 cross-domain skill (如 ctx-compress, scope-check) |
| PageRank query Q6 + Q7 | W1-4 落地后 | 新 query 验证新域节点够 |
| audit 加 cross-domain 域节点 ≥2 检查 | W1-4 umbrella 落地 | closure-guide P1 (1 节点 gene 域) 检查 |

W3 主题: **pre-commit 5+ 项目 + 自愈 v2.0**

W4 主题: **gcp_self_heal --watch 真 cron 化 + 收尾**.

详见 `system/gcp/2026-06-12-roadmap-gcp-1.4.0.md`.

## 1 句话

> GCP-1.4.0 W1 = 4 任务卡 (audit 升级 / archive 评估 / cross-domain umbrella /
> pre-commit 5+ 部署), 4-6 小时, 95.3% → 97%+ 覆盖率, 0% regression
> 防御网真部署.
