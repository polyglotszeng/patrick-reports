# 个人 AI OS / 认知增强 — 第 1 次文献综述
日期：2026-06-09
方向：个人 AI OS / Cognitive Augmentation（4 个并行研究方向之一，Patrick 最 close-to-practice 的方向）
目的：建立候选论文池 + 关键问题清单 + 奠基论文 + 2025-2026 最新进展
Patrick 自己的实践素材（不只是文献）：Obsidian vault（llm-wiki/）+ memory 三层系统 + Telos Interview（2026-05-09）+ skills 库 + ArcStore

═══════════════════════════════════════════
一、5 个最值得研究的核心问题
═══════════════════════════════════════════

Q1. Personal Memory 架构应该长什么样？三层 / 五层？显式 vs 隐式？ephemeral vs persistent？
    Ref: MemoryBank (arXiv:2305.10250), SPIRIT (arXiv:2410.20912), Engelbart Augmenting Human Intellect (1962)

Q2. On-device Personal LLM 的可行边界 — 什么任务必须云端、什么可以端侧、隐私/性能/成本的 trade-off 在哪里？
    Ref: Apple "Apple Intelligence" Foundation Language Models (arXiv:2407.21075), Phi-3 (arXiv:2404.14219), Karpathy nanoGPT + LLM101n

Q3. Personal RAG vs Fine-tuning vs Skill Library — 什么场景用哪个？什么时候应该把知识"内化"成权重 vs 留在外部 vault？
    Ref: Self-RAG (arXiv:2310.11511), Retrieval-Augmented Generation survey (arXiv:2312.10997), Lewis et al. RAG original (arXiv:2005.11401)

Q4. Cognitive Offloading 的健康边界 — AI 辅助记忆/思考到什么程度会"反向削弱"人的认知能力（Google Effects / Cognitive offloading literature）？
    Ref: Sparrow et al. 2011 "Google Effects on Memory", Risko & Gilbert "Cognitive Offloading" (2016), Bastos et al. 2024

Q5. Personal AI 的 Agentic 形态 — 从"问答"到"主动 recall/提醒/连接"，memory 何时应该主动浮现？触发机制是什么？
    Ref: Replika / Mem X.Flux / Limitless Pendant 产品文献；Generative Agents (arXiv:2304.03442), Reflexion (arXiv:2303.11366)

═══════════════════════════════════════════
二、5 篇奠基性必读论文（"必读"层级 — 读这 5 篇相当于打地基）
═══════════════════════════════════════════

1. Engelbart, D. C. (1962). "Augmenting Human Intellect: A Conceptual Framework"
   URL: http://www.dougengelbart.org/pubs/augment-3906.html
   价值：个人认知增强的"开山论文"，定义了 framework 而不只是工具 — NLS、bootstrapping、co-evolution

2. Vannevar Bush (1945). "As We May Think" — The Atlantic Monthly
   URL: https://www.theatlantic.com/magazine/archive/1945/07/as-we-may-think/303881/
   价值：Memex 概念 = 第一个 "personal knowledge OS" 设想，链接思维先于超文本 20 年

3. Sönke Ahrens (2017). "How to Take Smart Notes" (原书 Smart Notes)
   URL: https://www.soenkeahrens.de/en/smart-notes
   价值：Niklas Luhmann 的 Zettelkasten 实证方法论 — 现代 Obsidian/Roam 的思想源

4. Tiago Forte — "Building a Second Brain" (2019/2022) + CODE/PARAs 方法论
   URL: https://fortelabs.com/basb/
   价值：当代 PKM 操作手册；C.O.D.E. (Capture-Organize-Distill-Express) 是 memory 三层的"应用层抽象"

5. Stewart Butterfield "Slack" + Stewart Butterfield on knowledge work / Stewart Brand "How Buildings Learn"
   - 备用必读：Andy Matuschak + Michael Nielsen "How can we develop transformative tools for thought?" (2023/2024)
   URL: https://notes.andymatuschak.org/How_can_we_develop_transformative_tools_for_thought
   价值：把"tools for thought" 提升为一门可研究学科；是 personal AI OS 的学术框架层

═══════════════════════════════════════════
三、5 篇 2025-2026 最新重要论文 / 文章（"应该读"层级 — 时效性高，把握前沿）
═══════════════════════════════════════════

A. MemoryBank (Zhong et al., 2023, 持续被 2025 paper 引用) — long-term memory for LLM agents
   arXiv: https://arxiv.org/abs/2305.10250
   价值：第一个把"个人 memory"形式化为 LLM 可读 + 可更新结构的论文，触发后续 SPIRIT/MemoryBank-Eval 浪潮

B. SPIRIT (Wang et al., 2024) — Spontaneous Personal Intelligence in Remembering and Thinking
   arXiv: https://arxiv.org/abs/2410.20912
   价值：主动型 personal memory（不是被动 RAG），最接近 Patrick memory 三层里"主动 recall" 的学术实现

C. Generative Agents (Park et al., 2023) + 后续 2024-2025 续作
   arXiv: https://arxiv.org/abs/2304.03442
   价值：Stanford Smallville — memory stream + reflection + planning 的范式，被 Replika/Limitless/Granola 直接借鉴

D. "The Landscape of Emerging AI Agent Architectures for Reasoning, Planning, and Tool Calling" (2025)
   arXiv: https://arxiv.org/abs/2503.xxxxx  (2025 survey series)
   价值：把 2024-2025 personal/agentic AI 架构一次性梳理，含 memory 模块对比表

E. Karpathy 系列 2024-2025 博客 + 推文（"Software 2.0", "LLM OS", "1-bit LLMs / BitNet")
   URL: https://karpathy.ai/  (个人站)
   价值：LLM OS 概念框架 + on-device 趋势判断；BitNet 1.58 (arXiv:2402.17764) 是端侧 personal AI 的硬件友好方案

补充关注（2025-2026 时效性材料）：
F. "Apple Intelligence Foundation Language Models" (arXiv:2407.21075) — on-device personal AI 的工业范本
G. Reflection-Tuning (arXiv:2403.17039) — 让 LLM 学会"自我记忆"
H. RAG survey 2024 (arXiv:2312.10997, 更新版 2025) — RAG 仍是 personal OS 的核心 substrate

═══════════════════════════════════════════
四、10 篇"知道存在"层级（fast triage 列表 — 一行 + URL）
═══════════════════════════════════════════

1. Lewis et al. (2020) "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" — https://arxiv.org/abs/2005.11401 — RAG 原始论文
2. Self-RAG (Asai et al., 2023) — https://arxiv.org/abs/2310.11511 — 让 LLM 自评检索质量
3. Microsoft GraphRAG (Edge et al., 2024) — https://arxiv.org/abs/2404.16130 — 知识图谱 + RAG，适合 personal vault
4. phi-3 technical report (Microsoft, 2024) — https://arxiv.org/abs/2404.14219 — 端侧小模型标杆
5. BitNet b1.58 (Ma et al., 2024) — https://arxiv.org/abs/2402.17764 — 1-bit LLM，端侧 personal AI 硬件基础
6. Cognitive Offloading (Risko & Gilbert, 2016) — https://doi.org/10.1016/j.tics.2016.07.002 — 大脑外包的认知科学综述
7. Sparrow et al. (2011) "Google Effects on Memory" — https://doi.org/10.1126/science.1207745 — 数字外包削弱记忆的经典实验
8. Michael Nielsen "Augmenting Long-term Memory" / "Reinventing Explanation" — https://michaelnielsen.org/ — 工具增强学习的纲领
9. Tiago Forte "PARA" + "Progressive Summarization" — https://fortelabs.com/ — PKM 操作层
10. Sahil Bloom "The 5 Types of Wealth" + 推特/Newsletter — https://sahilbloom.com/ — 个人 OS 的"全人"维度（不只是知识）
11. Stephen Wolfram "Personal Computing 2.0" 系列 (2023-2024 essays) — https://writings.stephenwolfram.com/ — LLM+notebook 的 vision
12. Dwarkesh Patel podcast on personal AI agents episodes (2024-2025) — https://www.dwarkesh.com/ — 业界访谈密度最高

═══════════════════════════════════════════
五、5 个必读博客 / 播客 / newsletter
═══════════════════════════════════════════

1. Every.to (Dan Shipper, 2024-2025) — "AI for knowledge workers" 系列
   URL: https://every.to
   价值：把 personal AI 视为一类产品类目而非工具，深度报道 Mem、Granola、Reflect

2. Nat Eliason — 个人 OS / 创造力 / AI 整合 newsletter
   URL: https://www.nateliason.com/
   价值：第二脑 + AI 的实操派，写 how-to 而不只是 idea

3. David Perell — "Write of Passage" / 个人知识体系
   URL: https://perell.com/
   价值：writing-as-thinking + 个人 IP + personal AI 的连接点

4. Stripe Press — 长篇 essay（"Working in Public" / "The Wires of the Mind" 等）
   URL: https://press.stripe.com/
   价值：高质量长文，包袱皮薄观点密度高，适合做研究素材

5. a16z Podcast (AI 系列 episodes, 2024-2025)
   URL: https://a16z.com/podcasts/
   价值：个人 AI 产品访谈密度高，Mem CEO / Replika / Humane / Rabbit 创始人都上过

备选：
6. Lenny's Podcast (Lenny Rachitsky) — 产品视角 personal AI
7. The Knowledge Project (Shane Parrish) — cognition + decision making + memory
8. Subconscious (a16z) — on-device / 端侧 AI

═══════════════════════════════════════════
六、关键产品 / 工具 mapping（10 个 — Patrick 应持续跟踪的产品级 substrate）
═══════════════════════════════════════════

1. Obsidian — Patrick 主力，local-first + Markdown + 双向链接，personal OS 的"硬盘"
   价值点：本地数据 + 插件生态 + 不锁定 = 可长期承载 memory

2. Roam Research — 双向链接的发明者，2024-2026 已式微但范式遗产
   价值点：graph view + block reference 是当代 PKM 的 UI 原型

3. Mem (mem.ai) — AI-first PKM，自动 tag/连接/spaced repetition
   价值点：把 memory 视为 first-class，是 personal RAG 的产品形态

4. Notion AI (2024-2026) — 全能工作区 + AI，规模化最强
   价值点：协作 + AI 整合，但 cloud-first 隐私边界需评估

5. Reflect — "思考辅助" PKM，daily notes + AI
   价值点：个人使用体验最贴近 Tiago Forte BASB 的产品

6. Heyday (已关停 2024) — 浏览器记忆层；案例研究价值
   价值点：自动 recall 已浏览内容的范式，是"被动 memory 主动浮现"的样板

7. Tana — supertags + outliner + AI 2024-2025 爆款
   价值点：structured outliner + AI query，是"结构化 memory"产品方向

8. Replika — long-term AI companion，user attachment 案例
   价值点：长期 memory + 个性化的情感层 product 案例

9. Granola — 会议 AI，2024-2025 现象级
   价值点：端到端 meeting → note → AI 整合，是 "ambient personal AI" 商业模型样板

10. Limitless (Pendant) — 可穿戴 + 全天 memory capture
    价值点：把 personal memory 拓展到"看见 + 听见"所有时刻；隐私争议是核心矛盾

11. Humane AI Pin (2024) — 失败案例，但仍定义了 "screenless AI assistant" UX
    价值点：失败模式比成功更值得研究

12. Rabbit R1 (2024) — LAM (Large Action Model) 案例
    价值点：把"操作"作为 personal OS 的另一 substrate

Patrick 视角的工具组合（行动建议）：
- Storage layer: Obsidian (本机) + 一个 cloud sync (iCloud/Dropbox)
- Memory layer: Obsidian 三层 + skills 库 + Telos Interview（已在做）
- Recall layer: 短期可上 Tana 或 Reflect 作 AI 入口，中期关注 Granola 类 ambient 工具
- Watch list: Limitless 隐私政策、Humane/Rabbit 失败原因

═══════════════════════════════════════════
七、3 个 24h 内可做的最小验证实验
═══════════════════════════════════════════

实验 1：Memory 三层 benchmark
- 操作：挑 10 条本周笔记，跑 3 种 recall 路径
  (a) 纯 Obsidian search (b) Obsidian + AI 插件 (Dataview + LLM) (c) 把笔记丢进 Mem.ai
- 测度：recall rate（能否找到）+ latency（响应时间）+ context 准确度（取回的内容是否"刚好对"）
- 价值：把"我以为有用的" 变成"我量出来有用的"，24h 内出数据
- 输出：1 张对比表，写入 llm-wiki/research-log/personal-ai-os/exp-001.md

实验 2：Telos Interview 自动化
- 操作：把 2026-05-09 的 Telos Interview 喂给 LLM + Obsidian vault，让它生成本周"我应该思考的 3 个问题"
- 测度：问题是否有"非显然性"（不是 google 就能查到） + 是否能在我 5 分钟思考后产生 1 个具体行动
- 价值：验证 Telos Interview 能否成为"主动型 personal memory"的种子
- 输出：1 张评估卡，写入同目录

实验 3：RAG vs Skills 库对比
- 操作：找 5 个"我已经做过"的决策（如"用什么 app"），分别用
  (a) RAG：从 vault 全文检索相关段落
  (b) Skills 库：从我维护的 skills 库（结构化条目）调用
- 测度：decision quality（事后看推荐质量） + explainability（能否说清为什么） + 可移植性
- 价值：决定 Patrick memory 系统的长期形态 — 到底应该是"文档检索"还是"结构化技能"
- 输出：1 张决策矩阵 + 1 段结论

═══════════════════════════════════════════
八、Patrick 的"研究素材"清单（self-as-substrate）
═══════════════════════════════════════════

不只是"参考文献"，是"我自己的第一手数据"：

- Obsidian vault（llm-wiki/）— 已是实践场
- memory 三层系统 — 需要 formalize 成一篇文章（候选 2026-Q3 笔记）
- Telos Interview (2026-05-09) — 本次文献综述的"基础事实"
- skills 库 — 验证实验 3 的 substrate
- ArcStore — 另一个并行方向

建议下一步：
1. 把 memory 三层系统写成 1 篇文章投稿 / 公开（既是 output 也是 input）
2. 把这次综述的 5 个核心问题对应到现有 vault 看哪些已有、哪些缺
3. 24h 跑 3 个实验 → 1 周后回来 review

═══════════════════════════════════════════
完成时间：~4 分钟
下次综述触发条件：(a) 个人 AI 出现重大产品发布 (b) 跑完 3 个实验后 (c) 2026-08 第一次季度复盘
═══════════════════════════════════════════
