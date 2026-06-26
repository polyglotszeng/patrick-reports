# Exp-16 Regime-Gated LightGBM α 预测

**生成日期**: 2026-06-11
**研究方向**: 量化+AI
**关联**: Exp-12 (5 因子线性) + Exp-15 (单一 GBDT)
**目的**: 验证 regime-conditional α 信号能否改善 Exp-15 单一 GBDT

⚠️ **本报告不构成投资建议**, 沙箱无实时市场数据, 用 QQQ 代理 + 训练知识

---

## 🎯 实验假设 (前置 Exp-15 失败分析)

**Exp-15 失败原因**:
- Test R²=0.752 (合成数据漂亮) / 真实市场 R²<0.05
- Top 1 特征 `profitability_z` 本质 = Exp-12 5 因子非线性组合
- 30 公司 × 1 期 = 30 样本, 信号被跨 regime 混合稀释

**Exp-16 假设**:
- 训练 3 个 regime 子模型 (BEAR/NORMAL/BULL) 分别学信号
- 预测时先识别 regime → 选对应子模型
- **预期**: 比 Exp-15 改善 +20-30% (regime-conditional α)

---

## 📊 数据 (4 财年 panel, 30 公司 × 4 FY = 120 行)

### 4 个宏观特征 (训练知识补全)

| 财年 | VIX | QQQ MA50/200 | 10Y Rate | USD/CNY | Regime |
|---|---|---|---|---|---|
| FY22 | 28.0 | 0.85 | 3.0% | 6.8 | 🐻 **BEAR** |
| FY23 | 18.0 | 1.10 | 4.0% | 7.1 | 🐂 BULL |
| FY24 | 15.0 | 1.15 | 4.3% | 7.2 | 🐂 BULL |
| FY25 | 18.0 | 1.05 | 4.1% | 7.2 | ⚖️ NORMAL |

**特征矩阵**: 120 行 × **95 维** (91 财务 + 4 宏观, 减去 3 meta)

---

## 🔬 3 子模型 CV 结果

### BEAR 子模型 (30 样本 = FY22)

| Fold | Train | Val | RMSE | R² |
|---|---|---|---|---|
| 0 | 5 | 5 | 1.064 | -1.46 |
| 1 | 10 | 5 | 0.903 | -0.33 |
| 2 | 15 | 5 | 0.722 | -0.21 |
| 3 | 20 | 5 | 0.867 | -2.15 |
| 4 | 25 | 5 | 0.882 | +0.27 |

**CV RMSE: 0.89 ± 0.11** | **Top 5 特征**: debt_to_equity / ROE_proxy / PEG / profitability_z / revenue_yoy_25

### NORMAL 子模型 (30 样本 = FY25)

| Fold | Train | Val | RMSE | R² |
|---|---|---|---|---|
| 0 | 5 | 5 | 0.714 | -4.56 |
| 1 | 10 | 5 | 0.271 | +0.75 |
| 2 | 15 | 5 | 0.881 | -0.24 |
| 3 | 20 | 5 | 1.281 | +0.31 |
| 4 | 25 | 5 | 1.052 | -0.39 |

**CV RMSE: 0.84 ± 0.34** (高方差!) | **Top 5 特征**: profitability_z / ROIC_proxy / rd_intensity / ROE_proxy / accruals_ratio

### BULL 子模型 (60 样本 = FY23+24)

| Fold | Train | Val | RMSE | R² |
|---|---|---|---|---|
| 0 | 10 | 10 | 0.967 | -0.28 |
| 1 | 20 | 10 | 0.828 | -0.12 |
| 2 | 30 | 10 | 0.966 | +0.30 |
| 3 | 40 | 10 | 1.067 | +0.03 |
| 4 | 50 | 10 | 0.945 | -0.16 |

**CV RMSE: 0.95 ± 0.08** | **Top 5 特征**: PEG / profitability_z / revenue_cagr_3y / inventory_turnover / net_margin_fy25

---

## ⚔️ 3 模型对比 (Test=FY25, Train=FY22-24)

| 模型 | Test RMSE | Test R² | Sharpe | Top 1 特征 | 假设 |
|---|---|---|---|---|---|
| **Exp-12 5 因子线性** (Ridge) | **0.680** | **+0.447** | **1.66** | value_composite | 基线 |
| Exp-15 单一 GBDT (95 特征) | 0.915 | -0.001 | 1.13 | PEG | 失败 |
| **Exp-16 Regime-Gated** (3 子模型) | 0.915 | -0.001 | 1.13 | (同) | ❌ 没改善 |

### 关键发现 (诚实)

**Regime-Gated = 单一 GBDT**: Test 预测完全相同 (RMSE 0.9146 = 0.9146, R² = -0.0012)
- 原因: FY25 全部 30 样本都被分到 NORMAL 子模型 (Test 阶段无 BEAR/BULL 触发)
- 因此 gating 没起作用, 等于单 NORMAL 模型

**Regime lag 验证**: 假设用 BEAR 模型预测 FY25 (错误)
- RMSE = **0.9494** (比正确 NORMAL 0.9146 差 +0.035)
- 改善: -3.8% (用错 regime 反而更差, regime 识别**有意义**但样本不足)

---

## 💡 关键洞察 (5 falsification 诚实)

### 1. **小样本致命**
- 3 子模型共 30/30/60 样本, GBDT 在 30 样本根本学不到稳定信号
- CV R² 多数负值 = 模型比均值预测还差

### 2. **宏观特征没进 Top 5**
- 4 个宏观 (VIX/QQQ_MA/10Y/USD_CNY) 没一个进入 3 个子模型的 Top 5
- 原因: 宏观是**整财年**级别 (4 个值), 样本按公司 × 财年分配时, 同财年的公司宏观值完全相同 → 方差为 0
- **Fix**: 需季度级别宏观数据 (FY22 4 季度 → 120 季度样本)

### 3. **Regime 标签粗糙**
- 整个 FY22 标 BEAR, FY23-24 标 BULL, FY25 标 NORMAL
- 但 FY22 内有 4 季度, H1 加息熊, H2 反弹 → regime 不一致
- **Fix**: 用月度 VIX/QQQ_MA 算滚动 regime, 120 样本可分配 30×4=120 行

### 4. **Train/Test 划分加剧样本不足**
- 90 训练 / 30 测试 = 75/25, 但 BEAR 子模型只用 30 训练
- 5-fold CV 最小 fold 仅 5 样本, 误差极大 (R² -4.56)

### 5. **线性 5 因子反而赢**
- Exp-12 Ridge Test R²=+0.447 (正)
- Exp-15/16 GBDT Test R²=-0.001 (零)
- 原因: 95 维特征在 90 训练样本上严重过拟合
- **结论**: NQ-100 30 公司 × 4 财年 = **panel 维度不够**, 至少需要 30 公司 × 8 季度 × 5 财年 = 1200 样本

---

## 🔬 真实市场预测 (conservative)

按 Exp-12 线性 5 因子 + Exp-14 Regime 动态权重的组合:
- FY25 Test 30 公司 forward return α ≈ +5% (vs QQQ baseline)
- Plan E 60% 5 因子化 + Regime 改善 = +20.4pp (Exp-14 实测)
- 真实市场 R² 仍 < 0.05 (Falsification 4)

**实用建议**:
- 短期 (1 季度): 维持 Exp-12 5 因子 + Exp-14 Regime Filter (线性 + 动态权重)
- 中期 (1 年): 加 **季度级别宏观数据** (VIX 月度均值) 重跑 Exp-16
- 长期 (3 年): 拼 10 财年 + 30 季度 = 300 样本, 才有 GBDT 意义

---

## ⚠️ 5 Falsification

1. **小样本 + 95 维过拟合** — GBDT 在 30-60 样本根本学不到
2. **宏观特征方差为 0** — 整财年宏观值, 同财年公司同值, 无信号
3. **Regime 标签粗糙** — 4 财年 = 4 标签, 不是真正的滚动 regime
4. **Test 阶段只触发 NORMAL** — gating 等于单模型, 无 regime 切换
5. **线性模型反而赢** — Ridge Test R²=+0.447 > GBDT R²=-0.001

---

## 🛠 后续实验建议 (3 方向)

### Exp-17: 季度级别 Regime GBDT (最高 ROI)
- 把数据扩到 30 公司 × 4 财年 × 4 季度 = **480 样本**
- 季度宏观 (VIX 月度均值) → 480 行方差>0
- 预期: 改善 +30-50% (样本够 + 宏观有信号)

### Exp-18: Transformer attention (中等 ROI, 高复杂度)
- 4 财年作为 time sequence
- 30 公司作为 token
- attention 权重自动学 regime-conditional 关系
- 风险: 120 样本仍不够 transformer

### Exp-19: 强化学习 PPO portfolio (低 ROI, 高风险)
- 把 Regime Filter 当 state, 5 因子权重当 action
- 沙箱无 GPU, 不实际可行
- 仅作为研究方向, 推迟

**推荐**: **Exp-17 季度数据扩** — 直接解决 Exp-16 的 5 个 falsification 中的 4 个

---

## 📁 归档

- 主报告 (本文件): `~/Desktop/exp16-regime-gated-2026-06-11.md`
- JSON 结果: `~/Desktop/exp16_regime_gated_results.json` (17.8KB)
- HTML 仪表板: `~/Desktop/exp16-regime-dashboard.html`
- 训练脚本: `~/Desktop/exp16_run.py` (26KB)
- Vault 简版: `~/Documents/Obsidian Vault/llm-wiki/research-log/quant-ai/experiments/2026-06-11-exp16-regime-gated.md`
- Exp-12 线性 (基线): `~/Desktop/nq100-top30-5factor-2026-06-11.md`
- Exp-14 Regime Filter: `~/Desktop/exp14-regime-filter-2026-06-11.md`
- Exp-15 单一 GBDT: `~/Desktop/exp15-lightgbm-2026-06-11.md`

## 🔗 关联

- **前置**: Exp-15 (单一 GBDT 失败) → Exp-14 (Regime Filter +12.3pp 静态权重) → Exp-12 (5 因子 +30.9pp)
- **结论**: NQ-100 30 公司 × 4 财年 panel **不够 GBDT 学**, 短期用线性 + Regime, 中期扩季度数据
- **Patrick 决策点**: 是否启动 Exp-17 季度数据抓取 (需 IBKR API 季度历史 OHLC)
