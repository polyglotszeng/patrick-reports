---
title: "Nick Saraev - 3 视频 1: AI 生成 3D 滚动网站 (15 分钟 $2-3 tokens)"
date: 2026-06-13 02:25 CST
author: Patrick (via Hermes)
type: video-transcript-analysis
source: https://www.youtube.com/watch?v=ZfYvv-0l9NA
views: 290K
duration: 14:06
srt_lines: 1240
model: Whisper small English
tags: [claude-code, ai-agents, kling-3.0, taste-skill, anti-gravity, design-automation, agent-economics]
---

# 视频 1: AI 生成 3D 滚动网站 (15 分钟 $2-3 tokens)

**核心信息**: Nick 用 Claude Code + 自定义 "taste skill" + Kling 3.0 = **15 分钟生成 1 个高质感 3D 滚动效果网站, $2-3 token 成本** (传统方式 $5,000-10,000).

**关键经济数据** (来自视频原文):
- **旧价格**: $5,000-10,000 / 网站 (传统 web dev 报价)
- **新价格**: $2-3 tokens / 网站 + 10-15 分钟
- **降本倍数**: ~3000x ($7500 ÷ $2.5 = 3000x)
- **速度提升**: ~480x (3 days web dev → 30 sec AI iterate)

## 3 步工作流 (视频 17 段原话)

> "There's really just three steps and I'm going to show them all to you right now."

**Step 1 - Claude Code 写 bullet points** (~1 min)
- 在 IDE 平台 (Nick 用 "anti-gravity") 打开 Claude Code
- 写几条 bullet points 说清需求 (eg. "耳机品牌, 3D 滚动效果, 高端奢华风")
- AI 自动转成完整 web app

**Step 2 - taste skill 标准化设计** (~2 min)
- 一个 16 岁开发者做的 open repo (推特上发布)
- "instills a bunch of high-end like website design principles and then design schematics"
- 让 AI one-shot 出高质量网站, 不用反复调 spacing / luxury 感
- **关键**: 这是个 SKILL 文件 (跟 Patrick GCP-1.0 capsule 概念完美对齐!)

**Step 3 - Kling 3.0 生成动画资产** (~3 min)
- Higgs Field 平台访问 Kling 3.0
- 3 分钟生成多个动画: rotating globes / spaceships / 室内设计
- Claude Code 2 秒整合进网站

## 工具栈总结

| 工具 | 角色 | 价格 |
|------|------|------|
| Claude Code | 主编排, bullet → web app | Anthropic API (token 价) |
| taste skill (GitHub repo) | 设计原则 + 模板, one-shot 质量保证 | 免费 open source |
| Kling 3.0 (Higgs Field) | 视频/动画资产生成 | Higgs Field 订阅 |
| Anti-gravity | Claude Code IDE 包装 | (未提及, 可能免费/订阅) |

## 4 个示例网站 (视频开头展示)

1. **耳机品牌** — cool 3D scroll effects
2. **森林恢复** — cool 3D globe in background
3. **室内设计** — blow up of a house
4. **旋转空间站** — rotating space station look

**共性**: 都有 3D 滚动效果 + AI 生成资产 + 高端设计感.

## 关键技术细节 (来自 SRT 后半段)

**优化 lag 问题** (segment 213-224, 约 9:30 处):
- Nick 让 AI "make it load significantly faster"
- AI 自动: extract frames as optimized JPEGs + tie to scroll position
- 30 秒做完, 原 web dev 估 3 天
- **关键引用** (segment 224): "As a former web developer, some of the stuff that this thing does blows my mind. It would have taken me like three days to do what this just did in 30 seconds."

**Fuzzy gradient mask** (segment 206-211):
- 解决背景渐变没延伸到顶部的问题
- 用自然语言 "make the gradient a little bit stronger on the top and the bottom"

**Text overlay** (segment 229):
- 解决文字和动画重叠
- "add some sort of overlay to the text"

## Nick 的独白关键句

- 段 11: "A few years back, this would probably be $5,000 to $10,000 a pop. And I know that because I used to sell up websites for a living."
- 段 13: "Now you can literally do it in less than 10 minutes for somewhere around $2 to $3 in tokens."
- 段 23: "Kling 3.0" (新模型, 比 Kling 1/2 强)
- 段 24: "And then finally, you just integrate onto the site and push live."
- 段 26: "There's just an open repo here that basically instills a bunch of high-end like website design principles and then design schematics."
- 段 41: "And as mentioned, it's going to be like $5 in tokens." (估比段 13 $2-3 高 = 实际网站更大)

## 5 Falsification (批判性看视频 1)

| Falsification | 评估 |
|---------------|------|
| 1. "10 分钟 $2-3" 是真还是 clickbait? | **部分真** — token 价是真的, 但 taste skill 是预制 (没它 30 分钟+调试不止), 加上 Higgs Field 订阅 + 反复调, 总成本可能 $20-50 |
| 2. "卖 1 个 $15K" 标题党? | **是** — 视频没提 "卖", 只展示如何快速出网站. "$15K" 可能指 "这种网站传统卖 $15K, 现在 $3" |
| 3. "one-shot 质量" 可复现? | **不可靠** — Nick 是 16 岁 (24?) 老手, 用 taste skill 才能 one-shot. 普通人需要 3-5 轮调 |
| 4. Kling 3.0 + Higgs Field 中国能用? | **未知** — 中国大陆 + 国际支付可能困难. 视频无地理限制说明 |
| 5. 商业可持续? | **未知** — 卖 1 个网站给客户 $5K-15K, 实际 1 天能做 5-10 个 = $50K/天, 1 月 $1M+ 可行, 但市场需求是否够? |

## 跟 Patrick 研究方向关联

| 方向 | 关联度 | 关键启示 |
|------|--------|----------|
| AI Agent 经济学 | ⭐⭐⭐⭐ | "$15K 传统 → $3 AI" = 1000-3000x 降本. Lindy 路线 (1 周 MVP, 1 月 $1500 MRR) 实证 |
| 个人 AI OS | ⭐⭐⭐ | "Taste skill" 概念 = 跟 Patrick GCP-1.0 capsule 完美对齐 (打包设计原则/模板成可复用 skill) |
| 量化 + AI | ⭐ | 提到 "AI extract frames as optimized JPEGs" — 可能跟 GBDT 训练数据合成相关 |
| 世界模型 | ⭐ | Kling 3.0 视频生成 = 世界模型视觉生成应用 |

## 5 个可立即学的模式 (Patrick 可抄)

1. **taste skill 模式** — 找 1 个高质量设计 skill 公开 repo, 拿来包装自己的 Claude Code prompt
2. **3 步工作流** — 1) bullet 2) skill 模板 3) 多模态资产 — 比 35 步框架快 12x
3. **Higgs Field 平台** — Kling 3.0 入口, 中国网络可能要走 cn 版本
4. **Anti-gravity IDE** — Claude Code 包装, 跟 Cursor / Windsurf 对比
5. **"3 days → 30 sec" 验证话术** — 跟 Lindy "0.5x dev 10x productivity" 类似 = 营销话术

## 行动建议 (Patrick 周末)

- [ ] 找 1 个 taste skill 公开 repo 试 1 次 (eg. web design / data viz / agentic 风格)
- [ ] 装 anti-gravity (如果能装, Mac 端 Claude Code 替代)
- [ ] Higgs Field 注册 + 试 Kling 3.0 (1 个 exploded view 视频, 估 5-10 min)
- [ ] 复刻 Nick 4 个网站之一 (eg. 森林恢复, 简单些), 计时 + 算 token 成本
- [ ] 跟 Lindy / Artisan 数据合并, 更新 research-log/agent-economics

## 关键引用存档

```
[segment 11] "A few years back, this would probably be $5,000 to $10,000 a pop. 
              And I know that because I used to sell up websites for a living."

[segment 13] "Now you can literally do it in less than 10 minutes for 
              somewhere around $2 to $3 in tokens."

[segment 26] "There's just an open repo here that basically instills a bunch 
              of high-end like website design principles and then design schematics."

[segment 224] "It would have taken me like three days to do what this just 
               did in 30 seconds."
```

## 文件清单 (本视频产出)

- `/tmp/nick_srt/nick_ZfYvv-0l9NA.srt` (28KB / 1240 段, Whisper small English)
- `~/Documents/Obsidian Vault/llm-wiki/papers/nick-saraev-claude-code-deep-dive-2026-06-13.md` (4.9KB skeleton, 待视频 2/3 完成后合并更新)
- `~/Documents/Obsidian Vault/llm-wiki/papers/nick-saraev-2026-06-13-zfyvv-0l9na.md` (本文件, 视频 1 拆解)
- 等待: 视频 2 SRT, 视频 3 SRT
