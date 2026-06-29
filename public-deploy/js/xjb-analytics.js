/* xjb-analytics.js — Umami 真实接入 (Plausible-style)
 * 默认指向 umami.patrick-reports.patrick-l-zeng.workers.dev
 * 一旦你在 Umami 控制台创建了 website，把 website id 写到 XJB_UMAMI_WEBSITE_ID
 * 这一个全局配置就行；不需要改 5 个核心页面。
 *
 * v2 (2026-06-30): 从 console.log 占位升级为 Umami real tracking.
 *                  保留 fallback 行为: umami 还没加载好时，事件会 console.log
 *                  并入队，等 umami 就绪后 flush — 不丢事件。
 */
(function () {
  'use strict';

  // ---- 0. 配置:改这里就能切换 site / endpoint -------------------------------------
  var XJB_UMAMI_ENDPOINT   = 'https://umami.patrick-reports.patrick-l-zeng.workers.dev';
  var XJB_UMAMI_WEBSITE_ID =
    (window.XJB_UMAMI_WEBSITE_ID && String(window.XJB_UMAMI_WEBSITE_ID)) ||
    'PLACEHOLDER_WEBSITE_ID';   // ← 在 Umami 控制台创建 website 后，把 id 粘到这里 (或写到 window)
  var XJB_UMAMI_AUTOTRACK  = true;   // 自动 page_view
  var XJB_UMAMI_DO_NOT_TRACK = true; // 尊重浏览器 DNT (Plausible/Umami 默认行为)

  // ---- 1. 加载 Umami script -------------------------------------------------------
  function loadUmami() {
    if (document.querySelector('script[data-xjb-umami]')) return;
    var s = document.createElement('script');
    s.async = true;
    s.defer = true;
    s.src = XJB_UMAMI_ENDPOINT + '/script.js';
    s.setAttribute('data-website-id', XJB_UMAMI_WEBSITE_ID);
    s.setAttribute('data-auto-track', XJB_UMAMI_AUTOTRACK ? 'true' : 'false');
    s.setAttribute('data-do-not-track', XJB_UMAMI_DO_NOT_TRACK ? 'true' : 'false');
    s.setAttribute('data-host-url', XJB_UMAMI_ENDPOINT);
    s.setAttribute('data-xjb-umami', '1');
    document.head.appendChild(s);
  }

  // ---- 2. 事件队列 (umami 还没好时，事件先入队再 flush) ----------------------
  var queue = [];
  function flush() {
    if (!(window.umami && window.umami.track)) return;
    var q = queue; queue = [];
    q.forEach(function (ev) {
      try { window.umami.track(ev.name, ev.props || {}); }
      catch (e) { console.warn('[xjb-analytics] flush failed:', e); }
    });
  }

  // ---- 3. 公开 API: window.xjbTrack(eventName, props) ----------------------------
  function track(eventName, props) {
    if (!eventName) return;
    var safe = (typeof props === 'object' && props) ? props : {};
    // 始终 console.log (本地调试 + DNT 用户降级通道)
    try { console.log('[xjb-analytics]', eventName, safe); } catch (_) {}
    if (window.umami && window.umami.track) {
      try { window.umami.track(eventName, safe); } catch (e) { queue.push({ name: eventName, props: safe }); }
    } else {
      queue.push({ name: eventName, props: safe });
    }
  }

  // ---- 4. 业务事件: View Day / Star / Open WeChat / Share -------------------------
  // 给你 5 个核心页面统一调用约定 (HTML 里 data-attr 就能自动埋点)
  function autoBind() {
    // a) Day 视图跳转 → xjb_view_day(dayId, videoCount)
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href*="day-"]');
      if (!a) return;
      var m = (a.getAttribute('href') || '').match(/day-(\d+)/);
      if (m) track('xjb_view_day', { day: Number(m[1]), href: a.getAttribute('href') });
    });
    // b) 视频卡片 ⭐ → xjb_star_video
    document.addEventListener('click', function (e) {
      var s = e.target.closest && e.target.closest('[data-xjb-star]');
      if (s) track('xjb_star_video', { id: s.getAttribute('data-xjb-star') });
    });
    // c) 打开微信 gh_xxxxxxx / 二维码 / 联系按钮 → xjb_open_wechat
    document.addEventListener('click', function (e) {
      var w = e.target.closest && e.target.closest('[data-xjb-wechat]');
      if (w) track('xjb_open_wechat', { gh: w.getAttribute('data-xjb-wechat') });
    });
    // d) 分享按钮 (Web Share API / 复制链接) → xjb_share
    document.addEventListener('click', function (e) {
      var sh = e.target.closest && e.target.closest('[data-xjb-share]');
      if (!sh) return;
      var url = location.href;
      if (navigator.share) {
        navigator.share({ title: document.title, url: url }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).catch(function () {});
      }
      track('xjb_share', { url: url, method: navigator.share ? 'web_share' : 'clipboard' });
    });
  }

  // ---- 5. PWA install prompt (沿用 v11 行为) --------------------------------------
  function bindPWA() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').then(
        function (reg) { console.log('[PWA] SW registered:', reg.scope); },
        function (err) { console.warn('[PWA] SW registration failed:', err); }
      );
    });
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      window.deferredPrompt = e;
      console.log('[PWA] Install prompt available');
    });
  }

  // ---- 6. 启动 --------------------------------------------------------------------
  window.xjbTrack = track;
  loadUmami();
  autoBind();
  bindPWA();

  // DOMReady 后做: 第一次 flush + 初次 page_view
  function bootstrap() {
    // 等几帧，等 umami script 加载完
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (window.umami || tries > 20) {
        clearInterval(t);
        flush();
        track('page_view', {
          path: location.pathname,
          ref:  document.referrer || 'direct',
          title: document.title
        });
      }
    }, 250);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
