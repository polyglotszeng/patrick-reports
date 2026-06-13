# 世界模型 / 具身智能 — 第 1 次文献综述

日期: 2026-06-09
方向: World Models / Embodied AI / Embodied Agent
定位: 10 年级研究方向启动文献综述(fast triage,不做全文翻译)
筛选框架: 5 必读 + 5 应该读 + 10 知道存在

---

## 0. 三句话定位

- World model 路线 (LeCun JEPA / Dreamer / Genie / Cosmos / V-JEPA):在 latent space 学一个可预测、可规划的世界动力学,核心是"predict next state in representation space, not pixels"。
- Embodied agent 路线 (RT-2 / PaLM-E / π0 / RDT / Open X-Embodiment / RT-X):把 VLM 当 policy,通过互联网规模预训练 + 机器人数据微调,把语言知识迁移到动作。
- 2025-2026 的收敛信号:两条路线都在"video foundation model + action expert"汇合 (V-JEPA 2 + π0.5、Cosmos + GR00T、Genie 2 + SIMA 2)。

---

## 1. 5 个最值得研究的核心问题

1. Latent prediction vs pixel prediction — 像素级生成是否必要?
   - Ref: LeCun "A Path Towards Autonomous Machine Intelligence" (2022 white paper, 2024-2026 持续演讲更新)
   - Ref: V-JEPA 2 (Meta, 2025)

2. 如何从 observation 涌现 actionable world model? 即世界模型是否必须 explicit 3D / physical,还是 implicit latent 就够给 policy 用?
   - Ref: GAIA-1 (Wayve, 2023) vs Cosmos (NVIDIA, 2025) vs DreamerV3 (DeepMind, 2024)

3. 通用机器人 foundation model 是否存在?数据 / 架构 / 训练范式三选一哪个先突破?
   - Ref: Open X-Embodiment (DeepMind, 2023) / π0 (Physical Intelligence, 2024) / RDT-1B (清华, 2024) / π0.5 (2025)

4. VLM → VLA 的 transfer 效率:语言/视觉预训练到底带多少 inductive bias 过来?
   - Ref: RT-2 (Google DeepMind, 2023) / PaLM-E (Google, 2023) / OpenVLA (2024)

5. 评估与数据飞轮:sim-to-real、real-to-sim-to-real、Open X-Embodiment 这类共享数据集能否形成 community standard?
   - Ref: Open X-Embodiment / RT-X / DROID / Bridge Data

---

## 2. 5 篇必读 (Foundational)

| # | 论文 | arXiv / URL | 一句话价值 |
|---|------|------------|------------|
| 1 | World Models (Ha & Schmidhuber, 2018) | arXiv:1803.10122 | VAE+RNN latent dynamics 鼻祖,Dreamer 直接祖先 |
| 2 | Dream to Act: Model-Based Planning (Dreamer, Hafner 2020) | arXiv:1912.01603 | latent imagination + policy learning 范式定型 |
| 3 | V-JEPA: Revisiting Feature Prediction (Meta, 2024) | arXiv:2404.08471 | 视频 JEPA,LeCun 路线首个大规模验证,非生成式 |
| 4 | RT-2: Vision-Language-Action Models (DeepMind, 2023) | arXiv:2307.15818 | VLM 直接出 action token,VLA 范式起点 |
| 5 | Open X-Embodiment: Robotic Learning Datasets (DeepMind + 21 labs, 2023) | arXiv:2310.08864 | 22 个机构共享数据集,RT-X 训练,具身 GPT-3 时刻 |

---

## 3. 5 篇应该读 (Important context)

| # | 论文 | arXiv / URL | 一句话价值 |
|---|------|------------|------------|
| 1 | PaLM-E: Embodied Multimodal LLM (Google, 2023) | arXiv:2303.03378 | 7B/562B embodied multimodal,把 VLM 注入机器人 |
| 2 | DreamerV3 (Hafner, 2024) | arXiv:2301.04104 | 单一超参搞定 Minecraft/机器人/围棋,规模化重要里程碑 |
| 3 | Sora Technical Report (OpenAI, 2024) | openai.com/sora | 视频 foundation model 作为世界模拟器的最强商业 demo |
| 4 | LeCun JEPA 系列 talk & paper (Meta FAIR, 2023-2024) | ai.meta.com/jepa | LeCun 对 autoregressive/生成路线的系统反驳,必读框架 |
| 5 | GAIA-1: Generative World Model for Driving (Wayve, 2023) | arXiv:2309.17080 | 真实驾驶视频 + action-conditioned world model 范式 |

---

## 4. 10 篇知道存在 (Awareness list)

| # | 论文 | arXiv / URL | 一句话价值 |
|---|------|------------|------------|
| 1 | Genie 2: Large-Scale Foundation World Model (DeepMind, 2024) | deepmind.google/genie-2 | 文本→可交互 3D 环境,具身 agent 训练场 |
| 2 | V-JEPA 2 (Meta, 2025) | arXiv:2506.09985 | 1.2B 参数 video JEPA,zero-shot robot control |
| 3 | NVIDIA Cosmos (2025) | research.nvidia.com/cosmos | World Foundation Model 平台,合成数据飞轮 |
| 4 | π0 / π0.5 (Physical Intelligence, 2024-2025) | physicalintelligence.company | Flow matching VLA,通用机器人 foundation model 候选 |
| 5 | RDT-1B (清华 & BAAI, 2024) | arXiv:2410.07864 | 1.2B 机器人 diffusion transformer,双臂任务 SOTA |
| 6 | OpenVLA (2024) | arXiv:2406.09246 | 7B 开源 VLA,Prismatic VLM backbone |
| 7 | SIMA 2 (DeepMind, 2025) | deepmind.google/sima-2 | Genie 2 训练的通用 3D embodied agent |
| 8 | GR00T (NVIDIA, 2024-2025) | research.nvidia.com/gr00t | Humanoid foundation model,Cosmos 数据流 |
| 9 | Survey: A Survey on World Models (2024) | arXiv:2411.01399 | 综述,快速建立全景图 |
| 10 | Survey: Embodied AI Survey (2024-2025) | arXiv:2404.16019 | 具身智能综述,涵盖 simulator/benchmark/agent |

---

## 5. 5 个必读博客 / 报告 / 视频

1. Yann LeCun — "Objective-Driven AI" / JEPA talks (2023-2025, 多场)
   - 来源: ai.meta.com / facebookresearch/yann-lecun-universite-de-psl-2024
   - 价值: 整套 world model vs LLM 的方法论 + 路线图

2. World Labs — Fei-Fei Li 创始博客 & demo
   - 来源: worldlabs.ai
   - 价值: 3D 世界生成的产品化视角,Radiance Field 类范式

3. DeepMind — RT-2 / Open X-Embodiment / Genie 2 / SIMA 2 系列博客
   - 来源: deepmind.google/discover/blog
   - 价值: 一年内最完整的一条 embodied AI 演进线

4. Physical Intelligence — π0 / π0.5 官方主页
   - 来源: physicalintelligence.company/blog
   - 价值: 通用机器人 foundation model 的工程现实,数据/算力规模

5. NVIDIA — Cosmos / GR00T 开发者日视频 (GTC 2025)
   - 来源: nvidia.com/gtc
   - 价值: 合成数据 + world model 平台最全栈,行业基础设施视角

---

## 6. 关键公司 / 人物 mapping (10)

| # | 实体 | 关键人物 | 核心定位 / 必看产物 |
|---|------|----------|---------------------|
| 1 | World Labs | Fei-Fei Li (co-founder), Justin Johnson, Christoph Lassner, Ben Mildenhall | 3D 世界生成,Luma→Gaussian Splatting 一脉的下一站 |
| 2 | Covariant | Pieter Abbeel (co-founder), Peter Chen | 工业机器人基础模型,RFM-1,Bay Area 路线代表 |
| 3 | Physical Intelligence | Sergey Levine (co-founder), Karol Hausman, Lachy Groom | π0 / π0.5,通用机器人 foundation model,前 Stanford/Google DeepMind |
| 4 | Figure AI | Brett Adcock (founder), Jerry Pratt (CTO) | 通用 humanoid,Helix VLA model,BMW 工厂部署 |
| 5 | 1X Technologies | Bernt Børnich (CEO) | NEO humanoid,OpenAI 投资,家庭服务场景 |
| 6 | Boston Dynamics | Robert Playter (CEO), Scott Kuindersma | Atlas + Spot,MIT/TRUST 背景,Atlas LBM 模型 |
| 7 | Tesla Optimus | Elon Musk, Milan Kovac | 量产路线,Dojo 算力,工厂数据闭环 |
| 8 | Skild AI | Deepak Pathak (CEO), Abhinav Gupta | Carnegie Mellon 出身,brain-inspired 通用机器人模型 |
| 9 | Genesis (open source) | Zhou Xian (Stanford PhD), Carlos Esteban Garcia | 物理仿真 + 生成式数据,机器人 sim2real 平台 |
| 10 | Sora Team (OpenAI) | Tim Brooks, Bill Peebles, Aditya Ramesh | 文→视频 world model,后续 Sora 2 + 世界模拟器路线 |

---

## 7. 3 个 24h 内可做的最小验证实验

### 7.1 V-JEPA 2 零样本 robot control 复现
- 工具: Meta V-JEPA 2 开源 checkpoint (arXiv:2506.09985)
- 实验: 在公开视频上跑 zero-shot action probe,验证 video representation 是否真的 carry affordance
- 产出: 1 页对比表 (V-JEPA 2 vs CLIP vs DINOv2 probe accuracy)
- 时间: 4 小时,1 张 A100 即可

### 7.2 Cosmos world model + 合成数据训练小 VLA
- 工具: NVIDIA Cosmos WFM + GR00T N1 开源
- 实验: 抓取任务,只用 Cosmos 生成的合成数据训 OpenVLA-7B,vs 真实数据 baseline
- 产出: success rate 曲线 + 失败 case video
- 时间: 8-12 小时 (含数据生成),需要 H100

### 7.3 π0 / OpenVLA + 自有 hand-task 试玩
- 工具: OpenVLA-7B (arXiv:2406.09246) + LeRobot 库
- 实验: 在自有 web-cam + 简单抓方块任务上 fine-tune,端到端跑通 "VLA fine-tune → deploy → eval" 全流程
- 产出: 1 段 demo 视频 + 训练 loss 曲线
- 时间: 24h 内,单 GPU + 一个简易 gripper 即可

---

## 8. 关键术语速查 (首次出现时记录)

- WFM = World Foundation Model
- VLA = Vision-Language-Action model
- VLM = Vision-Language Model
- JEPA = Joint Embedding Predictive Architecture
- V-JEPA = Video JEPA
- sim2real = simulation to reality transfer
- DAgger = Dataset Aggregation (imitation learning)
- RT-X = Open X-Embodiment 联合训练的模型族

---

## 9. 下一步行动

- [ ] 24h 内: 跑通实验 7.3 (OpenVLA fine-tune)
- [ ] 1 周内: 精读 5 篇必读 + LeCun 全部 JEPA talks
- [ ] 2 周内: 跟读 Genie 2 / Cosmos / V-JEPA 2 代码,准备第一次 internal share
- [ ] 1 个月内: 选 1 个核心问题立项 (建议 #3 通用机器人 FM,数据飞轮最可执行)

---

*本文件为 fast triage,所有论文一句话价值不构成完整论文分析,精读时再回填。*
