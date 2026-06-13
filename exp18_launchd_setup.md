# Exp-18 IBKR 自动抓数据 — 周末 LaunchAgent 部署

> **目的**: Patrick 周末 14:00 (Sat) 自动跑 Exp-18 IBKR 抓 NQ-100 季度 OHLC, 不需要手敲命令.
> **依赖**: ① IBKR TWS 启动并开 API 端口 7497 (Patrick 周末先开) ② FRED API key (无 key 也跑, 跳过宏观步骤)

## 1. 安装 (一次, 2 分钟)

### 1.1 设置 FRED API key

申请 5 分钟: https://fred.stlouisfed.org/docs/api/api_key.html → 拿到 32 字符 key

```bash
# 替换 plist 里 __SET_FRED_KEY__ 为真实 key
sed -i '' 's|__SET_FRED_KEY__|你的_32字符_key|g' ~/Library/LaunchAgents/com.patrick.exp18-ibkr-fetch.plist
```

### 1.2 加载 launchd job

```bash
# 加载 (周六 14:00 自动跑)
launchctl load -w ~/Library/LaunchAgents/com.patrick.exp18-ibkr-fetch.plist

# 验证加载
launchctl list | grep exp18
# 期望: - 0 com.patrick.exp18-ibkr-fetch (横杠 = 上次未跑过, 等周六 14:00)
```

### 1.3 安装 Python 依赖 (Mac 本地)

**关键**: 周末跑 launchd **必须**用 Homebrew Python 3.14, 不用系统 `/usr/bin/python3` 3.9.6 — launchd GUI 沙箱会把 `/usr/bin/python3` 解析成 Xcode 工具链, 没权限访问 `~/Desktop/`. plist 已配 `/opt/homebrew/bin/python3` 绝对路径兜底.

```bash
# Homebrew python3.14 (plist 用的)
pip3 install ib_insync fredapi yfinance pandas tqdm numpy

# 验证 Homebrew python3 可读脚本 (端到端验证)
python3 -c "import sys; print(sys.executable); print(sys.version)"
# 期望: /opt/homebrew/bin/python3, 3.14.x
```

## 2. 周末执行 (周六上午, 5 分钟)

### 2.1 启动 IBKR TWS paper trading

- 打开 IBKR TWS (Mac 应用)
- 登录 paper 账户 (用户名 + 密码)
- File → Global Configuration → API → Settings:
  - ✅ Enable ActiveX and Socket Clients
  - Socket port: **7497**
  - Trusted IPs: 127.0.0.1
  - 点 OK
- File → Global Configuration → API → Precautions:
  - ❌ Bypass Order Pre-Settings for API Orders (避免误下单, 我们只读)

### 2.2 等周六 14:00 自动跑 (无需操作)

launchd 会自动:
1. 启动 `/usr/bin/python3 /Users/patrick/Desktop/exp18_ibkr_fetch.py`
2. 抓 30 公司 × 16 季度 OHLC (5-10 分钟)
3. 抓 FRED 宏观 (1 分钟)
4. 合并 panel (1 分钟)
5. 5 Falsification 健康检查 (1 分钟)

### 2.3 跑完看结果

```bash
# 看 stdout 日志
cat ~/Desktop/exp18_real_data/launchd_stdout.log | tail -30

# 看最终 panel
ls -la ~/Desktop/exp18_real_data/panel_quarterly_30x16.csv
head -5 ~/Desktop/exp18_real_data/panel_quarterly_30x16.csv
```

## 3. 立即手动跑 (不等周六)

```bash
# 先停止 launchd 自动跑 (避免冲突)
launchctl unload ~/Library/LaunchAgents/com.patrick.exp18-ibkr-fetch.plist

# 手动跑 (前台, 看实时输出)
cd ~/Desktop
export FRED_API_KEY=你的_32字符_key
python3 exp18_ibkr_fetch.py

# 跑完重新加载 launchd
launchctl load -w ~/Library/LaunchAgents/com.patrick.exp18-ibkr-fetch.plist
```

## 4. 故障排查

| 症状 | 原因 | 修复 |
|---|---|---|
| `IBKR connection timeout` | TWS 没开 / 端口错 | 检查 TWS paper 7497 端口, 重启 TWS |
| `FRED API key invalid` | key 错 / 没设环境变量 | 检查 plist 里 FRED_API_KEY, 重新申请 |
| `ticker NVDA 抓 0 行` | IBKR 限流 / 网络 | 重跑 (脚本有断点续传, 跳过已抓的) |
| `python3: command not found` (launchd 路径问题) | Mac PATH 限制 | plist 已配 PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin |
| `/Applications/Xcode.app/.../python3: can't open file` | launchd 沙箱把 `/usr/bin/python3` 解析成 Xcode 工具链 | plist 已改用 `/opt/homebrew/bin/python3` 绝对路径 (2026-06-12 端到端验证过) |
| `Permission denied ~/Desktop` | launchd 沙箱 | WorkingDirectory=/Users/patrick/Desktop 已配 |

## 5. 卸载 (清理)

```bash
# 停 + 删
launchctl unload ~/Library/LaunchAgents/com.patrick.exp18-ibkr-fetch.plist
rm ~/Library/LaunchAgents/com.patrick.exp18-ibkr-fetch.plist
```

## 6. 验证结果后下一步

跑成功后, 用同一份 panel 跑 Exp-12 5 因子真实 OOS 验证:

```bash
# 准备: 把 panel 转成 nq100_quarterly_panel_real.csv
cp ~/Desktop/exp18_real_data/panel_quarterly_30x16.csv ~/Desktop/nq100_quarterly_panel_real.csv

# 跑 Exp-12 真实数据版 (复制 exp17_run.py, 改输入路径)
cd ~/Desktop
python3 -c "
import pandas as pd
panel = pd.read_csv('nq100_quarterly_panel_real.csv')
print('Real panel shape:', panel.shape)
print('Columns:', list(panel.columns)[:20])
print('Head:')
print(panel.head(3))
"
```

## 关键提醒

- **必须先启动 TWS** — launchd 不会自动开 TWS, 周末上午先开 paper 账户
- **FRED key 一次性设置** — plist 里写死, 改 key 需 unload + 改 plist + load
- **断点续传** — 脚本自动跳过已抓 ticker, 重启 launchd 不会重抓
- **不要周六 14:00 之前跑** — launchd 配置是 Saturday 14:00, 改时间要 unload + 改 + load
