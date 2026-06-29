// Custom Worker for patrick-reports (CF Workers + Assets mode).
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;
    // /<name>.html → /<name>  (308 Permanent Redirect)
    if (path.endsWith('.html') && path !== '/index.html') {
      return Response.redirect(new URL(path.slice(0, -5), url).toString(), 308);
    }
    // 路径无 .html → 尝试加 .html 找 ASSETS (如 /day_recommend → day_recommend.html)
    let resp = await env.ASSETS.fetch(request);
    if (resp.status === 404) {
      const tryHtml = path.endsWith('/') ? path + 'index.html' : path + '.html';
      const tryReq = new Request(new URL(tryHtml, url).toString(), request);
      const tryResp = await env.ASSETS.fetch(tryReq);
      if (tryResp.ok) {
        // 重定向到 .html 版本 (保持 URL 干净)
        return Response.redirect(new URL(tryHtml, url).toString(), 308);
      }
    }
    return resp;
  }
};
