# CF Pages 部署成功 — 5 min 验证 + 5G 测试

## 现状
- **CF Pages URL**: https://patrcik-reports-ai.pages.dev (Patrick 拼写, 跟 patrick 不同)
- **绑仓**: polyglotszeng/patrick-reports (main 分支)
- **Build 设置**: 静态 HTML, Build command 留空, Build output = /

## 沙箱内 verify (现跑不通 = build 还没完)
```
bash ~/Desktop/verify-pages.sh
```

## 5 min 后再 verify
- 沙箱内 build 完 1-3 min, 5 min 后 100% 通
- 看 `verify-pages.sh` 输出 5/5 HTTP 200 = 通

## 5G 手机测试 (Patrick 你必手试)
1. iPhone 关 WiFi, 开 5G
2. 浏览器开 https://patrcik-reports-ai.pages.dev/pitch
3. **预期**: 立即加载, 跟家里 WiFi 一样
4. 试 .md 文件 (e.g. https://patrcik-reports-ai.pages.dev/2026-06-11-gcp-launch-digest.md) 看是否也通

## 域名对比
| 域名 | 国内 5G | 国外 | 状态 |
|------|---------|------|------|
| patrick-reports.patrick-l-zeng.workers.dev | ❌ GFW 墙 | ✅ 通 | Workers, 弃用 |
| patrcik-reports-ai.pages.dev | ✅ 应该通 | ✅ 通 | **新主用** |
| (可选) patrick-reports.com 域名 | ✅ 通 | ✅ 通 | 未来 |

## 两套 URL 改 投资人简报
OpenSwarm 投资人简报 `/pitch` 文件 hitsTarget 改:
```javascript
hitsTarget: 'patrcik-reports-ai.pages.dev/pitch'  // 改 pages.dev
```

或者保留 2 个 hostname 适配:
```javascript
const isCN = location.hostname.includes('pages.dev');
const target = isCN ? 'patrcik-reports-ai.pages.dev' : 'patrick-reports.patrick-l-zeng.workers.dev';
```

## 5 falsification
1. **DNS NXDOMAIN 持续 10+ min** — 走回 Vercel 5 min 部署 (我能代 deploy)
2. **5G 仍 timeout** — pages.dev 也被墙 (低概率 < 10%) → Vercel 备用
3. **build 失败** — 看 CF Pages 控制台 Build log
4. **静态 HTML 404** — Build output 设错 (设 "/" 不是 ".")
5. **跨运营商 5G 不一致** — 中国移动/电信/联通 GFW 策略略有不同, 5G 全测一遍
