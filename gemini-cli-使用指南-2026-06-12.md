# Gemini CLI 使用指南 — Patrick 沙箱外跑 (2026-06-12)

> **状态**: Gemini CLI v0.46.0 装好 ✅, API key 已设 ⚠️, 沙箱拦外网 3 次 timeout ❌
> **解**: 明天 Mac 自己的 terminal (不经 Hermes 沙箱) 跑, 10 分钟验

---

## 1. 快速验证 (明天第 1 步)

```bash
export GEMINI_API_KEY='***'
gemini --skip-trust -p "Say hello in 5 words"
```

期望: "Hello there! How can I help?" 之类回话。

**如果 timeout**: 大概率是网络/路由问题, 试:
```bash
# 设代理 (如果用 VPN)
export https_proxy=http://127.0.0.1:7890

# 或直连 (Mac 自己的 DNS)
gemini --skip-trust -p "test" --debug
```

---

## 2. Claude vs Gemini 双 AI 测试 (5 个对比 prompt)

> 测试逻辑: 拿 GCP-1.2.0 digest + 让 Claude 和 Gemini 各答同样 5 题, 对比哪个答对更多/更准。
> 双 AI 投票 = Patrick 的"第二意见"机制, 跑赢单 AI。

**Patrick 用法**:
1. 开 2 个 terminal, 一个跑 `gemini`, 一个跑 Claude (用我们平时聊的 terminal)
2. 同 prompt 跑, 对比答案
3. 在 vault 写 `claude-vs-gemini-2026-06-13.md` 存对比

### Prompt 1: GCP-1.2.0 关键 3 P0 patch (验协议理解)
```bash
gemini --skip-trust -p "Read ~/Desktop/gcp-1.2.0-launch-digest-v2-2026-06-12.html. List the 3 main P0 patches that brought GCP-1.0 → GCP-1.1.0 → GCP-1.2.0, in 1 sentence each."
```
**期望答案**:
- v1.0 → v1.1.0: 拆 audit 为 Pre-Audit + Post-Audit
- v1.1.0 → v1.1.1: 加 7-lessons launch checklist
- v1.1.1 → v1.2.0: 加 Step 9 修复循环 + Pitfall 8 数据稀疏性 + 7 Gene

### Prompt 2: GCP-1.2.0 9 步流程 (验流程理解)
```bash
gemini --skip-trust -p "From ~/Desktop/gcp-1.2.0-launch-digest-v2-2026-06-12.html, list all 9 steps in the GCP-1.2.0 protocol workflow in order."
```
**期望答案**: Step 1 选 Gene → Step 2 frontmatter → Step 2.5 Pre-Audit → Step 3 依赖表 → Step 4 registry → Step 6.5 Post-Audit → Step 7 Launch → Step 8 Calibrate → Step 9 修复循环

### Prompt 3: PageRank 5 query 召回 (验数据处理)
```bash
gemini --skip-trust -p "From ~/Desktop/gcp-1.2.0-launch-digest-v2-2026-06-12.html, the PageRank experiment showed 5 query recall went from 60% to 100%. Which 4 fixes made this happen?"
```
**期望答案**: Q1 fix (gene-capsule-protocol + devil/burst/tweak) + Q2 fix (weight 2→4) + Q3 fix (notebooklm) + ios-development 5 节点

### Prompt 4: 8 任务 LLM 路由 (验技术细节)
```bash
gemini --skip-trust -p "From ~/Desktop/gcp-1.2.0-launch-digest-v2-2026-06-12.html, what is the recommended local LLM for strict classification tasks (e.g. fixed N words), and why is it better than qwen3?"
```
**期望答案**: gemma4:e4b 9.6GB, 9.8s 稳 vs qwen3 20.5s 因 thinking 灾难慢 4x

### Prompt 5: 4 大数据纠错 (验诚实)
```bash
gemini --skip-trust -p "From ~/Desktop/gcp-1.2.0-launch-digest-v2-2026-06-12.html, list the 4 data corrections made during this session. Which 2 came from subagent honesty vs which 2 came from cross-subagent verification?"
```
**期望答案**:
- 2 个 subagent 诚实: Artisan $30M→$5M, Cognosys 2023 YC → 已关停
- 2 个 cross-subagent 验证: Coverage 5/239 (2.1%) → 45/226 (19.9%), GCP 协议核心 3 skill 缺数据 → 补 frontmatter

---

## 3. 5 个 GCP 任务专属 prompt (实战用法)

### 写新 skill 时 (用 Gemini 找最优 frontmatter)
```bash
gemini --skip-trust -p "I want to add a new skill ~/.hermes/skills/autonomous-ai-agents/test-skill/SKILL.md. It's a multi-agent orchestration tool. Per GCP-1.2.0 protocol, give me the 9-step checklist I should follow, and propose the exact frontmatter (gene, capsule, depends_on) this skill should have."
```

### 写跨境支付系统 PRD 时 (用 Gemini 找漏洞)
```bash
gemini --skip-trust -p "Read ~/Desktop/跨境支付系统-Package/PRD.md. As a critical reviewer, find 3 security or compliance holes I might have missed in the 6 state machine design. Reference Patrick's GCP-1.2.0 protocol for context."
```

### 写研究综述时 (用 Gemini 跑 arxiv)
```bash
gemini --skip-trust -p "Find me 3 most cited arxiv papers from 2025-2026 on MemGraphRAG. For each, give title, authors, abstract summary in 1 sentence, and how it would apply to my GCP-1.2.0 6 Gene structure."
```

### 跑 NotebookLM 对比 (用 Gemini 答同样问题)
```bash
gemini --skip-trust -p "Answer: what's the single most important fix I should do to make GCP-1.0's 6 Gene structure queryable via PageRank?"
# 然后问 Claude 同样问题, 对比答案
```

### 跑合规审查 (用 Gemini 找法律风险)
```bash
gemini --skip-trust -p "Read ~/Desktop/跨境支付系统-Package/PRD.md. As a US FinCEN + EU EMI + OFAC compliance officer, list 5 regulatory risks in the 6 state machine, in priority order."
```

---

## 4. 沙箱外常驻配置 (一劳永逸)

加进 `~/.zshrc` (Mac 自带):
```bash
# Gemini CLI
export GEMINI_API_KEY='***'
# 别名: 短问用 flash, 深问用 pro
alias gq='gemini --skip-trust -m gemini-2.5-flash'
alias gqp='gemini --skip-trust -m gemini-2.5-pro'
alias gi='gemini --skip-trust'  # 交互模式
```

之后:
```bash
gq "What is GCP?"                    # 快答
gqp "Read this PRD..."              # 深答
gi                                   # 交互模式, 适合多轮
```

---

## 5. Claude vs Gemini 用法分工建议

| 任务 | 用 Claude | 用 Gemini |
|------|----------|-----------|
| 长上下文 (本 session 32K + 1+ 报告) | ✅ (claude 200K) | ⚠️ (Gemini 2M 但需) |
| 代码 review | ✅ (claude 强) | ✅ |
| 大规模文件扫描 (例如 100+ 文件 grep) | ⚠️ | ✅ (2M context 强) |
| 中文写作 / 创意 | ✅ (Patrick 偏好) | ✅ |
| 快速 yes/no 问 | ⚠️ (贵) | ✅ (flash 便宜) |
| 第二意见 / 交叉验证 | ⚠️ | ✅ (推荐拿来 cross-check Claude) |
| 学术 deep-dive | ✅ | ✅ (2.5-pro 强) |
| 跑 cron | ✅ (已有) | ✅ (新) |

**最佳实践**: 写 code + 关键判断用 Claude, 大文件扫描 + 快速问答用 Gemini。

---

## 6. 失败时的 5 个 debug 步骤

1. `export GEMINI_API_KEY='***'` 设了?
2. `gemini --version` → 0.46.0 显示?
3. `gemini --skip-trust -p "test"` → "hello" 回话?
4. 网络通: `curl https://generativelanguage.googleapis.com` → 200?
5. 防火墙 / VPN: 关 VPN 重试, 或开 http_proxy

---

## 7. 1 句话总结

**明天 Mac 自己的 terminal 跑 `gq "test"`, 通了就 5 个对比 prompt 跑起来。Claude 答对 3/5 算正常, Gemini 答对 4/5 算惊喜。** 哪个答错一目了然 — Patrick 直接用双 AI 投票选最佳答案。

---

_Generated 2026-06-12 · Patrick Personal Agentic OS · 沙箱外使用指南_
