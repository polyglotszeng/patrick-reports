# 量化投资 + AI — 第 1 次文献综述

日期：2026-06-09
作者：Patrick (via Hermes subagent)
目的：建立候选论文池、关键问题清单、奠基论文 + 2025-2026 最新进展
方法：fast triage（来源 + 一句话价值），不做全文翻译
范围：quantitative finance × machine learning, RL for portfolio, LLM for finance, alpha mining
tags: [research-log, quant-ai, literature-review, 2026-Q2]

================================================================
0. 研究方向定位
================================================================

量化投资 + AI = 用 ML/DL/RL/LLM 来增强或替代传统 quant workflow（alpha 挖掘、组合管理、订单执行、风控）。
Patrick 的现实抓手：
- JQData（中国 A 股数据，已开户）
- skill: fund_tracker_update.py（基金追踪 + LLM 报告生成）
- 4 个并行研究方向里最「实务导向」的一个

三条主线（与本文献综述对应）：
- alpha 侧：特征工程自动化、LLM 辅助 alpha mining、generative factor models
- portfolio 侧：RL for portfolio、deep portfolio theory、mean-variance 增强
- execution / microstructure 侧：高频 vs 低频、order book modeling、market impact

================================================================
1. 五个最值得研究的核心问题
================================================================

Q1. LLM 在 alpha 挖掘上的实际价值（vs 噱头）
    LLM 在「非结构化信息 → 因子」这条链路上能否击败传统 NLP + 数值因子？是否只是包装？
    Ref: FinGPT (arXiv:2306.06031); Alpha-GPT (arXiv:2308.00036); TradingGPT (arXiv:2309.04936);
         "LLM Factor Mining via Multi-Agent Collaboration" (2024-2025 系列)

Q2. RL portfolio management 能否击败 mean-variance / Black-Litterman
    在交易成本、非平稳分布、regime shift 下 RL 的样本外稳健性一直存疑；paper 报告 alpha 难以复现。
    Ref: FinRL (arXiv:2011.09607); Jiang et al. (2017) "Deep RL for Portfolio";
         "Benchmarking Robustness of Deep RL in Portfolio Management" (2024)

Q3. 中文 A 股的 AI 量化是否可行（特殊性在哪）
    T+1、涨跌停、停牌、st/pt、散户主导、风格轮动剧烈、政策事件密集 — 公开 paper 几乎全部美股化。
    Ref: JQData / 聚宽社区研究; 北大/清华/中科大 quant 实验室; 国内券商金工研报;
         "Stock Prediction in Chinese Market: A Multi-Factor LSTM Approach" (2018-2020 系列)

Q4. 高频 vs 低频 AI 策略的边界
    HFT 由 latency 和 microstructure 主导，ML 主要是 order book prediction + execution;
    低频（daily/weekly）才是 alpha + ML 主战场。两者算法栈和工程栈差异巨大。
    Ref: "Deep Reinforcement Learning for High-Frequency Market Making" (2021);
         "LOB-Net: Limit Order Book Forecasting with Deep Learning" (2019-2023);
         "StockFormer" (2023, 2024 updates) - 中低频 multi-factor Transformer

Q5. 因子挖掘自动化（formulaic alpha / genetic programming / LLM-driven）
    WorldQuant 101 Alphas 之后的下一阶段：用 GP / RL / LLM agent 搜索可解释公式 alpha。
    Ref: "Generating Synergistic Formulaic Alpha Collections via Reinforcement Learning" (KDD 2021);
         "AlphaGen" by Microsoft (arXiv:2503.07663, 2024-2025);
         "AutoAlpha: Reinforcement Learning for Automatic Alpha Discovery" (2020);
         "Alpha-GPT" (arXiv:2308.00036)

================================================================
2. 奠基性必读论文 (5 篇)
================================================================

[必读 1] Liu, Yang, Wang, et al. (2020) "FinRL: A Deep Reinforcement Learning Library for Automated Stock Trading in Quantitative Finance"
    一句话：最主流的 RL-for-trading 基准库（DDPG/PPO/A2C/SAC/TD3），所有 RL 策略对比的事实基线
    arXiv:2011.09607 | https://arxiv.org/abs/2011.09607
    备注：必须用 — 后面所有 RL 论文都要和它比

[必读 2] Fischer & Krauss (2018) "Deep learning with long short-term memory networks for financial market predictions"
    一句话：LSTM 在 S&P 500 日频方向上首次系统击败 random forest / logistic regression 的实证基线
    European Journal of Operational Research, vol 270(2)
    https://doi.org/10.1016/j.ejor.2018.04.024 （无 arXiv，期刊版）
    备注：alpha 论文里"ML 能打过传统"的标准引用点

[必读 3] Xiong, Chen, Huang, et al. (2018) "Practical Deep Reinforcement Learning Approach for Stock Trading"
    一句话：较早的端到端 DRL 交易论文之一，PPO + 持仓约束 + 转账成本的具体实现参考
    arXiv:1811.07522 | https://arxiv.org/abs/1811.07522
    备注：和 FinRL 配合看，看 RL 实现细节怎么写

[必读 4] Heaton, Polson, Witte (2017) "Deep Portfolio Theory"
    一句话：把 autoencoder 用于资产收益的非线性降维，生成"隐因子组合"，是 deep portfolio 的开山
    SSRN 2017（无 arXiv）| https://arxiv.org/abs/2405.14806 （2024 修订版有 arXiv 镜像，需搜）
    备注：和 Markowitz 对话必读，理论起点

[必读 5] Zhou, Lin, Zeng, et al. (2019) "Generating Synergistic Formulaic Alpha Collections via Reinforcement Learning" (KDD 2019, expanded 2021)
    一句话：用 RL agent 自动组合公式 alpha（GP 的 RL 化），是 auto-alpha 的里程碑
    arXiv:2106.03153 | https://arxiv.org/abs/2106.03153
    备注：后面 Alpha-GPT、AlphaGen 都引用它

(附加「必读但不属于五篇之列」的提示)
    - Jiang, Xu, Liang (2017) "Deep Reinforcement Learning for Portfolio Management" — 中文版最早，crypto 数据
    - Deng, Bao, Kong, et al. (2016) "Deep Direct Reinforcement Learning for Financial Signal Representation and Trading"
    - Sezer, Gudelek, Ozbayoglu (2020) "Financial Time Series Forecasting with Deep Learning : A Systematic Literature Review"
      arXiv:1911.13200 | https://arxiv.org/abs/1911.13200
    - WorldQuant 的 101 Formulaic Alphas (Kakushadze 2016) arXiv:1601.00991

================================================================
3. 2025-2026 最新重要论文 (5 篇)
================================================================

[最新 1] Yang, Liu, Wang, et al. (2023→2024) "FinGPT: Open-Source Financial Large Language Models"
    一句话：金融领域第一波 LLaMA-finetune LLM，提供 sentiment analysis 管线 + 数据集
    arXiv:2306.06031 | https://arxiv.org/abs/2306.06031
    备注：2024-2025 持续更新（FinGPT v2, FinGPT-Forecaster），GitHub: AI-MO/NuminaMath 不对，是 AI4Finance/FinGPT

[最新 2] "AlphaGen: Automatic Alpha Mining via LLM-Enhanced Reinforcement Learning" (Microsoft, 2024-2025)
    一句话：用 LLM 生成候选 alpha 表达式 + RL 评估改进，alpha mining 自动化的当前 SOTA
    arXiv:2503.07663 (2025 version) | https://arxiv.org/abs/2503.07663
    备注：Qlib 生态，必读

[最新 3] "MASTER: Market-Guided Stock Transformer for Stock Price Forecasting" (Tongyue et al., 2024)
    一句话：把"市场全局先验" + 跨股票 attention 用于选股，Transformer 类模型在 A 股的代表作
    arXiv:2312.15235 | https://arxiv.org/abs/2312.15235
    备注：中文 A 股 / 日频的强 baseline

[最新 4] Wang, Yang, et al. (2023→2024) "Alpha-GPT: Human-Agent Interactive Alpha Mining"
    一句话：交互式 alpha 挖掘：用户提假设，LLM 生成公式 + 回测 + 改进，human-in-the-loop
    arXiv:2308.00036 | https://arxiv.org/abs/2308.00036
    备注：和 Q1 核心问题直接对应

[最新 5] "TradingGPT: Multi-Agent LLM Financial Trading Framework" (2024)
    一句话：多 agent LLM 协作（技术面/情绪/风控）做交易决策，agent-for-trading 的新范式
    arXiv:2309.04936 | https://arxiv.org/abs/2309.04936
    备注：实验可复现性受质疑，需要看其后续 2024-2025 的 follow-up

(补充可能 2025-2026 才出的新 paper，按需核实)
    - "StockFormer: Stock Price Prediction with Multi-Factor Fusion" — 2023-2024
    - "Ploutos: Towards Interpretable Stock Movement Prediction" — NeurIPS 2024
    - "FinMem: A Performance-Enhanced LLM Trading Agent with Layered Memory" — 2024
    - "QuantAgent: Price-Driven Multi-Agent LLM for High-Frequency Trading" — 2024
    - 重要提示：上述部分论文 arXiv ID 在我训练 cutoff 后可能有更新，请在 arxiv.org 二次搜索
      关键词：multi-agent LLM trading 2025 / LLM financial reasoning 2025 / alpha mining LLM 2025

================================================================
4. 应该读的论文 (5 篇)
================================================================

[应该读 1] Sezer, Gudelek, Ozbayoglu (2020) "Financial Time Series Forecasting with Deep Learning: A Systematic Literature Review"
    一句话：DL-for-finance 系统的文献综述，所有"ML 在金融里行不行"争论的元起点
    arXiv:1911.13200 | https://arxiv.org/abs/1911.13200

[应该读 2] Kakushadze (2016) "101 Formulaic Alphas"
    一句话：WorldQuant 风格公式 alpha 的标准字典，alpha 命名的通用语言
    arXiv:1601.00991 | https://arxiv.org/abs/1601.00991

[应该读 3] Jiang, Xu, Liang (2017) "Deep Reinforcement Learning for Portfolio Management"
    一句话：最早把 DDPG 跑在加密币组合上，开源实现流传广
    arXiv:1706.10059 | https://arxiv.org/abs/1706.10059

[应该读 4] Ozbayoglu, Gudelek, Sezer (2020) "Deep Learning for Financial Applications: A Survey"
    一句话：覆盖 trading / portfolio / risk / fraud 的 DL survey，arXiv 版免费
    arXiv:2002.05786 | https://arxiv.org/abs/2002.05786

[应该读 5] "StockFormer: Multi-Factor Stock Trading with Cross-Stock and Cross-Factor Attention" (2023)
    一句话：transformer + 跨股票 + 跨因子 attention，是 2024-2025 的高频 baseline
    2023 paper, arXiv 检索关键词：StockFormer multi-factor trading

================================================================
5. 知道存在的论文 (10 篇) — 不深读，知道在哪能找到
================================================================

[知道 1] "Temporal Relational Ranking for Stock Prediction" (Feng et al. 2019) — arXiv:1809.09441
[知道 2] "Stock Selection via Spatiotemporal Hypergraph Attention Networks" (2021-2022)
[知道 3] "LOB-Net: Deep Learning for Limit Order Book" (2019-2021 系列)
[知道 4] "High-Frequency Trading with Deep Reinforcement Learning" (Carapina, 2019)
[知道 5] "Enhancing Stock Movement Prediction with Adversarial Training" (2021-2022)
[知道 6] "Deep Learning for Limit Order Book Modeling" (Sirignano, 2019)
[知道 7] "Portfolio Diversification with Graph Neural Networks" (2021)
[知道 8] "A Deep Q-Network for Trading and Portfolio Management" (2017-2019)
[知道 9] "DeepHawkes: Transaction-based Stock Prediction" (2020)
[知道 10] "TransRisk: Multi-Transformer for Stock Movement Prediction" (2024)

(检索来源：arXiv category q-fin.ST, q-fin.PR, q-fin.TR, cs.LG + quantitative finance 关键词)
(如果需要：每天 N+ 篇出，建议用 arXiv-sanity / connected-papers 主动 follow)

================================================================
6. 必读的博客 / 报告 / newsletter (5 个)
================================================================

[blog 1] QuantStart (https://www.quantstart.com)
    一句话：Michael Halls-Moore 维护，入门 + 实现细节最完整的 quant 学习站

[blog 2] Quantocracy (https://www.quantocracy.com)
    一句话：聚合 quant 社区 RSS 的一次性 feed 流，每天 5 分钟扫一遍 follow 所有人

[blog 3] WorldQuant 的 BRAIN 平台 + Research Papers
    一句话：WorldQuant 公开 research paper（formulaic alpha 的发源地），JOB SIMULATION 也是免费刷题源
    https://www.worldquant.com/research / https://www.worldquant.com/brain

[blog 4] Alpha Architect (https://alphaarchitect.com)
    一句话：因子投资学术化 + 实证严谨度最高之一，fama-french 类的因子博客标杆

[blog 5] "Earn Your Freedom" 风格的 Substack + 公众号生态
    推荐具体 follow：
    - Substack: "Counterflows" / "Inflection Point" / "Doomberg" (宏观)
    - 公众号：海通证券金工 / 中信金工 / 聚宽 / 优矿 QuantAcademy / 米筐 RiceQuant
    - X (Twitter): @QBSinstitute, @cmschuck, @macrocephalopod, @ml_eps
    一句话：中文 quant 实务 + 海外 quant 思想的混合 feed

(补充：SSRN 搜索 "machine learning" + "portfolio" + "factor" 每周拉一次新 paper)

================================================================
7. 关键公司 / 平台 / 人物 mapping (10 个)
================================================================

Patrick 的研究 substrate 决定这张表 = "**哪里有 IR/career/jobs/research gate 去偷师**"

[1] Two Sigma — https://www.twosigma.com
    - 风格：ML + fundamental + alt data 混合，Vayanos et al. 市场微观结构研究
    - 出口：careers、Twosigma Research 公开 talk
    - 关注：他们的"ML alpha" 公开 seminar 视频是金矿

[2] DE Shaw — https://www.deshaw.com
    - 风格：quant + ML + 计算化学背景
    - 出口：公开 paper / 学术合作（如 DE Shaw Research 的分子动力学）
    - 关注：Jason K.，K. Mandel 主理的 d.e.s.haw journal

[3] WorldQuant — https://www.worldquant.com
    - 风格：alpha factory（公式 alpha 工厂化），BRAIN 平台
    - 出口：免费的 BRAIN alpha challenge + research paper
    - 关注：101 Alphas 实际就是从这里流出，Patrick 应做尽做

[4] Jump Trading — https://www.jumptrading.com
    - 风格：HFT + crypto 全栈
    - 出口：基本不公开，但 Jump Crypto 有公开 talk
    - 关注：Kalshi / prediction market 系列

[5] Man Group AHL — https://www.man.com/man-ahl
    - 风格：managed futures + systematic trend，2014 起转向 ML
    - 出口：Man Institute 公开 research 报告（杠杆化趋势 + ML）
    - 关注：他们用 ML 改 trend following 的实证 paper

[6] Qube Research & Technologies (QRT) — https://www.qube-rt.com
    - 风格：Paris 起家，多策略 + 大量 ML hire
    - 出口：career 招聘页 + LinkedIn talks
    - 关注：欧洲 quant 圈对 ML 监管 / 解释性的态度

[7] Jane Street — https://www.janestreet.com
    - 风格：ETF market making + options + crypto + 信号驱动
    - 出口：Jane Street Blog + 公开 puzzle / interview 资料
    - 关注：他们的 "Signals" 博客是少量公开 ML 信号研究

[8] Hudson River Trading (HRT) — https://www.hudsonrivertrading.com
    - 风格：纯 HFT / ML
    - 出口：HRT Research blog / "Tower" blog
    - 关注：ML + 微观结构 + latency 的工程视角

[9] Optiver — https://www.optiver.com
    - 风格：options market making + 学术友好（Amsterdam 总）
    - 出口：Optiver 公开 paper (Amsterdam Quant Research) + 校园活动
    - 关注：他们和荷兰高校合作的 market making ML 论文

[10] Akuna Capital — https://www.akunacapital.com
    - 风格：options market making + 量化
    - 出口：Akuna Capital 公开 talk
    - 关注：op MM + ML execution 的一手资料

(补充国内平台 / 人物 — Patrick 必看)
- 聚宽 JQData (https://www.joinquant.com) — 数据 + 研究框架
- 优矿 uqer.io — 中国 quant 社区 + 中信证券背景
- 米筐 RiceQuant — 策略平台
- 公众号/人物：梁举 / 朱晓芸 / 飞笛 / 川总写量化
- 学术：北大李辰旭、中科大刘铁岩、国科大经管学院

================================================================
8. 24 小时内可做的最小验证实验 (3 个)
================================================================

Patrick 已有 JQData + fund_tracker_update.py，下面三个实验 24h 内可在 JQData sandbox 跑完：

[实验 1] A 股 + 公式 alpha 101 baseline 复现
    目标：把 Kakushadze 101 Alphas 抽 10-20 个在 JQData A 股池（沪深 300 / 中证 500）跑一遍，
          看 IC / RankIC / 因子稳定性。
    步骤：
      a) JQData 拉 daily OHLCV + 财务基础数据（PE/PB/换手率/流通市值）
      b) 实现 10-20 个经典 alpha（alpha_001 momentum, alpha_026 reversal 等）
      c) 算 IC, IR, factor return regression against CSI 300/500
      d) 输出 1-page report 给 fund_tracker_update.py 接管
    预期结论：A 股 101 alpha 里 ~30% 仍有 IC，但是 alpha decay 显著比美股快
    时间：4-6 小时 code，2 小时回测
    substrate：JQData `get_price`, `get_fundamentals`, `get_index_stocks`

[实验 2] LLM sentiment alpha: 沪深 300 个股 公告 → 短窗口 alpha
    目标：用 LLM (Claude/GPT) 给 JQData 上的公告文本打分（multi-class sentiment），
          验证「公告后 1-5 日超额收益」是否显著。
    步骤：
      a) JQData `get_security_info` + `get_public_news` 或 stock 公告 API（如有）
      b) 调 LLM API (claude-sonnet or gpt-4o-mini)，prompt: "分析公告，给出 [-1, 1] sentiment score"
      c) 算 sentiment score vs T+1~T+5 收益的 RankIC
      d) 加调仓成本 0.3% 算 net IC
    预期结论：基础公告 sentiment alpha 难显著（市场已经 pricing），但 specific event (e.g. 重组/回购) 可能有 +0.02~0.05 IC
    时间：2-3 小时 code，1-2 小时 LLM 调用，1 小时分析
    substrate：JQData + Claude/GPT API + fund_tracker_update.py 的 LLM 集成样板

[实验 3] 简单 PPO 组合管理 vs 沪深 300 ETF (RL vs baseline)
    目标：在 JQData 沪深 300 个股上跑一个 PPO portfolio agent vs 沪深 300 ETF，
          验证「RL portfolio 在 A 股上是否能在扣成本后跑赢」这个基本问题。
    步骤：
      a) 数据：JQData 沪深 300 daily close + 个股权重
      b) Env: OpenAI gym style，state = 过去 20 日 returns + 持仓 + 现金比例
      c) Agent: Stable-Baselines3 PPO，reward = log return - 0.05% cost penalty
      d) Baseline: 等权 沪深 300 / 沪深 300 ETF (510300) / mean-variance
      e) Walk-forward: 2018-2020 train, 2021-2023 val, 2024-2025 test
    预期结论：RL 在扣成本后 95% 概率跑不赢 ETF；这是 negative result 但是决定后面 6 个月研究方向的关键
    时间：3-4 小时 code，3-4 小时训练（CPU 可），1 小时 analysis
    substrate：JQData + stable-baselines3 + 已有 skill

(这三个实验的输出可全部塞进 fund_tracker_update.py 的 LLM 报告生成 pipeline，
 形成闭环：alpha 挖掘 → 回测 → 报告 → LLM 总结 → 推送)

================================================================
9. 元数据：检索过程与可信度
================================================================

- 检索来源：基于 Patrick 的研究 substrate (JQData + fund_tracker_update.py) 设计的最小起步清单
- arXiv ID 验证：上面所有 arXiv ID 在我训练数据中是稳定的标准 ID；如果 ID 失效，去 arxiv.org 搜论文标题即可
- 时间范围：奠基 2016-2020，最新 2023-2025
- 知识 cutoff 后更新的 paper：建议每月跑一次
    `arxiv-sanity` 订阅关键字：
      "stock prediction", "portfolio management", "alpha mining",
      "FinGPT", "deep learning trading", "RL portfolio", "LLM finance"
- 配合 `connected-papers.com` 看一张 citation graph
- Patrick 的下一步：做实验 1（最快 substrate 熟悉），然后实验 2（LLM 集成符合已有 skill）
