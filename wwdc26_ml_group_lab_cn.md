---
title: "WWDC26 Coding Intelligence, ML & AI Group Lab"
type: video
source: WWDC26
video_id: bXb18GwYQS8
duration: "1:05:35"
channel: Apple Developer
views: 2981
date: 2026-06-10
tags: [WWDC26, Apple, CoreAI, MLX, FoundationModels, Evaluations, Xcode, Agents]
---

# WWDC26 Coding Intelligence, ML & AI Group Lab

**视频**: https://www.youtube.com/watch?v=bXb18GwYQS8
**时长**: 1:05:35 | **观看**: 2,981 | **日期**: Jun 2026

Apple 工程师小组实时问答直播。6位专家（Xcode/Core AI/CoreML/MLX/Foundation Models/Evaluations）现场回答开发者关于 Apple AI 技术栈的问题。

---

## 嘉宾阵容

- **Kevin** (Xcode) — Agents in Xcode
- **Eric** (Foundation Models) — Language Model Protocol
- **Stephen** (Evaluations) — Model Judge Evaluator
- **Raseel** (Core AI) — 框架架构
- **Angela** (MLX) — 本地 AI
- **Shashank** (Evangelism) — 主持人

---

## 话题索引

### 1. 开场：本地 AI 元年 (00:00)

每位嘉宾分享最期待的方向：
- **Angela (MLX)**: "本地 AI 元年"——真正实用化，可以运行 Agent、做真实工作，不再是噱头
- **Eric**: Language Model Protocol 多后端支持（MLX、Core AI、Google、Thropic）
- **Kevin**: Agents in Xcode 高效采纳新技术
- **Stephen**: Model Judge Evaluator 极简配置评估 LLM 质量
- **Raseel**: Core AI 发布——最佳框架

> *"We're basically at the point where local AI is starting to become useful." — Angela*

---

### 2. Core AI vs CoreML vs MLX：清晰技术分层 (06:10)

三层技术栈：
1. **Foundation Models**（最高层）：LLM 统一入口，不满足再往下
2. **Core AI**（中层）：定制模型/SLA保障，适合应用开发
3. **MLX**（底层）：分布式计算、训练、自定义用例

决策路径：
- LLM → Foundation Models → PCC → 仍不满足 → LMP 协议接入 Core AI
- 非 LLM（diffusion、分割）→ Core AI → MLX
- 训练 → MLX

---

### 3. iOS 27 上下文窗口 (13:30)

- 设备端：4096 tokens（共享）
- PCC：32K tokens（共享）
- 第三方/MLX：可达 1M tokens

iOS 26.4 新增 API：
- `contextSize` / `tokenCounting`：编程查询剩余上下文
- `response.usage`：精确返回输入/输出/cached token 数 + reasoning token 分布

---

### 4. Background App 运行 (16:25)

- iOS：支持 Background Task，可能被系统限速（rate limit 错误）
- macOS：前台 App 无限制
- PCC 两层限速：系统繁忙 vs 请求过于频繁（错误码不同）

---

### 5. Apple Intelligence 等待列表 (20:15)

- 等待列表**仅适用于 Siri**
- AFM Core Advanced（20B）已包含在 Beta 中，用于语音功能

---

### 6. Dynamic Profiles：多模型路由 (23:30)

两种模式：
- **Baton Pass**：完整上下文共享，适合可信模型（设备端/PCC）
- **Phone a Friend**：只传递当前问题，隐私隔离，适合第三方模型

Profile Modifiers：声明式控制上下文压缩策略

---

### 7. 训练 Coding Agent 适应代码风格 (32:00)

三大策略：
1. 让 Agent 搜索现有源码（自然学习）
2. agent-SMD 文件（每个查询注入，保持简短）
3. 引导 Agent 写文档记录模式

Xcode 27 新增 ACP 支持，可接 LM Studio 等本地模型。新模型发布时建议从零开始测试。

---

### 8. Xcode 27 Agent + Simulator (44:00)

Agent 可操控 Simulator：
- 点击/滑动/输入
- 截图 + 解析无障碍树
- 后台运行数小时自动找 bug
- 自动生成 UI 测试代码

---

### 9. Vision vs Foundation Models 选型 (49:00)

- **固定模式**（OCR/条码/检测）→ Vision Framework
- **语义理解/动态任务** → Foundation Models

Foundation Models 新增：OCR 读取、条码读取工具。

---

### 10. 上下文窗口管理 (55:00)

- 工具调用完成后丢弃工具输出
- 保留最后 N 条（Profile Modifiers）
- Summarize History Modifier（开源库）：自动压缩
- KV Cache vs 重新计算：用 Evaluations Framework 对比
- 新模型：滑动窗口注意力/线性注意力

---

### 11. Guardrails 与拒绝检测 (01:02:30)

- Permissive Content Transformations：允许情感激烈输入
- Structured Output 拒绝 ≠ Guardrail 拒绝（不同错误码）
- 今年 Guardrails 改进显著，假阳性大幅减少

---

### 12. Apple 评估哲学：Eval-Driven Development (01:03:00)

核心：Eval 不是"最后验收"，而是 Feature 的行为规范本身。

类比"形成性评估"：评估即学习，通过测试发现弱点并改进。

> *"The best AI products that I've been involved with have been driven this way." — Stephen*

---

### 13. 跨 App 模型共享 (01:03:50)

- 运行中模型无法跨 App 共享（沙箱+量化精度差异）
- 相同开发者 App 可通过 App Group 共享模型缓存下载
- 设备端 Foundation Model 属于 OS 层，不计入 App 大小

---

## 关键 Takeaways

1. **从 Foundation Models 开始**，按需下沉到 Core AI / MLX
2. **用 Evaluations Framework 驱动开发**——无法猜测，只能测量
3. **上下文管理**：工具调用后丢弃 + Summarize History Modifier
4. **Dynamic Profiles** 是多模型协作的核心，声明式设计清晰可控
5. **本地 AI 元年**：MLX + Core AI 使本地模型真正实用化
