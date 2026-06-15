# Neo Labs Tracker - Next.js 完整版

## 启动

```bash
cd /Users/zl/Documents/neo-labs-nextjs
npm install
npm run dev
# 访问 http://localhost:3000
```

## 功能

- ✅ **首页仪表板**（4 维 KPI + Top 5 实验室 + 季度变化快讯）
- ✅ **实验室列表页**（20 列可点击排序 + 6 维筛选 + 全文搜索 + 卡片视图）
- ✅ **实验室详情页**（动态路由 `/labs/[slug]` + 4 区块 + AI 投资观察）
- ✅ **对比视图**（最多 3 家并排 + 16 字段 + AI 对比）
- ✅ **投资组合**（localStorage 持久化 + MOIC/IRR/现金流/退出情景）
- ✅ **JSON 下载**（25 家完整数据）
- ✅ **静态导出**（`output: 'export'` = 可部署到任何静态托管）

## 部署到 Vercel/Cloudflare Pages

```bash
npm run build
# 输出到 ./out/ 目录
# 上传 ./out/ 到任何静态托管
```

## 数据源

- `app/data/neo-labs-main.json` (20 家主榜)
- `app/data/neo-labs-watchlist.json` (5 家 Watchlist)
- `app/data/neo-labs-public.json` (17 字段公开版)
- `app/data/neo-labs-internal.json` (29 字段内部版)

## 文件结构

```
neo-labs-nextjs/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # 首页仪表板
│   ├── labs/
│   │   ├── page.tsx          # 列表页
│   │   └── [slug]/page.tsx   # 详情页
│   ├── compare/page.tsx      # 对比页
│   ├── portfolio/page.tsx    # 投资组合
│   ├── data/                 # JSON 数据
│   └── globals.css
├── components/
│   ├── LabCard.tsx
│   ├── KPIDashboard.tsx
│   ├── SortableTable.tsx
│   └── ...
├── lib/
│   ├── analytics.ts          # Monte Carlo / IRR
│   └── types.ts
└── package.json
```
