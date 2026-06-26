---
title: "OpenSwarm Umami + 公网反代 — 周末 30 min 完整 setup 手册"
date: 2026-06-13 12:25 CST
author: Patrick (via Hermes)
type: setup-guide
status: ready-to-execute
tags: [umami, cloudflare-tunnel, cloudflared, reverse-proxy, self-hosted-analytics, openclaw-counter]
---

# OpenSwarm Umami + 公网反代 — 周末 30 min 完整 Setup

**前置**: 你已开 NAS SSH (今天 6-13), 装好 docker (今天验证), 装好 cloudflared (Mac 端 + NAS 端)
**目标**: 137 HTML 公网带 Umami 阅读 + 转发计数, 数据自有 ($0)

## 5 Falsification (Patrick 必读)

1. **Cloudflare Worker 私网不通** — Worker 跑 Cloudflare 边缘, 192.168.31.66 是私网, 除非 NAS 有公网 IP 否则 Worker 不能直连. **必须 cloudflared tunnel 桥接** (方案 A+B 混合)
2. **cloudflared 临时隧道 --url** — 24h 过期, 周末 demo OK 但不能长期. 长期需 named tunnel + DNS 记录
3. **Umami 装失败** — docker 权限可能不够, 需 `sudo` 拉 docker socket 或 polyhlots 加 docker 组
4. **Patrick 周末有空** — 这是周末任务, 工作日装不现实
5. **137 HTML 全注入** — inject-counter-136.sh 已试过 1 次 (118 注入 / 18 跳过 / 1 错误), 周末用真 website-id 重跑

## 7 步 Setup (周末 30 min)

### Step 1 (3 min): 装 Umami on NAS

```bash
# SSH 到 NAS
ssh polyhlots@192.168.31.66

# 看是否在 docker 组
id polyhlots
# 如果没在 docker 组, 跑这条 (需要 sudo 密码):
sudo usermod -aG docker polyhlots
# 然后 logout + login

# 装 Umami + Postgres
mkdir -p /volume1/docker/umami
cd /volume1/docker/umami
# copy ~/Desktop/umami-install-nas.sh 内容到这里
bash /volume1/homes/polyhlots/umami-install-nas.sh
# 或者直接复制 (从 Mac 推过来):
scp ~/Desktop/umami-install-nas.sh polyhlots@192.168.31.66:/volume1/docker/umami/
ssh polyhlots@192.168.31.66 'cd /volume1/docker/umami && sudo docker compose up -d'
```

**验证**: 浏览器开 http://192.168.31.66:3000 → 应该看到 Umami 登录页

### Step 2 (5 min): 改默认密码 + 加 website

1. 登录: admin / umami
2. 立即改密码 (Settings → Profile → Change password)
3. Settings → Websites → Add website
   - Name: `Patrick Reports`
   - Domain: `patrick-reports.patrick-l-zeng.workers.dev`
   - Enable: ✅
4. 复制 **Website ID** (UUID 格式) — 备用

### Step 3 (3 min): Mac 端改 inject-counter 占位 → 真 website-id

```bash
# 跑 inject 脚本, 传真 website-id
bash ~/Desktop/inject-counter-136.sh "PASTE-UUID-HERE"
# 应该 118 注入 / 18 跳过 / 1 错误 (跟之前 test 一致)
```

### Step 4 (5 min): NAS 装 cloudflared + 起隧道

```bash
# NAS 上 (用 Homebrew-like 方式或下载 binary)
wget -O /usr/local/bin/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared_linux_arm64
chmod +x /usr/local/bin/cloudflared
cloudflared --version

# ⚠️ 关键: 需先在 Mac 端 login 拿 cert, 或跳过 login 用临时隧道
# Mac 端: cloudflared login (浏览器开 + 选 patrick-l-zeng.workers.dev 域)
# 然后把 cert.pem 复制到 NAS
scp ~/.cloudflared/cert.pem polyhlots@192.168.31.66:~/.cloudflared/
ssh polyhlots@192.168.31.66 'mkdir -p ~/.cloudflared && mv ~/cert.pem ~/.cloudflared/'

# ⚠️ 更简单: 用临时隧道 (24h 有效, 周末 demo OK)
ssh polyhlots@192.168.31.66 'nohup cloudflared tunnel --url http://localhost:3000 > /tmp/umami-tunnel.log 2>&1 &'
# 等 5s, 读 URL
ssh polyhlots@192.168.31.66 'grep -oE "https://[a-z-]+\.trycloudflare\.com" /tmp/umami-tunnel.log | head -1'
# 拿到的 URL 类似: https://xxxx.trycloudflare.com
```

### Step 5 (3 min): 改 Cloudflare Worker 反代上游

```bash
# 改 ~/patricks-reports/umami-reverse-proxy.js
# 把 UMAMI_UPSTREAM 改成 trycloudflare URL
sed -i '' 's|UMAMI_UPSTREAM = "http://192.168.31.66:3000"|UMAMI_UPSTREAM = "https://xxxx.trycloudflare.com"|' ~/patricks-reports/umami-reverse-proxy.js

# 改名为 _worker.js (覆盖现有, 激活 Worker 路由)
cp ~/patricks-reports/umami-reverse-proxy.js ~/patricks-reports/_worker.js

# Commit + push
cd ~/patricks-reports
git add _worker.js
git commit -m "feat: umami 反代 worker (trycloudflare tunnel upstream)"
git push origin main
```

### Step 6 (3 min): Cloudflare Dashboard 加 Worker Route

⚠️ 这步必须**手动**在 Cloudflare Dashboard 配 (脚本做不到):

1. 浏览器开 https://dash.cloudflare.com/
2. Workers & Pages → patrick-reports → Triggers → Routes → Add route
3. Route: `umami.patrick-reports.patrick-l-zeng.workers.dev/*`
4. Worker: `umami-reverse-proxy` (或 `patrick-reports` 默认 worker)
5. Save

**或者**: 在 `_worker.js` 里加个 if 分支, 不需要 dashboard 配置 (我们已写在文件里)

### Step 7 (5 min): 全链路验证

```bash
# 1. NAS Umami 通
curl -sI http://192.168.31.66:3000/ | head -1
# 应该: HTTP/1.1 200

# 2. NAS cloudflared 隧道通
ssh polyhlots@192.168.31.66 'curl -sI https://xxxx.trycloudflare.com/ | head -1'
# 应该: HTTP/2 200

# 3. Cloudflare Worker 反代通 (5-10 min cache 等待)
sleep 600  # 等 10 min
python3 -c "import urllib.request; print(urllib.request.urlopen('https://umami.patrick-reports.patrick-l-zeng.workers.dev/umami-health', timeout=30).read().decode())"
# 应该看到: {"status":"ok","upstream":"https://xxxx.trycloudflare.com",...}

# 4. 公网 1 个 HTML 实际加载 Umami
open https://patrick-reports.patrick-l-zeng.workers.dev/openswarm-investor-briefing-2026-06-13.html
# 浏览器 DevTools → Network → 找 script.js 请求 → 应指向 umami.patrick-reports.patrick-l-zeng.workers.dev/script.js
```

## 4 件备份 / 监控脚本 (周末激活后跑)

### cron 1: 每日 9:00 跑 stats-update (自动改简报 4 data-to 数字)
```bash
crontab -e
# 加:
0 9 * * * bash /Users/patrick/bin/openswarm-stats-update.sh
```

### cron 2: 每日 23:30 跑 sync-daily-reports (Desktop → 公网)
- 已存在 `cron 9bbb4c3109a0` (无需配)

### cron 3: 每 6h 跑 umami-watchdog
```bash
crontab -e
# 加:
0 */6 * * * bash /Users/patrick/Desktop/umami-watchdog.sh
```

### cron 4: 监控 cloudflared tunnel 状态 (NAS 端)
```bash
# 在 NAS 上:
crontab -e
# 加:
*/30 * * * * pgrep -f 'cloudflared tunnel' || (echo "restart cloudflared" | mail -s "umami tunnel down" patrick@x.com)
```

## 1 句话总结

**30 min 周末搞定的 7 步: 装 Umami + 改密码 + 拿 UUID + 替换占位 + NAS 起 cloudflared tunnel + Worker 改 upstream + Dashboard 配 Route. 数据自有 ($0) + GDPR 合规 + 跨设备转发计数. 5 falsification: Worker 私网不通 / 临时隧道 24h / docker 权限可能 / 137 HTML 注入误差 / 周末有空否.**
