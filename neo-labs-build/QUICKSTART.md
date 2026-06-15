# 🚀 部署到 2017zyl.xyz/neo-labs/ - 完整操作手册

## 📋 当前状态（已 build 验证 ✅）

```
Total Next.js files: 36
Build output: out/ (2.9 MB)
HTML files: 37
JS bundle: 0.87 MB (gzip 优化后)
Routes: 11 (首页/列表/对比/Portfolio/Heatmap/Watchlist/Quarterly/投资人/团队/下载 + 25 详情)
Build status: ✓ Compiled successfully
```

## ⚡ 立即部署（3 步）

### 步骤 1: 复制到 monorepo

```bash
# 复制本项目到 patrick-reports 仓的 neo-labs/ 子目录
cp -r /Users/zl/Documents/neo-labs-nextjs/* \
      ~/patricks-reports/neo-labs/

# 验证文件
ls ~/patricks-reports/neo-labs/ | head -20
```

### 步骤 2: 复制数据文件（out 目录）

```bash
# 静态数据已被 build 复制到 out/neo-labs/
ls /Users/zl/Documents/neo-labs-nextjs/out/neo-labs/
# 应看到: labs.json  main.json  watchlist.json
```

### 步骤 3: 提交并推送

```bash
cd ~/patricks-reports
git add neo-labs/
git commit -m "feat(neo-labs): deploy v3.0 (36 files, 25 labs, Monte Carlo + IV + Greeks)"
git push origin main

# → GitHub Action 自动触发（已配 .github/workflows/deploy.yml）
# → CF Pages 自动构建 + 部署
# → 5-10 分钟后访问 https://2017zyl.xyz/neo-labs/
```

## 🔍 部署后验证

```bash
# 测试主入口
curl -I https://2017zyl.xyz/neo-labs/

# 测试列表页
curl -I https://2017zyl.xyz/neo-labs/labs/

# 测试详情页
curl -I https://2017zyl.xyz/neo-labs/labs/openai/

# 测试 JSON 数据
curl -I https://2017zyl.xyz/neo-labs/neo-labs/labs.json
```

## 📂 已配置的部署文件（全部在项目中）

| 文件 | 用途 |
|---|---|
| `next.config.js` | basePath='/neo-labs' (prod) / '' (dev) |
| `_redirects` | CF Pages 缓存 + 安全头 |
| `wrangler.toml` | CF Workers/Pages 项目配置 |
| `.github/workflows/deploy.yml` | GitHub Action 自动部署 |
| `DEPLOY.md` | 部署文档（详细版） |
| `MONITORING.md` | 部署后监控 + 性能优化 |

## 🛠 备选部署方式（如 GitHub Action 失败）

### 方式 A: 本地 wrangler CLI

```bash
# 设置环境变量
export CLOUDFLARE_API_TOKEN=your_token_here
export CLOUDFLARE_ACCOUNT_ID=your_account_id

# 直接部署 out/ 目录
cd /Users/zl/Documents/neo-labs-nextjs
npx wrangler pages deploy out --project-name=patrick-reports
```

### 方式 B: 手动 Direct Upload

1. 打开 https://dash.cloudflare.com/
2. Pages → patrick-reports → Create new deployment
3. 上传 `out/` 目录 zip
4. 部署路径：项目 → neo-labs/

## 🔄 故障排除

### 问题 1: 404 on /neo-labs/
- 检查 `next.config.js` 中 `basePath: isProd ? '/neo-labs' : ''`
- 确认 build 时设了 `NEXT_PUBLIC_BASE_PATH=/neo-labs`
- 检查 _redirects 路径

### 问题 2: 静态资源 404
- 确认 `assetPrefix` 配置正确
- 检查 `_next/static/` 是否被复制

### 问题 3: JSON 数据 404
- 确认 `public/neo-labs/*.json` 存在
- 确认 build 复制到 `out/neo-labs/`

### 问题 4: GitHub Action 失败
- 检查 `secrets.CLOUDFLARE_API_TOKEN` 是否设置
- 检查 `secrets.CLOUDFLARE_ACCOUNT_ID` 是否设置

## 📞 紧急回滚

```bash
# 在 CF Pages Dashboard
# → patrick-reports 项目
# → Deployments → 找到上一个 working 版本
# → 点击 "..." → "Promote to Production"
```
