# Patrick Personal Agentic OS Handbook

> 2026-06-11 · Patrick · Handbook v1

> Patrick 在 2026-06-11 用 1 个 prompt 触发 6 phase 把 238 skill 结构化进 6 Gene, 净增 19+ 份 artifact, 2 个新晋 Gold Mine, 4 个数据纠错, GCP-1.1.0 production-ready。

## TL;DR

| 39 skill | 6 Gold Mine | 22 源 | 4 纠错 | 6 phase | 19+ artifact |
|---|---|---|---|---|---|
| Gold pool | Gene domain | 外部源 | 数据纠错 | 流程阶段 | 净增产出 |

---

## CH 1: 一句话总结

Patrick 在 2026-06-11 用 1 个 prompt 触发 6 phase 把 238 skill 结构化进 6 Gene, 净增 19+ 份 artifact, 2 个新晋 Gold Mine, 4 个数据纠错, GCP-1.1.0 production-ready。

---

## CH 2: GCP-1.1.0 协议 (核心)

GCP = Gene Capsule Protocol。1.1.0 是把 v1.0 的 audit step 拆成 Pre+Post 两段, 修补 self-referential consistency pitfall, 并加上 progressive migration + cross-subagent verification 5 个 self-evolution 机制。

### 6 Gene Domains

| Gene | 定位 |
|---|---|
| `01-meta` | Skill system / registry / self-reference 元能力 |
| `02-build` | 代码/工具/基础设施类 skill 集合 |
| `03-knowledge` | 知识/研究/数据类 skill 集合 |
| `04-orchestration` | 编排/agent/task 调度类 skill 集合 |
| `05-delivery` | 输出/交付/写作/可视化类 skill 集合 |
| `06-personal-os` | Patrick 个人 AI OS 专用 skill (handbook, vault, LLM bench 等) |

### 5 Self-Evolution 机制

1. Cross-Subagent Verification: subagent 报数字后主线程 re-verify (find vs glob)
2. Pre+Post-Audit Split: 早发现 + 后校验双层保险
3. Self-Referential Consistency: 全局文件必须满足自己定义的合规 (YAML 风格铁律)
4. Progressive Migration: 每次新加 1 skill 加 1 字段, 不批量改 238
5. Calibrate 固化为协议第 8 步: 任何 protocol launch 后必跑

### 3 P0 Patch 详解

| Patch | 说明 |
|---|---|
| **P0-1 Pre+Post-Audit** | v1.0 audit 是 1 步一次性, 经常漏, 拆成 Pre-Audit (launch 前) + Post-Audit (close 后) 两步走, 用 1 prompt 双跑 |
| **P0-2 Self-Referential Consistency** | GCP 协议第 6 章定义 'gene field 必须带空格', 但 registry 文件里有 14 条没空格; 1.1.0 强制所有 gene 字段统一 'gene: <id>' 带空格格式 |
| **P0-3 Coverage 黄金法则** | find 不用 glob: 之前用 '*.yaml' glob 数 coverage 报 2.1% (5/239), 实际是 16.2% (39/240), 主线程用 find 重新数纠错 |

### 8 步流程 (含 Pre+Post-Audit)

1. Step 1 启动: 解析 prompt, 识别 6 Gene 域
2. Step 2 Snapshot: 备份 registry + .archive
3. Step 3 Scan: find 全量扫描 238 skill 文件
4. Step 4 Classify: 每 skill 分配到 1 个 Gene 域
5. Step 5 Migrate: 渐进式 1+1 加 field (含 gene: <id>)
6. Step 6 Pre-Audit: 跑 self-check 找漏 (4 大数据纠错来自这步)
7. Step 7 Launch: GCP-1.1.0 标记 production-ready
8. Step 8 Post-Audit + Calibrate: 跨 subagent 校验, 跑 benchmark 对比

> **YAML 风格铁律**: `gene: <id>` 带空格, YAML processor 解析可靠

> **Pitfall 6 Self-Referential Consistency**: Pitfall 6: Self-Referential Consistency。GCP 协议本身说 gene field 必须 'gene: <id>' 带空格, 但 registry 里 14 条不带空格, 用 'registry 状态' 反推 '协议应该改' 是错位思考; 正确做法是 registry 必须满足协议, 协议不向 registry 妥协。这就是为什么 1.1.0 把这写成 P0-2 patch。

---

## CH 3: 6 Gold Mine 排行榜

| # | Skill | Score | Value |
|---|---|---|---|
| 1 | `evaluation-mastery` | 81 | 评估方法论 / score 设计 / 多 LLM 对比框架 |
| 2 | `gene-capsule-protocol` | 80 | GCP-1.1.0 协议本身, 6 Gene 域分类法 + 8 步流程 |
| 3 | `local-llm-benchmark` | 76 | 本地 LLM 8 任务路由表 (qwen3/gemma4/hermes3) + 3 反模式 |
| 4 | `gene-registry` | 74 | 238 skill 中心注册表, 16.2% 黄金 skill 池 |
| 5 | `systematic-debugging` | 72 | 系统化 debug 6 步法 + root-cause-not-symptom 铁律 |
| 6 | `investigate` | 70 | investigate 流程 / 证据链 / 不靠记忆靠 artifact |

---

## CH 4: 4 大数据纠错 (Cross-Subagent 验证 lesson)

| 错误 | 真值 | 来源 |
|---|---|---|
| ~~Artisan $30M ARR~~ | **$5M ARR (250 客户/57 人)** | 2025-04 TechCrunch 公开报道, 5x 缩水 |
| ~~Cognosys 2023 YC 可复制~~ | **2025-05 被 Cohere 收购 (关停)** | 公开报道, AI Agent 经济基本盘已变 |
| ~~coverage 2.1% (5/239)~~ | **16.2% (39/240)** | find 黄金法则纠错, glob 数错了 |
| ~~旧 GCP-1.0 audit 一次过~~ | **8 步 Pre+Post 拆** | v1.1.0 patch 拆 audit 拆成 2 步 |

---

## CH 5: LLM 8 任务路由表 (from local-llm-benchmark v1.1.0)

| 任务 | 推荐模型 | 理由 |
|---|---|---|
| 短摘要 | `qwen3` | 速度优先, 质量够用 |
| 严格分类 | `gemma4:e4b` | 本周实验稳赢, 准确率最高 |
| codegen | `hermes3` | 结构化输出 + FC 兼容 |
| 长翻译 | `云端` | 本地模型 context 不够 |
| 多步推理 | `云端` | reasoning chain 长 |
| Function Calling | `云端` | FC 协议对本地支持弱 |
| sentiment 分析 | `hermes3` | JSON 输出稳定 |
| JSON 抽取 | `hermes3` | schema 严格遵循 |

### 3 反模式

- ! qwen3 thinking 模式是灾难: thinking 开启后 latency 翻 3x 且无质量提升
- ! 大模型 ≠ 好: gemma4:e4b 严格分类 > hermes3 70b, 模型大小不决定任务表现
- ! max_tokens 截断: 8K context 内长翻译必被截, 用云端或换 sliding window

---

## CH 6: 4 研究方向本周实验 1 句总结

| 方向 | 本周实验结论 |
|---|---|
| **AI Agent 经济** | Cognosys 2025-05 被 Cohere 收购, Lindy 是 2026 唯一可复刻的 YC Agent 路径 |
| **世界模型** | JEPA 主流 (Meta V-JEPA 2), LeWorldModel (LeWM) 标志性, 3/5 头部团队选 JEPA 系 |
| **个人 AI OS** | 短超时优先: firecrawl/CLI 短超时 + 主线程 fallback, 长 timeout 阻塞 |
| **量化+AI** | gemma4:e4b 严格分类稳赢, 4-bit 量化在分类任务不掉点 |

---

## CH 7: 6 Phase 时间线复盘

| Phase | 名 | 动作 |
|---|---|---|
| Phase 1 | Init | 创建 .archive + registry, 标记 GCP-1.0 baseline |
| Phase 2 | Scan | find 扫描 238 skill, 分到 6 Gene 域候选 |
| Phase 3 | Classify | 逐 skill 标 gene field, 渐进式 1+1 |
| Phase 4 | Pre-Audit | 发现 4 大数据纠错 + YAML 风格不一致 |
| Phase 5 | Patch | GCP-1.1.0 三 P0 patch 落地 |
| Phase 6 | Launch+Post-Audit | production-ready + 跨 subagent re-verify |

---

## CH 8: 7 个 Reusable Lesson (最重要)

1. ✓ Cross-Subagent Verification: 任何 subagent 报数字, 主线程 re-verify (find 不用 glob)
2. ✓ Pre+Post-Audit Split: audit 拆 2 步, 早发现 + 后校验
3. ✓ Self-Referential Consistency: 全局文件必须满足自己定义的合规
4. ✓ YAML 风格铁律: 'gene: <id>' 带空格, YAML processor 解析可靠
5. ✓ 渐进式迁移: 每次新加 1 skill 加 1 字段, 不批量改 238
6. ✓ 诚实标'未跑': 不编数据, subagent 主动报 Critical corrections
7. ✓ Calibrate 固化为协议第 8 步: 任何 protocol launch 后必跑

---

_Generated 2026-06-11 · Patrick Personal Agentic OS · source: 6-phase GCP-1.1.0 launch_
