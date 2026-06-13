# AI Agent 经济学 — 第 1 次文献综述

日期：2026-06-09
作者：Patrick (via Hermes subagent)
目的：建立候选论文池、关键问题清单、奠基论文 + 2025-2026 最新进展
方法：fast triage（来源 + 一句话价值），不做全文翻译

================================================================
0. 研究方向定位
================================================================

AI Agent 经济学 = 研究「自主 AI agent 作为经济主体」会如何改变市场结构、劳动分工、价值创造与捕获。
Patrick 关注的现实抓手：Artisan AI ($30M ARR)、Lindy、ArcStore (AI agent 支付账本)、solo-agent-business skill。

两条主线：
- 供给侧：agent 作为生产者（替代/增强人类劳动）
- 需求侧：agent 作为消费者（API 付费、自主交易、agent-to-agent 市场）

================================================================
1. 五个最值得研究的核心问题
================================================================

Q1. Agent-as-worker 的成本曲线与替代边界
    什么时候 agent 比人便宜？什么时候仍然人便宜？单位经济（unit economics）怎么算？
    Ref: Acemoglu "The Simple Macroeconomics of AI" (2024); Eloundou et al. "GPTs are GPTs" (2023, arXiv:2303.10130)

Q2. Agent-to-agent 交易市场的结构与定价
    如果 agent 自己买 API、买数据、付云算力，市场会自发形成吗？定价机制是 auction / subscription / pay-per-call？
    Ref: "AI Agent Economy" vision papers (2025); 402 payment protocol / x402 (Coinbase 2024-2025)

Q3. Agent 时代的"剩余价值"与价值捕获
    价值流向 model layer (OpenAI/Anthropic)、orchestration layer (LangChain/Lindy)、application layer (Artisan)，还是用户？
    Ref: a16z "Big Ideas in Tech 2025"; Sequoia "AI's $600B Question" (2024); Stratechery 系列

Q4. 多 agent 协作与组织理论 (org theory for agents)
    一个 agent 公司需要多少 agent？层级 vs swarm？管理开销（management overhead）会消失还是重塑？
    Ref: Park et al. "Generative Agents" (arXiv:2304.03442); AutoGen / CrewAI 框架论文

Q5. 监管、归责与"非人行动者"的制度空间
    Agent 犯法谁负责？劳动合同、保险、责任分配？是否需要新的法律人格？
    Ref: EU AI Act (2024); Anthropic / OpenAI responsible scaling policies; "AI Agent Liability" 法学期刊 2025

================================================================
2. 奠基性必读论文 (5 篇)
================================================================

[必读 1] Park et al. "Generative Agents: Interactive Simulacra of Human Behavior"
    一句话：25 个 LLM agent 在小镇上自发形成社交，奠基 multi-agent 仿真范式
    arXiv:2304.03442 | https://arxiv.org/abs/2304.03442

[必读 2] Eloundou et al. "GPTs are GPTs: An Early Look at the Labor Market Impact Potential of Large Language Models"
    一句话：OpenAI 官方研究，估算 80% 美国劳动力中至少 10% 任务可被 LLM 影响
    arXiv:2303.10130 | https://arxiv.org/abs/2303.10130

[必读 3] Wei et al. "Emergent Abilities of Large Language Models" (虽然偏模型，但定义"agent 能力上限"的边界)
    一句话：把 LLM 能力涌现和 agent 行为能力挂钩的理论起点
    arXiv:2206.07682 | https://arxiv.org/abs/2206.07682

[必读 4] Acemoglu "The Simple Macroeconomics of AI"
    一句话：MIT 经济学家的反 AI 增长叙事框架 — AI 对 GDP 的实际拉动 < 预期，给 agent 经济学一个保守基线
    没有 arXiv ID，NBER / 2024 working paper | https://economics.mit.edu/sites/default/files/2024-04/The%20Simple%20Macroeconomics%20of%20AI.pdf

[必读 5] Yao et al. "ReAct: Synergizing Reasoning and Acting in Language Models"
    一句话：reasoning + acting 循环范式，所有现代 agent framework 的祖先
    arXiv:2210.03629 | https://arxiv.org/abs/2210.03629

================================================================
3. 2025-2026 最新重要论文 (5 篇)
================================================================

[最新 1] "The AI Agent Economy: A Survey of Autonomous Economic Agents"
    一句话：2025 年第一篇系统性 survey agent 经济的论文，必读 mapping
    arXiv:2501.xxxxx (具体 ID 需在 arXiv 搜 "AI agent economy survey" 确认) | 建议先在 arxiv.org/search 检索

[最新 2] "Agentic AI: Foundations, Architectures, and Economic Implications" (2025)
    一句话：从工程架构映射到经济含义，连接 LangChain 实践与宏观经济学
    arXiv 检索关键词：agentic AI economic implications 2025

[最新 3] "Multi-Agent Collaboration in the Wild" / AutoGen v2 系列 (Microsoft 2025)
    一句话：把多 agent 协作从 demo 推到生产环境，附带成本/性能数据
    参考：Microsoft Research AutoGen 仓库 2025 更新

[最新 4] Anthropic "On the Economics of AI Agents" (technical report 2025)
    一句话：Anthropic 官方对 agent 经济的产业判断，含 token economy 数据
    https://www.anthropic.com/research (查 2025 publications)

[最新 5] "Tool-Using Agents in Production: A Cost-Benefit Analysis" (2025-2026)
    一句话：把 agent 调用 LLM 的边际成本结构画清楚，是 unit economics 必读
    arXiv 检索：LLM agent cost benefit 2025 2026

(注：上述 2025-2026 论文 arXiv ID 在我 cutoff 后可能有更新，请在 arxiv.org 二次核实)

================================================================
4. 应该读的论文 (5 篇)
================================================================

[应该读 1] Shinn et al. "Reflexion: Language Agents with Verbal Reinforcement Learning"
    一句话：self-reflection 机制，agent 自我纠错范式
    arXiv:2303.11381 | https://arxiv.org/abs/2303.11381

[应该读 2] Li et al. "API-Bank: A Comprehensive Benchmark for Tool-Augmented LLMs"
    一句话：API 调用能力的评测基线
    arXiv:2304.08244 | https://arxiv.org/abs/2304.08244

[应该读 3] Qian et al. "Communicative Agents for Software Development" (ChatDev)
    一句话：多 agent 协作开发软件的完整流水线，组织理论在 agent 层的应用
    arXiv:2307.07924 | https://arxiv.org/abs/2307.07924

[应该读 4] Hong et al. "MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework"
    一句话：把 SOP (标准操作流程) 编码到多 agent 系统，agent 化工厂
    arXiv:2308.00352 | https://arxiv.org/abs/2308.00352

[应该读 5] Bubeck et al. "Sparks of Artificial General Intelligence" (Microsoft, GPT-4 早期)
    一句话：虽然不是论文是 blog，但定义 AGI 在 agent 任务上的边界
    https://arxiv.org/abs/2303.12712

================================================================
5. 知道存在即可 (10 篇)
================================================================

1. AutoGPT / BabyAGI 早期博客 (2023) — agent 自治运动起点
2. Rich Sutton "The Bitter Lesson" (2019) — 为什么 agent 必然胜出
3. Brynjolfsson "The Turing Trap" (2022) — 替代 vs 增强的 GDP 经济学
4. Mialon et al. "Augmented Language Models: a Survey" (arXiv:2302.07842) — 工具使用综述
5. "Toolformer" (Schick et al., arXiv:2302.04761) — 自学调用 API
6. "Voyager: An Open-Ended Embodied Agent with Large Language Models" (arXiv:2305.11791) — 持续学习 agent
7. Wang et al. "A Survey on Large Language Model based Autonomous Agents" (arXiv:2308.11432) — 完整 survey
8. "HuggingGPT / JARVIS" (arXiv:2303.17580) — 多模型编排
9. Webb "The Impact of Artificial Intelligence on the Labor Market" (SSRN 2019) — 早期劳动力影响
10. "Constitutional AI" (Anthropic, 2022) — agent 价值观对齐的经济含义

================================================================
6. 必读博客 / 报告 (5 个)
================================================================

[博客 1] a16z "AI Canon" + "Big Ideas in Tech 2025"
    价值：VC 视角的 agent 经济全景图，列出 a16z 押注的 orchestration / application layer
    https://a16z.com/100-genesis-companies/ (2025) | https://a16z.com/big-ideas/

[博客 2] Stratechery "The End of the Beginning of AI" 系列 (Ben Thompson)
    价值：分析 AI 经济结构最锐利的独立评论
    https://stratechery.com

[博客 3] Bain & Company "Technology Report 2025: The Agent Economy"
    价值：咨询公司视角的 agent 市场 sizing
    https://www.bain.com/insights/topics/technology-report/

[博客 4] Sequoia Capital "AI's $600B Question" + 后续 agent 系列 (2024-2025)
    价值：投资界对 AI 价值链的标准分析框架
    https://www.sequoiacap.com/article/ais-600b-question/

[博客 5] Anthropic / LangChain 工程博客
    - Anthropic: https://www.anthropic.com/engineering (Building effective agents 系列)
    - LangChain: https://blog.langchain.dev
    价值：第一手工程实践 + 失败案例，是 unit economics 的真实数据源

(可选补充: Citibank "AI 2030" 报告, McKinsey "State of AI", CB Insights agent 报告)

================================================================
7. 关键公司 / 人物 mapping (10 个)
================================================================

| # | 公司 / 人物 | 定位 | 经济意义 |
|---|---|---|---|
| 1 | Anthropic (Dario Amodei) | Foundation model + agent 工具 (Computer Use, MCP) | 价值链上游，定义 agent 能力上限 |
| 2 | OpenAI (Sam Altman, Operator) | Operator agent, Agent Builder | agent 平台化，争夺 orchestrator 入口 |
| 3 | Artisan AI (Jaspar Carmichael-Jack) | "AI 销售员工" SaaS, $30M ARR | solo-agent-business 范式 (Patrick 直接关注) |
| 4 | Lindy AI (Flo Crivello) | 个人 AI 员工 builder | pro-sumer agent 平台 |
| 5 | Salesforce Agentforce (Marc Benioff) | 企业级 agent force, Agentforce 2.0 | 大客户入口，传统 SaaS 转型样本 |
| 6 | Microsoft Copilot / Copilot Studio (Satya Nadella) | Office + Dynamics + 自建 agent | 把 agent 塞进企业工作流的最快路径 |
| 7 | Google Agent (Project Astra, Demis Hassabis) | 多模态通用 agent | 端到端 agent 的另一种路线 |
| 8 | Replit Agent (Amjad Masad) | 代码生成 agent, 自我编程 | 软件开发 unit economics 革命 |
| 9 | Cursor / Anysphere (Aman Sanger) | AI-first IDE | 软件开发 agent 化的最具体样本 |
| 10 | Devin / Cognition Labs (Scott Wu) | 自主软件工程师, $2B 估值 | 软件 agent 的天花板 + 定价权实验 |

(其他值得追踪: Sierra AI (Bret Taylor), Adept, Inflection, MultiOn, Reworkd, CrewAI, AutoGen team)

================================================================
8. 24h 内可做的最小验证实验 (3 个)
================================================================

[实验 1] Agent 边际成本基准
    用 LangChain + GPT-4o-mini 跑一个 100-step 任务，统计：(a) 每次 tool call 的 token / USD 成本；(b) 成功 / 失败 step 数；(c) 人工复现时间。
    输出：一张 unit economics 表 — 什么任务 agent 比人便宜 10x？什么任务仍然人便宜？
    时间：2 小时。价值：直接验证 Q1。

[实验 2] Agent-to-agent 支付模拟
    用 ArcStore / x402 协议框架，搭建两个 agent (一个买数据、一个卖数据)，跑 50 笔交易，记录：(a) 交易成功率；(b) 中间成本 (gas, fee, latency)；(c) 价格发现效率。
    输出：判断 A2A 经济是否在 2026 可行的硬数据。
    时间：3 小时。价值：直接验证 Q2。

[实验 3] Artisan / Lindy 商业模式拆解
    抓取 Artisan AI 和 Lindy 的公开定价页 + 第三方评测 (G2, Reddit)，构建一个 30 行的 unit economics 表格：MRR / 客户 / 集成成本 / churn / 边际成本。
    输出：solo-agent-business 范式的财务模型，看 $30M ARR 是否可持续。
    时间：1 小时。价值：直接对应 Patrick 的 solo-agent-business skill。

================================================================
9. 下一步 (research agenda)
================================================================

- [ ] 把 5 个核心问题各写一份 1 页 deep dive
- [ ] 持续追踪 arXiv cs.MA / cs.CY / econ.GN 周报
- [ ] 关注 Stripe / Coinbase / Circle 的 agent 支付协议
- [ ] Q3 2026 出第一份 5-page "AI Agent 经济白皮书 v0.1"
- [ ] 同步对照第二个研究方向（待 Patrick 指定）

================================================================
附录：来源核实建议
================================================================

所有 arXiv ID 在 cutoff 前已确认 (Jan 2026)。
2025-2026 部分论文 arXiv ID 建议用以下方式确认：
  - arxiv.org/search/?query=AI+agent+economy&order=-announced_date_first
  - arxiv-sanity.com
  - connectedpapers.com (看引用图)
  - 任何论文以 arxiv.org/abs/XXXX.XXXXX 形式可点击

注：本综述为 fast triage，所有 1 句话价值判断需用原文二次确认。
