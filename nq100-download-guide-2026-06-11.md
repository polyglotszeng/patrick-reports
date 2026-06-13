# NASDAQ-100 财务数据下载指南

**目标**：你下载 100 家公司财报 CSV，发我 → 我做财务分析 + 投资策略 + obsidian + HTML

---

## 📊 100 家公司清单（NASDAQ-100，2025-2026 最新版）

按市值分桶，2025-12 截止（重排每年 12 月 + 季度调整）：

### 🥇 Mega Cap (>$1T, 7 家)
```
AAPL   Apple                          (Technology - Consumer Electronics)
MSFT   Microsoft                      (Technology - Software)
NVDA   NVIDIA                         (Technology - Semiconductors)
AMZN   Amazon                         (Consumer - E-commerce/Cloud)
GOOGL  Alphabet (Class A)              (Technology - Internet)
META   Meta Platforms                 (Technology - Social Media)
TSLA   Tesla                          (Consumer - Automotive)
```

### 🥈 Large Cap ($200B-$1T, 22 家)
```
AVGO   Broadcom                       (Technology - Semiconductors)
COST   Costco                         (Consumer - Retail)
NFLX   Netflix                        (Communication - Streaming)
TMUS   T-Mobile US                    (Communication - Telecom)
ASML   ASML Holding (ADR)             (Technology - Semicon Equipment)
CSCO   Cisco                          (Technology - Networking)
ADBE   Adobe                          (Technology - Software)
AMD    Advanced Micro Devices         (Technology - Semiconductors)
PEP    PepsiCo                        (Consumer - Beverages)
LIN    Linde                          (Materials - Industrial Gases)
AZN    AstraZeneca (ADR)              (Healthcare - Pharma)
QCOM   Qualcomm                       (Technology - Semiconductors)
INTU   Intuit                          (Technology - Software)
TXN    Texas Instruments              (Technology - Semiconductors)
AMGN   Amgen                          (Healthcare - Biotech)
HON    Honeywell                      (Industrials - Aerospace)
ISRG   Intuitive Surgical             (Healthcare - Medical Devices)
BKNG   Booking Holdings               (Consumer - Travel)
SBUX   Starbucks                      (Consumer - Restaurants)
VRSK   Verisk Analytics               (Industrials - Data Analytics)
GILD   Gilead Sciences                (Healthcare - Biotech)
ADP    Automatic Data Processing      (Industrials - HR Services)
PDD    PDD Holdings (ADR)             (Consumer - E-commerce)
```

### 🥉 Mid Cap ($50B-$200B, 35 家)
```
MU     Micron Technology              (Technology - Memory)
PANW   Palo Alto Networks             (Technology - Cybersecurity)
REGN   Regeneron                      (Healthcare - Biotech)
MELI   MercadoLibre                   (Consumer - LatAm E-commerce)
LRCX   Lam Research                   (Technology - Semicon Equipment)
INTC   Intel                          (Technology - Semiconductors)
ORLY   O'Reilly Automotive            (Consumer - Auto Parts)
KLAC   KLA Corporation                (Technology - Semicon Equipment)
CTAS   Cintas                         (Industrials - Uniforms)
WDAY   Workday                        (Technology - HR Software)
ROP    Roper Technologies             (Industrials - Diversified)
CDNS   Cadence Design Systems         (Technology - EDA Software)
SNPS   Synopsys                       (Technology - EDA Software)
MRVL   Marvell Technology             (Technology - Semiconductors)
AEP    American Electric Power        (Utilities - Electric)
MCHP   Microchip Technology           (Technology - Semiconductors)
FTNT   Fortinet                       (Technology - Cybersecurity)
DXCM   Dexcom                         (Healthcare - Medical Devices)
NXPI   NXP Semiconductors             (Technology - Semiconductors)
PYPL   PayPal                         (Financial - Payments)
PCAR   PACCAR                         (Industrials - Trucks)
CPRT   Copart                         (Industrials - Auto Auction)
KDP   Keurig Dr Pepper                (Consumer - Beverages)
EXC    Exelon                         (Utilities - Electric)
ROST   Ross Stores                    (Consumer - Retail)
MNST   Monster Beverage               (Consumer - Beverages)
PAYX   Paychex                        (Industrials - HR Services)
IDXX   IDEXX Laboratories             (Healthcare - Vet Diagnostics)
ODFL   Old Dominion Freight           (Industrials - Trucking)
FAST   Fastenal                       (Industrials - Fasteners)
EA     Electronic Arts                (Communication - Gaming)
ANSS   ANSYS                          (Technology - Engineering Software)
VRTX   Vertex Pharmaceuticals         (Healthcare - Biotech)
XEL    Xcel Energy                    (Utilities - Electric)
BKR    Baker Hughes                   (Energy - Oil Services)
ENPH   Enphase Energy                 (Energy - Solar)
ON     ON Semiconductor                (Technology - Semiconductors)
GEHC   GE HealthCare                  (Healthcare - Medical Devices)
FANG   Diamondback Energy             (Energy - Oil & Gas)
TTD    Trade Desk                     (Technology - Ad Tech)
ZS     Zscaler                        (Technology - Cybersecurity)
```

### 🌱 Small-Mid Cap (<$50B, 36 家)
```
WBA    Walgreens Boots Alliance       (Consumer - Pharmacy)
DLTR   Dollar Tree                    (Consumer - Discount Retail)
EBAY   eBay                           (Consumer - E-commerce)
ZM     Zoom Video                     (Technology - Video Conferencing)
LCID   Lucid Group                    (Consumer - EV)
RIVN   Rivian Automotive              (Consumer - EV)
ILMN   Illumina                       (Healthcare - Genomics)
SGEN   Seagen (acquired by Pfizer)     [Removed - skip]
CHRW   C.H. Robinson                  (Industrials - Logistics)
CSGP   CoStar Group                   (Real Estate - Data)
MAR    Marriott International         (Consumer - Hotels)
WBD    Warner Bros. Discovery         (Communication - Media)
DDOG   Datadog                        (Technology - Monitoring)
TEAM   Atlassian                      (Technology - Collaboration)
ABNB   Airbnb                         (Consumer - Travel)
DASH   DoorDash                       (Consumer - Food Delivery)
SIRI   Sirius XM                     (Communication - Radio)
DISH   DISH Network                   [Removed from NQ - skip]
PTC    PTC                            (Technology - PLM Software)
NTES   NetEase (ADR)                  (Communication - Gaming)
BIDU   Baidu (ADR)                    (Technology - Search)
NTAP   NetApp                         (Technology - Storage)
SWKS   Skyworks Solutions             (Technology - RF Semis)
ALGN   Align Technology               (Healthcare - Dental)
MTCH   Match Group                    (Communication - Dating)
PDCR   PDC Energy                     [Removed/skip]
INCY   Incyte                         (Healthcare - Biotech)
LULU   Lululemon                      (Consumer - Apparel)
FIVE   Five Below                     (Consumer - Discount)
ULTA   Ulta Beauty                    (Consumer - Beauty)
VRSN   VeriSign                       (Technology - Internet Infra)
AKAM   Akamai Technologies            (Technology - CDN)
DOCU   DocuSign                       (Technology - E-Signature)
SPLK   Splunk (acquired by Cisco)      [Removed - skip]
CHKP   Check Point Software           (Technology - Cybersecurity)
CDW    CDW Corporation                (Technology - IT Distribution)
CEG    Constellation Energy            (Utilities - Nuclear)
WARN   (not in NQ)                    
ARGX   argenx (ADR)                   (Healthcare - Biotech)
ARM    Arm Holdings                   (Technology - Semiconductors)
SMCI   Super Micro Computer           (Technology - Servers)
```

**注意**：每年 12 月重排 + 季度调整。**请以你下载时实际清单为准**（券商终端有最新）。

---

## 📋 你需要下载什么

### 必须 (3 份表格)

**1) 财务摘要 (Financial Summary)**
- 每家公司 1 行
- 字段：
  - ticker
  - 名称
  - 市值 (marketCap, USD)
  - 营收 TTM (revenue, USD)
  - 净利率 TTM (netMargin, %)
  - ROE TTM (ROE, %)
  - PE Forward (forwardPE)
  - PE Trailing (trailingPE)
  - 营收增速 YoY (revenueGrowth, %)
  - 利润增速 YoY (earningsGrowth, %)
  - PEG
  - Price/Sales
  - Debt/Equity
  - Free Cash Flow TTM (freeCashflow, USD)
  - Dividend Yield (%)

**2) ESG 评分 (ESG Ratings)**
- 每家公司 1 行
- 字段：
  - ticker
  - 名称
  - MSCI ESG Rating (AAA, AA, A, BBB, BB, B, CCC)
  - Sustainalytics Risk Score (0-40+)
  - S&P Global ESG Score (0-100)
  - CDP Climate Score (A, A-, B, B-, C, C-, D, D-)
  - ESG Controversy Level (Low/Moderate/Severe/Critical)
  - Industry rank (percentile)

**3) 业务摘要 (Business Description)**
- 每家公司 1 行
- 字段：
  - ticker
  - 名称
  - 行业 (Sector)
  - 子行业 (Industry)
  - 主营业务 (1-2 句)
  - 核心产品/服务 (3-5 个)
  - 关键客户/市场
  - 主要风险 (3-5 条)
  - 竞争优势 (3-5 条)
  - CEO + 成立年份
  - 总部地点

---

## 💻 下载方法（最简单）

### 选项 A: Webull / IBKR 批量 export
1. 登录券商
2. 进 Watchlist → 加 100 家公司
3. Export to CSV
4. 部分券商含财务摘要 (EPS/PE/PEG/Market Cap)

**限制**：可能不含 ESG 评分。

### 选项 B: Yahoo Finance (免费网页)
1. 进 `finance.yahoo.com/quote/AAPL/key-statistics` → 财务摘要
2. `finance.yahoo.com/quote/AAPL/profile` → 业务描述
3. 用 Excel Power Query 批量拉 100 家
4. 复制粘贴到 CSV

**限制**：不含 ESG 评分（需另源）。

### 选项 C: MSCI / Sustainalytics (付费)
- 个人投资者通常拿不到
- 替代: 找券商 Research Report
- 或用免费 ESG data: `esgbook.com` `sustainalytics.com` (前 5 家免费)

### 选项 D: 用 Python + yfinance（你已有 jupyter）
```python
import yfinance as yf
import pandas as pd

tickers = ['AAPL', 'MSFT', 'NVDA', ...]  # 100 个
data = []
for t in tickers:
    try:
        info = yf.Ticker(t).info
        data.append({
            'ticker': t,
            'name': info.get('longName'),
            'marketCap': info.get('marketCap'),
            'revenue': info.get('totalRevenue'),
            'pe_trailing': info.get('trailingPE'),
            'pe_forward': info.get('forwardPE'),
            'peg': info.get('pegRatio'),
            'revenueGrowth': info.get('revenueGrowth'),
            'earningsGrowth': info.get('earningsGrowth'),
            'netMargin': info.get('profitMargins'),
            'roe': info.get('returnOnEquity'),
            'debtEquity': info.get('debtToEquity'),
            'freeCashflow': info.get('freeCashflow'),
            'dividendYield': info.get('dividendYield'),
            'sector': info.get('sector'),
            'industry': info.get('industry'),
        })
    except: pass
df = pd.DataFrame(data)
df.to_csv('nq100_financials.csv', index=False)
print('Saved', len(df), 'rows')
```

**注意**: yfinance 在沙箱限流，但**你 Mac 本地跑应该能成**（前面 Exp 4 yfinance 没限过）。

### 推荐组合

```
财务摘要 → 选项 D (yfinance CSV)  → nq100_financials.csv
ESG 评分 → 手动 + esgbook.com 5 家免费 + Sustainalytics 前 5
业务描述 → 选项 B (Yahoo Profile) → nq100_business.csv
```

---

## 📁 文件命名（你发我时用）

```
~/Desktop/nq100_financials.csv         (100 行 × 16 列)
~/Desktop/nq100_esg.csv                (100 行 × 8 列)
~/Desktop/nq100_business.csv           (100 行 × 9 列)
```

可分 3 次发，每次 1 个文件。我会等齐后开始分析。

---

## 🎯 我拿到后会做什么

### 1. 财务分析 (1 份主报告)
- 100 家公司按 PE / ROE / 增速 排名
- Top 10 高质量 + Top 10 高增长 + Top 10 低估 + Top 10 高股息
- 各行业龙头 vs 跟跑者对比
- 风险信号 (高 D/E, 负 FCF, 营收负增长)

### 2. ESG 整合 (1 份 ESG 报告)
- 100 家 ESG 评分分布
- MSCI AAA/AA 名单 + Sustainalytics Low Risk 名单
- ESG 风险公司 (Severe/Critical)
- ESG 趋势: 2024 vs 2025 对比

### 3. 业务分析 (1 份业务报告)
- 7 大行业分类: Tech / Healthcare / Consumer / Comm / Industrial / Energy / Utility
- 每家 1 段 100-200 字业务摘要
- 护城河强度 (Wide/Moat/None)

### 4. 投资策略 (核心交付)
- **Solo Agent 视角**：作为你 1 个亿资产的投资组合顾问
- 4 个组合方案:
  - Plan A: 分散 + 红利 (80 家公司平均权重)
  - Plan B: 集中质量 (20 家最高 ROE+FCF)
  - Plan C: 增长优先 (15 家高增速 + 高 PEG)
  - Plan D: ESG 整合 (剔除 B 以下)
- 风险预算 / 仓位管理 / 再平衡频率
- 与你 4 研究方向 (AI Agent / World Model / Personal AI OS / Quant) 关联

### 5. obsidian 归档
- `~/Documents/Obsidian Vault/llm-wiki/investments/nq100/`
- 100 个子页 (每家 1 个) + 1 个总览 + 1 个组合分析

### 6. HTML 仪表板
- 深色主题 (复用你的 dashboard 风格)
- 可排序/筛选 (按 PE/ROE/市值/ESG)
- 公网推送 (Cloudflare Pages)
- 链接到每家子页

---

## ⏱ 估计时间

| 步骤 | 你 | 我 |
|---|---|---|
| 选 ticker (100 家) | 5 min | ✅ 已列清单 |
| 下载财务 CSV | 20 min | 等待 |
| 下载 ESG CSV | 30 min (5 家免费 + 手动) | 等待 |
| 下载业务 CSV | 20 min | 等待 |
| 发 3 个文件给我 | 1 min | 等待 |
| 我做分析 | - | 1-2 hours |
| 我写 obsidian (102 文件) | - | 30 min |
| 我做 HTML 仪表板 | - | 30 min |
| 推送公网 | - | 2 min |

**总计：你 ~80 min  + 我 ~3 hours**

---

## ⚠️ 重要警告

1. **本任务涉及投资建议**——我**不是持牌投资顾问**，所有输出仅作为研究/学习用途，**不构成投资建议**
2. **数据准确性**：以官方 10-K/10-Q + SEC EDGAR 为准，券商终端次之，yfinance 末位
3. **过往业绩不代表未来回报**
4. **投资有风险，请咨询持牌专业人士**

---

## 📅 文档创建: 2026-06-11
**待 Patrick**: 下载 3 个 CSV 发我
