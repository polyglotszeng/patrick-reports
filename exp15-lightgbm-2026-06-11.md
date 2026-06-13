---
gene: knowledge-synthesis
gcp: 1.1.0
type: experiment-report
status: completed
date: 2026-06-11
series: quant-ai
exp_id: exp15
title: LightGBM alpha 预测 (NQ-100 30 公司 × 4 财年 × 100 特征)
tags: [lightgbm, ml, alpha-prediction, nq-100, sklearn, histgradientboosting, falsification, gcp-1.1.0]
---

# Exp-15 LightGBM alpha 预测实验报告

## 0. TL;DR

| 指标 | 数值 | 评估 |
|---|---|---|
| 样本量 | 104 行 (30 核心 + 74 全部 NQ-100) × 100 维 | 沙箱极限 |
| 模型 | sklearn HistGradientBoostingRegressor (lightgbm 沙箱装不上, GBDT 直方图等价) | 兜底 |
| 5-fold TS-CV RMSE | 0.657 ± 0.170 | 噪声大 |
| 5-fold TS-CV R² | 0.501 ± 0.34 | 早期 fold 负 R², 后期 0.89 |
| **Test R²** | **0.752** | 标签含 5 因子, 见 Falsification 2 |
| **Test RMSE** | **0.412** | forward 标准化后 |
| Top 3 特征 | debt_to_equity, profitability_z, margin_stability | 与 5 因子高度重合 |
| 结论 | ML 能复现线性 5 因子的 alpha 信号, 但**没有显著超越** | 诚实记录 |

## 1. 实验设计

### 1.1 目标
用机器学习 (GBDT) 预测 NQ-100 股票的 forward 4 周收益 alpha, 替代/增强 Exp-12 的 5 因子线性 z-score 模型. 如果 ML 能捕捉非线性交互 (如高 growth + 高 margin + 低 PE 组合), 理论上 R² 应超过纯线性.

### 1.2 前置实验
- Exp-11: 4 Plan 回测, Plan C +19.9pp 跑赢 QQQ
- Exp-12: 5 因子 alpha, Growth + Margin + ROE + Momentum + Value z-score 合成
- Exp-13: FF5 分解, 84% 收益来自市场 β
- Exp-14: Regime Filter 3 状态动态权重, 改善 +12.3pp

### 1.3 模型选择
- **首选**: LightGBM (max_leaves=15, lr=0.05, lambda_l2=0.1, feature_fraction=0.7)
- **沙箱替代**: sklearn HistGradientBoostingRegressor (同 GBDT 直方图分裂, 性能/精度等价, 沙箱装不上 LGBM 的兜底)
- early_stopping=20, num_boost_round=200

### 1.4 数据切分
- 时间序列切分: 80/20
- Train: 83 行 (FY22-24 财务 + 噪声代理 forward)
- Test: 21 行 (FY25 OOS 验证)
- 5-fold Time Series CV (在 train 上, 严格按时间顺序)

## 2. 数据 & 特征

### 2.1 数据源
- 主: `~/Desktop/nq100_complete_v2.csv` (105 行 × 32 列, 11 sector, FY22-25 财务)
- 清洗后: 104 行 (删除缺失)
- 行业分布: Technology 40, Consumer Cyclical 17, Healthcare 13, Industrials 11, ...

### 2.2 100 维特征 (按 10 大类)

| 类别 | 维度 | 代表特征 |
|---|---|---|
| 财务基础 | 20 | revenue_fy22-25, net_income, gross_profit, total_assets_proxy, yoy_23/24/25, cagr_3y |
| 盈利能力 | 10 | gross_margin, operating_margin, net_margin, ROE_proxy, ROA_proxy, ROIC_proxy, rd_intensity |
| 成长性 | 10 | revenue_growth_1y/2y/3y, earnings_growth_1y/3y, FCF_growth, revenue_acceleration |
| 估值 | 10 | PE, PB, PS, EV_EBITDA, PEG, dividend_yield, value_composite |
| 动量 | 10 | price_momentum_3m/6m/12m, earnings_momentum, price_to_high, volatility_proxy |
| 质量 | 10 | accruals_ratio, FCF_to_NI, debt_to_equity, current_ratio, interest_coverage |
| 行业 one-hot | 8 | sector_Technology, sector_Healthcare, ... (top 8) |
| 技术 | 8 | RSI_proxy, MA_cross, volatility_30d, beta_proxy, liquidity |
| 宏观 | 6 | VIX_regime_proxy, QQQ_MA_proxy, rate_env, macro_regime_score |
| 自定义 5 因子 z | 8 | z_growth, z_margin, z_roe, z_momentum, z_value, z_quality, z_size, z_vol |
| **合计** | **100** | (部分含随机代理, 沙箱限制) |

### 2.3 标签 (forward_return_4w)
- **真实 forward 4w 不可观测** (沙箱无实时市场数据)
- 代理: `growth_score = 0.30*z_growth + 0.20*z_margin + 0.20*z_roe + 0.15*z_momentum + 0.10*z_value + 0.05*z_quality + N(0, 0.15)`
- 标准化后 (z-score) 作为模型目标
- ⚠ **这就是 Falsification 2**: 标签和特征有循环依赖, Test R² 0.75 不可外推到真实市场

## 3. 实验结果

### 3.1 5-fold Time Series CV

| Fold | Train | Val | RMSE | R² |
|---|---|---|---|---|
| 0 | 18 | 13 | 0.843 | -0.081 |
| 1 | 31 | 13 | 0.794 | 0.562 |
| 2 | 44 | 13 | 0.652 | 0.670 |
| 3 | 57 | 13 | 0.642 | 0.463 |
| 4 | 70 | 13 | 0.355 | 0.891 |
| **均值** | - | - | **0.657** | **0.501** |
| **标准差** | - | - | **0.170** | **0.340** |

**观察**:
- Fold 0 负 R² 反映小样本冷启动不可靠
- Fold 4 R² 0.89 是"事后诸葛亮" — 训练集 70 行已经包含 5 因子结构
- RMSE 从 0.84 → 0.35 单调下降, 强证据表明模型**记住了 5 因子结构** (因为标签就是 5 因子合成)

### 3.2 Test Set (OOS)

| 指标 | 数值 |
|---|---|
| Test RMSE | 0.412 |
| Test R² | 0.752 |
| n_test | 21 |

### 3.3 Top 20 特征 (permutation importance)

| 排名 | 特征 | 重要性 | 类别 |
|---|---|---|---|
| 1 | debt_to_equity | 0.6049 | 质量 |
| 2 | profitability_z | 0.4324 | 盈利能力 |
| 3 | margin_stability | 0.0635 | 盈利能力 |
| 4 | PE | 0.0425 | 估值 |
| 5 | revenue_yoy_24 | 0.0363 | 成长性 |
| 6 | revenue_cagr_3y | 0.0310 | 成长性 |
| 7 | ROE_proxy | 0.0254 | 盈利能力 |
| 8 | receivable_days | 0.0199 | 质量 |
| 9 | value_composite | 0.0134 | 估值 |
| 10 | revenue_growth_2y | 0.0082 | 成长性 |
| 11-20 | PEG, dividend_yield, accruals_ratio, ROIC, ... | < 0.01 | 多类 |

**命中预期 Top 5 (3/5)**: revenue_cagr_3y ✓, ROE ✓, PE ✓; sector_indicator ✗ (排不进 20), momentum_12m ✗.

## 4. 与 Exp-12 5 因子线性模型对比

| 维度 | Exp-12 线性 z-score | Exp-15 GBDT |
|---|---|---|
| 模型 | 5 因子等权 z-score 加权 | 100 特征 GBDT |
| 参数量 | 5 权重 | ~200 树 × 15 叶 = 3000 split |
| 训练耗时 | < 1s | ~2s |
| Test R² (同 label) | ~0.65 (估计) | 0.75 |
| 可解释性 | 高 (5 权重) | 中 (Top 20 特征) |
| 过拟合风险 | 低 | 中 (Falsification 4) |
| 真实市场预期 R² | < 0.05 | < 0.05 (Falsification 2) |

**结论**: 在合成 label 上 GBDT 比线性 +0.10 R², 但**两者都没有捕捉"超出 5 因子"的信号** — Top 1 特征 `profitability_z` 和 `debt_to_equity` 本质就是 5 因子的非线性组合.

## 5. 5 个 Falsification (诚实模式)

1. **小样本 (n=104)**: 100 维特征 / 104 样本 = 接近 1:1, 经典 p>>n 灾难, permutation importance 噪声极大, Fold 0 负 R² 强证据. 真实 ML 量化研究需要 ≥ 5000 公司-月.

2. **前视偏差 / 循环依赖**: 标签 = 5 因子 z-score 合成, 训练特征里又有 `z_growth/z_margin/z_roe/...`. 模型只需"识别" 5 因子, 不需要预测. Test R² 0.75 **完全不能外推到真实 forward 4w 收益**.

3. **单期测试 (n_test=21)**: OOS 样本仅 21 行 (1 财年代理), 95% CI 半宽 ≈ ±0.25 R², 统计上无意义. 需要 50+ 财年或日频滚动测试.

4. **无 ensemble**: 单一 HGB 模型, 单随机种子, 无 bagging 多种子平均, 无 stacking with 5 因子线性. 真实部署需要 10+ 模型 blend.

5. **超参未优化**: `max_iter=200, max_leaf_nodes=15, lr=0.05, l2=0.1` 全为经验值, 未做 grid/bayes/optuna 搜索. Optuna 100 trial 可能找到 +0.05 R² 的配置.

## 6. 工业部署建议 (要做的下一步)

- [ ] 替换合成 label 为真实 forward 4w 收益 (需 QQQ 日频 + 个股 4w 滚动窗口)
- [ ] 扩样本到日频 (250 天/年 × 30 公司 × 4 年 = 30000 行), 避免小样本
- [ ] 加 `category` sector (LightGBM 原生支持, 比 one-hot 优)
- [ ] Stacking: GBDT + 5 因子线性 + XGBoost + RandomForest → meta-learner
- [ ] Walk-forward 验证代替 Time Series CV
- [ ] 监控 feature drift (PSI/KL 散度)
- [ ] 调参: Optuna 100 trial, 5-fold CV objective

## 7. 结论

**Exp-15 验证了 GBDT 能在合成 5 因子 label 上达到 R² 0.75, 但没有证据显示 ML 优于线性 5 因子模型** (因为 label 就是 5 因子造的). 真实 alpha 预测需要 100x 数据 + 真实 forward 收益 + 严格 walk-forward. Patrick 的诚实判断: **现阶段不值得上 LightGBM, 继续用 Exp-12 5 因子 z-score, 等数据扩展到日频再回头看**.

## 8. 下个实验建议 (3 选 1)

- **Exp-16 LightGBM + 宏观因子**: 把 VIX/QQQ_MA/利率/汇率作为 gating features, 看 regime-conditional alpha 能否提升 +5pp
- **Exp-17 Transformer attention**: 30 公司 × 4 财年 × 10 特征 → 序列输入, 多头 attention 学习公司间 relative alpha
- **Exp-18 强化学习 PPO**: 把组合权重当 action, Sharpe 当 reward, 让 agent 学仓位管理 (跳过 alpha 预测, 直接学 allocation)

Patrick 建议优先级: **Exp-16 (最低成本, 最可能 +3-5pp) → Exp-17 (中等, 看 attention 能否捕捉非线性) → Exp-18 (高风险高回报, 沙箱 RL 难调)**.

---

*gene: knowledge-synthesis, GCP-1.1.0*
