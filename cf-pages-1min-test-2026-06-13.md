# CF Pages 1 min 试 — 5G 解墙最终测试

## 现状
- ✅ Vercel deploy 完 6 个公网文件 (6/6 HTTP 200)
- ❌ Vercel `*.vercel.app` 国内 GFW 墙 (跟 workers.dev 一样)
- ❌ CF Pages `*.pages.dev` 未测试 (可能墙 / 可能通)

## 1 min CF Pages 试 (Patrick 你手做, 沙箱不能代)

### Step 1: 浏览器开 CF 控制台 (15s)
- 浏览器开 https://dash.cloudflare.com/
- 左侧 **Workers & Pages**

### Step 2: Create Pages project (30s)
- 右上 **Create application** → **Pages** tab (不是 Workers!)
- **Connect to Git** → 选 GitHub
- 选 `polyglotszeng/patrick-reports` 仓
- 点 **Begin setup**

### Step 3: Build 设置 (15s)
- **Project name**: `patrick-reports-pitch` (新名, 避免 Worker 冲突)
- **Production branch**: `main`
- **Framework preset**: `None`
- **Build command**: **留空**
- **Build output directory**: `/`
- **Root directory**: **留空**

点 **Save and Deploy**

### Step 4: 等 build (1-3 min)
- 跳转到项目页
- 看 Build log, 1-3 min build 完
- URL 顶部显示: `https://patrick-reports-pitch.pages.dev`

### Step 5: 5G 手机试 (30s)
- iPhone 关 WiFi, 开 5G
- 浏览器开 `https://patrick-reports-pitch.pages.dev/pitch`
- **预期 1**: 立即加载 (5G 国内可访问) = **5G 解墙真解, 0 成本!**
- **预期 2**: 仍 timeout = pages.dev 也被墙, 必须买 patrick-reports.com (¥65) 真解

## 5 falsification

1. **CF Pages build 失败** — 看 Build log, 90% 是 build command / output dir 错
2. **5G 仍 timeout** — pages.dev 跟 workers.dev 一样 GFW 墙, 走买域名路径
3. **DNS propagation 慢** — 5G 手机换 4G / 朋友 5G 试
4. **iOS Safari 跟微信内置浏览器不同** — 用 Safari 不用微信
5. **CF Pages build 慢** (>5 min) — 第一次 deploy 冷启, 退后 5 min 再试

## 真解路径 (5 min, 1 个域名)

如 CF Pages 也墙 (低概率), 唯一真解:
1. 浏览器开 https://dash.cloudflare.com/
2. Domain Registration → Register Domains
3. 搜 `patrick-reports.com` → $9.15 → Continue
4. 信用卡 / Apple Pay 付
5. 1-2 min 注册完
6. Vercel 绑域 (5 min, 我可代)
7. 5G 立即可访问 `https://patrick-reports.com/pitch`

## 时间表

- 0 min: Patrick 1 min OAuth CF Pages 试
- 1 min: CF Pages build 开始
- 4 min: build 完 + 5G 试
- 5 min: 5G 真解 OR 走买域名
- 10 min: 5G 100% 真解 (买 patrick-reports.com)

## 总结

- 0 成本试 CF Pages 1 min (Patrick 1 min OAuth)
- 5G 国内 5 min 真解路径 = 买域名 ¥65
- 完整指南: `~/Desktop/5g-fix-10min-2026-06-13.md`
