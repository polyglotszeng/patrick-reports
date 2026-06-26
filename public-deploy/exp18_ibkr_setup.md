# Exp-18: IBKR TWS API 抓 NQ-100 季度 OHLC — 周末执行手册

> Patrick 周末在 Mac 上直接跑,把沙箱拉不到的"真实季度 OHLC"抓回来,给 Exp-11~17 的训练补上真数据
> 一次性 ~$10/月 (IBKR paper 账户免费, live 账户 $10/月市场数据费)

---

## 0. 30 秒 TL;DR

1. Mac 装 IBKR TWS → 申请 paper 账户 → 开 API
2. 申请 FRED API key (5 分钟, 免费)
3. `pip3 install ib_insync fredapi yfinance pandas tqdm`
4. `export FRED_API_KEY=你的key`
5. `cd ~/Desktop && python3 exp18_ibkr_fetch.py`
6. 5~10 分钟自动跑完,产出 `exp18_real_data/panel_quarterly_30x16.csv` (480 行)
7. 把 panel 喂给 `exp17_run.py` 重跑 GBDT,验证真实 alpha

---

## 1. 前置条件

| 项目 | 要求 | Mac 检查命令 |
|---|---|---|
| macOS | 15.7+ (本机已确认) | `sw_vers` |
| Python | 3.9+ (系统默认 3.9.6 可用) | `python3 --version` |
| Homebrew | 任意版本 | `brew --version` |
| pip3 | 系统自带 | `pip3 --version` |
| IBKR 账户 | paper trading 免费 (推荐先开) | https://www.interactivebrokers.com/ |

> **不需要真实 IBKR 账户** — paper trading 100% 免费,IBKR 注册后默认开 paper 模拟账户,无法充值入金

---

## 2. IBKR TWS 安装

### 2.1 下载
- 官网: https://www.interactivebrokers.com/en/trading/tws.php
- Mac 用户下: **TWS for Mac** (Latest stable) → `tws-latest-macosx-x64.dmg`
- 拖入 Applications

### 2.2 登录
- 启动 TWS
- 用户名 + 密码
- **选 "Paper Trading" 账户** (左上角账户下拉框,标 "DUxxx" 前缀)
- paper 账户 = 模拟交易,无真实资金风险

### 2.3 端口确认
TWS 默认 paper 端口 = **7497**,live 端口 = 7496

设置位置: `Edit → Global Configuration → API → Settings`
- ☑ Enable ActiveX and Socket Clients
- ☑ Allow connections from localhost only
- Socket port: **7497** (paper) / 7496 (live)
- ☑ Create API message log (可选, 调试用)

> **如果改了端口**, 同步修改脚本第 56 行 `IBKR_PORT = 7497`

### 2.4 保持 TWS 运行
- 跑脚本期间 TWS 必须开,APIs 才能连
- TWS 会弹 "API connection from 127.0.0.1" 通知,选 Yes
- 不交易时 TWS 可以放后台

---

## 3. API 申请 (paper 账户已默认开)

IBKR 账户在 Account Management → Trading Platform → API 里:

1. 浏览器登录 https://rd.iam.ibkr.com
2. 选 "Paper Account"
3. Account Management → Settings → Trading Platform → **API**
4. ☑ Enable API (默认开)
5. 记下 Trust IPs: 127.0.0.1 (localhost)
6. Client ID: 任意数字 (脚本默认 18, 1-32 都行,**避开 0 和 1** 易冲突)

> **paper 账户无任何 API 申请门槛** — 真实账户才需要等审核

---

## 4. FRED API key 申请 (5 分钟)

FRED (Federal Reserve Economic Data) 提供免费宏观数据。

1. 打开 https://fred.stlouisfed.org/docs/api/api_key.html
2. 点 "Request API Key" → 邮箱注册 → 收邮件拿 key (32 位字符)
3. 免费额度: 120 req/min, 25,000 req/月 (4 宏观指标 = 4 req, 月跑 10 次 = 40 req,够用)
4. **保存好 key** (页面刷新后只能看到末尾 4 位)

> 没有 FRED key 也能跑,只是 panel 里的 VIX/NDX/10Y/USD_CNY 4 列会变 NaN,数据本身 (30 公司 OHLC) 不受影响

---

## 5. Python 依赖

```bash
# 一次性装齐 (Mac 自带 pip3)
pip3 install --user ib_insync fredapi yfinance pandas tqdm

# 如果 macOS 报 "externally-managed-environment" 错误
pip3 install --user --break-system-packages ib_insync fredapi yfinance pandas tqdm
```

| 包 | 用途 | 必需? |
|---|---|---|
| `ib_insync` | IBKR TWS 异步封装 (比官方 ibapi 简单 10x) | 是 |
| `fredapi` | FRED 宏观数据 wrapper | 否 (无 key 可跳) |
| `yfinance` | IBKR 不可用时的 fallback + ±5% 校验 | 是 |
| `pandas` / `tqdm` | 数据处理 + 进度条 | 是 |
| `numpy` | 数值 (系统已带) | - |

> Python 3.9 也兼容 (脚本里 `Optional[pd.DataFrame]` 用的是 3.9+ typing 语法)

---

## 6. 环境变量设置

把 FRED key 加进 `~/.zshrc` (Mac 默认 zsh):

```bash
# 1) 编辑 .zshrc
nano ~/.zshrc

# 2) 在末尾追加 (替换成你的真 key)
export FRED_API_KEY="abcdef1234567890abcdef1234567890"

# 3) 让当前 shell 生效
source ~/.zshrc

# 4) 验证
echo $FRED_API_KEY
# 输出应该是 32 位 key
```

> **不想持久化** 也能跑: `FRED_API_KEY=你的key python3 exp18_ibkr_fetch.py`

---

## 7. 运行

```bash
# 1) 确认 TWS 在跑 (paper 7497 端口)
lsof -iTCP:7497 -sTCP:LISTEN
# 期望输出: ... LISTEN ... 1 ... 7497

# 2) 跑脚本
cd ~/Desktop
python3 exp18_ibkr_fetch.py
```

### 7.1 预期输出节奏 (大约 5~10 分钟)

```
[Step 1/4] 抓 30 公司季度 OHLC
  ✓ NVDA: 1006 日线 → 16 季度
  ✓ AAPL: 1006 日线 → 16 季度
  ... 进度条 30/30

[Step 2/4] 抓 FRED 4 宏观
  抓 FRED VIX (VIXCLS)...
  ✓ FRED 抓取完成: (16, 4)

[Step 3/4] 合并 panel
  ✓ panel 已保存: .../panel_quarterly_30x16.csv (480 行)

[Step 4/4] 5 Falsification 健康检查
  F1 公司数: 30/30 ✓
  F2 季度数: 均值 16.0, min/max 16/16 ✓
  F3 NaN 率: 0.00% ✓
  F4 价格 sanity: 极端跳变 0 个, 全正价 True ✓
  F5 宏观列: 存在 True, NaN 0.0% ✓
  Falsification: 5/5 通过
```

---

## 8. 预期输出

`~/Desktop/exp18_real_data/` 下生成:

| 文件 | 大小 | 内容 |
|---|---|---|
| `panel_quarterly_30x16.csv` | ~50 KB | **核心产物** 480 行 panel |
| `ticker_NVDA.csv` ... `ticker_FIVE.csv` | ~5 KB × 30 | 单公司季度 OHLC (断点缓存) |
| `exp18_fetch.log` | ~50 KB | 全程日志 (每 ticker 状态) |
| `sanity_check_report.json` | ~1 KB | 5 falsification 结果 |

### panel 字段
```
ticker, date, FY, Q, open, high, low, close, volume, VIX, NDX, rate_10Y, USD_CNY
NVDA,   2022-03-31, FY22, Q1, 273.3, 295.5, 252.0, 287.1,  8765432100, 27.3, 14858.0, 2.34, 6.38
...
```

---

## 9. 断点续传

**核心设计** — 30 公司抓 5~10 分钟,中间可能挂 (网络/TWS 升级), 不用重头跑。

- 每个 ticker 抓完立即保存 `ticker_NVDA.csv` (单公司缓存)
- 重跑时 `fetch_all_tickers()` 自动扫描已有 CSV,跳过
- 只重抓失败 / 新增的 ticker

```bash
# 跑了 20/30 挂了? 直接重跑, 跳过前 20 个
python3 exp18_ibkr_fetch.py
# 日志会显示: 断点续传: 已跳过 20 个, 待抓 10 个
```

---

## 10. 常见错误

### 10.1 `IBKR 连接失败: timeout`
**原因**: TWS 没开 / 端口错 / API 未 enable
**修法**:
```bash
# 检查 TWS 在跑
lsof -iTCP:7497 -sTCP:LISTEN
# 不在 LISTEN → 启动 TWS, 登录 paper 账户

# 检查端口设置
# TWS → Edit → Global Configuration → API → Settings → Socket port: 7497
```

### 10.2 `FRED 抓取失败: Invalid API key`
**原因**: key 错 / 没激活
**修法**:
```bash
# 1) 重新登 FRED 查 key
# 2) echo $FRED_API_KEY 确认环境变量对
# 3) 新邮箱注册的 key 要点邮件激活链接
```

### 10.3 `yfinance 429 Too Many Requests`
**原因**: 限流 (30 ticker 在 1 分钟内触发)
**修法**: 脚本内 `fetch_yfinance_fallback` 已带 `time.sleep(0.5)` 保护
- 还报就加大到 `time.sleep(1.0)`
- 周末凌晨跑 (美股盘后) 几乎不触发

### 10.4 `ib_insync ImportError`
**原因**: 没装 / pip3 装到了别的 Python
**修法**:
```bash
which python3
# /usr/bin/python3
pip3 install --user ib_insync
python3 -c "import ib_insync; print(ib_insync.__version__)"
# 应输出 0.9.86+ 之类
```

### 10.5 `Calendar quarter vs Fiscal quarter 不一致`
**原因**: 苹果财年 Q1 = 10~12月,与 calendar Q4 重合
**说明**: Exp-17 训练数据用 **calendar quarter** (Q1=1-3月), 脚本也用 calendar, 保持一致
- 真要按 fiscal quarter 拆, 在 `fetch_quarterly_ohlc` 里改 `resample("Q")` 为 `resample("BQ-FY")` 之类 (本脚本不实现, 留给 Exp-19+)

---

## 11. 下一步

panel 拿到后,验证 Exp-17 的"alpha 信号"是不是真 alpha (而不是过拟合到训练知识) :

```bash
# 1) 备份原 panel
cp ~/Desktop/exp17_run.py ~/Desktop/exp17_run_real.py

# 2) 改 exp17_run.py 读真实 panel
# DESK / "nq100_complete_v2.csv" → DESK / "exp18_real_data" / "panel_quarterly_30x16.csv"

# 3) 重跑 GBDT
python3 exp17_run_real.py
# 对比 alpha_mean ±5% 区间
# - 如果 R² > 0.4 仍稳 → 真 alpha
# - 如果 R² 暴跌到 < 0.1 → 之前是过拟合训练知识
```

---

## 附: 文件清单

| 路径 | 说明 |
|---|---|
| `~/Desktop/exp18_ibkr_fetch.py` | 主脚本 (503 行, 中文注释, 周末直接跑) |
| `~/Desktop/exp18_ibkr_setup.md` | 本 README |
| `~/Desktop/exp18_ibkr_setup.html` | HTML 单文件分享版 (深色主题) |
| `~/Desktop/exp18_real_data/` | 输出目录 (跑完自动建) |
| `~/Desktop/nq100_complete_v2.csv` | 前置 NQ-100 公司列表 (105 行, 已存在) |

---

**作者**: Patrick 量化助手
**实验**: Exp-18 (IBKR TWS API 季度 OHLC 抓取)
**日期**: 2026-06-12
**前置**: Exp-11~17 NQ-100 7 个实验
**后置**: Exp-19+ 真实 alpha 验证
