# ArcStore Stripe 接入指南

> 为 ArcStore 配置 Stripe 支付网关，支持全球信用卡收款和 Escrow 分账

---

## 目录

1. [什么是 Stripe Connect，为什么适合 ArcStore](#背景)
2. [账号注册与密钥获取](#第一步-注册-stripe-账号)
3. [测试模式验证](#第二步-测试模式验证)
4. [Docker 环境变量配置](#第三步-配置-docker-环境变量)
5. [Webhook 配置](#第四步-配置-webhook)
6. [从测试模式切换到正式模式](#第五步-从测试模式切换到正式模式)
7. [WorldFirst 对接（可选）](#第六步-worldfirst-对接可选)
8. [故障排除](#故障排除)

---

## 背景

### 为什么用 Stripe？

| 对比项 | 传统 Wire/SWIFT | Stripe |
|--------|----------------|--------|
| 手续费 | $15-50/笔 | 2.9% + $0.30 |
| 到账时间 | 3-5 工作日 | 2 工作日 |
| 外汇 | 不支持 | 自动换汇 |
| Escrow | 不支持 | Stripe Connect 原生支持 |
| 集成难度 | 高（银行接口） | 中（REST API） |

### ArcStore 现有的 Stripe 代码

ArcStore 已实现：
- `POST /api/payments/create-intent` — 创建 Stripe Checkout Session
- `POST /api/webhooks/stripe` — Stripe Webhook 回调（自动确认支付）
- `POST /api/payments/confirm-stripe` — 买家返回后验证支付状态

**只需要填入密钥，这些功能就能激活。**

---

## 第一步：注册 Stripe 账号

### 1.1 注册

访问 https://dashboard.stripe.com/register

填写信息：
- 邮箱（建议用真实邮箱，密钥通知会发到这里）
- 姓名/公司名
- 手机号（验证用）

### 1.2 获取 API Keys

登录后进入：
```
Dashboard → Developers → API keys
```

你会看到两对 keys：

| 环境 | Key 类型 | 格式 |
|------|----------|------|
| Test mode | Publishable key | `pk_test_...` |
| Test mode | Secret key | `sk_test_...` |
| Live mode | Publishable key | `pk_live_...` |
| Live mode | Secret key | `sk_live_...` |

**先只用 Test mode keys，验证流程后再切换正式模式。**

> ⚠️ Secret key 只显示一次，复制后妥善保存。不要提交到 Git！

### 1.3 开启测试模式

在 Dashboard 右上角确认显示 **"Test mode"** 开关是打开的（蓝色）。

Stripe 测试卡号（用于验证）：

| 卡号 | 用途 |
|------|------|
| `4242 4242 4242 4242` | 成功支付 |
| `4000 0025 0000 3155` | 需要 3D 认证 |
| `4100 0000 0000 0019` | 扣款失败 |
| `4000 0000 0000 0002` | 拒绝支付 |

---

## 第二步：测试模式验证

### 2.1 在本地验证（不需要 Docker 修改）

Stripe 提供 `stripe-cli` 工具，可以在本地接收 Webhook：

```bash
# macOS 安装
brew install/stripe/stripe-cli/stripe

# 登录
stripe login

# 监听本地 3005 端口
stripe listen --forward-to localhost:3005/api/webhooks/stripe
```

运行后会输出 Webhook signing secret，格式是 `whsec_...`

### 2.2 临时修改 Docker 运行参数（注入测试 Key）

```bash
# 先停掉当前容器
docker stop arcstore

# 用测试 Key 临时启动
docker run -d \
  --name arcstore \
  -p 45859:3005 \
  -e STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY \
  -e STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET \
  -e STRIPE_SUCCESS_URL=http://localhost:45859/?payment=success \
  -e STRIPE_CANCEL_URL=http://localhost:45859/?payment=cancelled \
  -v /Users/patrick/.openclaw/workspace/arcstore/data:/app/data \
  arcstore
```

### 2.3 完整测试流程

1. 打开 http://localhost:45859
2. 注册账号，登录
3. 选择商品，下单
4. 选择 "Stripe 信用卡" 支付方式
5. 使用测试卡号 `4242 4242 4242 4242` 付款
6. 验证：
   - Stripe Dashboard → Test mode → Payments 看到交易记录
   - ArcStore 订单状态自动变成 `PAID_NOTIFIED`
   - iMessage 收到付款通知

---

## 第三步：配置 Docker 环境变量

### 3.1 推荐：写一个 .env 文件

在 Mac 上创建 `/Users/patrick/.arcstore.env`：

```bash
# Stripe Keys（Test → 完成后换成 Live keys）
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx
STRIPE_SUCCESS_URL=https://你的域名/api/payments/stripe/success
STRIPE_CANCEL_URL=https://你的域名/api/payments/stripe/cancel

# 店铺名称（显示在 Stripe Checkout 页）
STORE_NAME=ArcStore

# WorldFirst（可选，等有真实账号后填写）
WF_ACCOUNT_NAME=你的WF账户名
WF_ACCOUNT_NUMBER=你的WF账号
WF_BANK_NAME=WorldFirst
WF_SWIFT_CODE=WFCIHKHHXXX

# 收款码（上传到图床，填 URL）
SELLER_PAYMENT_QR=https://你的图床.com/seller-qr.png
```

> ⚠️ 不要把这个文件提交到 Git！加到 `.gitignore`

### 3.2 修改 docker-compose.yml（推荐持久化）

找到 arcstore 的服务定义，添加环境变量：

```yaml
services:
  arcstore:
    image: arcstore
    ports:
      - "45859:3005"
    environment:
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - STRIPE_SUCCESS_URL=${STRIPE_SUCCESS_URL}
      - STRIPE_CANCEL_URL=${STRIPE_CANCEL_URL}
      - WF_ACCOUNT_NAME=${WF_ACCOUNT_NAME}
      - WF_ACCOUNT_NUMBER=${WF_ACCOUNT_NUMBER}
      - WF_BANK_NAME=${WF_BANK_NAME}
      - WF_SWIFT_CODE=${WF_SWIFT_CODE}
      - SELLER_PAYMENT_QR=${SELLER_PAYMENT_QR}
      - ADMIN_IMESSAGE=${ADMIN_IMESSAGE}
    volumes:
      - ./data:/app/data
```

然后创建 `.env` 文件（不同目录）：

```bash
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx
STRIPE_SUCCESS_URL=https://你的域名/api/payments/stripe/success
STRIPE_CANCEL_URL=https://你的域名/api/payments/stripe/cancel
WF_ACCOUNT_NAME=你的WF账户名
WF_ACCOUNT_NUMBER=你的WF账号
WF_BANK_NAME=WorldFirst
WF_SWIFT_CODE=WFCIHKHHXXX
SELLER_PAYMENT_QR=https://你的图床.com/seller-qr.png
ADMIN_IMESSAGE=你的iMessage账号
```

重启服务：

```bash
docker-compose down && docker-compose up -d
```

---

## 第四步：配置 Webhook

Stripe Webhook 是支付完成后 Stripe 主动通知 ArcStore 的机制，是 Escrow 自动化的核心。

### 4.1 生产环境 Webhook URL

在 Stripe Dashboard：

```
Dashboard → Developers → Webhooks → Add endpoint
```

填写：
- **Endpoint URL**: `https://你的域名/api/webhooks/stripe`
- **Description**: `ArcStore Production Webhook`
- **Select events**: `checkout.session.completed`

点击 "Add endpoint" 后，复制 **Signing Secret**（`whsec_...`）

### 4.2 需要的 Webhook 事件

| 事件 | 用途 |
|------|------|
| `checkout.session.completed` | ✅ 支付成功，自动推进订单状态 |
| `checkout.session.expired` | 买家超时未付款，可取消订单 |
| `payment_intent.payment_failed` | 支付失败，通知买家重试 |

### 4.3 签名验证

ArcStore 代码里已有签名验证：

```javascript
// /app/routes/payments.js（webhook handler）
const event = stripe.webhooks.constructEvent(
  req.body,
  sig,
  require('./config').STRIPE_WEBHOOK_SECRET
);
```

只要 `STRIPE_WEBHOOK_SECRET` 配置正确，伪造的回调会被拒绝。

### 4.4 本地测试（stripe-cli）

```bash
# 安装 stripe-cli
brew install stripe/stripe-cli/stripe

# 登录
stripe login

# 监听本地 45859，输出 webhook 到 console
stripe listen --forward-to localhost:45859/api/webhooks/stripe --log

# 触发一个测试事件
stripe trigger checkout.session.completed
```

---

## 第五步：从测试模式切换到正式模式

### 5.1 切换步骤

1. **确保测试流程完全走通**
   - 测试卡支付 ✅
   - Webhook 回调 ✅
   - 订单状态推进 ✅
   - 通知消息 ✅

2. **申请 Stripe Live Keys**
   ```
   Dashboard → Developers → API keys → Live mode
   ```
   开关切换到 Live。

3. **更新 .env**
   把 `sk_test_...` 换成 `sk_live_...`，`whsec_...` 换成正式环境的 secret。

4. **配置 HTTPS**
   Stripe 要求 Webhook URL 必须是 HTTPS。
   
   选项：
   - **Cloudflare Tunnel**（免费，5分钟搞定）
   - **Nginx 反向代理 + Let's Encrypt**
   - **NAS 上配 Nginx + 动态 DNS**

5. **更新 Webhook URL**
   生产环境的 Webhook URL 必须用正式域名，stripe-cli 监听的本地 URL 只能用于开发。

### 5.2 HTTPS 快速方案：Cloudflare Tunnel

```bash
# macOS 安装 cloudflared
brew install cloudflared

# 建立隧道（无需配置域名，免费）
cloudflared tunnel --url http://localhost:45859

# 输出示例：
# 2024-01-01T00:00:00Z INF Proxy tunnel established
# url=https://random-words.trycloudflare.com
# ^^^^^^^^ 这个 URL 就是你的公网地址
```

复制 `https://random-words.trycloudflare.com`，在 Stripe Dashboard Webhook 配置里填：
```
https://random-words.trycloudflare.com/api/webhooks/stripe
```

> Cloudflare Tunnel 免费版限制：每 24 小时 IP 变一次，适合开发/小规模使用。

---

## 第六步：WorldFirst 对接（可选）

WorldFirst 用于接收国际银行转账（替代 SWIFT），比 Wire Transfer 便宜。

### 6.1 注册 WorldFirst Business

访问 https://www.worldfirst.com/cn/business/

开通 **WorldFirst Account**（企业或个人）。

### 6.2 填写配置

```bash
# 在 .env 中
WF_ACCOUNT_NAME=你的WF账户显示名
WF_ACCOUNT_NUMBER=你的WF账号（格式如 WF-XXXX-XXXX-XXXX）
WF_BANK_NAME=WorldFirst / CITIBANK N.A.
WF_SWIFT_CODE=WFCIHKHHXXX  # WF 的 SWIFT 代码
```

### 6.3 买家如何转账

代码里已实现：买家选择 WorldFirst 后，前端展示银行账号信息，买家自行转账后上传截图，管理员确认到账。

---

## 故障排除

### 问题 1：Stripe Checkout 返回 500

```javascript
// 常见原因：STRIPE_SECRET_KEY 为空
// 检查 config/index.js 中：
STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
// 如果环境变量没注入，这个值就是空字符串
```

**解决**：确认 Docker 环境变量注入成功。

### 问题 2：Webhook 回调失败

```
Dashboard → Developers → Webhooks → [你的endpoint] → Failed
```

常见原因：
- HTTPS 没配（Stripe 要求 HTTPS）
- URL 不对（检查 trailing slash）
- 签名验证失败（`whsec_` 填错了）

**解决**：用 stripe-cli 本地测试，看具体报错。

### 问题 3：支付成功但订单状态没更新

可能原因：
- Webhook 没收到（检查 Stripe Dashboard → Webhooks → Logs）
- `orderId` 在 `metadata` 里没正确传递
- 订单已经是 `PAID_NOTIFIED` 状态（不会重复推进）

**排查**：
```javascript
// 在 webhook handler 里加 log
console.log('[Webhook] orderId:', orderId, 'event:', event.type);
```

### 问题 4：iMessage 通知没发出去

检查：
- macOS 上「信息」应用是否登录 iCloud
- `ADMIN_IMESSAGE` 环境变量是否正确（手机号或邮箱）
- `osascript` 是否有权限访问 Messages

**测试**：
```bash
osascript -e 'tell application "Messages" to send "test" to buddy "你的iMessage账号"'
```

### 问题 5：Docker 容器重启后 .env 没持久化

**原因**：直接 `docker run` 的环境变量在重启后会丢失。

**解决**：用 `docker-compose.yml` + `.env` 文件组合，确保重启后环境变量还在。

---

## 下一步：Stripe Connect（高级）

目前 ArcStore 的 Stripe 模式是：**买家付全款给你，你手动转给卖家**。

如果要做自动化分账（Escrow 核心），需要升级到 **Stripe Connect**：

```
买家付款 → 资金在平台账户（Hold）→ 确认收货 → 自动分账给卖家
```

### Stripe Connect 开通条件

- 企业 Stripe 账号（个人暂不支持）
- 完成身份验证
- 银行账户验证

### Stripe Connect 关键概念

| 概念 | 说明 |
|------|------|
| Platform（你） | 收钱的一方，持有资金 |
| Connected Account（卖家） | 最终收款人 |
| Transfer | 从平台转钱给卖家 |
| Application Fee | 你留的服务费 |

### 下一步行动清单

- [ ] 注册 Stripe 账号（个人/企业）
- [ ] 获取 Test API Keys
- [ ] 用 stripe-cli 本地验证 Webhook
- [ ] 确认 .env 配置注入到 Docker
- [ ] 测试完整支付流程（4242 卡）
- [ ] 配置 Cloudflare Tunnel（或 HTTPS）
- [ ] 配置生产 Webhook URL
- [ ] 切换到 Live Keys
- [ ] 开通 WorldFirst 接收国际汇款
- [ ] （可选）申请 Stripe Connect 实现自动分账
