# Claude vs Gemini 对比框架 — 2026-06-13 (template)

> **状态**: 沙箱内 Gemini CLI 3 次 timeout, 无法跑. 明天 Patrick 跑后填结果.
> **模板留好**, Patrick 在 Mac terminal 跑完填 5 个 prompt 的 Claude/Gemini 答案即可.

---

## 1. 对比方法论

**5 维度打分** (0-2 分制):
- **准确性** (答对几条关键事实)
- **完整性** (覆盖几个相关子点)
- **诚实度** (主动标"未跑" / "未找到")
- **格式** (按要求列表 / 段落 / 1 句)
- **速度** (小 / 中 / 大)

| 维度 | Claude v0.46.0 | Gemini 2.5-pro | 胜者 |
|-------|---------------|----------------|------|
| 准确性 | /2 | /2 | |
| 完整性 | /2 | /2 | |
| 诚实度 | /2 | /2 | |
| 格式 | /2 | /2 | |
| 速度 | /2 | /2 | |
| **总分** | **/10** | **/10** | |

---

## 2. 5 个测试 prompt (填答案)

### Prompt 1: 列 GCP-1.2.0 关键 3 P0 patch
**期望**: 拆 audit (Pre+Post) / 加 7-lessons / 加 Step 9 修复循环 + Pitfall 8

**Claude 答案**:
> [Patrick 填]

**Gemini 答案**:
> [Patrick 填]

**打分**:
| 维度 | Claude | Gemini | 胜者 |
|------|--------|--------|------|
| 准确性 | /2 | /2 | |
| 完整性 | /2 | /2 | |
| 诚实度 | /2 | /2 | |
| 格式 | /2 | /2 | |
| 速度 | /2 | /2 | |

### Prompt 2: 列 GCP-1.2.0 9 步流程
**期望**: Step 1 选 Gene → Step 2 frontmatter → Step 2.5 Pre-Audit → Step 3 依赖表 → Step 4 registry → Step 6.5 Post-Audit → Step 7 Launch → Step 8 Calibrate → Step 9 修复循环

**Claude 答案**:
> [Patrick 填]

**Gemini 答案**:
> [Patrick 填]

**打分**: (同模板)

### Prompt 3: PageRank 5 query 召回 60%→100% 4 个 fix
**期望**: Q1 fix (gene-capsule-protocol + devil/burst/tweak) + Q2 fix (weight 2→4) + Q3 fix (notebooklm) + ios-development 5 节点

**Claude 答案**:
> [Patrick 填]

**Gemini 答案**:
> [Patrick 填]

**打分**: (同模板)

### Prompt 4: 8 任务 LLM 路由 — 严格分类用什么
**期望**: gemma4:e4b 9.6GB, 9.8s 严格 5 词稳赢 qwen3 20.5s (因 thinking 灾难慢 4x)

**Claude 答案**:
> [Patrick 填]

**Gemini 答案**:
> [Patrick 填]

**打分**: (同模板)

### Prompt 5: 4 大数据纠错 — 哪 2 个 subagent 诚实 vs cross-subagent 验证
**期望**:
- subagent 诚实: Artisan $30M→$5M, Cognosys 已关停
- cross-subagent 验证: Coverage 5/239 (2.1%)→45/226 (19.9%), GCP 协议核心 3 skill 缺数据→补

**Claude 答案**:
> [Patrick 填]

**Gemini 答案**:
> [Patrick 填]

**打分**: (同模板)

---

## 3. 汇总 (Patrick 填)

| 维度 | Claude (总) | Gemini (总) | 胜者 |
|------|------------|-------------|------|
| 准确性 | /10 | /10 | |
| 完整性 | /10 | /10 | |
| 诚实度 | /10 | /10 | |
| 格式 | /10 | /10 | |
| 速度 | /10 | /10 | |
| **总** | **/50** | **/50** | |

---

## 4. 5 大使用建议 (填)

1. **长上下文 / 多文件 grep / 中文写作**: 用 [Claude / Gemini / 两者] 因为 ____
2. **快速 yes/no / 大文件扫描 / 2M context**: 用 [Claude / Gemini / 两者] 因为 ____
3. **代码 review / 大改动前 sanity check**: 用 [Claude / Gemini / 两者] 因为 ____
4. **第二意见 / cross-check**: 用 [Claude / Gemini / 两者] 因为 ____
5. **学术 deep-dive / 跨学科综述**: 用 [Claude / Gemini / 两者] 因为 ____

---

## 5. 1 句话结论 (Patrick 填)

> [Claude / Gemini] 适合 ____ 场景, [Claude / Gemini] 适合 ____ 场景. 总体 ____ 更强.

---

## 6. 怎么跑 (5 分钟流程)

**Patrick 明天 1 步**:
```bash
# Terminal 1
gq "Read ~/Desktop/gcp-1.2.0-launch-digest-v2-2026-06-12.html. List the 3 main P0 patches that brought GCP-1.0 → GCP-1.1.0 → GCP-1.2.0, in 1 sentence each."

# Terminal 2 (Claude)
"Read ~/Desktop/gcp-1.2.0-launch-digest-v2-2026-06-12.html. List the 3 main P0 patches that brought GCP-1.0 → GCP-1.1.0 → GCP-1.2.0, in 1 sentence each."

# Terminal 3
claude-vs-gemini-2026-06-13.md
# 复制 2 个答案, 填上面模板
```

**5 个 prompt 都跑完, 写 1+ 句话结论, 存 vault**:
```bash
cp claude-vs-gemini-2026-06-13.md ~/Documents/Obsidian\ Vault/llm-wiki/system/
```

---

_Generated 2026-06-12 (template, 填答案后) · Patrick Personal Agentic OS_
