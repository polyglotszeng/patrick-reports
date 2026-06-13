---
title: "Don't use Fable 5 in Claude... do this instead"
type: video
source: https://www.youtube.com/watch?v=BxR-r4F4Pbw
date: 2026-06-10
authors:
  - David Ondrej
tags:
  - AI
  - Claude
  - Fable
  - Cursor
  - AI-Agent
  - Workflow
related_notes:
  - llm-wiki/papers/fable-vs-hermes-capability-gap
  - llm-wiki/papers/claude-fable-usecases
---

# Don't use Fable 5 in Claude... do this instead

**URL:** https://www.youtube.com/watch?v=BxR-r4F4Pbw
**Channel:** David Ondrej
**Duration:** 32:29
**Views:** 26,980
**Date:** 2026-06-10

## Key Takeaways

1. **Fable 5 是自 GPT-4 以来最大模型飞跃** —  sleeping ~2 hours testing it; calls it "perhaps the biggest improvement, biggest moral jump since the release of GPT-4"
2. **不要通过 OpenRouter 使用 Fable** — 双倍 Opus 成本，且会 trip safeguards 自动降级到 Opus 4.8
3. **最佳入口是 Cursor Agent Window 或 Claude Code** — 这两者有内置降级机制，当 Fable trips safeguard 时自动切换到 Opus 4.8
4. **不要用 Claude App（Claw）** — 面向数亿用户，guardrails 过多，Fable 能力受限最严重
5. **API 方案（Pi Agent / OpenClaw）缺少 fallback** — trips safeguard 时直接抛出错误，不会优雅降级
6. **Claude Code 订阅性价比最高** — $100/月 Cloud Max Plan ≈ $2000 API credits，API 不享受补贴
7. **Fable 5 的核心优势：3D 模型 / 软件克隆 / 物理仿真** — 可以在单次提示中 one-shot 生成复杂 3D 模型、游戏、完整 App Builder
8. **提示策略根本性转变：不要微观管理** — Fable 比用户更懂代码架构，给目标 + 约束，让它自己推理
9. **OpenRouter 月均支出 $5-6K** — 这还是 Fable 发布前的开销，切换到 Fable 后成本将翻倍
10. **"永久下层阶级"正在形成** — 能用最好模型 + 有预算的人 vs. 只能用旧模型的人，差距将超过"用电 vs. 不用电"
11. **AutoGit 开源工具** — David Ondrej 用 Fable built 并开源，agent 每次操作自动 git commit/push
12. **Fable 会主动 push back 用户的错误想法** — 不像之前的模型那样"yesmen"，有真正的批判性思维

## Section-by-Section Summary

### 1. 为什么不要用 OpenRouter / API
- Fable 是全球最贵模型之一，成本是 Opus 的两倍
- 主要问题：Fable 容易 trip safeguards，正常提示（如"告诉我关于 Fable 5 的一切"）就会触发，自动降级到 Opus 4.8
- API 方案（Pi Agent、OpenClaw、 Hermes Agent）没有 fallback 机制，一旦触发 safeguard 直接报错

### 2. 四大使用场景推荐度

| 场景 | 推荐度 | 原因 |
|---|---|---|
| Cursor Agent Window | ⭐⭐⭐⭐⭐ | 有内置 fallback，内含 safeguard 检测和自动降级 |
| Claude Code（云端应用） | ⭐⭐⭐⭐⭐ | Anthropic 官方，订阅补贴最大，$100 ≈ $2000 API credits |
| Claude App（Claw） | ⭐⭐ | guardrails 过多，面向大众用户限制了 Fable 能力 |
| API / OpenRouter | ⭐ | 无 fallback，成本高，容易触发降级 |

### 3. Claude Code 订阅 vs. API 成本对比
- $100/月 Cloud Max Plan ≈ $2000 API credits
- OpenRouter: $200/月实际只能用 $20-25 的 credits（无补贴）
- Claude Code 是 Fable 最高性价比入口
- ⚠️ 2026-06-23 起 Anthropic 将 Fable 移出订阅，改为纯 API credits 计费

### 4. Fable 5 的 One-Shot 能力展示
- **3D 游戏（Cloud Artifact）**: Slenderman 后室游戏，带动画，一次生成
- **3D 网络数据包可视化**: 把网络包渲染成 3D 赛车，实时物理效果
- **Lovely.app 克隆**: 完整 App Builder，两次提示 vs. 传统开发数周
- **3D 机械装配体**: 复杂连杆机构，一次提示生成
- **3D 城市交通仿真**: 物理引擎、日夜循环，一次完成

### 5. Guard Rail 规避技巧
- **不要提"告诉我关于 Fable 5 的一切"** — 这会被识别为模型蒸馏攻击企图
- **不要提网络安全相关提示** — 如"帮我检查 App 安全性"会触发
- **安全分析的正确做法**: 先用 Opus 4.8 做安全分析 → 把结果给 Fable → 让它评估"你会如何在我们的代码库实现这个"
- **XML tag 包装输出**: 把 Opus 的分析结果包装到 XML tag 中再给 Fable，降低触发概率

### 6. 提示工程范式转变（Power User Tips）
旧范式（对 GPT-4 / Sonnet 有效）:
- 写长而详细的提示
- 微观管理每一步实现
- 提供大量规范和限制

**新范式（Fable 5）**:
- **模糊但清晰**: 对目标模糊（vague about implementation），对外观和使用方式清晰
- **不微观管理**: "Give it a goal, some constraints, success criteria, and let it run"
- **删除所有 verbose scaffolding**: 之前的提示词模板对 Fable 反而是 token 浪费
- **Scope Guard**: "Simplest solution that works. No extra refactoring."
- **Agent Loop**: Run it in a harness（Cursor / Claude Code）
- **不要只用于大任务**: 任何有智能需求的地方都可以用 Fable

### 7. 真实成本数据
- OpenRouter 周账单: ~$1K
- OpenRouter 月账单（仅 API）: ~$5-6K（这是 Fable 发布前）
- Claude Code 订阅（未计入）: 额外的 $200/月
- **预计全切换到 Fable 后: $10K+/月**

### 8. 商业警告：Anthropic 第三天数据留置
- Anthropic 对 Fable 实行 30 天强制数据留置（mandatory third-party data retention）
- 企业客户大量因此拒绝使用 Fable
- 员工可能私下偷偷使用（shadow AI）

### 9. AutoGit 开源工具
- **链接**: https://github.com/davidondrej/autogit
- 功能: 每次 agent 操作自动 git commit + push
- 用法: `npm install autogit` → `autogit setup` → `autogit` 启动
- 目标用户: internal software / hobbies / side projects
- 限制: 不适合大型生产级应用（百人以上付费用户）

### 10. 建造者 vs. 非建造者的差距
- "If you compete against someone who cannot use electricity, cannot use internet, cannot use computers — you would destroy that person"
- Fable 这类模型带来的优势 ≈ 100倍于此
- **核心信息：去 build 任何东西。Internal software、AI startup、open source、CMS、自动化工作流**
- "It's literally one prompt away"

## Key Quotes

> "If you aren't prepared to spend multiple thousands of dollars per month for AI, you're not going to have an advantage." — David Ondrej, 4:44

> "Give it a goal, some constraints, success criteria, and let it run. Stop trying to think you know the implementation better. These models are way too competent." — David Ondrej, 23:40

> "The implications are any software can be cloned with a couple of prompts and that means it has never been more valuable to open source the software." — David Ondrej, 11:50

> "This is probably the first model that I feel like is close to my intelligence. Like most of the models when you talk to them, you can feel like they're yesmen, they're kind of agreeable. With Fable, you don't have that feeling." — David Ondrej, 12:26

> "The time it takes for your idea to become reality has never been lower." — David Ondrej, 18:08

> "Whether it's building mobile apps, video games, B2B SaaS, internal software, open source packages — I mean, just do something. Like that's the main message. Do something. Stop making excuses. Fable is insane." — David Ondrej, 31:05

## Discussion Questions

- Fable 5 的"防 safeguard"机制是否意味着 Claude 实际上在监控你的提示内容？
- Anthropic 的 30 天数据留置政策是否会成为企业采用的阻碍，导致 Fable 最终只能被个人用户和中小企业使用？
- 随着 AI 模型成本持续上升，"AI 精英"和"AI 下层阶级"的分化是否不可避免？有没有反制力量？
- AutoGit 这类自动 commit 工具的出现，是否意味着传统版本控制概念正在被重新定义？
- 如果 Fable 可以 one-shot 复制任何软件，闭源软件的经济护城河是否已经崩溃？
