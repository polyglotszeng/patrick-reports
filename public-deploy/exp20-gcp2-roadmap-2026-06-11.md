# Exp-20 GCP-2.0 量化+AI 方向下一代研究路线提案

**作者**: Patrick 量化助手
**日期**: 2026-06-11
**协议**: GCP-1.1.0 (Goals / Constraints / Progress / next + 5 falsification)
**状态**: 🟡 提案待决策 (W2 前需确认决策 1)
**接续**: Exp-11~17 NQ-100 7 实验收官, 启 GCP-2.0 量化+AI 方向下一代研究路线

---

## 0. TL;DR (6 数字)

**① NQ-100 系列 7 实验核心结论 (1 句话)**
NQ-100 静态回测框架成熟、5 因子 linear + Regime 改善可复刻, 但 30 样本 GBDT 100% 过拟合, 真实 OOS 验证卡在"沙箱天花板", 必须接真实数据 (Exp-18 IBKR) 才能继续。

**② 3 个核心 falsification (从 7 实验沉淀)**
1. **30 样本 GBDT 100% 过拟合** — Exp-15/16 Test R²<0.05, 训练 R²=0.95, 样本量是根本瓶颈
2. **Exp-12 in-sample 0.45 复刻 = 0.95 改善是 overfit 上限** — 真实 OOS 应接近 0
3. **季度数据扩无新信息** — linear interpolation 与同季 rolling 强相关, 480 样本 panel 是工程就绪不是 alpha 增量

**③ 4 个 GCP-2.0 新方向 (1 段)**
突破"沙箱天花板" = 因子增强 (新数据源) + 周期量化 (动态 regime) + 组合优化 (可投资) + AI 增强 (LLM 提速) 4 个方向并行, 每个方向 1 个 30 min ~ 1 h 最小实验, W5 末根据 W1-W4 失败率决定是否 deep-dive。

**④ 8 周 4 方向 4 最小实验**
W1 A2 insider trading → W2 B1 月度 regime → W3 C1 风险平价 → W4 D3 LLM 回测生成, 全部为可执行的最低门槛实验, 失败即降级 fallback。

**⑤ 2 个决策点**
- 决策 1: W2 前是否投 ~$10/月 IBKR 抓真实季度 OHLC
- 决策 2: W4 末根据 W1-W4 失败率 (>50% 跳过) 决定是否启动 W5-W8 deep-dive

**⑥ 1 句话后续建议**
GCP-2.0 是量化+AI 方向**最后一代 8 周路线** — 4 方向同时起 4 最小实验, 周末就能跑 W1 A2 insider trading, 不需要等 IBKR 决策。

---

## 1. NQ-100 系列 7 实验收官总结

### 1.1 实验总表

| 实验 | 状态 | 关键发现 | 真实 alpha 验证 |
|---|---|---|---|
| **Exp-11** 4 Plan | ✅ | C 增长 +79.2% vs QQQ +59.3% (4 年回测) | 已用真实价格 (2022-2025) |
| **Exp-12** 5 因子 | ✅ | +30.9pp 改善 (中等场景) | 30 样本 overfit 上限 |
| **Exp-13** FF5 分解 | ✅ | 84% 收益来自市场 β, 5 因子残余 ~16% | 已用真实价格 |
| **Exp-14** Regime Filter | ✅ | +12.3pp 改善 (BULL/NORMAL/BEAR 过滤) | 已用真实价格 |
| **Exp-15** GBDT | ❌ | Test R²<0.05 (沙箱), Train R²=0.95 | 需真实数据 |
| **Exp-16** GBDT-Regime | ❌ | GBDT 在 regime 切换下完全没生效 | 需真实数据 |
| **Exp-17** 季度扩 | ⚠️ | 480 样本 panel 工程就绪 | 需真实数据 (工程合成立) |

### 1.2 核心 falsification (从 7 实验沉淀)

**Falsification 1: 30 样本 GBDT 100% 过拟合**
- Exp-15 train R²=0.95, test R²<0.05, 差距 >0.9
- Exp-16 加入 regime 后 GBDT 仍未生效
- 根因: 30 季度样本 (8 行业 × 4 季度粒度不足) 远小于 5 因子 × 5 弱学习器参数
- 推论: 任何非线性方法 (GBDT / NN / Transformer) 在 <500 样本下都不能用, 必须先扩样本

**Falsification 2: Exp-12 in-sample 0.45 → 0.95 是 overfit 上限**
- Exp-12 报告 5 因子 vs 单因子的 R² 改善从 0.45 → 0.95 (中等场景)
- 这是 in-sample 复刻, 真实 OOS 应接近 0
- 推论: 任何"in-sample 看起来 >0.5 的改善"都要打折 50-80%
- GCP-2.0 必须强制 OOS 测试 (4-fold TS-CV 起步)

**Falsification 3: 季度数据扩无新信息**
- Exp-17 用 linear interpolation 把 16 季度扩成 480 样本 panel
- 但插值数据与同季 rolling 强相关 (ρ >0.9)
- 480 样本是"工程就绪"不是"alpha 增量"
- 推论: 数据扩需用真实高频 (日/周) 或新数据源 (替代/行为/跨资产), 插值是 noise

### 1.3 真实数据缺口 (量化 + AI 方向天花板)

**当前状态**: NQ-100 7 实验所有 alpha 改善都基于季度或线性插值, 真实 OOS 验证 = 0
**关键瓶颈**:
- IBKR 抓 OHLC 数据每月 $10, 4 年日级 = ~1000 交易日 × 100 公司 = 10 万样本
- 真实数据到位后, GBDT/HMM/LLM 才有可能在 1 万 + 样本下工作
- 接 Exp-18 IBKR = GCP-2.0 的**前置条件** (决策 1)

---

## 2. 4 个 GCP-2.0 新方向

### 方向 A: 因子增强 (Factor Augmentation) ⭐⭐⭐⭐

**目标**: 找 NQ-100 5 因子之外的新 alpha 源, 用 4 思路突破 Exp-12 0.45 上限。

**子方向**:
- **A1: 替代数据** (satellite / patent / hiring / app rank) — Patrick Mac 拉 API
- **A2: 行为金融** (analyst revision / insider trading / 13F) — SEC EDGAR 免费
- **A3: 跨资产** (USD/JPY / 铜油比 / BTC) — FRED + yfinance
- **A4: NLP alpha** (10-K / earnings call sentiment) — local-llm-benchmark

**最小实验** (W1 8/3, 30 min): **A2 insider trading 单因子**
- 拉 SEC Form 4 (insider buy/sell) for NQ-100 top 30
- 16 季度 panel, 算 IC vs 5 因子残差
- 评判: 新因子 IC > 0.03 (绝对) 且残差 IC > 0.02 (相对)
- 失败兜底: 切 A3 跨资产 (FRED API 一行代码)

**预期**: 1-2 个新 IC>0.03 因子, 联合 IC 0.5+ (vs Exp-12 5 因子 0.45)

**风险**:
- 数据稀疏 (Form 4 季度披露稀疏, 30 公司 × 16 季度 = 480 条记录)
- Patrick 不会用 insider trading 数据做实际投资 (合规 / 个人偏好)
- IC 计算需在 5 因子残差空间, 简单叠加会双重计算

**关联 skill**:
- `nq100-quant-backtest` (IC framework / Fama-MacBeth 回归)
- `local-llm-benchmark` (A4 NLP sentiment 用本地 qwen3 路由)
- `nasdaq-financials` (NQ-100 成分股映射)

### 方向 B: Regime Quant (周期量化) ⭐⭐⭐⭐⭐

**目标**: 把 Exp-14 静态 Regime 升级为动态多周期 regime, 探索"regime 切换频率 vs 因子 IC"的真实关系。

**子方向**:
- **B1: 月度 regime** (16 月度 + 16 季度 + 4 财年 3 周期粒度)
- **B2: 行业 regime** (10 个 sector 各自 regime, 半导体 vs 零售周期不同步)
- **B3: 因子 regime** (5 因子在 BULL/BEAR/NORMAL 各自 IC, 不止市场 β)
- **B4: Regime transition probability** (隐马尔可夫 / HMM, 预测下周 regime)

**最小实验** (W2 8/10, 1 h): **B1 月度 regime × 4-fold TS-CV**
- 用 SPY 月度 close 算 60 月滚动 vol + 趋势
- 分 3 regime: BULL (vol<15%, trend>0) / BEAR (vol>25%, trend<0) / NORMAL (其他)
- 4-fold TS-CV (train 12 月 → test 4 月, 滚动)
- 5 因子 IC 在 3 regime 各自算 (避免 in-sample 偏)
- 评判: BULL 期间 IC 0.08, BEAR 期间 IC -0.05 (regime 切换是关键信号)

**预期**: 5 因子在 BULL 期间 IC 0.08, BEAR -0.05, regime 切换本身是 alpha 源

**风险**:
- 60 样本月度不够 HMM 训练 (B4 降级)
- 16 季度 3 label 切换频率低, 统计检验力不足
- "regime" 定义本身有 hindsight bias (用未来数据标 regime)

**关联 skill**:
- `nq100-quant-backtest` (回测 + IC 框架)
- `world-model-tracker` (HMM / 状态机实现, B4 用)
- `distributed-research-playbook` (TS-CV 滚动协议)

### 方向 C: Portfolio Construction (组合优化) ⭐⭐⭐

**目标**: 把 5 因子 alpha 转化为实际可投资组合, 用 4 种仓位管理方法对比 Max DD / Sharpe。

**子方向**:
- **C1: 风险平价** (volatility inverse weighting, σᵢ⁻¹)
- **C2: Black-Litterman** (5 因子 view + 市场 prior, Bayesian 后验)
- **C3: Kelly 仓位** (最优 f = (W×R - L) / (W×R + L), 含分数 Kelly)
- **C4: 再平衡频率优化** (月/季/年, 含交易成本 ~ 0.1%/笔)

**最小实验** (W3 8/17, 1 h): **C1 风险平价 vs 等权**
- 5 因子选股 top 20 (NQ-100)
- 等权 vs 风险平价 (用 60 日滚动 σ)
- FY22-FY25 4 年回测, 对比 Sharpe / Max DD / Calmar
- 评判: 风险平价 Max DD 从 -49% → -35% (≥5pp 改善)
- 失败兜底: 切 C4 再平衡频率 (等权 + 月/季/年 对比)

**预期**: 风险平价 Max DD -49% → -35%, Sharpe 0.8 → 1.0

**风险**:
- 简化模型 — 没含交易成本 (实际 0.1% × 12 月再平衡 = 1.2%/年)
- 风险平价在 regime 切换时反而加剧回撤 (低波动资产突然崩盘)
- Kelly 仓位 (C3) 在胜率 <0.5 时会过度保守

**关联 skill**:
- `nq100-quant-backtest` (基础回测)
- `equity-portfolio-backtest` (组合优化主框架, 含 BL / Kelly)
- `nasdaq-financials` (历史价格)

### 方向 D: AI-Augmented (AI 增强) ⭐⭐⭐⭐

**目标**: 用 LLM 加速量化研究全流程 (因子发现 / 回测 / 报告), 把"1 周研究"压缩到 1 天。

**子方向**:
- **D1: LLM 因子合成** (本地 qwen3 读 10-K, 输出 10 维 alpha 评分, 0-1 标准化)
- **D2: AutoML** (本地 hermes3 + genetic algorithm 找最优 5 因子权重)
- **D3: LLM 回测代码生成** (Patrick 给 prompt, Hermes 出 backtest.py)
- **D4: LLM 报告 + 5 falsification 自动生成** (跑完实验后, LLM 写 markdown)

**最小实验** (W4 8/24, 30 min): **D3 跑通 — 1 prompt → backtest 脚本**
- prompt: "写一个 backtest.py 加载 NQ-100 5 因子, top 20 等权, 4 年回测, 输出 Sharpe/Max DD"
- Hermes (本地) → 生成 .py → 跑通 → 输出报告
- 评判: 生成的脚本能跑 + 输出数字与 Exp-12 ± 5% 一致
- 失败兜底: 切 D1 LLM 因子合成 (qwen3 读 10-K 出评分, 更可控)

**预期**: 1 周研究效率 +5x, 8 周路线压缩到 2 周完成

**风险**:
- local-llm-benchmark 已证 hermes3 codegen OK (1 步生成), 但多步 planning 不行
- LLM 生成的 backtest.py 可能有 silent bug (用错列名 / 单位错位)
- 验证机制: 强制 LLM 输出 vs 已知 baseline (Exp-12) 对比, 偏差 >5% 标记为幻觉

**关联 skill**:
- `local-llm-benchmark` (hermes3 vs qwen3 路由, D1/D3 用)
- `nq100-quant-backtest` (回测框架被 LLM 调用)
- `agent-orchestration` (LLM 拆 subagent, D4 多步报告)

---

## 3. 8 周执行表

| 周 | 方向 | 最小实验 | 预期 / 评判标准 | 失败兜底 |
|---|---|---|---|---|
| **W1 (8/3)** | A2 insider trading | SEC Form 4 拉 30 公司 × 16 季度, 算 IC vs 5 因子残差 | 新 IC>0.03 + 残差 IC>0.02 | 失败 → 降级 A3 跨资产 (FRED API 1 行) |
| **W2 (8/10)** | B1 月度 regime | 4-fold TS-CV, 5 因子 IC × 3 regime (BULL/NORMAL/BEAR) | BULL IC 0.08 / BEAR -0.05 | 失败 → 降级 B2 行业 regime |
| **W3 (8/17)** | C1 风险平价 | 等权 vs 风险平价, FY22-FY25 4 年回测 | Max DD -49% → -35% (≥5pp) | 失败 → 降级 C4 再平衡频率 |
| **W4 (8/24)** | D3 LLM 回测生成 | 1 prompt → Hermes 出 backtest.py → 跑 → 出报告 | 跑通 + 与 Exp-12 ±5% | 失败 → 降级 D1 LLM 因子合成 |
| **W5 (8/31)** | A1+A2 deep-dive | 替代数据 API 集成 (3-4h) | 1 个新数据源 IC>0.05 | 失败 → 记 falsification |
| **W6 (9/7)** | B3+B4 deep-dive | 因子 regime + HMM 转换概率 (3-4h) | 转换概率预测胜率 >0.55 | 失败 → 记 falsification |
| **W7 (9/14)** | C2+C3 deep-dive | Black-Litterman + Kelly (3-4h) | Sharpe +0.2 vs C1 | 失败 → 记 falsification |
| **W8 (9/21)** | D1+D4 deep-dive | LLM 因子 + 报告自动生成 (3-4h) | 报告生成 1 步到位 | 失败 → 收工, GCP-3.0 |

**关键设计**:
- W1-W4 = 4 方向各 1 最小实验, 总计 4 小时
- W5-W8 = 4 方向 deep-dive, 每方向 1 个 3-4h 完整实验
- 失败兜底: 每个最小实验都有 fallback 子方向, 不需要"完美"
- 失败率统计: W4 末算 W1-W4 失败数, >50% 则跳过 W5-W8 deep-dive

---

## 4. 5 Falsification 框架 (GCP-2.0)

按 GCP-1.1.0 标准, 5 个 falsification 用于判定 GCP-2.0 是否达到 Goals:

1. **数据扩边际递减** — Exp-12 5 因子 + 新 1 因子 (A 方向) IC 提升 < 0.01
   - 含义: 新数据源没有 alpha 增量, 因子增强方向失败
   - 应对: 收工 A 方向, 启 GCP-3.0 寻找非因子路线

2. **Regime 切换频率低** — 16 季度 3 label 切换次数 < 5 次
   - 含义: B 方向 regime 本身是 hindsight bias, 统计上无意义
   - 应对: B 方向降级为"regime 辅助"而非主线

3. **风险平价 vs 等权差异 < 2%** — Sharpe / Max DD 改善 < 2pp
   - 含义: C 方向简化模型陷阱, 交易成本 / regime 切换吃掉 alpha
   - 应对: C 方向需引入 BL (C2) 或 Kelly (C3) 才有可能突破

4. **LLM codegen 幻觉** — 生成的 backtest.py 有 syntax error / 跑不通 / 输出与 baseline 偏差 >5%
   - 含义: D 方向 LLM 不可靠, 仍需人工 review
   - 应对: 限制 LLM 用法 (D1 因子合成, D3 模板填充), 不依赖 D4 自动报告

5. **新方向投入 ROI 不明** — 1 周 + Mac 资源 vs 1-3pp 改善
   - 含义: GCP-2.0 整体方向 ROI 不明, 可能不如"接 IBKR 抓真实数据"单方向
   - 应对: W4 末算总 ROI, < 3pp/方向 提前收工, 启 GCP-3.0

**GCP-2.0 成功标准** (W8 末评判):
- 至少 2/4 方向 falsification 通过 (即实际有 alpha 增量)
- 至少 1 个方向 deep-dive 完成 (W5-W8)
- IBKR 真实数据已对接 (决策 1 是)
- GCP-2.0 报告 (本文件) → GCP-3.0 提案

---

## 5. 2 个决策点 (Patrick)

### 决策 1: IBKR 真实数据接入

**触发时点**: W2 前 (8/10 之前)
**问题**: 是否投 ~$10/月 IBKR 抓 NQ-100 真实季度 OHLC 数据?
**选项**:
- **A. 投 $10/月** — IBKR paper trading 账户 + TWS API 抓 4 年日级 OHLC (~1000 交易日 × 100 公司 = 10 万样本)
- **B. 不投, 用免费数据** — 继续用 yfinance / FRED, 但 GBDT/HMM/LLM 在 <500 样本下不能用
- **C. 找免费替代** — Tiingo ($0-10/月) / Alpha Vantage (5 calls/min 免费) / Polygon.io (有限免费)

**推荐**: **A. 投 $10/月 IBKR** (决策成本低, 解锁 4 方向真实验证)
**影响**:
- 是 → GCP-2.0 4 方向都能做真实 OOS 验证
- 否 → GBDT (A1) / HMM (B4) / Kelly (C3) 全部降级, GCP-2.0 价值减半

### 决策 2: W5-W8 Deep-Dive 启动

**触发时点**: W4 末 (8/28)
**问题**: W1-W4 4 最小实验中, 失败 (falsification 命中) 多少个?
**判定标准**:
- **失败率 ≤ 50%** (≤2 个失败) → 启动 W5-W8 deep-dive, 每方向 3-4h 完整实验
- **失败率 > 50%** (≥3 个失败) → 跳过 W5-W8, 收工 GCP-2.0, 启 GCP-3.0

**推荐**: 看 W1-W4 实际数据决定, 不预先承诺
**影响**:
- 是 → 8 周完整路线, 期望 2-3pp alpha 增量
- 否 → 4 周收工, GCP-2.0 变 4 周回顾 + GCP-3.0 全新方向

---

## 6. 关联 skill (8 个)

按 GCP-1.1.0 Capsule 协议, 列出 8 个核心 skill 及在 GCP-2.0 中的角色:

| # | Skill | 角色 | 用于方向 |
|---|---|---|---|
| 1 | `nq100-quant-backtest` | 主回测框架 (IC / Fama-MacBeth / 4-fold TS-CV) | A / B / C / D (全方向) |
| 2 | `nasdaq-financials` | NQ-100 成分股 + 财务数据 + 行业映射 | A / C (选股) |
| 3 | `local-llm-benchmark` | 本地 LLM 路由 (hermes3 / qwen3 / llama3) | A4 (NLP) / D (全 AI 增强) |
| 4 | `equity-portfolio-backtest` | 组合优化主框架 (BL / Kelly / 风险平价) | C (组合优化) |
| 5 | `world-model-tracker` | HMM / 状态机 / 转换概率 | B4 (Regime 转换) |
| 6 | `agent-orchestration` | subagent 协调 (LLM 拆任务) | D4 (报告生成) |
| 7 | `distributed-research-playbook` | 8 周研究节奏 + TS-CV 协议 | 全方向 (协议层) |
| 8 | `gene-capsule-protocol` | GCP-1.1.0 框架 (Goals/Constraints/Progress) | 本文件 (元协议) |

**新增 skill 候选** (W5-W8 deep-dive 时创建):
- `sec-form4-parser` (A2 专用, 若 insider trading IC>0.03 升级为 skill)
- `hmm-regime-detector` (B4 专用, HMM 训练脚本)
- `llm-backtest-codegen` (D3 专用, LLM backtest 模板)

---

## 7. 失败兜底 (Patrick 不需要完美)

GCP-1.1.0 的核心精神: **falsification 是朋友, 不是失败**。

### 7.1 4 方向任一失败

**应对**: 记录 falsification, 切换 fallback
- A 失败 → A3 跨资产 (FRED 1 行 API)
- B 失败 → B2 行业 regime (10 sector × 3 regime = 30 cell, 样本更少)
- C 失败 → C4 再平衡频率 (等权 + 月/季/年对比)
- D 失败 → D1 LLM 因子合成 (qwen3 读 10-K 出评分)

### 7.2 全部失败

**应对**: GCP-2.0 提前结束, 启 GCP-3.0 全新研究路线
- GCP-3.0 候选方向: 多资产 (crypto / commodities / FX) / 加密量化 / 强化学习 / 另类数据 (新闻情绪)
- 不强求"接续 NQ-100 系列", GCP-2.0 = 量化+AI 方向最后一代 8 周路线

### 7.3 时间盒保护

即使所有方向都成功, **W8 末必须收工**:
- 防过度拟合: 任何超过 8 周的研究都进入"in-sample 陷阱"
- 防资源耗尽: Mac / IBKR / Patrick 注意力都是有限资源
- 防路线漂移: GCP-2.0 = 8 周严格时间盒, 不延长

---

## 8. 1 句话总结

**GCP-2.0 = 4 方向 × 8 周 × 最小实验节奏, 突破 NQ-100 7 实验收官后"沙箱天花板"**: 接 Exp-18 真实数据 (决策 1 IBKR $10/月) + 启因子增强 (A) / 周期量化 (B) / 组合优化 (C) / AI 增强 (D) 4 方向, 每方向 1 最小实验 (W1-W4 共 4h) + 失败兜底, W5-W8 deep-dive 4 方向各 3-4h, W4 末根据 W1-W4 失败率 (>50% 跳过) 决定是否 deep-dive, W8 末无条件收工启 GCP-3.0。

---

## 附录 A: GCP-1.1.0 格式自检

本文件符合 GCP-1.1.0 协议要求:

- [x] **Goals** — 突破 NQ-100 沙箱天花板, 启 4 方向 (因子增强 / 周期量化 / 组合优化 / AI 增强)
- [x] **Constraints** — 8 周时间盒 / $10/月 IBKR / 不在沙箱跑 / 不推公网 / 中文输出
- [x] **Progress** — Exp-11~17 7 实验已完成, 真实 OOS 验证 = 0
- [x] **Next** — 决策 1 (W2 前 IBKR) → W1 A2 → W2 B1 → W3 C1 → W4 D3 → W4 末决策 2 → W5-W8 deep-dive
- [x] **5 Falsification** — 数据扩边际递减 / Regime 切换频率低 / 风险平价差异小 / LLM 幻觉 / ROI 不明

## 附录 B: 文件交付

- 主报告: `/Users/patrick/Desktop/exp20-gcp2-roadmap-2026-06-11.md` (本文件, ~13KB)
- Vault 简版: `/Users/patrick/Documents/Obsidian Vault/llm-wiki/research-log/quant-ai/2026-06-11-gcp2-roadmap.md`
- Dashboard: `/Users/patrick/Desktop/gcp2-roadmap-dashboard.html`
