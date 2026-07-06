# 全球火箭发射数据库

静态 HTML 原型 + Node 数据构建器。数据源：LL2（实时/未来排期）、GCAT（历史基线）、CelesTrak SATCAT（物体交叉核验）、Space-Track（仅后端认证核验）、UNOOSA（登记国核验）。

## 本地运行

```bash
python3 -m http.server 8765
# 打开 http://localhost:8765/index.html
```

直接双击 `index.html` 也能打开（走内嵌种子数据兜底），但 JSON 加载路径请通过本地服务器测试。

## 手动刷新数据

```bash
npm run build:data          # 拉取 LL2 + GCAT，重建 data/*.json
npm run build:data:offline  # 不联网，用 cache/ 重建
LL2_PAGES=3 npm run build:data  # 调整 LL2 分页（免费额度 15 req/h，勿调太高）
```

脚本行为：LL2 分页拉取（upcoming + previous）→ GCAT TSV 弹性解析（列名候选匹配，只保留轨道发射）→ 合并去重（LL2 覆盖窗口内以 LL2 为准，同日同火箭标记 `source_conflicts`）→ 保留人工整理的 `website`/`references` 富集字段（按火箭型号匹配）→ 重建 `launches.json` / `stats.json` / `sources.json`。`objects.json` 是独立富集层，不会被覆盖。任一源拉取失败时自动回退到现有数据中该源的记录。

## 自动更新（cron）

`.github/workflows/update-data.yml`：每天 UTC 03:17 自动运行构建脚本，数据有变化时提交回仓库；也可在 Actions 页手动触发。推送到 GitHub 并启用 Actions 即生效。

## 部署

任何静态托管均可（GitHub Pages / Cloudflare Pages / Vercel 等）。配合上面的 Actions cron，页面数据每日自动更新。GitHub Pages 启用方式：仓库 Settings → Pages → 从 main 分支根目录部署。

## 约束

- 前端不调用任何需认证的服务；Space-Track 凭据严禁进入前端代码。
- 全部展示数据来自 `data/*.json` 静态文件。
- 页面在网络刷新失败时回退内嵌种子数据，保持可用。
