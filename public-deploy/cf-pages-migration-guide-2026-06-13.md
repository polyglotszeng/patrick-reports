# Cloudflare Pages 迁移指南 — 15 min 解 GFW 墙

**适用**: `patrick-reports.patrick-l-zeng.workers.dev/pitch` 在中国大陆 5G 打开失败 (workers.dev 被 GFW 屏蔽)

**方案**: 1 套 Cloudflare Pages 项目, 走 `*.pages.dev` 子域名 (GFW 通常放行)

**耗时**: 15 min (Patrick 5 min 控制台 + 3 min 等 build + 2 min verify + 5 min 5G 测试)

## 步骤 1: Cloudflare 控制台 Create Pages project (5 min)

1. 浏览器开 https://dash.cloudflare.com/
2. 左侧栏选 **Workers & Pages** → 右上角 **Create application** → **Pages** tab → **Connect to Git**
3. 选 **GitHub** → 授权 Cloudflare 访问 GitHub (如果之前没授权)
4. 选 **polyglotszeng/patrick-reports** 仓 → **Begin setup**

## 步骤 2: Build 设置 (3 min)

**Project name**: `patrick-reports` (会自动分配 `patrick-reports.pages.dev` 子域)

**Production branch**: `main`

**Build settings** (关键 — 这是 static HTML, 不需要 build):
- **Framework preset**: `None`
- **Build command**: **留空** ❌
- **Build output directory**: `/` (或留空, 默认仓根目录)
- **Root directory**: **留空** ❌

**Environment variables**: 不用配

点 **Save and Deploy** → 等 1-3 min 第一次 build

## 步骤 3: Verify Pages URL (2 min)

Build 成功后, 跳转到 Pages project 页面, 看:
- **Visit**: `https://patrick-reports.pages.dev/`
- 应该看到仓根目录的 `index.html` (如果有) 或目录列表
- 直接试 `https://patrick-reports.pages.dev/pitch` (无 index.html, 静态文件直接 serve)

**沙箱内 verify**:
```bash
curl -sS -o /dev/null -w "HTTP: %{http_code} | Total: %{time_total}s\n" \
  --max-time 15 "https://patrick-reports.pages.dev/pitch"
# 期望 HTTP 200 | < 3s
```

## 步骤 4: 5G 手机测试 (2 min) — Patrick 必手试

1. iPhone 关 WiFi, 开 5G
2. 浏览器开 `https://patrick-reports.pages.dev/pitch`
3. **预期**: 立即加载, 跟家里 WiFi 一样
4. **如失败**: 试 `https://patrick-reports.pages.dev/openswarm-investor-briefing-2026-06-13.html`

**5 falsification**:
- ❌ **pages.dev 仍被墙** (低概率 < 10%, 但可能) → 试 Vercel (`vercel --prod` 5 min 拿 `xxx.vercel.app`)
- ❌ **Patrick 5G 走 APN 慢** (网络问题, 不是域名问题) → 试 4G / 朋友 5G / 同事 5G
- ❌ **DNS 污染** (本地运营商劫持 pages.dev) → 改 DNS 8.8.8.8 / 1.1.1.1 重试
- ❌ **HTTPS 证书问题** (iPhone 不信 CF 证书) → 升级 iOS / 用 Safari 不用微信内置浏览器
- ❌ **5G 切换回 WiFi** (iPhone 自动切回) → 飞行模式 10s 后回 5G

## 步骤 5: 两套都保 (建议)

**不卸 Workers**! `workers.dev` 在国外投资人 / 远程时仍可访问. 两套并行:
- `patrick-reports.patrick-l-zeng.workers.dev` → 国外 + 大陆外
- `patrick-reports.pages.dev` → 大陆内

**OpenSwarm 投资人简报 CONFIG 改** (`/pitch` 文件 hitsTarget):
```javascript
hitsTarget: 'patrick-reports.pages.dev/pitch'  // 改 pages.dev
// 或保留 2 个
const baseURL = location.hostname.includes('pages.dev') 
  ? 'patrick-reports.pages.dev' 
  : 'patrick-reports.patrick-l-zeng.workers.dev';
```

## 步骤 6: 失败兜底 — Vercel 5 min 备用

如 pages.dev 真被墙 (低概率), 5 min 备用:
```bash
cd /Users/patrick/patricks-reports
npm i -g vercel  # 一次性
vercel login     # 浏览器授权
vercel --prod    # 5 min 部署, 拿 xxx.vercel.app
# 然后所有 HTML 自动在 https://patrick-reports-xxx.vercel.app/pitch
```

## 步骤 7: 7 步 setup 手册 v2 同步

`~/Documents/Obsidian Vault/llm-wiki/projects/umami-setup-weekend-2026-06-13.md` 加段:
```
## 6.5 (新增) Cloudflare Pages 迁移 — 解 GFW 墙
如上 7 步, 15 min, Patrick 周末 5G 验证
```

## 总结

- ✅ **15 min 免费解 GFW 墙** (不用付费域名)
- ✅ **自动拿 pages.dev 子域** (CF Pages 标准流程)
- ✅ **两套都保** (国外用 workers, 国内用 pages)
- ⚠️ **如 pages.dev 也被墙** (低概率) → Vercel 5 min 备用
- ⚠️ **如要真"互联网"形象** → 买域名 $12/年 + 备案 7-10 天
