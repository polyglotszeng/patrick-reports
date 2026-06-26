// Custom Worker for patrick-reports (CF Workers + Assets mode).
// Handles .html → no-ext redirects that CF Pages _redirects doesn't
// reliably process in Workers + Assets mode.
//
// Pattern:
//   /<name>.html  → 308 → /<name>
//   /<path>/      → 308 → /<path>  (trailing slash redirect)
//   else          → env.ASSETS.fetch (serve static asset)

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // /<name>.html → /<name>  (308 Permanent Redirect)
    if (path.endsWith('.html') && path !== '/index.html') {
      const newPath = path.slice(0, -5);
      return Response.redirect(new URL(newPath, url).toString(), 308);
    }

    // /<path>/ → /<path>  (308, strip trailing slash for directory URLs)
    // Skip: keep directory indexes like /worldmonitor/ working
    // (CF serves dir/index.html automatically)

    // Default: serve static asset from public-deploy/
    return env.ASSETS.fetch(request);
  }
};
