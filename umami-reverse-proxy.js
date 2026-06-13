// umami-reverse-proxy.js
// Cloudflare Worker 反代脚本 — umami.patrick-reports.patrick-l-zeng.workers.dev → Umami on NAS
// 2026-06-13 创建, 周末等 Patrick 装完 Umami 激活
//
// 部署步骤:
//   1. cp umami-reverse-proxy.js ~/patricks-reports/_worker.js (替换)
//   2. cd ~/patricks-reports && git add _worker.js && git commit -m "feat: umami reverse proxy worker"
//   3. git push origin main (Cloudflare Pages auto-deploy)
//   4. Cloudflare Dashboard → Workers Routes → 加 patrick-reports.patrick-l-zeng.workers.dev/umami*  → 这个 worker
//   5. ⚠️ 关键: Worker 不能直连 192.168.31.66 (私网) — 需要先在 NAS 上起 cloudflared tunnel (方案 B)
//
// 关键诚实标:
//   - Cloudflare Worker 跑在边缘节点, 跟家庭内网隔离
//   - 除非 NAS 有公网 IP 或先开 cloudflared, Worker 无法直连 NAS
//   - 本脚本预留 UMAMI_UPSTREAM 常量, 默认 http://192.168.31.66:3000 (Patrick 改 IP 即可)
//
// 周末 2 步走:
//   路径 1 (有公网 IP): 改 UMAMI_UPSTREAM = "http://NAS-PUBLIC-IP:3000"
//   路径 2 (无公网 IP): 在 NAS 上起 cloudflared tunnel → 改 UMAMI_UPSTREAM = "https://xxx.trycloudflare.com"

const UMAMI_UPSTREAM = "http://192.168.31.66:3000";  // ⚠️ 私网, Worker 不能直连, 需配 cloudflared tunnel
const ALLOWED_ORIGINS = [
  "https://patrick-reports.patrick-l-zeng.workers.dev",
  "https://umami.patrick-reports.patrick-l-zeng.workers.dev",
  "http://localhost:3000",
  "http://192.168.31.66:3000",
];

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, HEAD",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Website-Id, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };
}

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // 1. CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  
  // 2. 健康检查 (Cloudflare 自身监控)
  if (url.pathname === "/umami-health" || url.pathname === "/_health") {
    return new Response(JSON.stringify({
      status: "ok",
      upstream: UMAMI_UPSTREAM,
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
  
  // 3. 代理到 Umami
  // 把 /umami/* 路径转给 /api/* (Umami 后端 API 路径)
  let targetPath = url.pathname;
  if (targetPath.startsWith("/umami/")) {
    targetPath = targetPath.replace(/^\/umami\//, "/");
  }
  // script.js 是 Umami 静态资源
  if (targetPath === "/umami-script.js" || targetPath === "/script.js") {
    targetPath = "/script.js";
  }
  
  const targetUrl = UMAMI_UPSTREAM + targetPath + url.search;
  
  // 4. 构造上游请求
  const headers = new Headers(request.headers);
  headers.set("Host", new URL(UMAMI_UPSTREAM).host);
  // 保留 X-Forwarded-For / X-Real-IP
  const clientIp = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
  headers.set("X-Forwarded-For", clientIp);
  headers.set("X-Real-IP", clientIp);
  headers.set("X-Forwarded-Proto", "https");
  
  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
      redirect: "follow",
    });
    
    const responseHeaders = new Headers(upstream.headers);
    Object.entries(corsHeaders()).forEach(([k, v]) => responseHeaders.set(k, v));
    // 缓存策略: script.js 缓存 1h, API 不缓存
    if (targetPath === "/script.js") {
      responseHeaders.set("Cache-Control", "public, max-age=3600");
    } else {
      responseHeaders.set("Cache-Control", "no-store");
    }
    
    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (e) {
    return new Response(JSON.stringify({
      error: "Umami upstream unreachable",
      upstream: UMAMI_UPSTREAM,
      detail: e.message,
      hint: "需配 cloudflared tunnel 在 NAS 上 (私网 Worker 不能直连)",
    }), {
      status: 502,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  },
};
