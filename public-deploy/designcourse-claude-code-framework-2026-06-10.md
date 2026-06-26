# DesignCourse · "Build a Modern AI-Infused SaaS with Claude Code" 课程框架

**URL**: https://designcourse.com/app/course/claude-code-ai-saas
**平台**: DesignCourse (Gary Simon 创立的 UI/AI 课程平台)
**状态**: ⚠️ **推测性框架**（课程内容在登录墙后，本文档基于公开描述 + 同类课程趋势 + Gary Simon 2025-2026 教学风格推断，**未与真大纲核对**）

---

## 🎯 课程推测核心命题

**用 Claude Code 作为 AI 编程代理 + 现代 Web 栈，从零搭建一个有商业价值的 SaaS 产品**。

Gary Simon 2025-2026 课程系列特征：
- 强 UI/UX 视觉（他早期是 designcourse.com 前端讲师）
- 真实项目驱动（不是 toy demo）
- AI 工具工作流（Claude Code / Cursor / Bolt / Lovable / v0）
- 现代栈（Next.js 14+ / shadcn-ui / Tailwind / Supabase / Stripe）

## 📚 推测模块（基于趋势与同类课程）

### Module 0: 课程介绍与心智模型
- 什么是 AI-Infused SaaS（vs 传统 SaaS）
- Claude Code 与 Cursor/Bolt 的定位差异
- 课程最终交付物：1 个完整 SaaS 应用（生产环境可上线）

### Module 1: 项目规划与架构
- 选 idea：从市场需求到 PRD
- Tech stack 选择（Next.js + Supabase + Stripe + shadcn-ui 是 2025 黄金栈）
- 数据模型设计
- Pricing model 设计（freemium / tiered / usage-based）

### Module 2: Claude Code 基础
- 安装与配置（CLI / VSCode / Cursor 集成）
- CLAUDE.md 与 memory 文件
- Slash commands + subagents
- MCP (Model Context Protocol) 服务

### Module 3: 项目脚手架与基础架构
- 用 Claude Code 生成 Next.js 14 app router 项目
- 配置 shadcn-ui + Tailwind 主题
- Supabase 集成（auth + database + storage）
- Stripe 集成（subscriptions + one-time）

### Module 4: 核心功能实现
- 用户认证（sign up / login / OAuth / magic link）
- Dashboard（基于角色的 UI）
- CRUD 操作（产品/订单/订阅）
- AI 集成（OpenAI / Anthropic API + streaming UI）

### Module 5: AI 功能深度集成
- 嵌入 Claude API 作为产品功能
- Prompt engineering 与 streaming
- 成本控制（caching / rate limiting / token 预算）
- Guardrails（防止 prompt injection / 数据泄露）

### Module 6: UI/UX 打磨
- Design system 与 components library
- 动效与微交互（framer-motion / CSS transitions）
- 暗色主题 / 响应式 / 无障碍
- Landing page 与 pricing page 设计

### Module 7: 部署与生产化
- Vercel 部署与 preview environments
- 环境变量管理
- Monitoring（Sentry / PostHog / LogRocket）
- 性能优化（Core Web Vitals）

### Module 8: 营销与增长
- SEO 优化（Next.js metadata + sitemap）
- 启动策略（Product Hunt / Twitter / Reddit）
- 分析集成（Mixpanel / Amplitude）
- A/B 测试基础

### Module 9: 商业化与扩展
- 支付墙设计（free trial / paywall / upgrade flow）
- Customer success 与 onboarding
- 反馈循环与迭代
- AI agent 化（让产品自己做生意）

### Module 10: 收尾与下一步
- 项目打磨与开源
- 简历与作品集包装
- 找 co-founder / 融资基础
- 长期：如何用 AI agent 自动化整个 SaaS 运营

---

## 🔗 与你 4 研究方向的关联

### 1. 🤖 AI Agent 经济学
**直接对应**：课程 Module 5（AI 成本控制）+ Module 9（agent 化商业）
- **复用 Exp 01** (LLM 成本基准)：评估产品 AI 功能 cost-of-goods
- **复用 Exp 05** (本地 LLM benchmark)：能否用本地模型降本？
- **复用 Exp 06** (Hermes3 能力边界)：哪些功能必须云端 API vs 本地

**新角度**：
- Solo agent business 模式（Patrick memory 提到关注 Artisan AI $30M ARR / Lindy / $5K/月）
- SaaS + agent 双重商业模式

### 2. 🌍 世界模型 / 具身智能
**弱关联**：课程主要是 Web SaaS，但
- 如果产品涉及 3D 视觉（AR/VR/3D 扫描）会用到
- 你 Vision3D 项目有相关代码可复用

### 3. 🧠 个人 AI OS / 认知增强
**强关联**：课程 Module 2（CLAUDE.md / memory）就是个人 AI OS 的核心
- 把你学到的"memory 3 层"模式应用到课程项目
- 用 Telos Interview 风格的目标设定
- 课程本身就是教你构建一个增强你能力的 agent 系统

### 4. 📊 量化 + AI
**中等关联**：课程 Module 8 营销增长 + Module 9 商业化用到数据驱动
- A/B 测试与你的 quant 101 alphas 思路一致
- 任何 SaaS 都可视为一个 portfolio（用户 = assets）

---

## 🎯 3 个动手计划选项（与课程对齐）

### Plan A: 学完课程后启动 1 个真实 SaaS
1. 用课程大纲做骨架
2. 边学边建（不只听，做 100%）
3. 你的细分领域（AI + 设计师工具？AI + 中文用户？AI + 量化平台？）
4. 3 个月内 MVP，6 个月内付费用户

### Plan B: 提取课程"AI 工作流"应用到 ArcStore
- ArcStore 已有 Web + 后端
- 用 Claude Code 重新做一次（v2 优化）
- 借鉴课程的 Stripe + Supabase + shadcn 模式

### Plan C: 课程作为研究材料
- 不是为了做 SaaS，是为了研究"如何用 AI 教人做 AI SaaS"
- 写一篇"AI 教育产品分析"研究笔记
- 对应研究方向 1 + 3

---

## 📋 行动计划（如果你真要学）

1. **登录 designcourse.com 拿到真大纲**（我推测的可能差 30-50%）
2. **对比本框架**：把我推测错的章节改正
3. **制定你的学习路径**：跳过已知（Next.js/Supabase 基础）+ 重点学 AI 集成
4. **每周一节**：节奏与你的 4 研究方向并行
5. **建项目 sub-vault**：~/Documents/Obsidian Vault/llm-wiki/projects/ai-saas-course/

---

## ⚠️ 重要警告

**这是基于公开信息推测的框架**，与真课程大纲可能差异巨大：
- 模块数 / 章节数可能不同
- 项目最终交付物可能不是 SaaS 而是其他类型（API？插件？CLI？）
- 使用的技术栈可能不同（不一定 Next.js + Supabase）
- 课程可能重点在 UI 设计而非 AI 工程

**如果你想用本文档做实际学习计划，请先登录 designcourse.com 核对真大纲**。

---

## 📅 文档创建: 2026-06-10
**核实状态**: 待 Patrick 登录后核对
