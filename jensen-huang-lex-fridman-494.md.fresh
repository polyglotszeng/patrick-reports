---
title: "Jensen Huang: NVIDIA - The $4 Trillion Company & the AI Revolution | Lex Fridman Podcast #494"
type: video
source: https://www.youtube.com/watch?v=vif8NQcjVf0
date: 2026-06-13
duration: 2:25:51
views: 1211621
likes: 25329
channel: Lex Fridman
tags:
  - nvidia
  - jensen-huang
  - ai-compute
  - extreme-co-design
  - leadership
  - lex-fridman-podcast
related_notes:
  - llm-wiki/knowledge/nvidia-deep-dive
  - llm-wiki/knowledge/ai-compute-economics
---

# Jensen Huang: NVIDIA - The $4 Trillion Company & the AI Revolution | Lex Fridman Podcast #494

Source: https://www.youtube.com/watch?v=vif8NQcjVf0
嘉宾: Jensen Huang (NVIDIA CEO) | 主持: Lex Fridman
日期: 2026-06-13 | 时长: 2:25:51

---

## Key Takeaways

1. **Extreme Co-Design 是"问题超出单机"之后的必然结果**: "The problem no longer fits inside one computer to be accelerated by one GPU." (1:24) 当 10,000 台机器只换来线性扩展时,必须把算法拆分、shard pipeline、shard data、shard model — Amdahl's Law 决定了你没法只优化单点。

2. **60 人 direct staff, 不做 1-on-1, 整个公司一张白板**: "My direct staff is 60 people. ... no conversation is ever one person. ... We present a problem and all of us attack it." (5:36) 所有 architect / memory / CPU / optics / 算法专家同时听, 谁能 tune in 谁 tune out, 因为讨论任何一环都会影响所有层。

3. **CUDA-on-GeForce 是 NVIDIA 历史上最接近"existential threat" 的决策**: "completely consumed all of the company's gross profit dollars." (14:25) 公司从约 $8B 市值跌到 $1.5B 撑了 10 年, 才把 CUDA 变成计算平台。Jensen 总结: "NVIDIA is the house that GeForce built."

4. **信仰系统 (belief system) 是 CEO 的核心产品**: 在重大决定前, Jensen 用 2-3 年持续"lay down bricks" 给员工 / 董事会 / 供应链 / 客户, 等宣布那天大家反应是 "What took you so long?" (19:24) — Groq/agentic 架构 2.5 年前 GTC keynote 就已经画过。

5. **四条 Scaling Laws, 计算是唯一瓶颈**: ① Pre-training ② Post-training (synthetic data + RLHF) ③ Test-time / inference (thinking, planning, search) ④ Agentic (multiply AI, 派 sub-agents). 闭合循环: agent 生成 experience → 筛选回 pre-training. "Intelligence is gonna scale by one thing, and that's compute." (28:41)

6. **Hardware 必须"先于"算法 2-3 年预判**: "AI model architectures are being invented about once every six months. System architectures ... every three years." (29:14) — NVLink 72 (从 8 升到 72) 就是在 MoE 出现前就押注, 让 4T-10T 参数模型"装在一个 computing domain 里跑".

7. **Vera Rubin Pod 数字 (Jensen 口中, 真实)**: 7 chip types / 5 purpose-built rack types / 40 racks / 1.2 quadrillion transistors / ~20,000 NVIDIA dies / 1,100+ Rubin GPUs / 60 exaflops / 10 PB/s scale-out bandwidth. NVL 72 单 rack: 1.3M components, 1,300 chips. "We're probably gonna have to crank out about 200 of these pods a week." (1:00:23)

8. **Install base > 技术, 是 NVIDIA 第一 moat**: "Our single most important property as a company is the install base of our computing platform." (1:15:27) "It wasn't three people that made CUDA successful. It was 43,000 people." (1:16:14) — 几百万开发者 + 几十年承诺 + 信任 = 不可替代. 即便出现 "GUDA / TUDA" 也无所谓.

9. **Coding 人口从 30M 扩到 1B, 程序员不会被取代**: "What is the definition of coding? ... specification. ... How many people could do that? ... we just went from 30 million to probably 1 billion." (2:02:16) 目的 (purpose) 和任务 (task) 不是一回事 — radiologists 在 CV superhuman 之后反而增加了.

10. **Reasoning in public, 而不是 vision-from-mountaintop**: Jensen 不写 manifesto, 也不宣布 dramatic pivot, 而是 "continuously reason about everything in front of my team" (2:19:13) — 让别人能 intercept reasoning steps, 而不是只看见 outcome. 这是他维持 humility 的方法.

11. **能源解法: 利用电网 99% 时间 idle 的 60% 峰值容量**: "99% of the time we're nowhere near the worst case condition. ... during that time, we either have a backup generator ... or we just have our computers shift the workload somewhere else, or we have the computers just run slower." (47:54) 三方博弈: 客户接受 graceful degradation, 工程师造可降级系统, 电力公司提供分级合同.

12. **对死亡的应对 = 不做 succession planning, 而是"持续 transfer knowledge"**: "Every single meeting is about a reasoning meeting. ... Nothing I learn ever sits on my desk longer than a fraction of a second." (2:19:16) — 希望 die on the job instantaneously, 因为持续 raising everyone around 才是 anti-fragile succession.

---

## Section-by-Section Summary

### Ch.1 — Extreme Co-Design 起源 (0:00-15:00)
- 单 GPU 加速解决不了 10,000 台机器只换线性扩展, 必须把算法、pipeline、data、model 全部 shard (1:24) — Amdahl's Law 给出硬约束, 计算 / 网络 / 切换 / 调度全是问题.
- 整个 stack 从 architecture 到 application 必须联合优化: chips, systems, system software, algorithms, applications, plus power, cooling, networking, switches (3:55).
- "Speed of light" 是 Jensen 30 年前开始的方法论: 每个指标都跟物理极限对比 — latency / throughput / cost / time / effort / headcount (56:43).
- "Complexity as necessary, but as simple as possible" (1:00:39) — 简单性是 metrics, 不是美学.
- 1.3M components / NVL 72 rack, 200 pods/week 是 supply chain 倒推出来的节奏 (1:00:23).

### Ch.2 — CUDA & GeForce 战略, 信仰系统的塑造 (15:00-30:00)
- CUDA 之前花了 10 年 — programmable pixel shader → FP32 → Cg → CUDA on GeForce (8:23).
- 决定把 CUDA 装到每台 PC "whether customers use it or not" (13:33), 因为 install base = 唯一重要. RISC 架构完美却失败, x86 不优雅却胜出, 都是 install base 决定.
- 那 10 年公司从 ~$8B → $1.5B 市值, "35% gross margin company" 吃下 50% cost increase (14:50).
- Jensen 不做 1-on-1, 把 60 人放一屋, 用"持续 laying down bricks" 2-3 年来 shape belief system — "On the day I say 'let's buy Mellanox' or 'let's go all in on deep learning,' it's completely obvious" (19:39).
- 没人会被 surprise 一次, 每次大决策是 "What took you so long?" 时刻.

### Ch.3 — 四个 Scaling Laws (30:00-50:00)
- Pre-training: 数据不够是 Ilya 当时判断, 但 synthetic data 让"数据被 compute 限制", 限制反过来了 (24:08).
- Test-time / inference: "Inference is thinking. ... Thinking is way harder than reading." (25:53) — 推理芯片不是小芯片, 是 NVIDIA 全栈 (25:30).
- Agentic: "We're now creating large teams. ... It's so much easier to scale NVIDIA by hiring more employees than it is to scale myself." (27:36) — Agent 数量可以瞬时膨胀.
- 闭环: agent experience → 筛选 → pre-training → post-training → test-time → agent (28:32).
- 预判 MoE 之前 2-3 年就推 NVLink 72 (从 8 跳到), 让 4T-10T 参数模型"装在一个 GPU domain" (30:57). Vera Rubin rack 设计完, 一年后才看到 Claude Code / Codex / OpenClaw — "You just reason about it" (32:34).

### Ch.4 — 能源 / 电力瓶颈 (50:00-1:05:00)
- Power 是 Jensen 公开承认的 concern, 但通过 extreme co-design 把 tokens/sec/watt 每年提一个数量级 (37:50) — "Moore's Law would have progressed computing about 100 times in the last 10 years. We progressed ... a million times."
- Token 成本每年降一个数量级, 抵消 GPU 单价上升 (38:55).
- 电网设计为 worst case + margin, 99% 时间在 60% 峰值运行 — 那 40% 容量是 idle, 完全可以做合同让 data center 接管 (47:54).
- 三方: 客户接受 graceful degradation, data center 可降级, 电力公司提供分级 deliver promise (50:00-52:36).
- 上游 ASML / TSMC CoWoS / SK Hynix HBM 都在"我和他们分别谈过 + 他们答应了" 的状态下, "I told 'em what I needed. They told me what they're gonna go do, and I believe them" (47:18).

### Ch.5 — 供应链 / 制造哲学 / Speed of Light (1:05:00-1:20:00)
- 2 年前说服 DRAM CEO 押注 HBM (当时几乎只用于超算) → 让他们 capex 几十亿美元 (41:30). LPDDR5 (手机 memory) 同样故事 → "Cell phone memory for supercomputers?" (42:11) 听完也信了. 3 家都是 45 年老厂, 全部 record year.
- NVLink-72 把 supercomputer 集成从"data center 内部"前移到"supply chain 制造" — 1 rack 2-3 吨, 不能再到现场组装 (45:28). 这让 supply chain 必须有 gigawatt-level 制造 + 测试能力.
- Memphis Colossus (xAI, 200K GPUs, 4 个月): Elon "minimalist systems thinker" (53:49) — 现场 present, 问每个"does it have to take this long?", 让每个 supplier 把 NVIDIA 当 top priority.
- Speed of light 方法: "explain to me why 74 days in the first place. ... Oftentimes, you'd be surprised. It might come to six days." (58:50) — continuous improvement 是 74→72, first principles 是 74→6.

### Ch.6 — Vera Rubin Pod & China 创新生态 (1:20:00-1:35:00)
- Pod 复杂度数字 (见 Takeaway 7), Jensen 重点是 "as complex as necessary, but as simple as possible" (1:00:39).
- China 分析 — 三因素: ① 50% 全球 AI 研究员是中国籍 (1:02:16) ② 省/市级政府互相竞争 → 内部 insane competition → emerge incredible ③ "family first, friends second, company third" → 朋友同学互通 + open source 是 natural (1:03:42). "Fastest innovating country in the world today" (1:04:44).
- Nemotron 3 Super (120B 参数, open weight MoE, 用在 Perplexity): 三个动机 ① co-design 内部可见性 (transformer + SSM, 不是纯 transformer) (1:06:38) ② 让每个行业接入 AI 革命 (proprietary 让研究困难) ③ AI 不只是 language, 还有 biology / physics / chemistry / weather — "We don't build cars, but we wanna make sure every car company has access to great models" (1:09:07).

### Ch.7 — TSMC & NVIDIA Moat (1:35:00-1:50:00)
- TSMC 不只是 transistor, 是 orchestration — "the dynamics of the world's complexity" (1:11:34). 同时 technology-focused + customer service-oriented (1:12:14). 第三个是 trust: "Three decades, ... hundreds of billions of dollars of business ... we don't have a contract." (1:13:09) Morris Chang 2013 曾 offer Jensen TSMC CEO — "I already had a job" (1:13:30).
- Moat 第一: install base (CUDA 本身 + 几百万开发者 + 43K NVIDIA 员工). 不可替代因为: "I trust 100% that NVIDIA is going to keep CUDA around ... You could take that to the bank, and that last part, trust" (1:17:50).
- Moat 第二: ecosystem — vertical integrate complexity, horizontal integrate to every industry (1:18:25). 汽车 / 卫星 / 太空 / edge / radio base stations / supercomputers at Lilly — 一个 architecture 跑遍所有.
- 单元进化: GPU → computer → cluster → AI factory (1:19:20). "Picking up the chip is kind of still adorable. ... My mental model is this giant gigawatt thing" (1:19:45).

### Ch.8 — DLSS 5, Doom/Virtua Fighter, AGI Timeline (1:50:00-2:00:00)
- DLSS 5 争议: 玩家担心 "AI slop", Jensen 解释是 "3D conditioned, 3D guided" — geometry + textures + artistry 由艺术家定, AI 只 enhance 不改, 并允许艺术家 train 自己 style model (1:50:24). "It's just yet another tool."
- Greatest game: Doom (文化 + 行业拐点) / Virtua Fighter (技术拐点) (1:53:20).
- AGI: "I think it's now." (1:56:35) — 一个 Claw 写 web service, 被几 billion 人用 50 cents, 短期出现又消失, 这种"internet era 2.0" 已经在发生. "100,000 of those agents, building NVIDIA is zero percent" (1:58:28).
- Radiology 类比: CV 2019-2020 superhuman, 放射科医生反而短缺 — 任务 ≠ 目的, purpose 不变时 automation 反而扩招.

### Ch.9 — Coding 未来, 工作焦虑, AI 教育 (2:00:00-2:15:00)
- Coding 定义: "specification, and maybe if you want to be rather directive, you could even give it an architecture" (2:01:52). Programmer 数量从 30M 扩到 1B (2:02:18).
- Specification 的 artistry: Jensen 自己给公司 strategy 时 "under specify it on purpose, so that 43,000 amazing people make it even better than I imagined" (2:04:23). 未来 coding 是在 prescriptive ↔ exploratory 光谱上选位置.
- 工作焦虑: 拆成"能做的" / "不能做的", 对"能做的"马上 reason + act; 对"不能做的"立即接受 (2:06:55).
- 给大学毕业生建议: "be expert in using AI" — 同样适用于 accountant, marketing, supply chain, 律师, 木匠, 农民 (2:07:55). AI 是 metacircular teacher, "you can't walk up to Excel and say 'I don't know how to use Excel.' You're done" (2:10:01).

### Ch.10 — 意识, 死亡, 人性, 未来希望 (2:15:00-2:25:51)
- "I don't know if the chip will ever get nervous." (2:11:18) — 同样 input, 两个 computer 会给 statistical different outcomes, 但 "it's not because it felt different" (2:12:21). 主观体验, Jensen 不 over-claim.
- "Intelligence is a commodity" — Jensen 60 个 direct report 每个都"superhuman" 在自己领域, "somehow I'm sitting in the middle orchestrating all 60 of 'em" (2:14:55). Intelligence 是 functional word, humanity 是 different word — 未来 elevated 的应该是 character, compassion, generosity, tolerance for pain, determination (2:15:39).
- 死亡: "I really don't wanna die. ... This is a once in a humanity experience" (2:17:42). 不做 succession planning, 反而更激进地 share knowledge — "Every moment ... is about passing on knowledge to people as fast as I can. ... I die on the job instantaneously" (2:19:24).
- 未来希望: "the end of disease ... pollution drastically reduced ... traveling at the speed of light ... my humanoid on a spaceship" (2:22:54). "How can you not be romantic about that?"
- 收尾 Alan Kay: "The best way to predict the future is to invent it." (2:25:46)

---

## Key Quotes

- "The problem no longer fits inside one computer to be accelerated by one GPU." (1:24) — 解释 extreme co-design 的根本原因, 单机优化已死, 分布式问题才是本世代.
- "My direct staff is 60 people. ... no conversation is ever one person. ... We present a problem and all of us attack it." (5:36) — 60 人不是 1-on-1 文化, 是 cross-discipline 攻击同一问题.
- "NVIDIA is the house that GeForce built, because it was GeForce that took CUDA out to everybody." (15:05) — 用 GeForce 玩家装机文化 + 大学 lab 装 cluster 的反直觉路径, 把 CUDA 变成 install base.
- "It wasn't three people that made CUDA successful. It was 43,000 people." (1:16:14) — 反驳 "技术靠天才" 神话, 强调组织 + 时间 + 承诺.
- "Inference is thinking. ... Thinking is way harder than reading." (25:53) — 反驳"inference 芯片会 commoditize" 的市场共识, 4 年后被验证.
- "The best way to predict the future is to invent it." (2:25:46) — Alan Kay 引用, 整场访谈的精神主轴.
- "Intelligence is a commodity. Humanity is not." (2:15:53) — Jensen 反复强调: 当机器变聪明, 人要被 elevate 的是 character, compassion, endurance.

---

## Discussion Questions

1. **Co-design 的边界在哪?** 如果一家小公司没有 NVIDIA 这种 60 个 superhuman direct report 的资源, "extreme co-design" 还有可能实现吗? 还是它本质上是 monopoly 优势? 哪些 NVIDIA 的做法 (e.g. 信仰系统塑造) 是不需要 monopoly 也能复制的?
2. **Agentic scaling 是真定律还是营销话术?** Jensen 把它和 pre-training scaling 并列, 但 agent 跟 GPU 不同, agent 是软件, 可以开源 + 复制 — 这次 NVIDIA 的 moat 在哪一层? 是"agent 需要算力"还是"agent 需要 NVIDIA 算力"?
3. **Coding 人口扩 30 倍, 真的会发生吗?** Jensen 说 30M → 1B, 假设是"specification = coding" 重新定义. 问题是: 如果 specification 写错了, 1B coder 比 30M coder 是否更危险? 治理 / verification 这一层 NVIDIA 不卖, 谁卖?
4. **"Belief system shaping" 是 leadership skill 还是 manipulation?** Jensen 公开说"已经决定的事, 慢慢用 reasoning 说服大家, 等宣布日看起来是 obvious" — 这是 alignment 还是 manufactured consent? 60 人 direct staff 模式下, 这种文化在 43K 员工规模下还能保持吗?
5. **死亡 + 知识转移**: "die on the job instantaneously" 是 Jensen 个人哲学, 但公司层面 — 如果 Jensen 真的明天意外, 没有 succession plan 的 43K 人 + 几十个上游 CEO + 几百个客户, 怎么 absorb 这件事?

---

## 实战映射 (Patrick 视角)

### 1. Extreme Co-Design → Hermes 多 Skill 协同

Jensen 60 人 direct staff 同时听同一问题, "any conversation is one conversation" — 这个模式对 Hermes 的多 skill 架构有直接映射价值. 当前 Hermes 跑 skill 的方式是 sequential 串行 (一个 skill 调完再调下一个), 真正"extreme co-design" 应该是: 用户提一个复杂 query (e.g. "分析 Sora 2 视频生成的 economics + 给我世界模型研究方向的论文 3 篇 + 写代码 prototype"), 多个 skill (research, code, write, summarize) 并发被 dispatch 到同一 query, 看到彼此的 partial output, 互相 critique, 共同 reason. — 这本质上是"60 个 superhuman 在一屋" 的 software analog. 落地: Hermes 当前 `tools/` 下 skill 是独立的, 没有 shared scratchpad, 没有"谁先发言谁后发言"的 awareness. 第一步可以做: 给 Hermes 加一个 `discussion_skill` 编排器, 接受复杂 query 后先 decompose, 同时唤起 2-5 个相关 skill, 把 partial output 灌回共享 memory, 再让一个 verifier skill 整合.

### 2. 60 人 Direct Staff → Patrick 决策风格

Jensen 的反直觉点: 不做 1-on-1, 不写 manifesto, 持续在 60 人面前 reason. Patrick 的研究模式更接近"serial deep work" — 一次看一篇论文, 一次跑一个实验, 没有"60 个研究员同时听我 reason 一个问题" 的 orchestrator 角色. 映射: 不需要真的雇 60 人, 但可以构造一个"6-10 人虚拟 staff" 围绕 Patrick 4 个研究方向 (AI Agent 经济学 / 世界模型 / 个人 AI OS / 量化+AI) — 每个方向 1-2 个 super-expert AI agent (e.g. 一个专门扫 arxiv 经济学, 一个专门跑代码 prototype), Patrick 是中间那个 orchestrator, 用 Hermes session 做 reasoning surface. 这跟 Jensen "I'm the dishwasher in the middle of superhumans" 是同构的. 关键 discipline: 每次 reason 都要让 agent 看到 reasoning steps, 不只是 outcome, 这样 Patrick 能持续被 challenge, 避免 confirmation bias.

### 3. 四条 Scaling Laws → AI Agent 经济学研究

Jensen 的 agentic scaling law ("multiply AI, we could spin off agents as fast as you want to spin off agents") 是 AI Agent 经济学最直接的 thesis: 智能的边际成本正在坍塌, 跟 Jensen 提的"$1 per million tokens" 是同一枚硬币. Patrick 的 4 个研究方向里, "AI Agent 经济学" 跟这个最贴 — 具体可做的研究问题: ① agentic compute 的 supply curve 长什么样 (L40 / H100 / Vera Rubin 各自的 token cost?) ② agent 数量指数增长时, "agent quality" 是 concave 还是 linear? (e.g. 100 个 agent 解 IMO 是不是 1 个的 100 倍?) ③ 谁是 agent economy 的货币发行方 — OpenAI / Anthropic / NVIDIA? ④ 个人 AI OS 里 agent 是 commodity 还是稀缺资源? (跟 Jensen "intelligence is commodity, character isn't" 直接挂钩.)

### 4. Token 工厂 → 量化+AI 的 Unit Economics

Jensen 把 computer 重新定义为"factory" 而不是"warehouse", 因为 generative AI 是 production 不是 retrieval. 这对 Patrick 的"量化+AI" 方向有直接 mapping: 量化策略的 PnL 可以拆成 (signal quality) × (execution cost) × (capital efficiency). 当 AI agent 替代 researcher + junior PM, signal production 变成 factory — 关键问题是"每个 token 出多少 alpha" 的 unit economics, 而不是"信号方向对不对". 具体可做的: 用 NVIDIA Nemotron 3 Super (120B MoE, 开源) 在本地跑 quant research, benchmark 它的 token/sec/$ vs 闭源模型, 验证 Jensen 说的"token cost coming down an order of magnitude every year" — 这是 Patrick 量化策略的 cost-side alpha, 不需要 alpha-side 突破就能拿.

### 5. Coding 1B 化 → 个人 AI OS 的 Specification Artistry

Jensen 说 coding 从 30M → 1B, 因为 specification 才是核心. Patrick 的"个人 AI OS" 方向本质上是: 一个人 + 一套 skill + 一组 agent = 能 orchestrate 出 10x 产出. 这跟 Jensen "I'm the dishwasher in the middle of superhumans" 是 personal 版的 extreme co-design. 关键 takeaway: 个人 OS 的"界面" 不是 chat box, 是 specification canvas — Patrick 要练的不是 prompt engineering, 是 "under specify it on purpose, so that amazing people (这里是 agent) make it even better than I imagined" (2:04:23). 跟 Jensen 44 年管 NVIDIA 的 metacognitive habit 是同一个. 落地: Hermes 可以加一个 `spec_writer` skill, 专门帮 Patrick 把模糊 idea 转成"足够具体可执行, 又故意留空给 agent 发挥" 的 spec — 这是个人 AI OS 真正的 UI.

---

备注: 视频 Jensen Huang 回答全程 public reasoning, 没有 marketing 表演, 适合作为"AI 时代组织设计 + 决策哲学" 第一性参考. 与其配套的资料: ① Lex 之前采访 Satya Nadella, Satya 谈 Microsoft "Learn it all vs Know it all" 文化, 跟 Jensen 的 belief system shaping 是对偶 ② a16z 播客 Marc Andreessen "Why Software Is Eating the World" 跟 Jensen 提的"compute 是新的 electricity" 互补.
