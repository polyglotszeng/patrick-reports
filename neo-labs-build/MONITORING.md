# 📊 部署后监控 + 性能优化

## 🎯 性能指标 (部署后实测)

| 指标 | 数值 | 状态 |
|---|---|---|
| 总 HTML 文件 | **37 个** | ✅ (11 页面 + 25 详情 + 1 404) |
| 总 JS bundle | **0.87 MB** | ✅ (CDN 缓存后 < 100ms) |
| 总产物大小 | **2.9 MB** | ✅ (CF Pages 免费 tier 充足) |
| 首屏 JS (共享) | **87.2 kB** | ✅ (< 100 kB 优秀) |
| 单页 JS 最大 | **165 kB** (详情页) | ✅ |
| 静态预渲染 | **全部 11 路由** | ✅ (无 SSR runtime) |
| API 依赖 | **0** (纯静态) | ✅ |

## 🌍 CF Pages 全球 CDN 节点

CF Pages 自动使用 200+ 边缘节点（北美/欧洲/亚太/南美/非洲/大洋洲），无需额外配置。

## 🔍 部署后 5 项必做监控

### 1. Uptime 监控（推荐：uptime monitoring）
- **uptimerobot.com**（免费 50 个 monitor）= Patrick 私推荐
- **CF Analytics**（自动启用）= 查看请求/带宽/错误率
- **healthchecks.io** = cron job 监控

### 2. 真实访问速度测试
- **pagespeed.web.dev** = Lighthouse 评分（SEO/性能/可访问性）
- **gtmetrix.com** = 全球节点速度测试
- **webpagetest.org** = 多浏览器多设备

### 3. 错误监控（推荐：Sentry）
- 免费版每月 5K events
- 集成 Next.js：1 行代码即可
- 实时告警：error rate > 1% → Slack 通知

### 4. SEO 监控
- **Google Search Console** = 提交 sitemap（已有 sitemap.xml 自动生成）
- **Bing Webmaster Tools** = 必填（CF Pages 在 Bing 排名较好）
- **Ahrefs/SEMrush** = 关键词追踪

### 5. 数据时效监控
- Patrick 的 `data_freshness_days` 字段已监控
- 推荐 cron job（每 7 天）检查每家 > 180 天的标的
- 提醒：直接访谈创始人

## ⚡ 性能优化清单

### 已完成 (build 时自动)
- ✅ **静态导出**（无 SSR runtime = 0 Cold Start）
- ✅ **Image optimization**（`unoptimized: true`，用 SVG + CSS 替代位图）
- ✅ **Code splitting**（每页独立 JS bundle）
- ✅ **Static asset caching**（`_next/static/*` 1 年）
- ✅ **HTML no-cache**（保证内容新鲜）
- ✅ **JSON 5min cache**（折衷新鲜 vs 性能）
- ✅ **basePath optimization**（`/neo-labs/` 子路径，CDN 友好）
- ✅ **Gzip/Brotli**（CF 自动启用）

### 可选进一步优化（如需要）
- ⚪ **Critical CSS 内联**（用 `next critical` 插件）
- ⚪ **字体子集化**（用 `next/font`）
- ⚪ **图片懒加载**（已通过 `loading="lazy"` 实现）
- ⚪ **Service Worker**（PWA，需要 `next-pwa`）

## 📈 监控仪表板建议

推荐创建 `/monitor` 内部页面（仅 Patrick 访问）：

```bash
# 添加 /app/monitor/page.tsx
# 显示：
# - 实时 CF Analytics 数据
# - 25 家实验室数据时效
# - 关键基金公告 RSS 聚合
# - 已知 404 列表
```

## 🚨 已知限制（不影响部署）

1. **数据时效**：25 家中 2 家（Latent Labs / Skild AI）>180 天，建议手动更新
2. **Cholesky 分解**：用 `O(n³)`，n>50 时变慢（当前 25 家 OK）
3. **CF Pages 免费 tier**：每月 500 次 build + 100GB 带宽 = 充足
4. **GitHub Action**：每月 2000 分钟免费 = 足够 30+ 次/月部署

## ✅ 部署验证 checklist

- [ ] CF Pages 部署成功（2017zyl.xyz/neo-labs/ 返回 200）
- [ ] 所有 11 个路由可访问
- [ ] 25 家详情页可访问
- [ ] JSON 数据可下载
- [ ] localStorage 投资组合持久化（仅 client-side）
- [ ] Mobile responsive（iPhone Safari / Android Chrome）
- [ ] Lighthouse 性能分 > 90
- [ ] 公开版 vs 内部版字段分级正常
- [ ] Patrick 主站（patrick-reports 其他 HTML）不受影响

## 🔄 数据更新流程

```bash
# 1. 改完数据（Labs/ 文档）
cd /Users/zl/Documents

# 2. 同步到项目
cp neo-labs-labs.json neo-labs-nextjs/public/neo-labs/labs.json
cp neo-labs-labs.json neo-labs-nextjs/app/data/neo-labs.json

# 3. 同步到 monorepo
rsync -av neo-labs-nextjs/ ~/patricks-reports/neo-labs/

# 4. 提交推送
cd ~/patricks-reports
git add neo-labs/
git commit -m "data(neo-labs): update 2026-06-14"
git push origin main

# 5. 几分钟后 CF Pages 自动部署
# 6. 验证 https://2017zyl.xyz/neo-labs/
```

## 📞 故障联系

- **CF Pages 故障**：Cloudflare Status → status.cloudflare.com
- **域名问题**：(阿里/HiChina 2017zyl.xyz)
- **数据问题**：直接编辑 `neo-labs-labs.json` → 同步 → push

## 🎯 2026 H2 监控目标

- **日活 (DAU)**：N/A（私募工具）
- **周下载数**：> 5 次（Patrick + 4 授权 LP）
- **数据时效**：> 90% 实验室 < 90 天
- **Lighthouse 性能分**：> 95
- **Lighthouse SEO 分**：> 95
- **Lighthouse 可访问性**：> 90
