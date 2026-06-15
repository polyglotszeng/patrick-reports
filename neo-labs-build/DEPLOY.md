# Neo Labs Tracker - 部署到 2017zyl.xyz/neo-labs/

## 📍 部署信息

- **域名**: 2017zyl.xyz（Patrick 个人域名，2026-06-13 阿里/HiChina 注册）
- **CF 仓**: polyglotszeng/patrick-reports（已存在，CF Pages 部署）
- **本项目路径**: monorepo 子目录 `neo-labs/`
- **目标 URL**: `https://2017zyl.xyz/neo-labs/`
- **子路径**: `/neo-labs/`

## 🚀 部署流程

### 方式 1: 通过 GitHub Action 自动部署（推荐）

1. **复制项目到 monorepo**:
   ```bash
   cp -r /Users/zl/Documents/neo-labs-nextjs/* \
         ~/patricks-reports/neo-labs/
   ```

2. **在 patrick-reports 仓设置 GitHub Secrets**:
   - `CLOUDFLARE_API_TOKEN`: CF API Token（已有）
   - `CLOUDFLARE_ACCOUNT_ID`: CF Account ID（已有）

3. **推送触发自动部署**:
   ```bash
   cd ~/patricks-reports
   git add neo-labs/
   git commit -m "feat(neo-labs): deploy v3.0 with 28 files"
   git push origin main
   # → GitHub Action 自动构建 + 部署到 CF Pages
   ```

### 方式 2: 本地手动部署（快速测试）

```bash
cd /Users/zl/Documents/neo-labs-nextjs
npm install
npm run deploy:prep   # = build + 复制数据 + 准备 out/

# 部署到 patrick-reports 的 out 目录
# 1. 复制 out/ 内容到 CF Pages 项目的部署目录
cp -r out/* ~/patricks-reports/out/neo-labs/

# 2. 或用 wrangler 直接部署（推荐）
export CLOUDFLARE_API_TOKEN=your_token
export CLOUDFLARE_ACCOUNT_ID=your_account
npm run deploy:cf
```

## 📁 项目结构（monorepo 子目录）

```
patrick-reports/  (CF Pages project)
├── index.html          (主站)
├── ...
├── neo-labs/           (本项目部署目录)
│   ├── index.html      (Neo Labs 首页)
│   ├── labs/
│   │   ├── index.html  (列表)
│   │   ├── openai/
│   │   │   └── index.html
│   │   └── ... (25 家)
│   ├── compare/
│   ├── portfolio/
│   ├── portfolio-heatmap/
│   ├── watchlist/
│   ├── quarterly/
│   ├── _next/static/  (JS/CSS bundles)
│   └── neo-labs/        (JSON 数据)
│       ├── labs.json
│       ├── main.json
│       └── watchlist.json
```

## ⚙️ 关键技术点

### 1. basePath 配置
- `next.config.js`: dev 时 basePath=''，prod 时 basePath='/neo-labs'
- `basePath` 自动影响所有 `<Link>` 组件
- `assetPrefix` 影响 `_next/static/` 资源路径

### 2. 静态数据加载
- 数据从 `public/neo-labs/*.json` 加载（被 `next export` 复制到 `out/neo-labs/`）
- `lib/data.ts` 自动从 public 或 app/data 加载
- 客户端 fetch 路径自动用 basePath 拼接

### 3. CF Pages 配置
- `_redirects`: 缓存控制 + 安全头
- `wrangler.toml`: project 配置（兼容 CF Pages）
- 静态导出 = 不需要 Node.js runtime

## 🔄 更新部署

```bash
# 1. 改完代码后
cd /Users/zl/Documents/neo-labs-nextjs
npm run deploy:prep

# 2. 同步到 monorepo
rsync -av --delete \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=out \
  --exclude=.git \
  ./ ~/patricks-reports/neo-labs/

# 3. 部署
cd ~/patricks-reports
git add neo-labs/
git commit -m "feat(neo-labs): update"
git push origin main
```

## 🐛 故障排除

### 问题 1: 链接指向 404
- 原因: basePath 在 dev 环境未启用
- 解决: 用 `npm run build` 验证（会启用 basePath='/neo-labs'）

### 问题 2: JSON 数据 404
- 原因: fetch 路径不对
- 解决: 确保 `public/neo-labs/*.json` 存在，且 `npm run deploy:prep` 已复制到 `out/neo-labs/`

### 问题 3: 样式资源 404
- 原因: assetPrefix 未设置
- 解决: 检查 `next.config.js` 中 `assetPrefix: isProd ? basePath : ''`

## 📊 当前状态

- ✅ 8 个页面（首页/列表/详情/对比/Portfolio/Heatmap/Watchlist/Quarterly）
- ✅ 7 个客户端组件
- ✅ 3 个工具库
- ✅ 完整 25 家 Neo Labs 数据
- ✅ Monte Carlo + IV + Greeks 完整分析
- ✅ 部署到 2017zyl.xyz/neo-labs/
