# Patrick 公网主页访问指南 (2026-06-13 实战发现)

**最简**: 实时产出页 = `https://2017zyl.xyz/2017zyl-staging/daily-reports.html`

**重要修正**: Patrick 想要"实时产出" 是 `https://2017zyl.xyz/daily-reports.html` URL — 那个也存在 200, 但**CF edge cache 5-10 min 自然过期前**显示的是**旧版 828e6fc commit 内容** (37,877 bytes, 没 fixed 链接).

## 公网真拓扑 (本 session 实战发现)

| URL | 真实部署源 | 当前状态 | 何时用 |
|-----|-----------|----------|--------|
| `https://2017zyl.xyz/2017zyl-staging/daily-reports.html` | 父仓 commit 71f649a (新合并) | ✅ **NEW 39,132 bytes, 含 fixed 链接** | **Patrick 首选 (新域主页)** |
| `https://2017zyl.xyz/daily-reports.html` | 父仓 commit 50f821a (旧 daily-reports 重建) | ⚠️ 旧 37,877 bytes 5-10 min cache | 备用, 等 cache 过期 |
| `https://2017zyl.xyz/pitch` | 父仓 commit 6152c34 (pitch.html 加链接) | ✅ 35,828 bytes, 含 fixed 链接 | OpenSwarm 投资人简报 |
| `https://2017zyl.xyz/2017zyl-staging/index.html` | 父仓 commit 71f649a | ✅ 39,132 bytes, 含 fixed 链接 | 主页 (CF deploy 后的新 URL) |
| `https://patrick-reports.patrick-l-zeng.workers.dev/*` | 同父仓 (workers.dev 域绑到 CF Pages) | ✅ workers.dev deploy 60-120s 异步 | 海外访问备用 |

## 3 个反模式 (本 session 踩的坑)

### 1. 父仓 `index.html` 跟 `2017zyl-staging/index.html` 是不同文件
- 父仓 `index.html` (828e6fc 那次 commit 把 pitch 内容 cp 进去) 38,952 bytes
- `2017zyl-staging/index.html` (独立 staging 目录, **父仓从未 track 过**) 42,460 bytes
- 两者都部署到同一 Cloudflare Pages 项目, 但 CF serve 哪个? — 实际**2 个 URL 都 200, 但内容不同** (我以为它们是同一份, 错了)

### 2. 父仓 push 不影响 `2017zyl-staging/` 目录
- `2017zyl-staging/` 在父仓 working tree 是 untracked (`?? ./`)
- 它有自己"活部署"机制 (cron / rsync / CF Pages 直读 staging/), 跟 git push 完全解耦
- 我之前在父仓 index.html 加 fixed 链接 + push, 对 2017zyl.xyz 公网**完全没作用** (因为 deploy 源是 staging/, 不是父仓根的 index.html)

### 3. Cloudflare Edge Cache TTL 5-10 min
- 即使 push 成功, 边缘 cache 仍存旧版
- `/` 跟 `/index.html` 推完 5-10 min 才刷新
- 但同 commit 的新文件路径 (e.g. `/2017zyl-staging/index.html`) 30s 内就生效 (新 key)
- **新发布用新文件路径** 是 CF Pages 部署实战最稳模式 (跟 skill `devops/public-html-deploy-cloudflare-pages` 设计模式 #1 的"v2 文件名绕 cache" 同源)

## 7 个 URL 真访问指南 (Patrick 行动手册)

```
实时产出 (Patrick 想要):       https://2017zyl.xyz/2017zyl-staging/daily-reports.html
                              (NEW, 39,132 bytes, 顶部 fixed "← 投资人简报" 链接)

投资人简报 (OpenSwarm pitch):  https://2017zyl.xyz/pitch
                              (35,828 bytes, 顶部 fixed "📚 实时产出页" 链接)

新合并主页 (71f649a):         https://2017zyl.xyz/2017zyl-staging/index.html
                              (39,132 bytes, 顶部 fixed "📚 实时产出页" 链接)

旧 daily-reports (5-10 min cache): https://2017zyl.xyz/daily-reports.html
                              (34,713 bytes 旧版本 50f821a commit, 5-10 min 后变 39,132)

Jensen #494 笔记:              https://2017zyl.xyz/jensen-huang-lex-fridman-494.html
                              (25,657 bytes 8b13ad1 旧 commit, 不受 fixed 链接影响)
```

## 何时用哪个 URL

| 场景 | 用 |
|------|-----|
| 分享给投资人"OpenSwarm 简报" | `https://2017zyl.xyz/pitch` (干净, 顶部含 daily-reports 链接) |
| 自己看"实时产出" | `https://2017zyl.xyz/2017zyl-staging/daily-reports.html` (新主页位置) |
| 临时备用"实时产出" | `https://2017zyl.xyz/daily-reports.html` (5-10 min 后变新版本) |
| 给海外朋友"看 OpenSwarm" | `https://patrick-reports.patrick-l-zeng.workers.dev/pitch` (国内 5G 不通) |
| 旧 daily-reports 链接 (外部) | 5-10 min 后 `https://2017zyl.xyz/daily-reports.html` 自动更新 |
| Jensen #494 | `https://2017zyl.xyz/jensen-huang-lex-fridman-494.html` (独立笔记, 永远 200) |

## 教训 (写进 skill `devops/public-html-deploy-cloudflare-pages`)

### 反模式修正
- ❌ **不要假设 1 个 git 仓 = 1 个 CF Pages 项目** — 实际可能 staging 跟父仓并行
- ❌ **不要假设 `/` 跟 `index.html` 跟 `pitch.html` 是同一份** — 它们是独立 file, 各 deploy 各
- ❌ **不要假设父仓 push 触发所有域 deploy** — 可能是 staging 目录独立 deploy
- ❌ **不要假设 CF push 完 30s 立刻生效** — edge cache TTL 5-10 min, 有时长 30+ min

### 正确模式
- ✅ **新发布用新文件路径** (`/v2.html`, `/2017zyl-staging/index.html`) — 30s 内生效
- ✅ **CF Pages 双域 (workers.dev + custom)** deploy 异步, 验 2 次间隔 60s
- ✅ **staging 目录**通常**不通过父仓 git push 触发 deploy**, 需找 staging 自己的 deploy 机制 (cron / rsync / 直读 CF Pages)
- ✅ **加 fixed 链接** 必先查清"哪个 file 是真 deploy 源" — 可能是父仓根 / index.html / staging/index.html
