// Custom Worker for patrick-reports (CF Workers + Assets mode).
// 07-04 EXTEND: 加上 /api/ticker + /api/jobs 两个 endpoint (从 agent-tasks.jsonl 派生)
//               用于 mission-control.html 的 LIVE mode
// 07-06 EXTEND: 加 /api/design endpoint (从 state/html-design-library.json 派生)
//               用于 design-library-dashboard + mission-control stat card
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;

    // === API routes (07-04 + 07-06 NEW) ===
    if (path === "/api/ticker" || path === "/api/jobs" || path === "/api/design") {
      return handleApi(path, url, env, request);
    }

    const archiveRepair = await repairDailyReportArchivePath(path, url, env, request);
    if (archiveRepair) return archiveRepair;

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
  },
};

async function repairDailyReportArchivePath(path, url, env, request) {
  if (!path.startsWith("/daily-reports/")) return null;

  const original = await env.ASSETS.fetch(request);
  if (original.ok) return null;

  const suffix = path.slice("/daily-reports/".length);
  const candidates = [];

  if (suffix.startsWith("daily-reports/")) {
    candidates.push("/" + suffix);
  }
  candidates.push("/" + suffix);

  for (const candidate of candidates) {
    if (!candidate || candidate === path) continue;
    const candidateUrl = new URL(candidate, url);
    const candidateReq = new Request(candidateUrl.toString(), request);
    const candidateResp = await env.ASSETS.fetch(candidateReq);
    if (candidateResp.ok) {
      const cleanPath = candidate.endsWith("/index.html")
        ? candidate.slice(0, -"index.html".length)
        : candidate;
      return Response.redirect(new URL(cleanPath || "/", url).toString(), 308);
    }
  }

  return null;
}


// === /api/ticker + /api/jobs implementation ===
// Reads agent-tasks.jsonl from ASSETS (Workers Assets mode can serve static files via ASSETS.bindings)
async function handleApi(path, url, env, request) {
  const cors = {
    "content-type": "application/json",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
  };
  // Read jsonl via ASSETS binding
  let text;
  try {
    const r = await env.ASSETS.fetch(new URL("/agent-tasks/agent-tasks.jsonl", url));
    if (!r.ok) throw new Error(`ASSETS fetch ${r.status}`);
    text = await r.text();
  } catch (e) {
    return new Response(JSON.stringify({ error: `cannot read jsonl: ${e.message}` }), {
      status: 502,
      headers: cors,
    });
  }

  if (path === "/api/ticker") {
    const sinceParam = url.searchParams.get("since");
    const since = sinceParam ? new Date(sinceParam).getTime() : 0;
    const events = [];
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      let row;
      try { row = JSON.parse(line); } catch { continue; }
      const t = new Date(row.started_at).getTime();
      if (t <= since) continue;
      const isErr = row.status !== "done" || (row.error && row.error.length > 0);
      let msg = "";
      if (row.metrics) {
        const parts = [];
        for (const [k, v] of Object.entries(row.metrics)) {
          if (typeof v === "number" && v > 0) parts.push(`${k}=${v}`);
        }
        if (parts.length) msg = parts.join(" · ");
      }
      if (row.error) {
        const errShort = String(row.error).split("\n")[0].slice(0, 80);
        msg = msg ? `${msg} · ${errShort}` : errShort;
      }
      if (!msg) msg = `${row.status} · ${row.latency_ms}ms`;
      events.push({ t: row.started_at, src: row.task_name, st: isErr ? "error" : "ok", msg });
    }
    events.sort((a, b) => new Date(b.t).getTime() - new Date(a.t).getTime());
    return new Response(JSON.stringify({ events, fetched_at: new Date().toISOString() }), { headers: cors });
  }

  if (path === "/api/jobs") {
    const byName = new Map();
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      let row;
      try { row = JSON.parse(line); } catch { continue; }
      const cur = byName.get(row.task_name) || {
        task_name: row.task_name,
        runs: 0,
        errors: 0,
        last_run_at: null,
        last_status: null,
      };
      cur.runs += 1;
      if (row.status !== "done" || (row.error && row.error.length > 0)) cur.errors += 1;
      if (!cur.last_run_at || row.started_at > cur.last_run_at) {
        cur.last_run_at = row.started_at;
        cur.last_status = row.status;
      }
      byName.set(row.task_name, cur);
    }
    const jobs = Array.from(byName.values()).sort(
      (a, b) => new Date(b.last_run_at).getTime() - new Date(a.last_run_at).getTime(),
    );
    return new Response(
      JSON.stringify({
        jobs,
        source: "agent-tasks.jsonl",
        note: "subset of full cron registry — only publish-tasks captured here",
        fetched_at: new Date().toISOString(),
      }),
      { headers: cors },
    );
  }

  // === /api/design implementation (07-06 NEW) ===
  // Reads state/html-design-library.json from ASSETS, computes aggregate stats + lists fails.
  if (path === "/api/design") {
    let designText;
    try {
      const r = await env.ASSETS.fetch(new URL("/state/html-design-library.json", url));
      if (!r.ok) throw new Error(`ASSETS fetch ${r.status}`);
      designText = await r.text();
    } catch (e) {
      return new Response(JSON.stringify({ error: `cannot read design state: ${e.message}` }), {
        status: 502,
        headers: cors,
      });
    }
    let state;
    try { state = JSON.parse(designText); } catch (e) {
      return new Response(JSON.stringify({ error: `design state parse: ${e.message}` }), {
        status: 502,
        headers: cors,
      });
    }
    const sites = state.sites || {};
    const stats = { pass: 0, shell: 0, wall: 0, tld: 0, network: 0, fail: 0 };
    const fails = [];
    const networkBlocked = [];
    for (const [name, s] of Object.entries(sites)) {
      const st = s.status || "UNKNOWN";
      if (st === "PASS") stats.pass++;
      else if (st === "PASS-SHELL") stats.shell++;
      else if (st === "CF-WALL" || st === "VERCEL-CHECKPOINT") stats.wall++;
      else if (st === "TLD-BLOCKED") stats.tld++;
      else if (st === "NETWORK-BLOCKED") { stats.network++; networkBlocked.push({ name, url: s.url }); }
      else { stats.fail++; fails.push({ name, url: s.url, code: s.http_code, note: s.cf_wall ? "CF wall" : s.vercel_checkpoint ? "Vercel" : "" }); }
    }
    return new Response(
      JSON.stringify({
        last_sweep: state.last_sweep,
        total: Object.keys(sites).length,
        stats,
        fails,
        network_blocked: networkBlocked,
        source: "state/html-design-library.json",
        fetched_at: new Date().toISOString(),
      }),
      { headers: cors },
    );
  }
}