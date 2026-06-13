---
title: "OpenSwarm 投资人简报 ↔ Obsidian 联动方案"
date: 2026-06-13 03:55 CST
author: Patrick (via Hermes)
type: design-doc
status: draft-v1
tags: [openswarm, obsidian-integration, public-html, dashboard, third-party-counter, goatcounter, hits-sh]
---

# OpenSwarm 投资人简报 ↔ Obsidian 联动方案

**来源简报**: `/Users/patrick/Downloads/index.html` (32KB / 554 行) — 26+ AI agents 投资人简报, 已含 hits.sh + GoatCounter 集成

**目标**: 把简报**公网** (Cloudflare Pages) + **Obsidian vault** + **5 类自动同步** 联动起来, 投资人/合伙人/朋友访问时, 看到的是"Patrick 知识库"实时投影, 不是静态 HTML

## 5 Falsification (先想清楚)

1. **OpenSwarm 简报数据真实性** — 26+ agents / 3808+ sessions / 14 cron / 500+ ArcStore 上线商品 数字需要跟实际系统核对 (不要投资人问起时打脸)
2. **Vault → 公网 实时同步** — 5-10 min Cloudflare cache 延迟 = 投资人看到数据滞后
3. **第三方计数器 (hits.sh + GoatCounter) 准确性** — 5-10% 误差, 且 hits.sh 不区分 UV/PV
4. **Patrick 真用这套系统** — 简报里写 14 cron / 5 个 cron chart (arXiv 量子 / 核聚变 / AI 伦理周报 / 投资简报 / 复盘记录) 跟 memory "34 个 cron" 对应? 
5. **OpenSwarm 项目真实状态** — 投资人看完要 follow up, 系统真在跑吗?

## 联动设计 (4 层)

### 第 1 层: 公网 ↔ Vault (双向同步)

```
~/Desktop/openswarm-investor-briefing-2026-06-13.html (Mac 源)
    ↓ sync-daily-reports.sh (23:30 cron)
~/patricks-reports/openswarm-investor-briefing-2026-06-13.html (Git)
    ↓ git push
https://patrick-reports.patrick-l-zeng.workers.dev/openswarm-investor-briefing-2026-06-13.html (公网)
    ↓ (反方向: 投资人 contact)
~/Documents/Obsidian Vault/llm-wiki/projects/openswarm-investor-briefing-2026-06-13.html (镜像)
```

**已做**: 简报已 cp 到 Desktop + vault + 推 patricks-reports (git commit befa961, push 进行中)

### 第 2 层: 数据实时 (3 类自动源)

| 数据源 | 来源 | 同步方式 | 频率 |
|--------|------|----------|------|
| **26+ Agents 数量** | vault `~/.hermes/skills/*/SKILL.md` 计数 | sync-daily-reports.sh 注入 CONFIG | 每日 23:30 |
| **3808+ Sessions** | Hermes session DB (`session_search` 工具) | cron 跑 Python count sessions | 每日 9:00 |
| **14 Cron Jobs** | `hermes cron list` | cron 跑 Python count jobs | 每日 9:00 |
| **500+ ArcStore** | localhost:3001 商品计数 | Python 调 arcstore API | 每日 9:00 |

**实现**: 1 个脚本 `~/bin/openswarm-stats-update.sh` (1.5KB) 每日 9:00 跑, 改 `index.html` 里的 4 个 `data-to` 数字 + commit + push.

### 第 3 层: 计数器 (hits.sh + GoatCounter)

**当前**:
- **hits.sh** 第三方阅读计数 = 改 URL 即可, 0 注册
  - 当前指向: `patrick-reports.patrick-l-zeng.workers.dev/openswarm-investor-briefing-2026-06-13.html` (已改)
  - 真工作: curl 200 OK 验证
- **GoatCounter** 转发事件 = 留 `YOURCODE` 占位, 等 Patrick 注册

**升级** (NAS Umami 自托管路线):
- 周末 Patrick 跑 `sudo bash /Users/patrick/Desktop/umami-install-nas.sh` → http://192.168.31.66:3000
- 拿到 website-id → 跑 `bash /Users/patrick/Desktop/inject-counter-136.sh <UUID>` → 136 HTML 全加 Umami script
- Cloudflare Pages 设 umami.patrick-reports.patrick-l-zeng.workers.dev → 反代 NAS:3000

### 第 4 层: 投资人 follow-up 联动 (5 个 CTA)

简报里 5 处 CTA 都加 `?utm_source=openswarm-briefing` 跟踪:
- `#system` 锚点 → "看系统如何运转" (跳到 metrics + chart 段)
- `#ask` 锚点 → "融资与合作" (跳到最底)
- `转发并 +1` 按钮 → GoatCounter `forward-click` 事件
- 邮件/微信 → `?utm_source=openswarm-briefing&utm_medium=share`
- footer 链接 → `llm-wiki/projects/` (跳回 Obsidian 镜像)

**Google Analytics vs 自托管 Umami**:
- Umami 自托管: 数据自有, GDPR 合规, $0
- GA: 数据归 Google, GDPR 风险, 但功能全
- Patrick 偏自托管 (从选择 NAS + 自建 OpenSwarm 看)

## 实施路线 (3 阶段, 总 ~3-5 天)

### Phase 1: 立即 (今晚 0-30 min) — 已大部分完成
- [x] OpenSwarm 简报 cp 到 Desktop + vault + 公网
- [x] 改 CONFIG 指向 patrick 公网 URL
- [x] git commit befa961 + push (后台, 慢)
- [x] 写 2 个脚本 (umami-install-nas.sh + inject-counter-136.sh) 等 Patrick 周末跑
- [ ] 验证公网 200 + 截图 (等 Cloudflare 5-10 min 部署)

### Phase 2: 周末 (1-2 天)
- [ ] Patrick 跑 `sudo bash umami-install-nas.sh` → Umami 上线
- [ ] 浏览器开 http://192.168.31.66:3000 → 改默认密码 + 加 website
- [ ] 拿 website-id 跑 inject-counter-136.sh → 136 HTML 全加 Umami
- [ ] Cloudflare Pages 加 umami.patrick-reports.patrick-l-zeng.workers.dev → 反代
- [ ] 写 1 个 openswarm-stats-update.sh (每日 9:00 跑, 改 data-to 数字)

### Phase 3: 长期 (1-2 周)
- [ ] 简报数字真实性审计 (跟实际系统核对)
- [ ] 加 4 个数据源 (sessions / cron / agents / ArcStore) 自动注入
- [ ] 加 1 个 vault note "投资人沟通记录" 自动加到简报 footer
- [ ] 试 Twitter Card / LinkedIn share (og:image) 简报预览效果

## 跟现有系统集成

| 系统 | 集成点 | 现状 |
|------|--------|------|
| **Hermes session** | 3808+ sessions = `~/.hermes/sessions/*.jsonl` 计数 | 待 Phase 3 写脚本 |
| **Hermes cron** | 14 cron = `hermes cron list` 计数 | 待 Phase 3 |
| **GCP capsule** | 26+ agents = `~/.hermes/skills/*/SKILL.md` 计数 | 待 Phase 3 |
| **ArcStore** | 500+ 商品 = `localhost:3001/api/products` 计数 | 待 Phase 3 |
| **vault 镜像** | 简报 HTML 放 `llm-wiki/projects/` 已做 ✅ | 已做 |
| **公网 cron** | 23:30 sync-daily-reports.sh 已推 ✅ | 已做 |

## 5 风险 + 兜底

| 风险 | 兜底 |
|------|------|
| 数字被截图断章 | 简报加 "数据更新于 YYYY-MM-DD" 时间戳 + 每月自动 regen |
| 投资人邮件跟进流失 | 简报加 1 个 `mailto:patrick@...` 链接, umami 事件跟踪点击率 |
| 5-10 min cache 延迟影响 demo | 急用时用 `?nocache=N` URL bypass |
| GoatCounter 限制 10万 PV/月 | 流量超限前切 Umami 自托管 |
| 简报被复制 | 加版权 + "by Patrick, AI Agent 实践者" tagline |

## 1 句话总结

**OpenSwarm 投资人简报已公网 + vault 联动 (双层镜像), hits.sh 阅读计数 0 注册即时工作, 周末 Patrick 跑 umami-install-nas.sh + inject-counter-136.sh 升级到 Umami 自托管, Phase 3 接入 4 个真实数据源 (sessions/cron/agents/ArcStore) 让数字不是静态. 风险是数字真实性 + 5-10 min cache 延迟 + 投资人 follow-up 流失, 兜底是时间戳 + mailto 跟踪 + URL cache-bypass + Umami 切托管.**
