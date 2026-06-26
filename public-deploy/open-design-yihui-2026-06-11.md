---
title: "告别 Claude Design，拥抱 Open Design"
type: video
source: https://www.youtube.com/watch?v=yKXqup5Fyck
date: 2026-05-17
authors:
  - YIHUI
tags:
  - AI
  - OpenDesign
  - ClaudeDesign
  - DesignSystem
  - Cursor
  - CloudCode
  - AI-Agent
  - UI-Design
related_notes:
  - llm-wiki/papers/fable-5-onredej-workflow
  - llm-wiki/papers/claude-fable-usecases
---

# 告别 Claude Design，拥抱 Open Design

**URL:** https://www.youtube.com/watch?v=yKXqup5Fyck
**Channel:** YIHUI
**Duration:** 30:06
**Views:** 4,926
**Date:** 2026-05-17

## Key Takeaways

1. **Claude Design 最大问题：Token 限额极小** — 即使 $200/月套餐也开发不了几个项目
2. **Open Design = 开源替代方案** — 支持接入用户自己的 Agent（Cloud Code / CodeX / Cursor Agent 等），Token 完全自控
3. **Open Design 完全免费** — 开源工具，无使用成本
4. **设计系统 = 乐高说明书 + 标准零件包** — 不管谁来搭，最终风格都统一；Open Design 提供的是「快速起步的风格模板」而非完整企业设计系统
5. **Section 概念** — 页面组成部分（Hero、Footer、FAQ、Pricing、Steps 等），最多选 5 个
6. **生成内容包含品牌颜色、组件样式** — Button、Card、表单、Layout，支持响应式，包含登录页和后台管理页
7. **推荐用 Cursor 查看和调试** — 生成的代码可直接在 Cursor Agent 中打开和修改
8. **组件封装是关键** — 没有封装，AI 会在多页面重复写同一组件；改了 $15→$20 会漏改其他页面；使用共享组件则一处修改处处生效
9. **AI 会自动封装** — 页面膨胀时，Agent 会自动封装新出现的重复元素
10. **Cloud Code + OpenCity 效果最好** — 设计出来的样式更好看

## Section-by-Section Summary

### 第一部分：安装配置

**Open Design 下载地址：** getopendesign.com

**安装步骤：**
1. 下载 MacOS / Windows 版本，解压安装
2. 首次启动选择本地 COI（Agent）类型：Cloud Code / CodeXCO / Open Code / Cursor Agent / i-Mesh
3. 安装对应插件后即可使用套餐额度（而非消耗 Open Design 自己的 Token）

**支持的所有 Agent：**
- Cloud Code（Claude Code）
- CodeXCO（OpenAI Codex）
- Open Code
- Cursor Agent
- i-Mesh

### 第二部分：设计系统基础

**什么是设计系统：**
- 做产品像搭乐高 → 设计系统就像乐高的说明书和标准零件包
- 有了它，不管谁来搭，最终风格都统一
- Open Design 提供的是「快速起步的风格模板」，不是完整企业设计系统

**Section 概念：**
- Section = 页面的组成部分（Hero、Footer、CTA、Steps、FAQ、Pricing 等）
- 最多选 5 个
- 选完后 AI 会生成对应的设计系统

**生成内容：**
- 品牌颜色
- 组件样式（Button、Card、表单、Layout）
- 登录页面
- 后台管理页面
- 响应式支持

### 第三部分：真实项目复刻

**工作流：**
1. 选择页面需要的 Section（最多 5 个）
2. AI 生成设计系统（生成品牌颜色、组件样式）
3. 复制设计文件到实际项目
4. 用 Cursor Agent 打开项目进行调试

**推荐阅读（设计系统入门）：**
- 什么 是设计系统（文档子男）
- 人人都是产品经理 — 什么是设计系统
- 国内的一些设计系统
- Sketch — 什么是设计系统

### 第四部分：组件封装的核心重要性

**问题：**
- 如果没有组件封装，AI 会在三个页面重复写同一个价格看板
- 当价格从 $15 改成 $20 时，AI 大概率会漏改其中一些页面

**解决方案：**
- 将重复元素封装为共享组件（Agent Sam 约束规则）
- 一处修改，所有页面自动同步更新
- 页面膨胀时，Agent 会自动封装新出现的重复元素

**Temp 文件夹技巧：**
- 不想提交到 GitHub 的实验代码，放进 temp 文件夹
- GitHub 不会追踪该文件夹内容

### 第五部分：工具选择建议

| 工具 | 推荐度 | 原因 |
|---|---|---|
| Cloud Code + OpenCity | ⭐⭐⭐⭐⭐ | 样式效果最好 |
| Cursor Agent | ⭐⭐⭐⭐ | 调试方便，代码修改直观 |
| CodeX | ⭐⭐⭐⭐ | Token 给得很足，社区普及率高 |
| Claude Design | ⭐⭐ | Token 限额太小，$200/月也开发不了几个项目 |

## Key Quotes

> "如果说我们做产品像搭乐高的话，那设计系统就像那些乐高的说明书和标准零件包。有了它，不管谁来搭，最终风格都是统一的。" — YIHUI

> "Claude Design 最大的问题就是 Token 限额太小，即使你是 200 美金的版本也开发不了几个项目。" — YIHUI

> "封装的重要性就是，如果没有一定的约束不封装的话，AI 会在三个页面同时有价格看板时，重写同一套代码写三个页面。当价格从 $15 改成 $20 时，其他两个页面可能 AI 大概率会漏改。" — YIHUI

> "Cloud Code + OpenCity 的设计效果会更好看一些。" — YIHUI

## Discussion Questions

- Open Design 的开源模式是否意味着 Claude Design 的商业价值被开源社区彻底瓦解？
- 组件封装的 AI 自动识别和复用，在没有显式约束的情况下，AI 能否真正学会DRY原则？
- 当 AI 可以自动封装组件时，人类设计师/开发者的角色是否从"实现者"变成了"规则定义者"？
- Open Design 支持接入多个 Agent（Cloud Code / CodeX / Cursor Agent），这种多 Agent 协作设计模式是否会催生新的设计工作流？
- 设计系统的民主化（开源模板）是否会让中小团队也能有大型科技公司的设计品质？这对设计行业有何影响？
