# Patrick's Daily Reports

每日由 Hermes 自动生成的 HTML 报告 / 调研 / 数据可视化。

## 部署
- GitHub: `polyglotszeng/patrick-reports`
- Cloudflare Pages: `patrick-reports.pages.dev`（接入后生效）
- 自定义域名：待绑定

## 自动化
每日由 `~/bin/sync-daily-reports.sh` 同步 Desktop 上生成的 HTML，git push 触发 Cloudflare Pages 自动部署。

## 目录
- `index.html` — 报告门户（自动从 `reports.json` 拉取）
- `reports.json` — 报告元数据列表（自动维护）
- `rss.xml` — RSS 订阅
- `*.html` — 实际报告
