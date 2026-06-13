---
title: "Nick Saraev - 3 Claude Code Videos Deep Dive (2026-06-13)"
date: 2026-06-13 01:58 CST
author: Patrick (via Hermes)
type: video-analysis
source: YouTube @nicksaraev
videos_analyzed: 3
total_views: 672K
total_duration_min: 52
tags: [claude-code, ai-agents, anthropic, n8n-alternative, video-analysis, sub-agent-architecture]
---

# Nick Saraev - 3 Claude Code Videos Deep Dive

**TL;DR**: 3 视频总 52 min, 672K views. 核心主题 = Claude Code 实战 + Agent 编排 + Routines (cron-like 自动化). 全是 "如何用 Claude Code 赚钱" / "Claude 替代 n8n/Zapier" 路线, 跟 Patrick 4 研究方向"AI Agent 经济学"高度对齐.

## 3 视频概览

| # | Video | Views | Duration | 核心主题 |
|---|-------|-------|----------|----------|
| 1 | [Claude Code + Nano Banana 2 + Kling = $15K Animated Sites](https://www.youtube.com/watch?v=ZfYvv-0l9NA) | 290K | 14 min | AI Agent 编排 + 多模态出活 (Nano Banana 2 静态图 + Kling 视频 → 自动网站 $15K) |
| 2 | [Claude Routines Just Dropped, And It's Perfect](https://www.youtube.com/watch?v=j3aXJNu9804) | 207K | 19 min | Claude Routines = cron-like 自动化 (替代 n8n/Zapier/Make) |
| 3 | [Claude Managed Agents Just Dropped, And It Kills n8n](https://www.youtube.com/watch?v=Ob5Vu-gD3mo) | 175K | 19 min | Managed Agents = Anthropic 官方 multi-agent 编排 (直击 n8n 商业模式) |

**合计 672K views, 3 月窗口最热 3 视频之 3**

## 转录状态

- [x] 3 视频 mp3 下载 (8.4 + 11.7 + 10.5 MB)
- [x] 3 Whisper small 并行转录启动 (proc_d6d1d7179388 / proc_6b10eb9a4f07 / proc_2895b8ea96e9)
- [ ] 25-35 min 后 SRT 落 `/tmp/nick_srt/nick_*.srt`
- [ ] .md + HTML dashboard 同步到 Desktop + vault + 公网

## 视频 1: Nano Banana 2 + Kling = $15K Animated Sites (290K views)

**核心卖点**: Nick 用 Claude Code 编排 Nano Banana 2 (静态图生成) + Kling AI (视频生成) = 自动化生产 animated website 卖给客户, 单价 $15K.

**关键观察** (从标题 + thumbnail 推测, 待 SRT 验证):
- 走 multi-modal pipeline: 文案 → static images → video clips → 拼装 website
- 客户场景: real estate / restaurant / local business (本地商家动画官网)
- 价格: $15K/单 = $300K/年 / 20 单 / 年 = 接近 Patrick "5 factor + cron 自动化" 模式

**SRT 待填** (PENDING)
- [ ] 完整转录 14 min (~300-500 段)

## 视频 2: Claude Routines Just Dropped (207K views)

**核心卖点**: Anthropic 新功能 Routines = Claude 跑 cron job. 你设规则 → 定时触发 Claude → 自动做事.

**关键观察** (从标题 + thumbnail 推测, 待 SRT 验证):
- Routines vs cron 的区别: Claude 自己判断要不要做, 不只是机械触发
- 用例: 每日 digest / 周报 / 客户跟进 / 销售外联 / 数据同步
- 跟 Patrick 已有的 cron 体系对比: Hermes cron = no_agent shell, Claude Routines = LLM-driven agent

**SRT 待填** (PENDING)
- [ ] 完整转录 19 min (~400-600 段)

## 视频 3: Claude Managed Agents Just Dropped, Kills n8n (175K views)

**核心卖点**: Anthropic 官方 multi-agent 平台 = 直击 n8n / Zapier / Make 的 workflow automation 市场. "Kills n8n" 是 clickbait 但透露信号.

**关键观察** (从标题 + thumbnail 推测, 待 SRT 验证):
- Managed Agents = Claude 官方托管多 agent 编排 (类似 Hermes delegation)
- 跟 n8n 区别: n8n = 你拖节点, Managed Agents = 你说目标, Claude 自己拆 + 派 + 整合
- 商业影响: n8n 估值 / 客户流可能下滑 (跟 Lindy AI 类似压力)

**SRT 待填** (PENDING)
- [ ] 完整转录 19 min (~400-600 段)

## 跟 Patrick 4 研究方向关联

| 方向 | 视频关联 |
|------|----------|
| AI Agent 经济学 | ⭐ 3 视频全对 (Lindy 路线复刻 / n8n 替代 / Agent 编排变现) |
| 世界模型 / 具身智能 | ❌ 无直接关联 |
| 个人 AI OS / 认知增强 | ⚠️ 视频 2 (Routines) 部分对 (cron + LLM 决策) |
| 量化 + AI | ❌ 无直接关联 |

**重点**: AI Agent 经济学方向应该再跑一轮调研, 加上 Nick Saraev 的 3 视频 = 1 数据点 + 1 平台信号 + 1 商业挑战.

## 下一步 (明天 6-13)

1. **起床先看 SRT** - `/tmp/nick_srt/nick_*.srt` 3 文件, 拼 3 份完整 transcript
2. **写 3 份拆解** - 按 video-to-obsidian skill 流程: SRT → .md → HTML
3. **跟 memory 中旧 "Cognosys 被收购 / Lindy $49-299 / Artisan $5M" 数据对照** - 更新 AI Agent 经济学方向
4. **推公网** - 1 个 HTML dashboard 汇总 3 视频, 跟现有 nick-saraev-3-months-dashboard.html 合并
5. **可选**: 把 3 视频的 5 falsification 写到 research-log/agent-economics/experiments/

## 文件清单 (本 round 产出)

- `~/Documents/Obsidian Vault/llm-wiki/papers/nick-saraev-claude-code-deep-dive-2026-06-13.md` (本文件)
- 待: 3 份 .md 视频拆解
- 待: 1 份 HTML dashboard (3 视频合并)
- 待: 公网 commit

## 公网 URL (待生成)

- 计划: https://patrick-reports.patrick-l-zeng.workers.dev/nick-saraev-claude-code-deep-dive.html
