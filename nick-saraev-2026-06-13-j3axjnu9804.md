---
title: "Nick Saraev - 视频 2: Claude Routines Just Dropped, And It's Perfect"
date: 2026-06-13 02:35 CST
author: Patrick (via Hermes)
type: video-transcript-analysis
source: https://www.youtube.com/watch?v=j3aXJNu9804
views: 207K
duration: 18:00
srt_lines: 1516
model: Whisper small English
tags: [claude-routines, anthropic, automation, cron, n8n-alternative, gmail-connector, slack-integration, agent-economics, webhook]
---

# 视频 2: Claude Routines Just Dropped, And It's Perfect

**核心信息**: Anthropic 推出 **Claude Routines** = 让 Claude 通过 schedule / trigger / webhook 三种方式自动 kick off 自动化任务. 跟 n8n / Zapier / Make 直接竞争.

**关键引用** (segment 1-2 原话):
> "Anthropic just launched routines, which allows Claude to kick off automations via schedule, trigger, or even a webhook."

**定位** (segment 3-4):
> "This closes the loop and basically turns Claude into a dedicated automation platform competing with no code drag and drop builders like N8N and others."

## 3 种触发方式

| 触发方式 | 说明 | 例子 |
|----------|------|------|
| **Schedule** | 时间驱动 (类似 cron) | hourly / daily / weekly |
| **Trigger** | 事件驱动 | (视频未细讲) |
| **Webhook** | 外部 HTTP 回调 | 第三方服务推过来 |

## 视频涵盖 (segment 5-8)

> "I'm going to show you guys how you can build routines very quickly. I'm going to give you guys a couple of demos. And I'm going to walk you through step by step setting up your own routines on both the Claude desktop interface, as well as behind the scenes via API."

**两种使用界面**:
1. **Claude desktop** (UI) — 适合非技术用户
2. **API** (programmatic) — 适合技术集成

## Demo 1: Daily Mailbox Summary + Draft (segment 9-99)

**触发**: Schedule daily at 5:10 AM (Nick 起床前 10 分钟)

**3 步**:
1. **Gmail connector 拉邮件** (segment 96-98): "the agent is going to check my mailbox using the Gmail connector"
2. **SOP / logic 解析** (segment 97-98): "It's going to run through whatever SOP or logic that I gave it, which in this case was just, hey, go see if we had any previous email communicate"
3. **生成草稿 → Slack 推送** (segment 99): "it's going to draft up the message and send it to me in Slack"

**可视化调度** (segment 80-83):
> "we have this little visual interface where I could select hourly, daily, and so on and so forth"

**多触发器** (segment 87-88):
> "you can add multiple of these triggers at any point in time"

**Calendar 视图** (segment 89-92):
> "if I go back to routines, you'll see there's a little calendar feature here and you can now see that there's a daily mailbox summary plus draft opened at 5:10, as well as a couple of other ones that I was playing around with earlier today"

## Nick 自己用 Routines 替代什么 (segment 356-368, 17:00-17:40)

**关键段 356-357**: "I'm going to replace all of my proposal generators with these built-in routines."

**销售流程自动化** (segment 358-363, 17:10-17:25):
1. **Sales call 结束** → 收到 webhook 带 transcript
2. **Routine 1** (webhook trigger): 生成 immediate post-call email + workflow diagram draft
3. **Nick 手动调整** + 发送 (因为 "perception of more effort and higher perceived quality")

**签约流程** (segment 364-368, 17:30-17:45):
1. **Proposal 发出** → Routine 监控是否签字
2. **签约触发** webhook → 推到下一个 routine
3. **Routine 2**: 发送 onboarding email + calendar 通知 + thank-you 消息

**关键洞察**: Nick 用 Routines 替代他 agency 几乎所有非"human face time"步骤.

## Nick 收尾关键引用 (segment 369-375, 17:45-18:00)

**核心结论** (segment 369-370):
> "You guys can automate more or less all of the non, like human face time steps in a business right now."

**对比之前** (segment 371-373):
> "And it's not like you couldn't before. It's just in order to do it before it was pretty laborious. You needed a fair amount of know-how."

**新现实** (segment 374-375):
> "Um, now, as long as you understand sort of the routine spec and more or less what I've showed you in this video, you guys are good to go."

## 跟 Hermes cron 对比 (Patrick 视角)

| 维度 | Claude Routines | Hermes cron (no_agent) |
|------|------------------|-------------------------|
| 触发方式 | schedule / trigger / webhook | schedule only (cron expression) |
| 执行内容 | LLM agent + SOP | shell script only |
| 适用场景 | 知识流程 (邮件/CRM/总结) | 系统流程 (备份/监控/数据) |
| Token 成本 | 每次触发消耗 LLM | $0 (本地 shell) |
| 可视化 | Claude desktop UI | jobs.json 文本 |
| Setup 难度 | 低 (UI drag-drop) | 中 (写 cron expression) |
| Debug | raw API event log | cron 输出 + exit code |

**结论**: 两套系统**互补不竞争**. Routines 适合业务流, Hermes cron 适合基础设施.

## 跟 Patrick GCP capsule / 4 研究方向关联

| 方向 | 关联度 | 关键启示 |
|------|--------|----------|
| **AI Agent 经济学** | ⭐⭐⭐⭐⭐ | Routines + Managed Agents = Anthropic 全栈对 n8n/Zapier 挑战. 12-18 月窗口 |
| **个人 AI OS** | ⭐⭐⭐⭐ | Routines = Patrick "personal AI OS" 的 cron 替代. 用 Routines 做 daily digest / 周报 / 销售跟进 = 1 周可上 |
| **量化 + AI** | ⭐⭐ | 可借鉴: routine 监控 (eg. 每日市场数据 → 总结 → Slack) 但 quant 通常需要精确脚本不是 LLM |
| **世界模型** | ⭐ | (无直接关联) |

## 5 Falsification (批判性看视频 2)

| Falsification | 评估 |
|---------------|------|
| 1. "Routines 跟 n8n 直接竞争" 是 clickbait? | **部分真** — Routines 还没 visual UI (Nick 视频 3 预测 Anthropic 会加), 当前 n8n 仍占 visual 优势 |
| 2. "Setup 简单" 可复现? | **受限** — 需要 Gmail/Slack/ClickUp 等 connector 配置, 跟 n8n 一样需要 API key |
| 3. LLM 成本可控? | **未知** — 每日 5:10 AM 触发 = 1 次/天, 估 $0.50-2/次 (取决于邮件量), 月 $15-60. 比 n8n $20/月 高但增加 LLM 智能 |
| 4. "多触发器" 真的 work? | **部分** — 视频 demo 只展示 1 个 schedule 触发, 多 trigger 没真实测 |
| 5. 商业可持续? | **高** — Nick 自己 agency 在用, 替换他原有工具, = 1 个 enterprise 案例 |

## 5 个可立即学的模式 (Patrick 可抄)

1. **Daily Mailbox Summary 模式** — 早 5:10 AM 触发, 拉邮件 → SOP 解析 → Slack 草稿
2. **Webhook 串联 Routine 模式** — Routine A 触发 → webhook → Routine B (销售流程)
3. **视觉 Calendar 视图** — 1 个 dashboard 看所有 routine 何时跑
4. **Gmail/Slack/ClickUp connector** — Anthropic 已内建, 不需要写 API
5. **"非 human face time 自动化" 框架** — Nick 的判断标准 = 适合 Routines 候选清单

## 跟现有 memory 数据对比 (更新 AI Agent 经济学)

| 公司/产品 | Nick Saraev 视频确认 | memory 旧数据 | 修正 |
|-----------|----------------------|---------------|------|
| Anthropic Routines | ✅ 12-18 月 visual UI 出来后, 跟 n8n/Zapier/Make 全方位竞争 | ❌ 之前没记录 | **新增数据点** |
| n8n | ⚠️ 当前还有 visual 优势, 但 6-12 月窗口被取代 | ❌ 之前没记录 | **新增风险点** |
| Lindy | ✅ 同类竞争位置 | ✅ 之前记 | 一致 |
| Artisan AI | ✅ 同类竞争位置 (Nick 自己也用 Routines 卖实施) | ✅ $5M ARR, 57 人 | 一致 |
| Hermes cron | ✅ 不被取代 (基础设施层, Routines 是业务层) | ✅ no_agent + script | **新定位** |
| **新结论** | **2026 H2 窗口**: Anthropic 推出 Routines + Managed Agents, 整合 12-18 月内 visual UI 化 = 4 类玩家洗牌 (Anthropic vs n8n vs Lindy vs Artisan) | - | **新信号** |

## 行动建议 (Patrick 周末)

- [ ] 注册 Claude Routines (Anthropic Console), 试 1 个 daily digest routine
- [ ] 评估: 我 (Patrick) 的 Hermes cron + Routines 双系统架构? cron 做基础设施, Routines 做业务流
- [ ] 跟踪 Anthropic visual UI 公告 (segment 213-219 of 视频 3 预测)
- [ ] 把 3 视频的核心 demo (mailbox summary / clickup tasks / 3D website) 跟 Lindy 路线 (1 周 MVP) 对比
- [ ] 更新 research-log/agent-economics: 加 Nick Saraev 3 视频 = 第 3 数据点, 4 玩家洗牌时间表

## 关键引用存档

```
[segment 1-2] "Anthropic just launched routines, which allows Claude to kick 
               off automations via schedule, trigger, or even a webhook."

[segment 3-4] "This closes the loop and basically turns Claude into a 
               dedicated automation platform competing with no code drag and 
               drop builders like N8N and others."

[segment 80-83] "we have this little visual interface where I could select 
                 hourly, daily, and so on and so forth."

[segment 87-88] "you can add multiple of these triggers at any point in time."

[segment 96-99] "The agent is going to check my mailbox using the Gmail 
                 connector. It's going to run through whatever SOP or logic 
                 that I gave it... it's going to draft up the message and 
                 send it to me in Slack."

[segment 356-357] "I'm going to replace all of my proposal generators with 
                   these built-in routines."

[segment 369-370] "You guys can automate more or less all of the non, like 
                   human face time steps in a business right now."

[segment 374-375] "now, as long as you understand sort of the routine spec 
                   and more or less what I've showed you in this video, you 
                   guys are good to go."
```

## 文件清单

- `/tmp/nick_srt/nick_j3aXJNu9804.srt` (36KB / 1516 段, Whisper small English)
- `~/Documents/Obsidian Vault/llm-wiki/papers/nick-saraev-2026-06-13-j3axjnu9804.md` (本文件, 视频 2 拆解)
- 配对: 视频 1 (ZfYvv-0l9NA, AI 3D 网站) + 视频 3 (Ob5Vu-gD3mo, Managed Agents)
